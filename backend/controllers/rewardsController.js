const User = require("../models/User");

const getRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let badge = "None";

    if (user.streak >= 30) badge = "🥇 Gold Planet Protector";
    else if (user.streak >= 14) badge = "🥈 Silver Eco Hero";
    else if (user.streak >= 7) badge = "🥉 Bronze Eco Saver";

    res.json({ streak: user.streak, badge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRewards };
