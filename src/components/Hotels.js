import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { hotelService } from "../services/api";
import "./Hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getAll();
        // Ensure each hotel has an id field
        const hotelsWithId = data.map((hotel) => ({
          ...hotel,
          id: hotel._id || hotel.id,
        }));
        setHotels(hotelsWithId);
        setError(null);
      } catch (err) {
        setError("Failed to fetch hotels. Please try again later.");
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && hotel.price < 50000) ||
      (priceFilter === "moderate" &&
        hotel.price >= 50000 &&
        hotel.price < 100000) ||
      (priceFilter === "luxury" && hotel.price >= 100000);

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "3+" && hotel.rating >= 3) ||
      (ratingFilter === "4+" && hotel.rating >= 4) ||
      (ratingFilter === "5" && hotel.rating === 5);

    return matchesSearch && matchesPrice && matchesRating;
  });

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span key={index} className={index < rating ? "star filled" : "star"}>
          ★
        </span>
      ));
  };

  const getHotelImage = (hotel) => {
    if (!hotel) return "/images/hotels/grandplaza.jpeg";

    const name = hotel.name?.toLowerCase() || "";
    const description = hotel.description?.toLowerCase() || "";

    // Map hotels to their corresponding images
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

    // Default image
    return "/images/hotels/grandplaza.jpeg";
  };

  if (loading) {
    return (
      <div className="loading-hotels">
        <div className="spinner"></div>
        <p>Loading hotels...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="hotels-container">
      <div className="hotels-hero-section">
        <h1>Find Your Perfect Stay</h1>
        <p>Discover comfortable accommodations worldwide</p>
      </div>

      <div className="search-filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by hotel name or location..."
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
        <div className="rating-filter">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="3+">3+ Stars</option>
            <option value="4+">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <div className="hotels-grid">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <img src={getHotelImage(hotel)} alt={hotel.name} />
                <div className="hotel-rating">
                  {renderStars(hotel.rating)}
                  <span className="rating-number">{hotel.rating}</span>
                </div>
              </div>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="location">{hotel.location}</p>
                <p className="description">{hotel.description}</p>
                <div className="hotel-amenities">
                  {hotel.amenities &&
                    hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  {hotel.amenities && hotel.amenities.length > 3 && (
                    <span className="amenity-tag">
                      +{hotel.amenities.length - 3} more
                    </span>
                  )}
                </div>
                <div className="hotel-details">
                  <div className="price">
                    ₹{hotel.price.toLocaleString("en-IN")}
                  </div>
                  <div className="reviews">
                    ({hotel.reviews?.length || 0} reviews)
                  </div>
                </div>
                <Link to={`/hotels/${hotel.id}`} className="view-details-btn">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No hotels found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="hotels-footer">
        <div className="promo-section">
          <h2>Special Offers</h2>
          <p>Book now and get 15% off on your first hotel booking!</p>
          <Link to="/contact" className="contact-btn">
            Contact Us
          </Link>
        </div>
        <div className="partners-section">
          <h3>Our Hotel Partners</h3>
          <div className="partner-logos">
            <img src="/images/hotel1.png" alt="Hotel 1" />
            <img src="/images/hotel2.png" alt="Hotel 2" />
            <img src="/images/hotel3.png" alt="Hotel 3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
