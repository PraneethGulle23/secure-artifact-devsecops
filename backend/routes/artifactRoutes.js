const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadArtifact,
  getArtifacts,
  downloadArtifact,
  revokeArtifact,
} = require("../controllers/artifactController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadArtifact
);

router.get("/", authMiddleware, getArtifacts);

router.get("/:id/download", authMiddleware, downloadArtifact);

router.patch("/:id/revoke", authMiddleware, revokeArtifact);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   uploadArtifact,
//   getArtifacts,
//   downloadArtifact,
// } = require("../controllers/artifactController");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// router.post(
//   "/upload",
//   authMiddleware,
//   upload.single("file"),
//   uploadArtifact
// );

// router.get("/", authMiddleware, getArtifacts);

// module.exports = router;

// router.get("/:id/download", authMiddleware, downloadArtifact);