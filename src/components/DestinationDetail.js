import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { destinationService } from "../services/api";
import "./DestinationDetail.css";

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getById(id);
        setDestination(data);
        setError(null);
      } catch (err) {
        setError(
          "Failed to fetch destination details. Please try again later."
        );
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // Function to get the appropriate image based on destination type
  const getDestinationImage = (destination) => {
    if (!destination) return "/images/destination.jpg";

    const name = destination.name?.toLowerCase() || "";
    const description = destination.description?.toLowerCase() || "";

    // Check for beach/seaside keywords
    if (
      name.includes("beach") ||
      name.includes("seaside") ||
      name.includes("ocean") ||
      description.includes("beach") ||
      description.includes("seaside") ||
      description.includes("ocean")
    ) {
      return "/images/destinations/beach.jpg";
    }

    // Check for mountain/ski keywords
    if (
      name.includes("mountain") ||
      name.includes("ski") ||
      name.includes("snow") ||
      description.includes("mountain") ||
      description.includes("ski") ||
      description.includes("snow")
    ) {
      return "/images/destinations/mountain.jpg";
    }

    // Check for city/urban keywords
    if (
      name.includes("city") ||
      name.includes("urban") ||
      name.includes("metropolis") ||
      description.includes("city") ||
      description.includes("urban") ||
      description.includes("metropolis")
    ) {
      return "/images/destinations/city.jpg";
    }

    // Check for desert keywords
    if (
      name.includes("desert") ||
      name.includes("sahara") ||
      description.includes("desert") ||
      description.includes("sahara")
    ) {
      return "/images/destinations/desert.jpg";
    }

    // Default image
    return "/images/destination.jpg";
  };

  if (loading) {
    return (
      <div className="loading-destination">
        <div className="spinner"></div>
        <p>Loading destination details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!destination) {
    return <div className="error-message">Destination not found</div>;
  }

  return (
    <div className="destination-detail-container">
      <div className="destination-hero">
        <img
          src={getDestinationImage(destination)}
          alt={destination.name}
          className="destination-hero-image"
        />
        <div className="destination-hero-content">
          <h1>{destination.name}</h1>
          <p className="location">{destination.location}</p>
          <div className="rating">
            <span>{destination.rating} ★</span>
            <span>({destination.reviews?.length || 0} reviews)</span>
          </div>
        </div>
      </div>

      <div className="destination-content">
        <div className="destination-description">
          <h2>About {destination.name}</h2>
          <p>{destination.description}</p>
        </div>

        <div className="destination-amenities">
          <h2>Amenities</h2>
          <ul>
            {destination.amenities?.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            )) || (
              <>
                <li>Scenic Views</li>
                <li>Local Attractions</li>
                <li>Cultural Experiences</li>
                <li>Natural Beauty</li>
              </>
            )}
          </ul>
        </div>

        <div className="destination-reviews">
          <h2>Reviews</h2>
          {destination.reviews?.length > 0 ? (
            <div className="reviews-list">
              {destination.reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.author}</span>
                    <span className="review-rating">{review.rating} ★</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                  <span className="review-date">{review.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet. Be the first to review this destination!</p>
          )}
        </div>

        <div className="destination-booking">
          <h2>Plan Your Trip</h2>
          <div className="booking-options">
            <Link
              to={`/hotels?destination=${destination._id}`}
              className="booking-btn"
            >
              Find Hotels
            </Link>
            <Link
              to={`/flights?destination=${destination._id}`}
              className="booking-btn"
            >
              Find Flights
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
