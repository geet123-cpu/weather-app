const mongoose = require("mongoose");

const WeatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  humidity: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Weather", WeatherSchema);