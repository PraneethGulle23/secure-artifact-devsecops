const Artifact = require("../models/Artifact");
const AuditLog = require("../models/AuditLog");
const ShareRequest = require("../models/ShareRequest");
const User = require("../models/User");
const { encryptFile, decryptFile } = require("../utils/encryption");
const path = require("path");
/* ==============================
   UPLOAD
============================== */
const uploadArtifact = async (req, res) => {
  try {
    const { expiryDate, maxDownloads } = req.body;

    const user = await User.findById(req.user.id);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const encryptedPath = req.file.path + ".enc";

    await encryptFile(req.file.path, encryptedPath);

    const artifact = await Artifact.create({
      name: req.file.originalname,
      encryptedPath: encryptedPath,
      ownerId: user._id,
      organizationId: user.organizationId,
      expiryDate: expiryDate || null,
      maxDownloads: maxDownloads || 0,
      downloadCount: 0,
      status: "active",
    });

    res.status(201).json({
      message: "File uploaded successfully",
      artifact,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};


/* ==============================
   GET ORG FILES
============================== */
const getArtifacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    /* 1️⃣ Own organization files */
    const ownFiles = await Artifact.find({
      organizationId: user.organizationId,
    });

    /* 2️⃣ Approved shared files */
    const approvedShares = await ShareRequest.find({
    toOrganizationId: user.organizationId,
    status: "approved",
  });

    const sharedFileIds = approvedShares.map(
      (share) => share.fileId
    );

    const sharedFiles = await Artifact.find({
      _id: { $in: sharedFileIds },
    });

    /* 3️⃣ Merge & remove duplicates (safety) */
    const fileMap = new Map();

    [...ownFiles, ...sharedFiles].forEach((file) => {
      fileMap.set(file._id.toString(), file);
    });

    const allFiles = Array.from(fileMap.values());

    res.json(allFiles);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};


/* ==============================
   DOWNLOAD (Core Governance Engine)
============================== */
const downloadArtifact = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!artifact) {
      return res.status(404).json({ message: "File not found" });
    }

    const sameOrg =
      artifact.organizationId.toString() ===
      user.organizationId.toString();

    /* ===============================
       OWNER DIRECT ACCESS (No Limits)
    =============================== */
    if (sameOrg) {
      await AuditLog.create({
        fileId: artifact._id,
        userId: user._id,
        organizationId: user.organizationId,
        action: "download_owner",
        status: "success",
        ipAddress: req.ip,
      });

      return decryptFile(artifact.encryptedPath, res, artifact.name);
    }

    /* ===============================
       FIND APPROVED SHARE
    =============================== */
    const approvedShare = await ShareRequest.findOne({
      fileId: artifact._id,
      toOrganizationId: user.organizationId,
      status: "approved",
    });

    if (!approvedShare) {
      await AuditLog.create({
        fileId: artifact._id,
        userId: user._id,
        organizationId: user.organizationId,
        action: "download_attempt",
        status: "blocked",
        ipAddress: req.ip,
      });

      return res.status(403).json({ message: "Access denied" });
    }

    /* ===============================
       REVOKED CHECK
    =============================== */
    if (approvedShare.isRevoked) {
      return res.status(403).json({ message: "Access revoked" });
    }

    /* ===============================
       EXPIRY CHECK
    =============================== */
    if (
      approvedShare.expiryDate &&
      new Date() > approvedShare.expiryDate
    ) {
      return res.status(403).json({ message: "Access expired" });
    }

    /* ===============================
       DOWNLOAD LIMIT CHECK
    =============================== */
    if (
      approvedShare.maxDownloads > 0 &&
      approvedShare.downloadCount >= approvedShare.maxDownloads
    ) {
      return res.status(403).json({
        message: "Download limit reached",
      });
    }

    /* ===============================
       SUCCESS
    =============================== */
    approvedShare.downloadCount += 1;
    await approvedShare.save();

    await AuditLog.create({
      fileId: artifact._id,
      userId: user._id,
      organizationId: user.organizationId,
      action: "download",
      status: "success",
      ipAddress: req.ip,
    });

    decryptFile(artifact.encryptedPath, res, artifact.name);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Download failed" });
  }
};
// const downloadArtifact = async (req, res) => {
//   try {
//     const artifact = await Artifact.findById(req.params.id);
//     const user = await User.findById(req.user.id);

