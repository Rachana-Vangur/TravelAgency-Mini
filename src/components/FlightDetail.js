import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./FlightDetail.css";

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    class: "economy",
    departureDate: "",
    returnDate: "",
  });

  useEffect(() => {
    // Simulate fetching flight data from API
    const fetchFlightData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await flightService.getById(id);
        // setFlight(response.data);

        // For now, using mock data
        setTimeout(() => {
          setFlight({
            id: id,
            airline: "SkyWings Airlines",
            flightNumber: "SW" + Math.floor(Math.random() * 1000),
            departure: {
              city: "New York",
              airport: "JFK",
              time: "10:30 AM",
            },
            arrival: {
              city: "London",
              airport: "LHR",
              time: "10:30 PM",
            },
            duration: "7h 30m",
            price: 75000,
            availableSeats: 42,
            aircraft: "Boeing 787 Dreamliner",
            amenities: ["Wi-Fi", "In-flight Entertainment", "Meals", "Drinks"],
            image: "/assets/images/flights/hero.svg",
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load flight details. Please try again later.");
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    if (!flight) return 0;

    const basePrice = flight.price;
    const classMultiplier = bookingData.class === "business" ? 3.5 : 1;
    const passengerCount = parseInt(bookingData.passengers);

    return basePrice * classMultiplier * passengerCount;
  };

  const handleBookNow = () => {
    // In a real app, you would validate the form and then proceed
    navigate("/payment", {
      state: {
        type: "flight",
        itemId: flight.id,
        itemName: `${flight.airline} - ${flight.flightNumber}`,
        price: calculateTotalPrice(),
        bookingDetails: {
          ...bookingData,
          flight: flight,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flight-detail-loading">
        <div className="spinner"></div>
        <p>Loading flight details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flight-detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flight-detail-error">
        <h2>Flight Not Found</h2>
        <p>The flight you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/flights")}>Back to Flights</button>
      </div>
    );
  }

  return (
    <div className="flight-detail-container">
      <div className="flight-detail-header">
        <h1>Flight Details</h1>
        <button className="back-button" onClick={() => navigate("/flights")}>
          Back to Flights
        </button>
      </div>

      <div className="flight-detail-content">
        <div className="flight-info-section">
          <div className="flight-image">
            <img src={flight.image} alt={`${flight.airline} flight`} />
          </div>

          <div className="flight-basic-info">
            <h2>{flight.airline}</h2>
            <p className="flight-number">Flight: {flight.flightNumber}</p>
            <p className="flight-aircraft">{flight.aircraft}</p>
            <div className="flight-amenities">
              {flight.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="flight-route">
            <div className="route-point departure">
              <h3>{flight.departure.city}</h3>
              <p className="airport">{flight.departure.airport}</p>
              <p className="time">{flight.departure.time}</p>
            </div>
            <div className="route-line">
              <div className="line"></div>
              <div className="duration">{flight.duration}</div>
              <div className="line"></div>
            </div>
            <div className="route-point arrival">
              <h3>{flight.arrival.city}</h3>
              <p className="airport">{flight.arrival.airport}</p>
              <p className="time">{flight.arrival.time}</p>
            </div>
          </div>
        </div>

        <div className="booking-section">
          <h2>Book This Flight</h2>
          <div className="flight-info">
            <div className="price">₹{flight.price.toLocaleString("en-IN")}</div>
            <div className="seats">
              Available Seats: {flight.availableSeats}
            </div>
          </div>

          <form className="booking-form">
            <div className="form-group">
              <label htmlFor="passengers">Number of Passengers</label>
              <select
                id="passengers"
                name="passengers"
                value={bookingData.passengers}
                onChange={handleInputChange}
                required
              >
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="class">Travel Class</label>
              <select
                id="class"
                name="class"
                value={bookingData.class}
                onChange={handleInputChange}
                required
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="departureDate">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={bookingData.departureDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="returnDate">Return Date (Optional)</label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={bookingData.returnDate}
                onChange={handleInputChange}
                min={
                  bookingData.departureDate ||
                  new Date().toISOString().split("T")[0]
                }
              />
            </div>

            <div className="total-price">
              <p>Total Price:</p>
              <p className="total-amount">
                ₹{calculateTotalPrice().toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              className="book-now-button"
              onClick={handleBookNow}
              disabled={!bookingData.departureDate}
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
