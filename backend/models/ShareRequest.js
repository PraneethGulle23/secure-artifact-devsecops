const mongoose = require("mongoose");

const shareRequestSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artifact",
      required: true,
    },
    fromOrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    toOrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending_internal",
        "pending_external",
        "approved",
        "rejected",
      ],
      default: "pending_internal",
    },

    // 🔥 NEW FIELDS
    expiryDate: {
      type: Date,
    },

    maxDownloads: {
      type: Number,
      default: 0, // 0 = unlimited
    },

    downloadCount: {
      type: Number,
      default: 0,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShareRequest", shareRequestSchema);
// const mongoose = require("mongoose");

// const shareRequestSchema = new mongoose.Schema(
//   {
//     fileId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Artifact",
//       required: true,
//     },

//     fromOrganizationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     },

//     toOrganizationId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Organization",
//       required: true,
//     },

//     requestedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "pending_internal",
//         "pending_external",
//         "approved",
//         "rejected"
//       ],
//       default: "pending_internal",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ShareRequest", shareRequestSchema);

