const express = require("express");
const router = express.Router();
const { getPublicProfile } = require("../controllers/profileController");

router.get("/:publicId", getPublicProfile);

module.exports = router;
