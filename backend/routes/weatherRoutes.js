const express = require("express");
const router = express.Router();
const Weather = require("../models/Weather");

router.post("/save", async (req, res) => {
  try {
    const weather = new Weather(req.body);
    await weather.save();

    res.json({
      message: "Weather saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;