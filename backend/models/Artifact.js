const mongoose = require("mongoose");

const artifactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    encryptedPath: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artifact", artifactSchema);

// const mongoose = require("mongoose");

// const artifactSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     encryptedPath: {
//       type: String,
//       required: true,
//     },

//     ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     organizationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     },

//     expiryDate: {
//       type: Date,
//     },

//     maxDownloads: {
//       type: Number,
//       default: 0, // 0 = unlimited
//     },

//     downloadCount: {
//       type: Number,
//       default: 0,
//     },

//     allowedUsers: [
//       {
//         type: String, // store email
//       },
//     ],

//     status: {
//       type: String,
//       enum: ["active", "expired", "revoked"],
//       default: "active",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Artifact", artifactSchema);