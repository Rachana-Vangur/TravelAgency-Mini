const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const { protect, restrictTo } = require("../middleware/auth");

// Get all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single destination
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create destination (admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update destination (admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete destination (admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json({ message: "Destination removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add review to destination
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const { rating, comment } = req.body;

    destination.reviews.push({
      user: req.user.id,
      rating,
      comment,
    });

    // Calculate average rating
    const totalRating = destination.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    destination.rating = totalRating / destination.reviews.length;

    await destination.save();
    res.json(destination);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
