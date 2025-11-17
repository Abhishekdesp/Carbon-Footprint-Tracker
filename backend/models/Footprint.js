const mongoose = require("mongoose");

const footprintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  transportation: {
    distanceKm: Number,
    transportType: String,
    fuelType: String,
    flights: Number,
    emissions: Number
  },

  electricity: {
    unitsUsed: Number,
    emissions: Number
  },

  food: {
    dietType: String,
    emissions: Number
  },

  lifestyle: {
    plasticUse: Number,
    recyclingScore: Number,
    emissions: Number
  },

  totalCarbon: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Footprint", footprintSchema);
