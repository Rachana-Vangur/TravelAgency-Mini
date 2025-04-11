// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ProfileLogo from './ProfileLogo'; // Assuming you have this component
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Check if the authentication token exists in localStorage
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []); // Run this effect only once on component mount

    const handleProfileClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/login'); // Or handle as needed if not logged in
        }
    };

    return (
        <div className="home-container">
            {/* Header/Navigation Bar */}
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-icon">✈️</span> TripBliss
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/flights">Flights</Link>
                    <Link to="/hotels">Hotels</Link>
                    <Link to="/destinations">Destinations</Link>
                    <Link to="/about">About</Link>
                </nav>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <div onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                            <ProfileLogo /> {/* Render the profile logo component */}
                        </div>
                    ) : (
                        <Link to="/login" className="login-button">Log In</Link>
                        // The Sign Up button has been removed
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Discover Your Perfect Stay</h1>
                    <p>Explore the world's most amazing hotels and destinations with exclusive deals</p>

                    <div className="features">
                        <div className="feature">
                            <span className="feature-icon">🧳</span>
                            <span>Flexible Booking</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">📍</span>
                            <span>1000+ Destinations</span>
                        </div>
                        <div className="feature">
                            <span className="feature-icon">👨‍💼</span>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Destinations Section */}
            <section className="destinations-section">
                <div className="section-header">
                    <h2>Popular Destinations</h2>
                    <p>Explore our most sought-after travel destinations</p>
                    <Link to="/destinations" className="view-all">View all →</Link>
                </div>

                <div className="destination-cards">
                    <div className="destination-card maldives">
                        <div className="card-content">
                            <h3>Maldives</h3>
                            <p>Crystal clear waters and overwater bungalows</p>
                            <span className="location-tag">Maldives</span>
                        </div>
                    </div>

                    <div className="destination-card santorini">
                        <div className="card-content">
                            <h3>Santorini</h3>
                            <p>Iconic whitewashed buildings with sea views</p>
                            <span className="location-tag">Santorini, Greece</span>
                        </div>
                    </div>

                    <div className="destination-card bali">
                        <div className="card-content">
                            <h3>Bali</h3>
                            <p>Tropical paradise with rich culture</p>
                            <span className="location-tag">Bali, Indonesia</span>
                        </div>
                    </div>

                    <div className="destination-card swiss-alps">
                        <div className="card-content">
                            <h3>Swiss Alps</h3>
                            <p>Stunning mountain views and luxury chalets</p>
                            <span className="location-tag">Swiss Alps</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose TripBliss Section */}
            <section className="why-choose-section">
                <div className="section-header center">
                    <h2>Why Choose TripBliss</h2>
                    <p>Experience seamless travel planning with our innovative platform designed to meet all your travel needs</p>
                </div>

                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon">⭐</div>
                        <h3>Best Price Guarantee</h3>
                        <p>Get the best rates with our price match promise and no hidden fees</p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">🌎</div>
                        <h3>Worldwide Coverage</h3>
                        <p>Access over 1 million hotels and accommodations globally</p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">📖</div>
                        <h3>Flexible Booking</h3>
                        <p>Change your plans with free cancellation on most bookings</p>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon">📞</div>
                        <h3>24/7 Support</h3>
                        <p>Our travel experts are available round the clock to assist you</p>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <p>All material herein © 2005-2025 Agoda Company Pte. Ltd. All Rights Reserved.</p>
                    <p>Agoda is part of Booking Holdings Inc., the world leader in online travel & related services.</p>

                    <div className="partner-logos">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3KJ33e3IFtL0QxmP19Jep37cLnIMIg8vyoSOy7dTPy-mpdZwCE4A8o-lhdPApna4LF78&usqp=CAU" alt="Agoda" className="partner-logo" />
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8ZsJVOTUHkIzRIx6TxPTLcMfId317L8FIu---JB981HxvMG7L_HYkSWonNwnxPutM6FU&usqp=CAU" alt="Priceline" className="partner-logo" />
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJazYsOM9GRmO4gRi_61H_ylwG92V849M2eg&s" alt="KAYAK" className="partner-logo" />
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuukwGkfQRlu4u3zQIctCq32MqKT71CC_1ag&s" alt="Booking.com" className="partner-logo" />
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-3qbldbP_CMfPueW8wUAjEe-4XxREZX3S_w&s" alt="OpenTable" className="partner-logo" />
                    </div>

                    <div className="app-promotion">
                        <button className="app-button">
                            <span className="phone-icon">📱</span> Save more on App!
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;