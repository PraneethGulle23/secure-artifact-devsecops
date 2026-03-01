const Organization = require("../models/Organization");
const ShareRequest = require("../models/ShareRequest");
const Artifact = require("../models/Artifact");
const User = require("../models/User");

exports.createShareRequest = async (req, res) => {
  try {
    // const { fileId, toOrganizationName } = req.body;
    const { fileId, toOrganizationName, expiryDate, maxDownloads } = req.body;

    const user = await User.findById(req.user.id);
    const artifact = await Artifact.findById(fileId);

    if (!artifact)
      return res.status(404).json({ message: "File not found" });

    const targetOrg = await Organization.findOne({
      name: toOrganizationName,
    });

    if (!targetOrg)
      return res.status(404).json({ message: "Target org not found" });

    if (user.organizationId.toString() !== artifact.organizationId.toString())
      return res.status(403).json({ message: "Cannot share external file" });

    const initialStatus =
      user.role === "admin"
        ? "pending_external"
        : "pending_internal";

    // const request = await ShareRequest.create({
    //   fileId,
    //   fromOrganizationId: user.organizationId,
    //   toOrganizationId: targetOrg._id,
    //   requestedBy: user._id,
    //   status: initialStatus,
    // });

    const request = await ShareRequest.create({
      fileId,
      fromOrganizationId: user.organizationId,
      toOrganizationId: targetOrg._id,
      requestedBy: user._id,
      status: initialStatus,
      expiryDate: expiryDate || null,
      maxDownloads: maxDownloads || 0,
      downloadCount: 0,
    });

    res.json({ message: "Share request created", request });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.role !== "admin")
      return res.status(403).json({ message: "Admins only" });

    const requests = await ShareRequest.find({
      $or: [
        { fromOrganizationId: user.organizationId },
        { toOrganizationId: user.organizationId },
      ],
      status: { $in: ["pending_internal", "pending_external"] },
    })
      .populate("fileId", "name")
      .populate("requestedBy", "email")
      .populate("fromOrganizationId", "name")
      .populate("toOrganizationId", "name");

    res.json(requests);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
};


// exports.updateShareRequest = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const request = await ShareRequest.findById(req.params.id);

//     const user = await User.findById(req.user.id);

//     if (user.role !== "admin") {
//       return res.status(403).json({ message: "Admins only" });
//     }

//     request.status = status;
//     await request.save();

//     res.json({ message: "Request updated" });

//   } catch (error) {
//     res.status(500).json({ message: "Failed to update request" });
//   }
// };
exports.updateShareRequest = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ShareRequest.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    // Internal approval (Org-B admin)
    if (
      request.status === "pending_internal" &&
      user.role === "admin" &&
      request.fromOrganizationId.toString() ===
        user.organizationId.toString()
    ) {
      request.status = "pending_external";
      await request.save();
      return res.json({ message: "Internal approved" });
    }

    // External approval (Org-C admin)
    if (
      request.status === "pending_external" &&
      user.role === "admin" &&
      request.toOrganizationId.toString() ===
        user.organizationId.toString()
    ) {
      request.status = status; // approved or rejected
      await request.save();
      return res.json({ message: "External decision done" });
    }

    return res.status(403).json({ message: "Unauthorized" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed" });
  }
};