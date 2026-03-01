const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createShareRequest,
  getIncomingRequests,
  updateShareRequest,
} = require("../controllers/shareController");

router.post("/request", authMiddleware, createShareRequest);
router.get("/incoming", authMiddleware, getIncomingRequests);
router.patch("/:id", authMiddleware, updateShareRequest);

module.exports = router;