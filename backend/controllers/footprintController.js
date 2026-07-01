const { ObjectId } = require("mongoose").Types;
const Footprint = require("../models/Footprint");
const { updateStreak } = require("./authController");

// FOOTPRINT: SUMMARY
const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const result = await Footprint.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $facet: {
          today: [
            { $match: { date: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: "$totalCarbon" } } }
          ],
          week: [
            { $match: { date: { $gte: sevenDaysAgo } } },
            { $group: { _id: null, total: { $sum: "$totalCarbon" } } }
          ],
          month: [
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$totalCarbon" } } }
          ]
        }
      }
    ]);

    const todayTotal = result[0]?.today[0]?.total || 0;
    const weekTotal = result[0]?.week[0]?.total || 0;
    const monthTotal = result[0]?.month[0]?.total || 0;

    res.json({
      today: todayTotal.toFixed(1),
      week: weekTotal.toFixed(1),
      month: monthTotal.toFixed(1),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FOOTPRINT: TRANSPORTATION
const logTransportation = async (req, res) => {
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
};

// FOOTPRINT: ELECTRICITY
const logElectricity = async (req, res) => {
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
};

// FOOTPRINT: FOOD
const logFood = async (req, res) => {
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
};

// FOOTPRINT: LIFESTYLE
const logLifestyle = async (req, res) => {
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
};

// WEEKLY CHART DATA
const getWeeklyChart = async (req, res) => {
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
};

// CATEGORY BREAKDOWN
const getCategoryBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const result = await Footprint.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          transport: { $sum: "$transportation.emissions" },
          electricity: { $sum: "$electricity.emissions" },
          food: { $sum: "$food.emissions" },
          lifestyle: { $sum: "$lifestyle.emissions" }
        }
      }
    ]);

    const data = result[0] || { transport: 0, electricity: 0, food: 0, lifestyle: 0 };

    res.json({
      transport: data.transport || 0,
      electricity: data.electricity || 0,
      food: data.food || 0,
      lifestyle: data.lifestyle || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// INSIGHTS
const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const result = await Footprint.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $facet: {
          weekData: [
            { $match: { date: { $gte: sevenDaysAgo } } },
            {
              $group: {
                _id: null,
                weeklyTransport: { $sum: "$transportation.emissions" },
                foodEmissions: { $sum: "$food.emissions" },
                lifestyleRecycling: { $sum: "$lifestyle.recyclingKg" }
              }
            }
          ],
          thisMonthData: [
            { $match: { date: { $gte: thisMonth } } },
            {
              $group: {
                _id: null,
                thisMonthElectricity: { $sum: "$electricity.emissions" }
              }
            }
          ],
          prevMonthData: [
            { $match: { date: { $gte: lastMonth, $lt: thisMonth } } },
            {
              $group: {
                _id: null,
                lastMonthElectricity: { $sum: "$electricity.emissions" }
              }
            }
          ]
        }
      }
    ]);

    const week = result[0]?.weekData[0] || { weeklyTransport: 0, foodEmissions: 0, lifestyleRecycling: 0 };
    const thisMonthData = result[0]?.thisMonthData[0] || { thisMonthElectricity: 0 };
    const prevMonthData = result[0]?.prevMonthData[0] || { lastMonthElectricity: 0 };

    const weeklyTransport = week.weeklyTransport || 0;
    const foodEmissions = week.foodEmissions || 0;
    const lifestyleRecycling = week.lifestyleRecycling || 0;
    const thisMonthElectricity = thisMonthData.thisMonthElectricity || 0;
    const lastMonthElectricity = prevMonthData.lastMonthElectricity || 0;

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
};

// TIPS API
const getTips = async (req, res) => {
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
};

// RECOMMENDATIONS
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const entries = await Footprint.find({ userId, date: { $gte: monthStart } });
    let transport = 0, electricity = 0, food = 0, lifestyle = 0;
    entries.forEach(e => {
      transport += e.transportation?.emissions || 0;
      electricity += e.electricity?.emissions || 0;
      food += e.food?.emissions || 0;
      lifestyle += e.lifestyle?.emissions || 0;
    });

    const tips = [];
    if (transport > 50) tips.push("Consider replacing a weekly car trip with public transit or cycling.");
    if (electricity > 80) tips.push("Lower AC thermostat by 1–2°C and seal drafts to save energy.");
    if (food > 60) tips.push("Add one more plant-based meal per week to reduce food emissions.");
    if (lifestyle > 20) tips.push("Repair or donate items instead of buying new to cut embodied emissions.");

    res.json({ transport, electricity, food, lifestyle, tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// IMAGE UPLOAD
const uploadPhoto = (req, res, next) => {
  try {
    console.log('Upload handler invoked for user:', req.user?.id);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.json({
      message: "Uploaded",
      file: {
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mime: req.file.mimetype
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
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
};
