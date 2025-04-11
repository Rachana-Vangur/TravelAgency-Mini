// Home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import ProfileLogo from "./ProfileLogo";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to TripBliss</h1>
        <p>Your journey to extraordinary destinations begins here</p>
        <Link to="/destinations" className="cta-button">
          Explore Now
        </Link>
      </section>

      <section className="featured-section">
        <div className="featured-card flights">
          <div className="featured-card-content">
            <h3>Find Your Flight</h3>
            <p>Discover the best deals on flights worldwide</p>
            <Link to="/flights" className="cta-button">
              Book Flights
            </Link>
          </div>
        </div>

        <div className="featured-card hotels">
          <div className="featured-card-content">
            <h3>Perfect Stay</h3>
            <p>Find your ideal accommodation</p>
            <Link to="/hotels" className="cta-button">
              Book Hotels
            </Link>
          </div>
        </div>

        <div className="featured-card destinations">
          <div className="featured-card-content">
            <h3>Dream Destinations</h3>
            <p>Explore amazing places around the world</p>
            <Link to="/destinations" className="cta-button">
              View Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Categories */}
      <section className="travel-categories">
        <h2>Explore Our Services</h2>
        <div className="category-grid">
          <Link to="/flights" className="category-box">
            <div className="category-image">
              <img src="/images/homepage/flight.jpeg" alt="Flights" />
            </div>
            <h3>Flights</h3>
            <p>Find and book flights to your dream destination</p>
          </Link>

          <Link to="/hotels" className="category-box">
            <div className="category-image">
              <img src="/images/homepage/hotel.jpeg" alt="Hotels" />
            </div>
            <h3>Hotels</h3>
            <p>Discover comfortable stays for your journey</p>
          </Link>

          <Link to="/destinations" className="category-box">
            <div className="category-image">
              <img src="/images/homepage/destination.jpeg" alt="Destinations" />
            </div>
            <h3>Destinations</h3>
            <p>Explore amazing places around the world</p>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose TripBliss</h2>
        <div className="features-grid">
          <div className="feature-box">
            <span className="feature-icon">🌍</span>
            <h3>Global Coverage</h3>
            <p>Access to destinations worldwide</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">💰</span>
            <h3>Best Prices</h3>
            <p>Competitive rates and deals</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">🛡️</span>
            <h3>Secure Booking</h3>
            <p>Safe and reliable transactions</p>
          </div>
          <div className="feature-box">
            <span className="feature-icon">🤝</span>
            <h3>24/7 Support</h3>
            <p>Always here to help you</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 TripBliss. All rights reserved.</p>
          <div className="partner-logos">
            <img src="/assets/images/partners/partner1.svg" alt="Partner 1" />
            <img src="/assets/images/partners/partner2.svg" alt="Partner 2" />
            <img src="/assets/images/partners/partner3.svg" alt="Partner 3" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
