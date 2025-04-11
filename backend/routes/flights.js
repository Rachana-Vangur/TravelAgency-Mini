const express = require("express");
const router = express.Router();
const Flight = require("../models/Flight");
const { protect, restrictTo } = require("../middleware/auth");

// Get all flights
router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get flight by ID
router.get("/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json(flight);
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search flights
router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};

    if (from) query.from = new RegExp(from, "i");
    if (to) query.to = new RegExp(to, "i");
    if (date) {
      const searchDate = new Date(date);
      query.departureDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59)),
      };
    }

    const flights = await Flight.find(query);
    res.json(flights);
  } catch (error) {
    console.error("Error searching flights:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a flight (admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    console.error("Error creating flight:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a flight (admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json(flight);
  } catch (error) {
    console.error("Error updating flight:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a flight (admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.json({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error("Error deleting flight:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
