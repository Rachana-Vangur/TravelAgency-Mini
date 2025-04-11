// src/components/About.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css'; // You can create an About.css for specific styling

const About = () => {
    const [showContactInfo, setShowContactInfo] = useState(false);

    const handleContactClick = () => {
        setShowContactInfo(!showContactInfo);
    };

    return (
        <div className="about-container">
            <header className="about-header">
                <h1>About TripBliss</h1>
                <div className="about-buttons">
                    <Link to="/" className="home-button">Home</Link>
                    <button onClick={handleContactClick} className="contact-button">Contact Us</button>
                </div>
                {showContactInfo && (
                    <div className="contact-info">
                        <h2>Contact Information</h2>
                        <p><strong>Phone:</strong> +91 9876543210</p>
                        <p><strong>Email:</strong> support@tripbliss.com</p>
                        <p><strong>Address:</strong> 123 Travel Street, Hyderabad, Telangana, India</p>
                        <p><strong>Follow us on:</strong> <a href="https://facebook.com/tripbliss" target="_blank" rel="noopener noreferrer">Facebook</a> | <a href="https://twitter.com/tripbliss" target="_blank" rel="noopener noreferrer">Twitter</a> | <a href="https://instagram.com/tripbliss" target="_blank" rel="noopener noreferrer">Instagram</a></p>
                        <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                    </div>
                )}
            </header>
            <section className="about-section">
                <h2>Our Mission</h2>
                <p>At TripBliss, our mission is to make travel planning seamless, enjoyable, and accessible to everyone. We strive to connect travelers with the best accommodations, flights, and experiences the world has to offer, all in one convenient platform.</p>
            </section>
            <section className="about-section">
                <h2>Our Story</h2>
                <p>TripBliss was founded in [Year of founding] by a group of passionate travelers who recognized the need for a more integrated and user-friendly travel booking experience. Frustrated with juggling multiple websites and dealing with complex booking processes, they set out to create a platform that simplifies every step of the journey.</p>
            </section>
            <section className="about-section">
                <h2>What We Offer</h2>
                <ul>
                    <li><strong>Extensive Selection:</strong> Browse a wide range of hotels, flights, and destinations.</li>
                    <li><strong>Exclusive Deals:</strong> Access special offers and discounts to make your travel more affordable.</li>
                    <li><strong>User-Friendly Interface:</strong> Our intuitive platform is designed for easy navigation and booking.</li>
                    <li><strong>Dedicated Support:</strong> Our customer support team is available 24/7 to assist you with any queries.</li>
                </ul>
            </section>
            <section className="about-section">
                <h2>Our Team</h2>
                <p>We are a diverse team of travel enthusiasts, technology experts, and customer service professionals committed to providing you with the best possible travel experience.</p>
                {/* You could add team member profiles here if you have them */}
            </section>
            <footer className="about-footer">
                <p>&copy; {new Date().getFullYear()} TripBliss. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default About;