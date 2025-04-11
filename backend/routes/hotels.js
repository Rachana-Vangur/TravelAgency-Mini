const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const { protect, restrictTo } = require("../middleware/auth");

// Get all hotels
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get hotel by ID
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search hotels
router.get("/search", async (req, res) => {
  try {
    const { location, minPrice, maxPrice, rating } = req.query;
    let query = {};

    if (location) {
      query.location = new RegExp(location, "i");
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    const hotels = await Hotel.find(query);
    res.json(hotels);
  } catch (error) {
    console.error("Error searching hotels:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a hotel (admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a hotel (admin only)
router.put("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a hotel (admin only)
router.delete("/:id", protect, restrictTo("admin"), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a review to a hotel
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const { rating, comment } = req.body;
    const newReview = {
      user: req.user.id,
      rating,
      comment,
    };

    hotel.reviews.push(newReview);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
