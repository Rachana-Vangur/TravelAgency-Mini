// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProfilePicture from "../assets/default-profile.png";
import { Link, useNavigate } from "react-router-dom";
import {
  authService,
  bookingService,
  hotelService,
  destinationService,
} from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState({
    current: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  // Authentication check
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login", {
        state: {
          from: "/dashboard",
          message: "Please log in to access your dashboard",
        },
      });
    }
  }, [navigate]);

  // Function to get the appropriate hotel image
  const getHotelImage = (hotel) => {
    if (!hotel) return "/images/hotels/grandplaza.jpeg";
    const name = hotel.name?.toLowerCase() || "";
    const description = hotel.description?.toLowerCase() || "";
    if (name.includes("grand plaza") || description.includes("grand plaza")) {
      return "/images/hotels/grandplaza.jpeg";
    }
    if (name.includes("seaside") || description.includes("seaside")) {
      return "/images/hotels/seaside.jpg";
    }
    if (name.includes("mountain") || description.includes("mountain")) {
      return "/images/hotels/mountainview.jpeg";
    }
    if (name.includes("urban") || description.includes("urban")) {
      return "/images/hotels/urbanbotique.jpg";
    }
    if (name.includes("luxury") || description.includes("luxury")) {
      return "/images/hotels/luxurypalace.jpg";
    }
    return "/images/hotels/grandplaza.jpeg";
  };

  // Function to get the appropriate destination image
  const getDestinationImage = (destination) => {
    if (!destination) return "/images/destination.jpg";
    const name = destination.name?.toLowerCase() || "";
    const description = destination.description?.toLowerCase() || "";
    if (name.includes("tokyo") || description.includes("tokyo")) {
      return "/images/destinations/tokyo.jpeg";
    }
    if (name.includes("paris") || description.includes("paris")) {
      return "/images/destinations/paris.jpeg";
    }
    if (name.includes("new york") || description.includes("new york")) {
      return "/images/destinations/newyork.jpeg";
    }
    if (name.includes("rome") || description.includes("rome")) {
      return "/images/destinations/rome.jpeg";
    }
    if (name.includes("sydney") || description.includes("sydney")) {
      return "/images/destinations/sydney.jpeg";
    }
    return "/images/destination.jpg";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check for authentication token
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to access your dashboard");
          navigate("/login", {
            state: {
              from: "/dashboard",
              message: "Please log in to access your dashboard",
            },
          });
          return;
        }

        const userData = await authService.getCurrentUser();
        console.log("User data fetched:", userData);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Please log in to access your dashboard");
        navigate("/login", {
          state: {
            from: "/dashboard",
            message: "Please log in to access your dashboard",
          },
        });
      }
    };

    const fetchBookings = async () => {
      try {
        // Check for authentication token
        const token = localStorage.getItem("authToken");
        if (!token) {
          return; // Don't fetch bookings if not authenticated
        }

        setLoading(true);
        const data = await bookingService.getMyBookings();
        console.log("Raw bookings data:", data);

        // Process and format the bookings
        const processedBookings = data.map((booking) => {
          // Determine the correct start and end dates based on booking type
          let startDate, endDate;
          if (booking.itemType === "flight") {
            startDate = booking.departureDate || booking.startDate;
            endDate = booking.returnDate || booking.endDate;
          } else if (booking.itemType === "hotel") {
            startDate = booking.checkIn || booking.startDate;
            endDate = booking.checkOut || booking.endDate;
          } else {
            startDate = booking.startDate;
            endDate = booking.endDate;
          }

          // Determine the correct number of people
          const people =
            booking.passengers || booking.guests || booking.travelers || 1;

          // Determine the correct total price
          let totalPrice = booking.totalPrice;
          if (!totalPrice && booking.price) {
            totalPrice = booking.price;
          }

          return {
            ...booking,
            startDate,
            endDate,
            people,
            totalPrice,
            // Add additional fields for display
            checkIn: startDate,
            checkOut: endDate,
            guests: people,
            rooms: booking.rooms || 1,
            travelers: people,
            passengers: people,
          };
        });

        // Sort current bookings by start date (most recent first)
        const currentBookings = processedBookings
          .filter((booking) => {
            const endDate = new Date(booking.endDate);
            return endDate >= new Date();
          })
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        // Sort past bookings by end date (most recent first)
        const pastBookings = processedBookings
          .filter((booking) => {
            const endDate = new Date(booking.endDate);
            return endDate < new Date();
          })
          .sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

        console.log("Processed current bookings:", currentBookings);
        console.log("Processed past bookings:", pastBookings);

        setBookings({
          current: currentBookings,
          past: pastBookings,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
    fetchBookings();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      setError("Failed to cancel booking");
    }
  };

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    try {
      if (selectedBooking.itemType === "hotel") {
        await hotelService.addReview(selectedBooking.itemId, reviewData);
      } else if (selectedBooking.itemType === "destination") {
        await destinationService.addReview(selectedBooking.itemId, reviewData);
      }
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: "" });
      // Refresh bookings to show updated reviews
      const userBookings = await bookingService.getMyBookings();
      setBookings(userBookings);
    } catch (err) {
      setError("Failed to submit review");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error formatting date:", err);
      return "Invalid Date";
    }
  };

  const filteredBookings =
    activeTab === "current"
      ? (bookings.current || []).filter((booking) => {
          const matchesSearch =
            booking.itemName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.reference?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesType =
            filterType === "all" || booking.itemType === filterType;

          return matchesSearch && matchesType;
        })
      : (bookings.past || []).filter((booking) => {
          const matchesSearch =
            booking.itemName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            booking.reference?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesType =
            filterType === "all" || booking.itemType === filterType;

          return matchesSearch && matchesType;
        });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={ProfilePicture}
            alt="User Profile"
            className="profile-image"
          />
          <div className="user-info">
            <h2>Welcome, {user?.name || "User"}!</h2>
            <p>Email: {user?.email || ""}</p>
            <p>Member since: {formatDate(user?.createdAt) || ""}</p>
          </div>
          <div className="profile-actions">
            <Link to="/edit-profile" className="edit-profile-button">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <div className="booking-tabs">
            <button
              className={`tab ${activeTab === "current" ? "active" : ""}`}
              onClick={() => setActiveTab("current")}
            >
              Current Bookings
            </button>
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Booking History
            </button>
          </div>

          <div className="booking-filters">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="destination">Destinations</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
            </select>
          </div>
        </div>

        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>
                No {activeTab === "current" ? "current" : "past"} bookings
                found.
              </p>
              <Link to="/destinations" className="browse-button">
                Browse Destinations
              </Link>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-image">
                  <img
                    src={
                      booking.itemType === "hotel"
                        ? getHotelImage(booking.item)
                        : booking.itemType === "destination"
                        ? getDestinationImage(booking.item)
                        : "/images/flight.jpg"
                    }
                    alt={booking.itemName}
                  />
                </div>
                <div className="booking-info">
                  <div className="booking-header">
                    <h3>{booking.itemName}</h3>
                    <span className={`booking-type ${booking.itemType}`}>
                      {booking.itemType}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p>
                      <strong>Reference:</strong> {booking.reference}
                    </p>
                    {booking.itemType === "destination" && (
                      <>
                        <p>
                          <strong>Dates:</strong>{" "}
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p>
                          <strong>Travelers:</strong> {booking.travelers}
                        </p>
                        <p>
                          <strong>Package:</strong>{" "}
                          <span className="capitalize">{booking.package}</span>
                        </p>
                      </>
                    )}
                    {booking.itemType === "hotel" && (
                      <>
                        <p>
                          <strong>Check-in:</strong>{" "}
                          {formatDate(booking.startDate)}
                        </p>
                        <p>
                          <strong>Check-out:</strong>{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p>
                          <strong>Guests:</strong> {booking.numberOfPeople}
                        </p>
                        <p>
                          <strong>Rooms:</strong> {booking.rooms || 1}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p>
                      <strong>Total:</strong> ₹
                      {(
                        booking.total ||
                        booking.totalPrice ||
                        0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="booking-actions">
                    {(booking.itemType === "hotel" ||
                      booking.itemType === "destination") && (
                      <button
                        className="review-button"
                        onClick={() => handleReviewClick(booking)}
                      >
                        Write a Review
                      </button>
                    )}
                    {booking.status === "Confirmed" && (
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showReviewModal && (
        <div className="review-modal">
          <div className="review-modal-content">
            <h2>Write a Review</h2>
            <div className="review-form">
              <div className="rating-input">
                <label>Rating:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= reviewData.rating ? "filled" : ""
                      }`}
                      onClick={() =>
                        setReviewData({ ...reviewData, rating: star })
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="comment-input">
                <label>Comment:</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              <div className="review-actions">
                <button className="submit-review" onClick={handleReviewSubmit}>
                  Submit Review
                </button>
                <button
                  className="cancel-review"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
