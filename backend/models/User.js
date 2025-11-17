const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: null },

});

module.exports = mongoose.model("User", userSchema);
