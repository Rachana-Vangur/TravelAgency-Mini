import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelService } from "../services/api";
import { bookingService } from "../services/api";
import "./HotelDetail.css";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setError("Please log in to view hotel details and make bookings");
      navigate("/login", {
        state: {
          from: `/hotels/${id}`,
          message: "Please log in to view hotel details and make bookings",
        },
      });
      return;
    }
    setIsAuthenticated(true);

    const fetchHotelData = async () => {
      try {
        setLoading(true);
        console.log("Fetching hotel with ID:", id);
        const data = await hotelService.getById(id);
        console.log("Hotel data received:", data);
        setHotel(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setError("Failed to load hotel details. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelData();
    } else {
      setError("Invalid hotel ID");
      setLoading(false);
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    if (!hotel || !bookingData.checkIn || !bookingData.checkOut) return 0;

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return hotel.price * nights * bookingData.rooms;
  };

  const handleBookNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to book a hotel");
      // Redirect to login page with return path
      navigate("/login", {
        state: {
          from: `/hotels/${id}`,
          message: "Please log in to book a hotel",
        },
      });
      return;
    }

    // Validate hotel data
    if (!hotel?.id || !hotel?.name) {
      console.error("Invalid hotel data:", hotel);
      setError("Invalid hotel information. Please try again.");
      return;
    }

    // Validate booking dates
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    // Format dates to ISO string
    const checkIn = new Date(bookingData.checkIn).toISOString();
    const checkOut = new Date(bookingData.checkOut).toISOString();

    try {
      // Check for existing bookings
      const existingBookings = await bookingService.getMyBookings();
      const hasExistingBooking = existingBookings.some((booking) => {
        if (booking.itemType === "hotel" && booking.itemId === hotel.id) {
          const existingCheckIn = new Date(
            booking.checkIn || booking.startDate
          );
          const existingCheckOut = new Date(
            booking.checkOut || booking.endDate
          );
          const newCheckIn = new Date(checkIn);
          const newCheckOut = new Date(checkOut);

          // Check if dates overlap
          return (
            (newCheckIn >= existingCheckIn && newCheckIn < existingCheckOut) ||
            (newCheckOut > existingCheckIn &&
              newCheckOut <= existingCheckOut) ||
            (newCheckIn <= existingCheckIn && newCheckOut >= existingCheckOut)
          );
        }
        return false;
      });

      if (hasExistingBooking) {
        setError(
          "You already have a booking for this hotel during these dates"
        );
        return;
      }

      // Calculate number of nights
      const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      );

      // Calculate total price
      const totalPrice = hotel.price * nights * bookingData.rooms;

      // Validate total price
      if (totalPrice <= 0) {
        console.error("Invalid total price:", totalPrice);
        setError("Invalid price calculation. Please try again.");
        return;
      }

      // Log hotel data and booking state for debugging
      console.log("Hotel data:", hotel);
      console.log("Booking state:", {
        type: "hotel",
        itemId: hotel.id,
        itemName: hotel.name,
        price: totalPrice,
        bookingDetails: {
          checkIn,
          checkOut,
          guests: bookingData.guests || 1,
          rooms: bookingData.rooms || 1,
          hotel: {
            id: hotel.id,
            name: hotel.name,
            price: hotel.price,
          },
        },
      });

      // Navigate to payment page with booking data
      navigate("/payment", {
        state: {
          type: "hotel",
          itemId: hotel.id,
          itemName: hotel.name,
          price: totalPrice,
          bookingDetails: {
            checkIn,
            checkOut,
            guests: bookingData.guests || 1,
            rooms: bookingData.rooms || 1,
            hotel: {
              id: hotel.id,
              name: hotel.name,
              price: hotel.price,
            },
          },
        },
      });
    } catch (err) {
      console.error("Error checking existing bookings:", err);
      setError("Failed to verify booking availability. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="hotel-detail-loading">
        <div className="spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotel-detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="hotel-detail-error">
        <h2>Hotel Not Found</h2>
        <p>The hotel you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/hotels")}>Back to Hotels</button>
      </div>
    );
  }

  return (
    <div className="hotel-detail-container">
      <div className="hotel-detail-header">
        <h1>Hotel Details</h1>
        <button className="back-button" onClick={() => navigate("/hotels")}>
          Back to Hotels
        </button>
      </div>

      <div className="hotel-detail-content">
        <div className="hotel-info-section">
          <div className="hotel-image">
            <img src={hotel.image} alt={hotel.name} />
          </div>

          <div className="hotel-basic-info">
            <h2>{hotel.name}</h2>
            <p className="hotel-location">{hotel.location}</p>
            <div className="hotel-rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < hotel.rating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="hotel-description">{hotel.description}</p>
          </div>

          <div className="hotel-amenities">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {hotel.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <span className="amenity-icon">✓</span>
                  <span className="amenity-name">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h2>Book This Hotel</h2>
          {!isAuthenticated ? (
            <div className="login-required-message">
              <p>Please log in to book this hotel</p>
              <button
                className="login-button"
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: `/hotels/${id}`,
                      message: "Please log in to book this hotel",
                    },
                  })
                }
              >
                Log In
              </button>
            </div>
          ) : (
            <>
              <div className="price-info">
                <p className="price-label">Price per night:</p>
                <p className="price-amount">₹{hotel.price}</p>
              </div>

              <form className="booking-form">
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in Date</label>
                  <input
                    type="date"
                    id="checkIn"
                    name="checkIn"
                    value={bookingData.checkIn}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOut">Check-out Date</label>
                  <input
                    type="date"
                    id="checkOut"
                    name="checkOut"
                    value={bookingData.checkOut}
                    onChange={handleInputChange}
                    min={
                      bookingData.checkIn ||
                      new Date().toISOString().split("T")[0]
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleInputChange}
                    required
                  >
                    {[...Array(4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="rooms">Number of Rooms</label>
                  <select
                    id="rooms"
                    name="rooms"
                    value={bookingData.rooms}
                    onChange={handleInputChange}
                    required
                  >
                    {[...Array(3)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Room" : "Rooms"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="total-price">
                  <p>Total Price:</p>
                  <p className="total-amount">₹{calculateTotalPrice()}</p>
                </div>

                <button
                  type="button"
                  className="book-now-button"
                  onClick={handleBookNow}
                  disabled={!bookingData.checkIn || !bookingData.checkOut}
                >
                  Book Now
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