//     if (!artifact)
//       return res.status(404).json({ message: "File not found" });

//     const sameOrg =
//       artifact.organizationId.toString() ===
//       user.organizationId.toString();

//     /* ---------- OWNER DIRECT ACCESS ---------- */
//     if (sameOrg) {
//       decryptFile(artifact.encryptedPath, res, artifact.name);
//       return;
//     }

//     /* ---------- FIND APPROVED SHARE ---------- */
//     const approvedShare = await ShareRequest.findOne({
//       fileId: artifact._id,
//       toOrganizationId: user.organizationId,
//       status: "approved",
//     });

//     if (!approvedShare)
//       return res.status(403).json({ message: "Access denied" });

//     /* ---------- REVOKE CHECK ---------- */
//     if (approvedShare.isRevoked)
//       return res.status(403).json({ message: "Access revoked" });

//     /* ---------- EXPIRY CHECK ---------- */
//     if (
//       approvedShare.expiryDate &&
//       new Date() > approvedShare.expiryDate
//     ) {
//       return res.status(403).json({ message: "Access expired" });
//     }

//     /* ---------- DOWNLOAD LIMIT ---------- */
//     if (
//       approvedShare.maxDownloads > 0 &&
//       approvedShare.downloadCount >= approvedShare.maxDownloads
//     ) {
//       return res.status(403).json({
//         message: "Download limit reached",
//       });
//     }

//     /* ---------- SUCCESS ---------- */
//     approvedShare.downloadCount += 1;
//     await approvedShare.save();

//     await AuditLog.create({
//       fileId: artifact._id,
//       userId: user._id,
//       organizationId: user.organizationId,
//       action: "download",
//       status: "success",
//       ipAddress: req.ip,
//     });

//     decryptFile(artifact.encryptedPath, res, artifact.name);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Download failed" });
//   }
// };
// const downloadArtifact = async (req, res) => {
//   try {
//     const artifact = await Artifact.findById(req.params.id);
//     const user = await User.findById(req.user.id);

//     if (!artifact) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     /* ---------- OWNER OVERRIDE ---------- */
//     if (artifact.status === "revoked") {
//       if (artifact.ownerId.toString() !== user._id.toString()) {
//         return res.status(403).json({ message: "File revoked" });
//       }
//     }

//     /* ---------- EXPIRY CHECK ---------- */
//     if (artifact.expiryDate && new Date() > artifact.expiryDate) {
//       artifact.status = "expired";
//       await artifact.save();
//       return res.status(403).json({ message: "File expired" });
//     }

//     /* ---------- DOWNLOAD LIMIT ---------- */
//     if (
//       artifact.maxDownloads > 0 &&
//       artifact.downloadCount >= artifact.maxDownloads
//     ) {
//       return res.status(403).json({ message: "Download limit reached" });
//     }

//     /* ---------- ORGANIZATION ACCESS ---------- */
//     const sameOrg =
//       artifact.organizationId.toString() ===
//       user.organizationId.toString();

//     /* ---------- APPROVED CROSS-ORG SHARE ---------- */
//     const approvedShare = await ShareRequest.findOne({
//       fileId: artifact._id,
//       toOrganizationId: user.organizationId,
//       status: "approved",
//     });

//     if (!sameOrg && !approvedShare) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     /* ---------- SUCCESS ---------- */
//     artifact.downloadCount += 1;
//     await artifact.save();

//     await AuditLog.create({
//       fileId: artifact._id,
//       userId: user._id,
//       organizationId: user.organizationId,
//       status: "success",
//       ipAddress: req.ip,
//     });

//     decryptFile(artifact.encryptedPath, res, artifact.name);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Download failed" });
//   }
// };


/* ==============================
   REVOKE
============================== */
const revokeArtifact = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!artifact) {
      return res.status(404).json({ message: "File not found" });
    }

    if (
      user.role !== "admin" ||
      artifact.organizationId.toString() !== user.organizationId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    artifact.status = "revoked";
    await artifact.save();

    res.json({ message: "File revoked successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Revoke failed" });
  }
};


module.exports = {
  uploadArtifact,
  getArtifacts,
  downloadArtifact,
  revokeArtifact,
};