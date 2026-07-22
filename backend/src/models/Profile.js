const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    // Links this profile to the logged-in user who owns it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Public, unguessable ID used in the QR code URL (e.g. /emergency/<publicId>)
    // This is what a stranger's scan resolves to - it must never expose the Mongo _id
    // or anything else that could let someone enumerate other users' profiles.
    publicId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },

    allergies: [{ type: String }],
    conditions: [{ type: String }],
    medications: [{ type: String }],

    organDonor: { type: Boolean, default: false },
    preferredHospital: { type: String },
    insuranceProvider: { type: String },
    insuranceNumber: { type: String },

    emergencyContacts: [contactSchema],

    // Cached AI-generated clinical summary, regenerated whenever the profile is saved
    aiSummary: { type: String, default: "" },
    aiSummaryUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
