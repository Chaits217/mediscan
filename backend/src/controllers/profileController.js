const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const Profile = require("../models/Profile");
const ScanLog = require("../models/ScanLog");
const generateAiSummary = require("../utils/generateAiSummary");

// GET /api/profile/me - the logged-in user's own profile (for the dashboard)
async function getMyProfile(req, res) {
  const profile = await Profile.findOne({ user: req.userId });
  if (!profile) {
    return res.status(404).json({ error: "No profile yet. Create one to get started." });
  }
  res.json({ profile });
}

// POST /api/profile - create the profile (first time only)
async function createProfile(req, res) {
  try {
    const existing = await Profile.findOne({ user: req.userId });
    if (existing) {
      return res.status(409).json({ error: "You already have a profile. Use edit instead." });
    }

    const publicId = uuidv4();
    const profile = await Profile.create({
      ...req.body,
      user: req.userId,
      publicId,
    });

    // Generate the first AI summary right away so the scan page has something to show
    const summary = await generateAiSummary(profile);
    profile.aiSummary = summary;
    profile.aiSummaryUpdatedAt = new Date();
    await profile.save();

    res.status(201).json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't create your profile. Try again." });
  }
}

// PUT /api/profile - update the existing profile, regenerates the AI summary
async function updateProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ error: "No profile found to update." });
    }

    Object.assign(profile, req.body);

    // Regenerate the summary since the underlying data changed
    const summary = await generateAiSummary(profile);
    profile.aiSummary = summary;
    profile.aiSummaryUpdatedAt = new Date();

    await profile.save();
    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't save your changes. Try again." });
  }
}

// GET /api/profile/qr - returns a QR code (as a data URL image) pointing at the public scan page
async function getQrCode(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    if (!profile) {
      return res.status(404).json({ error: "Create a profile first to get your QR code." });
    }

    const scanUrl = `${process.env.CLIENT_URL}/emergency/${profile.publicId}`;
    const qrDataUrl = await QRCode.toDataURL(scanUrl, {
      width: 512,
      margin: 2,
      color: { dark: "#22305C", light: "#FFFFFF" },
    });

    res.json({ qrDataUrl, scanUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't generate the QR code." });
  }
}

// GET /api/public/:publicId - the public, no-login scan endpoint anyone can hit
async function getPublicProfile(req, res) {
  try {
    const profile = await Profile.findOne({ publicId: req.params.publicId }).select(
      "-user -__v"
    );

    if (!profile) {
      return res.status(404).json({ error: "This profile doesn't exist or was removed." });
    }

    // Fire-and-forget scan log - doesn't block the response
    ScanLog.create({ profile: profile._id }).catch((e) =>
      console.error("Scan log failed:", e.message)
    );

    res.json({ profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong loading this profile." });
  }
}

module.exports = {
  getMyProfile,
  createProfile,
  updateProfile,
  getQrCode,
  getPublicProfile,
};
