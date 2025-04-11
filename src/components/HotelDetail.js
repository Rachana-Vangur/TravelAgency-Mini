import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelService } from "../services/api";
import "./HotelDetail.css";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1,
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        console.log("Fetching hotel with ID:", id);
        const data = await hotelService.getById(id);
        console.log("Hotel data received:", data);
        const hotelWithId = {
          ...data,
          id: data._id || data.id,
        };
        setHotel(hotelWithId);
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
  }, [id]);

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

  const handleBookNow = () => {
    navigate("/payment", {
      state: {
        type: "hotel",
        itemId: hotel.id,
        itemName: hotel.name,
        price: calculateTotalPrice(),
        bookingDetails: {
          ...bookingData,
          hotel: hotel,
        },
      },
    });
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
                  bookingData.checkIn || new Date().toISOString().split("T")[0]
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
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
