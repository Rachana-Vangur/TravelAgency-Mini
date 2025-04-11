const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const { protect, restrictTo } = require("../middleware/auth");

// Get all bookings (admin only)
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("destination", "name location");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's bookings
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "destination",
      "name location imageUrl price"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single booking
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("destination", "name location imageUrl price");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create booking
router.post("/", protect, async (req, res) => {
  try {
    const {
      destinationId,
      startDate,
      endDate,
      numberOfPeople,
      specialRequests,
    } = req.body;

    // Check if destination exists and has available spots
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    if (destination.availableSpots < numberOfPeople) {
      return res.status(400).json({ message: "Not enough available spots" });
    }

    // Calculate total price
    const totalPrice = destination.price * numberOfPeople;

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      destination: destinationId,
      startDate,
      endDate,
      numberOfPeople,
      totalPrice,
      specialRequests,
    });

    await booking.save();

    // Update available spots
    destination.availableSpots -= numberOfPeople;
    await destination.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update booking status (admin only)
router.patch("/:id/status", protect, restrictTo("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Cancel booking
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update available spots
    const destination = await Destination.findById(booking.destination);
    if (destination) {
      destination.availableSpots += booking.numberOfPeople;
      await destination.save();
    }

    await booking.remove();
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
