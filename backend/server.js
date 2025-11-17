require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// -----------------------------
// ENV CONFIG
// -----------------------------
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// -----------------------------
// DB CONNECT
// -----------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/Carbon_FootPrint_Tracker")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// MODELS
const User = require("./models/User");
const Footprint = require("./models/Footprint");

// -----------------------------
// JWT
// -----------------------------
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// -----------------------------
// AUTH MIDDLEWARE
// -----------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Malformed token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid/Expired token" });
    req.user = user;
    next();
  });
}

// -----------------------------
// DAILY STREAK LOGIC
// -----------------------------
async function updateStreak(userId) {
  const user = await User.findById(userId);

  const today = new Date();
  const last = user.lastActive ? new Date(user.lastActive) : null;

  if (!last) {
    // First activity ever
    user.streak = 1;
  } else {
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1; // continued streak
    } else if (diffDays > 1) {
      user.streak = 1; // reset streak
    }
  }

  user.lastActive = today;
  await user.save();
}

// -----------------------------
// AUTH ROUTES
// -----------------------------

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashed,
    });

    await newUser.save();

    const token = generateToken({ id: newUser._id, email: newUser.email });

    res.json({ message: "User created", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken({ id: user._id, email: user.email });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DASHBOARD
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Protected data",
      user,
      streak: user.streak,
      lastActive: user.lastActive,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// FOOTPRINT: SUMMARY
// -----------------------------
app.get("/footprint/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const footprints = await Footprint.find({ userId });

    const todayTotal = footprints
      .filter((f) => new Date(f.date) >= startOfToday)
      .reduce((s, f) => s + f.totalCarbon, 0);

    const weekTotal = footprints
      .filter((f) => new Date(f.date) >= sevenDaysAgo)
      .reduce((s, f) => s + f.totalCarbon, 0);

    const monthTotal = footprints
      .filter((f) => new Date(f.date) >= startOfMonth)
      .reduce((s, f) => s + f.totalCarbon, 0);

    res.json({
      today: todayTotal.toFixed(1),
      week: weekTotal.toFixed(1),
      month: monthTotal.toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// FOOTPRINT: TRANSPORTATION
// -----------------------------
app.post("/footprint/transportation", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { vehicle, fuel, distance, flights, emissions } = req.body;

    const newEntry = new Footprint({
      userId,
      transportation: {
        distanceKm: Number(distance),
        transportType: vehicle,
        fuelType: fuel,
        flights: Number(flights),
        emissions: Number(emissions),
      },
      electricity: { emissions: 0 },
      food: { emissions: 0 },
      lifestyle: { emissions: 0 },
      totalCarbon: Number(emissions),
    });

    await newEntry.save();
    await updateStreak(userId);

    res.json({ message: "Transportation footprint saved", total: emissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// FOOTPRINT: ELECTRICITY
// -----------------------------
app.post("/footprint/electricity", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { units, lpg, acHours, emissions } = req.body;

    const newEntry = new Footprint({
      userId,
      transportation: { emissions: 0 },
      electricity: {
        unitsUsed: Number(units),
        lpgCylinders: Number(lpg),
        acHoursPerDay: Number(acHours),
        emissions: Number(emissions),
      },
      food: { emissions: 0 },
      lifestyle: { emissions: 0 },
      totalCarbon: Number(emissions),
    });

    await newEntry.save();
    await updateStreak(userId);

    res.json({ message: "Electricity footprint stored!", total: emissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// FOOTPRINT: FOOD
// -----------------------------
app.post("/footprint/food", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { diet, dairy, snacks, waste, emissions } = req.body;

    const newEntry = new Footprint({
      userId,
      food: {
        dietType: diet,
        dairyCups: Number(dairy),
        snacksPerDay: Number(snacks),
        wasteKg: Number(waste),
        emissions: Number(emissions),
      },
      transportation: { emissions: 0 },
      electricity: { emissions: 0 },
      lifestyle: { emissions: 0 },
      totalCarbon: Number(emissions),
    });

    await newEntry.save();
    await updateStreak(userId);

    res.json({ message: "Food footprint saved!", total: emissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// FOOTPRINT: LIFESTYLE
// -----------------------------
app.post("/footprint/lifestyle", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { clothes, gadgets, plastic, recycle, water, emissions } = req.body;

    const newEntry = new Footprint({
      userId,
      lifestyle: {
        clothesBought: Number(clothes),
        gadgetsBought: Number(gadgets),
        plasticWaste: Number(plastic),
        recyclingKg: Number(recycle),
        waterUsage: Number(water),
        emissions: Number(emissions),
      },
      transportation: { emissions: 0 },
      electricity: { emissions: 0 },
      food: { emissions: 0 },
      totalCarbon: Number(emissions),
    });

    await newEntry.save();
    await updateStreak(userId);

    res.json({ message: "Lifestyle footprint saved!", total: emissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// WEEKLY CHART DATA
// -----------------------------
app.get("/footprint/weekly-chart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const entries = await Footprint.find({
      userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    const dailyTotals = {};
    entries.forEach((entry) => {
      const day = entry.date.toLocaleDateString("en-US", { weekday: "short" });
      dailyTotals[day] = (dailyTotals[day] || 0) + entry.totalCarbon;
    });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const chartData = days.map((day) => ({
      day,
      carbon: dailyTotals[day] || 0,
    }));

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// CATEGORY BREAKDOWN
// -----------------------------
app.get("/footprint/category-breakdown", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const entries = await Footprint.find({
      userId,
      date: { $gte: startOfMonth },
    });

    let transport = 0,
      electricity = 0,
      food = 0,
      lifestyle = 0;

    entries.forEach((e) => {
      transport += e.transportation.emissions || 0;
      electricity += e.electricity.emissions || 0;
      food += e.food.emissions || 0;
      lifestyle += e.lifestyle.emissions || 0;
    });

    res.json({ transport, electricity, food, lifestyle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// INSIGHTS
// -----------------------------
app.get("/footprint/insights", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const weekEntries = await Footprint.find({ userId, date: { $gte: sevenDaysAgo } });
    const monthEntries = await Footprint.find({ userId, date: { $gte: thisMonth } });
    const prevMonthEntries = await Footprint.find({ userId, date: { $gte: lastMonth, $lt: thisMonth } });

    const weeklyTransport = weekEntries.reduce(
      (sum, f) => sum + (f.transportation?.emissions || 0),
      0
    );

    const thisMonthElectricity = monthEntries.reduce(
      (sum, f) => sum + (f.electricity?.emissions || 0),
      0
    );

    const lastMonthElectricity = prevMonthEntries.reduce(
      (sum, f) => sum + (f.electricity?.emissions || 0),
      0
    );

    const foodEmissions = weekEntries.reduce(
      (sum, f) => sum + (f.food?.emissions || 0),
      0
    );

    const lifestyleRecycling = weekEntries.reduce(
      (sum, f) => sum + (f.lifestyle?.recyclingKg || 0),
      0
    );

    const electricityChange =
      lastMonthElectricity > 0
        ? (
            ((thisMonthElectricity - lastMonthElectricity) /
              lastMonthElectricity) *
            100
          ).toFixed(1)
        : 0;

    res.json({
      weeklyTransport,
      electricityChange,
      foodEmissions,
      lifestyleRecycling,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// TIPS API
// -----------------------------
app.get("/footprint/tips", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const entries = await Footprint.find({ userId }).sort({ date: -1 }).limit(10);

    let transport = 0,
      electricity = 0,
      food = 0,
      lifestyle = 0;

    entries.forEach((e) => {
      transport += e.transportation?.emissions || 0;
      electricity += e.electricity?.emissions || 0;
      food += e.food?.emissions || 0;
      lifestyle += e.lifestyle?.emissions || 0;
    });

    const tips = [];

    if (transport > 10)
      tips.push("🚗 Try reducing daily travel by 2–3 km to lower weekly emissions.");

    if (electricity > 15)
      tips.push("⚡ Reduce AC usage by 30 minutes/day — saves ~10 kg CO₂/month.");

    if (food > 20)
      tips.push("🍽️ Add 1 vegetarian day/week — cuts food emissions by 12%.");

    if (lifestyle > 5)
      tips.push("🌿 Increase recycling by 1–2 kg to offset plastic waste.");

    res.json({ tips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
// REWARDS API
// -----------------------------
app.get("/rewards", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let badge = "None";

    if (user.streak >= 30) badge = "🥇 Gold Planet Protector";
    else if (user.streak >= 14) badge = "🥈 Silver Eco Hero";
    else if (user.streak >= 7) badge = "🥉 Bronze Eco Saver";

    res.json({ streak: user.streak, badge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -----------------------------
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
