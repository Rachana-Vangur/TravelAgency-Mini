import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookingService } from "../services/api";
import "./FlightDetail.css";

const FlightDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookingData, setBookingData] = useState({
    passengers: 1,
    class: "economy",
    departureDate: "",
    returnDate: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setError("Please log in to view flight details and make bookings");
      navigate("/login", {
        state: {
          from: `/flights/${id}`,
          message: "Please log in to view flight details and make bookings",
        },
      });
      return;
    }
    setIsAuthenticated(true);

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

  const handleBookNow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to book a flight");
      // Redirect to login page with return path
      navigate("/login", {
        state: {
          from: `/flights/${id}`,
          message: "Please log in to book a flight",
        },
      });
      return;
    }

    // Validate flight data
    if (!flight?.id || !flight?.airline || !flight?.flightNumber) {
      console.error("Invalid flight data:", flight);
      setError("Invalid flight information. Please try again.");
      return;
    }

    // Validate booking dates
    if (!bookingData.departureDate) {
      setError("Please select a departure date");
      return;
    }

    // Format dates to ISO string
    const departureDate = new Date(bookingData.departureDate).toISOString();
    const returnDate = bookingData.returnDate
      ? new Date(bookingData.returnDate).toISOString()
      : null;

    try {
      // Check for existing bookings
      const existingBookings = await bookingService.getMyBookings();
      const hasExistingBooking = existingBookings.some((booking) => {
        if (booking.itemType === "flight" && booking.itemId === flight.id) {
          const existingDeparture = new Date(
            booking.departureDate || booking.startDate
          );
          const existingReturn = booking.returnDate
            ? new Date(booking.returnDate)
            : null;
          const newDeparture = new Date(departureDate);
          const newReturn = returnDate ? new Date(returnDate) : null;

          // For one-way flights
          if (!existingReturn && !newReturn) {
            return (
              existingDeparture.toDateString() === newDeparture.toDateString()
            );
          }

          // For round-trip flights
          if (existingReturn && newReturn) {
            return (
              (newDeparture >= existingDeparture &&
                newDeparture <= existingReturn) ||
              (newReturn >= existingDeparture && newReturn <= existingReturn) ||
              (newDeparture <= existingDeparture && newReturn >= existingReturn)
            );
          }
        }
        return false;
      });

      if (hasExistingBooking) {
        setError("You already have a booking for this flight on these dates");
        return;
      }

      // Calculate total price
      const totalPrice = calculateTotalPrice();

      // Validate total price
      if (totalPrice <= 0) {
        console.error("Invalid total price:", totalPrice);
        setError("Invalid price calculation. Please try again.");
        return;
      }

      // Log flight data and booking state for debugging
      console.log("Flight data:", flight);
      console.log("Booking state:", {
        type: "flight",
        itemId: flight.id,
        itemName: `${flight.airline} - ${flight.flightNumber}`,
        price: totalPrice,
        bookingDetails: {
          departureDate,
          returnDate,
          passengers: bookingData.passengers || 1,
          class: bookingData.class || "economy",
          flight: {
            id: flight.id,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            price: flight.price,
          },
        },
      });

      // Navigate to payment page with booking data
      navigate("/payment", {
        state: {
          type: "flight",
          itemId: flight.id,
          itemName: `${flight.airline} - ${flight.flightNumber}`,
          price: totalPrice,
          bookingDetails: {
            departureDate,
            returnDate,
            passengers: bookingData.passengers || 1,
            class: bookingData.class || "economy",
            flight: {
              id: flight.id,
              airline: flight.airline,
              flightNumber: flight.flightNumber,
              price: flight.price,
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
          {!isAuthenticated ? (
            <div className="login-required-message">
              <p>Please log in to book this flight</p>
              <button
                className="login-button"
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: `/flights/${id}`,
                      message: "Please log in to book this flight",
                    },
                  })
                }
              >
                Log In
              </button>
            </div>
          ) : (
            <>
              <div className="flight-info">
                <div className="price">
                  ₹{flight.price.toLocaleString("en-IN")}
                </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetail;
