const User = require("../models/User");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ===========================
   SIGNUP
=========================== */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, organizationName, inviteCode } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "Already registered with this email",
      });
    }

    let organization;
    let role = "member";

    // Create new organization
    if (organizationName && !inviteCode) {
      const generatedInviteCode = Math.random()
        .toString(36)
        .substring(2, 8);

      organization = await Organization.create({
        name: organizationName,
        inviteCode: generatedInviteCode,
      });

      role = "admin";
    }

    // Join existing organization
    if (inviteCode && !organizationName) {
      organization = await Organization.findOne({ inviteCode });

      if (!organization) {
        return res.status(400).json({
          message: "Invalid invite code",
        });
      }

      role = "member";
    }

    // Prevent sending both fields
    if (!organization) {
      return res.status(400).json({
        message:
          "Provide either organization name (create) OR invite code (join)",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      organizationId: organization._id,
    });

    res.status(201).json({
      message: "User registered successfully",
      inviteCode: role === "admin" ? organization.inviteCode : null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ===========================
   LOGIN
=========================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      role: user.role,
      organizationId: user.organizationId,
      name: user.name,   // ✅ FIXED: return name
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};