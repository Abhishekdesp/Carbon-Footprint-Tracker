const express = require("express");
const router = express.Router();
const { signup, login, logout, getDashboard, updateProfile } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/dashboard", authenticateToken, getDashboard);
router.put("/update-profile", authenticateToken, updateProfile);

module.exports = router;
