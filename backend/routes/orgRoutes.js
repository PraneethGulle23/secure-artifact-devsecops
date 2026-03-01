const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Organization = require("../models/Organization");
const User = require("../models/User");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const org = await Organization.findById(user.organizationId);

    res.json({
      organizationName: org.name,
      inviteCode: org.inviteCode,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;