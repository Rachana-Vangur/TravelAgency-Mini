import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { flightService } from "../services/api";
import "./Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const mockFlights = [
    {
      id: "1",
      airline: "Emirates",
      flightNumber: "EK123",
      departure: {
        city: "Mumbai",
        airport: "BOM",
        time: "10:30 AM",
      },
      arrival: {
        city: "Dubai",
        airport: "DXB",
        time: "12:30 PM",
      },
      duration: "3h 30m",
      price: 45000,
      availableSeats: 42,
      image: "/images/flights/emirates.png",
    },
    {
      id: "2",
      airline: "Delta",
      flightNumber: "DL456",
      departure: {
        city: "Delhi",
        airport: "DEL",
        time: "11:45 AM",
      },
      arrival: {
        city: "New York",
        airport: "JFK",
        time: "2:45 PM",
      },
      duration: "15h 00m",
      price: 85000,
      availableSeats: 28,
      image: "/images/flights/delta.png",
    },
    {
      id: "3",
      airline: "Lufthansa",
      flightNumber: "LH789",
      departure: {
        city: "Bangalore",
        airport: "BLR",
        time: "1:15 PM",
      },
      arrival: {
        city: "Frankfurt",
        airport: "FRA",
        time: "6:45 PM",
      },
      duration: "9h 30m",
      price: 65000,
      availableSeats: 35,
      image: "/images/flights/lufthansa.png",
    },
    {
      id: "4",
      airline: "Singapore Airlines",
      flightNumber: "SQ234",
      departure: {
        city: "Chennai",
        airport: "MAA",
        time: "2:30 PM",
      },
      arrival: {
        city: "Singapore",
        airport: "SIN",
        time: "7:00 PM",
      },
      duration: "4h 30m",
      price: 35000,
      availableSeats: 50,
      image: "/images/flights/singapore.png",
    },
    {
      id: "5",
      airline: "Qatar Airways",
      flightNumber: "QR567",
      departure: {
        city: "Kolkata",
        airport: "CCU",
        time: "3:45 PM",
      },
      arrival: {
        city: "Doha",
        airport: "DOH",
        time: "6:15 PM",
      },
      duration: "5h 30m",
      price: 40000,
      availableSeats: 45,
      image: "/images/flights/qatar.png",
    },
  ];

  const getPriceRange = (price) => {
    if (price < 50000) return "budget";
    if (price < 100000) return "moderate";
    return "luxury";
  };

  const getAirlineImage = (airline) => {
    const airlineLower = airline.toLowerCase();
    if (airlineLower.includes("emirates")) {
      return "/images/flights/emirates.jpg";
    } else if (airlineLower.includes("delta")) {
      return "/images/flights/delta.jpeg";
    } else if (airlineLower.includes("lufthansa")) {
      return "/images/flights/lufthansa.jpeg";
    } else if (airlineLower.includes("singapore")) {
      return "/images/flights/singapore.jpg";
    } else if (airlineLower.includes("qatar")) {
      return "/images/flights/qatar.jpg";
    }
    return "/images/airline-placeholder.png";
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const data = await flightService.getAll();
        setFlights(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch flights. Please try again later.");
        console.error("Error fetching flights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && flight.price < 50000) ||
      (priceFilter === "moderate" &&
        flight.price >= 50000 &&
        flight.price < 100000) ||
      (priceFilter === "luxury" && flight.price >= 100000);

    const matchesDate =
      !dateFilter || flight.departureDate.includes(dateFilter);

    return matchesSearch && matchesPrice && matchesDate;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Format as HH:MM
  };

  if (loading) {
    return (
      <div className="loading-flights">
        <div className="spinner"></div>
        <p>Loading flights...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flights-container">
      <div className="flights-hero-section">
        <h1>Find Your Perfect Flight</h1>
        <p>Search and book flights to destinations worldwide</p>
      </div>

      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by city or airline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="price-filter">
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
        <div className="date-filter">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flights-grid">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <div key={flight._id} className="flight-card">
              <div className="flight-header">
                <div className="airline-info">
                  <img
                    src={getAirlineImage(flight.airline)}
                    alt={flight.airline}
                  />
                  <span>{flight.airline}</span>
                </div>
                <div className="flight-number">{flight.flightNumber}</div>
              </div>

              <div className="flight-route">
                <div className="departure">
                  <div className="time">{formatTime(flight.departureTime)}</div>
                  <div className="city">{flight.from}</div>
                </div>
                <div className="flight-path">
                  <div className="line"></div>
                  <div className="duration">{flight.duration}</div>
                </div>
                <div className="arrival">
                  <div className="time">{formatTime(flight.arrivalTime)}</div>
                  <div className="city">{flight.to}</div>
                </div>
              </div>

              <div className="flight-details">
                <div className="date">{formatDate(flight.departureDate)}</div>
                <div className="price">
                  ₹{flight.price.toLocaleString("en-IN")}
                </div>
              </div>

              <Link to={`/flights/${flight._id}`} className="book-flight-btn">
                Book Now
              </Link>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No flights found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="flights-footer">
        <div className="promo-section">
          <h2>Special Offers</h2>
          <p>Book now and get 10% off on your first flight booking!</p>
          <Link to="/contact" className="contact-btn">
            Contact Us
          </Link>
        </div>
        <div className="partners-section">
          <h3>Our Airline Partners</h3>
          <div className="partner-logos">
            <img src="/images/flights/emirates.jpg" alt="Emirates" />
            <img src="/images/flights/delta.jpeg" alt="Delta" />
            <img src="/images/flights/lufthansa.jpeg" alt="Lufthansa" />
            <img src="/images/flights/singapore.jpg" alt="Singapore Airlines" />
            <img src="/images/flights/qatar.jpg" alt="Qatar Airways" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
