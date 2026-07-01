const express = require("express");
const router = express.Router();
const { getRewards } = require("../controllers/rewardsController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, getRewards);

module.exports = router;
