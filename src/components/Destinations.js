// src/components/Destinations.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { destinationService } from "../services/api";
import "./Destinations.css"; // Create this CSS file

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getAll();
        setDestinations(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch destinations. Please try again later.");
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Function to get the appropriate image based on destination type
  const getDestinationImage = (destination) => {
    if (!destination) return "/images/destination.jpg";

    const name = destination.name?.toLowerCase() || "";
    const description = destination.description?.toLowerCase() || "";

    // Map destinations to their corresponding images
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

    // Default image
    return "/images/destination.jpg";
  };

  const filteredDestinations = destinations.filter((destination) => {
    const matchesSearch = destination.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && destination.price < 1000) ||
      (priceFilter === "moderate" &&
        destination.price >= 1000 &&
        destination.price < 2000) ||
      (priceFilter === "luxury" && destination.price >= 2000);

    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="loading-destinations">
        <div className="spinner"></div>
        <p>Loading destinations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="destinations-container">
      <div className="destinations-hero-section">
        <h1>Explore Amazing Destinations</h1>
        <p>Discover the world's most beautiful places</p>
      </div>

      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search destinations..."
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
      </div>

      <div className="destinations-grid">
        {filteredDestinations.map((destination) => (
          <div key={destination._id} className="destination-card">
            <img
              src={getDestinationImage(destination)}
              alt={destination.name}
            />
            <div className="destination-info">
              <h3>{destination.name}</h3>
              <p className="location">{destination.location}</p>
              <p className="description">{destination.description}</p>
              <div className="destination-details">
                <span className="price">₹{destination.price}</span>
                <span className="rating">
                  {destination.rating} ★ ({destination.reviews?.length || 0}{" "}
                  reviews)
                </span>
              </div>
              <Link
                to={`/destinations/${destination._id}`}
                className="view-details-btn"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="destinations-footer">
        <div className="promo-section">
          <h2>Special Offers</h2>
          <p>Book now and get 10% off on your first booking!</p>
          <Link to="/contact" className="contact-btn">
            Contact Us
          </Link>
        </div>
        <div className="partners-section">
          <h3>Our Partners</h3>
          <div className="partner-logos">
            <img src="/images/partner1.png" alt="Partner 1" />
            <img src="/images/partner2.png" alt="Partner 2" />
            <img src="/images/partner3.png" alt="Partner 3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
