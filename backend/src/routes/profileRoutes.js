const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  getMyProfile,
  createProfile,
  updateProfile,
  getQrCode,
} = require("../controllers/profileController");

router.use(requireAuth);

router.get("/me", getMyProfile);
router.post("/", createProfile);
router.put("/", updateProfile);
router.get("/qr", getQrCode);

module.exports = router;
