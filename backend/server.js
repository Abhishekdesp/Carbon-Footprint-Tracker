require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const footprintRoutes = require("./routes/footprintRoutes");
const rewardsRoutes = require("./routes/rewardsRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect Database
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    mongoState: mongoose.connection.readyState // 0: disconnected, 1: connected
  });
});

// Routes
app.use("/", authRoutes);
app.use("/", footprintRoutes); // Mount at root since routes have internal prefixing
app.use("/rewards", rewardsRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
