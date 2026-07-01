const express = require("express");
const router = express.Router();
const {
  getSummary,
  logTransportation,
  logElectricity,
  logFood,
  logLifestyle,
  getWeeklyChart,
  getCategoryBreakdown,
  getInsights,
  getTips,
  getRecommendations,
  uploadPhoto
} = require("../controllers/footprintController");
const { authenticateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(authenticateToken); // Protect all routes in this file

router.get("/footprint/summary", getSummary);
router.post("/footprint/transportation", logTransportation);
router.post("/footprint/electricity", logElectricity);
router.post("/footprint/food", logFood);
router.post("/footprint/lifestyle", logLifestyle);
router.get("/footprint/weekly-chart", getWeeklyChart);
router.get("/footprint/category-breakdown", getCategoryBreakdown);
router.get("/footprint/insights", getInsights);
router.get("/footprint/tips", getTips);
router.get("/recommendations", getRecommendations);

// Upload endpoint
router.post("/upload", upload.single("photo"), uploadPhoto);

module.exports = router;
