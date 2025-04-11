import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { destinationService } from "../services/api";
import "./Stays.css";

const Stays = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const propertyTypes = [
    "Hotel",
    "Resort",
    "Apartment",
    "Villa",
    "Guest House",
  ];

  const amenities = [
    "WiFi",
    "Pool",
    "Spa",
    "Restaurant",
    "Gym",
    "Parking",
    "Room Service",
    "Beach Access",
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await destinationService.getAll();

      // Transform destinations into hotel-like objects with additional properties
      const hotelData = response.map((dest) => ({
        ...dest,
        propertyType:
          propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        amenities: amenities.slice(0, Math.floor(Math.random() * 5) + 3),
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        reviews: Math.floor(Math.random() * 500) + 50, // Random number of reviews
      }));

      setHotels(hotelData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hotels. Please try again later.");
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyTypeChange = (type) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1];

    const matchesPropertyType =
      selectedPropertyTypes.length === 0 ||
      selectedPropertyTypes.includes(hotel.propertyType);

    const matchesAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((amenity) => hotel.amenities.includes(amenity));

    return (
      matchesSearch && matchesPrice && matchesPropertyType && matchesAmenities
    );
  });

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
    <div className="stays-container">
      <div className="stays-hero-section">
        <div className="hero-content">
          <h1 className="stays-title">Find Your Perfect Stay</h1>
          <p>Discover handpicked hotels for your next adventure</p>
        </div>
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

        <div className="filters-container">
          <div className="price-filter">
            <label>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
            />
          </div>

          <div className="property-type-filter">
            <h3>Property Type</h3>
            <div className="filter-options">
              {propertyTypes.map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedPropertyTypes.includes(type)}
                    onChange={() => handlePropertyTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="amenities-filter">
            <h3>Amenities</h3>
            <div className="filter-options">
              {amenities.map((amenity) => (
                <label key={amenity} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hotels-grid">
        {filteredHotels.map((hotel) => (
          <Link
            to={`/hotel/${hotel._id}`}
            key={hotel._id}
            className="hotel-card"
          >
            <div
              className="hotel-image"
              style={{ backgroundImage: `url(${hotel.image})` }}
            >
              <div className="hotel-overlay">
                <div className="hotel-price">
                  ₹{hotel.price}
                  <span className="per-night">/night</span>
                </div>
              </div>
            </div>
            <div className="hotel-details">
              <h3>{hotel.name}</h3>
              <p className="location">{hotel.location}</p>
              <p className="description">{hotel.description}</p>
              <div className="hotel-meta">
                <div className="rating">
                  <span className="stars">
                    {"★".repeat(Math.floor(hotel.rating))}
                  </span>
                  <span className="rating-number">{hotel.rating}</span>
                  <span className="reviews">({hotel.reviews} reviews)</span>
                </div>
              </div>
              <div className="amenities">
                {hotel.amenities.slice(0, 3).map((amenity) => (
                  <span key={amenity} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stays;
