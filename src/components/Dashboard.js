/*// src/components/Dashboard.js
import React from 'react';
import './Dashboard.css';
import ProfilePicture from '../assets/default-profile.png';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout button clicked!"); // Debugging line
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('address');
        localStorage.removeItem('userBookings');
        console.log("AuthToken removed:", localStorage.getItem('authToken')); // Debugging line
        navigate('/');
        console.log("Navigating to /"); // Debugging line
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="profile-section">
                    <img src={ProfilePicture} alt="User Profile" className="profile-image" />
                    <div className="details-section">
                        <div className="details-header">Details</div>
                        <button onClick={handleLogout} className="logout-button">Log-out</button>
                        <Link to="/edit-profile" className="edit-profile-button">Edit Profile</Link>
                        <Link to="/" className="home-button">Home</Link> {/* Added Home Button */
/*
                   </div>
                    <div className="user-info">
                        <h2>Hi {localStorage.getItem('username') || 'User'} !</h2>
                        <p>Email: {localStorage.getItem('email') || ''}</p>
                        <p>Phone: {localStorage.getItem('phone') || ''}</p>
                        <p>Address: {localStorage.getItem('address') || ''}</p>
                        <button className="delete-account-button">Delete account</button>
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="bookings-header">
                    <button className="bookings-tab active">Bookings</button>
                    <button className="history-tab">History</button>
                </div>
                <div className="bookings-area">
                    <div className="search-bar">
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="bookings-list">
                        {JSON.parse(localStorage.getItem('userBookings'))?.length > 0 ? (
                            JSON.parse(localStorage.getItem('userBookings')).map(booking => (
                                <div className="booking-item" key={booking.id}>
                                    <img src={booking.image} alt={booking.destination} className="booking-image" />
                                    <div className="booking-details">
                                        <p className="destination">{booking.destination}</p>
                                        <p className="reference">{booking.reference}</p>
                                        <p className="email">{booking.contactEmail}</p>
                                        <p className="date">{booking.date}</p>
                                    </div>
                                    <button className="cancel-button" onClick={() => console.log(`Cancel ${booking.id}`)}>Cancel</button>
                                </div>
                            ))
                        ) : (
                            <p className="empty-bookings">No current bookings.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
*/

/*// src/components/Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import ProfilePicture from '../assets/default-profile.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userBookings, setUserBookings] = useState([]);
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (!hasLoaded.current) {
            const storedBookings = localStorage.getItem('userBookings');
            if (storedBookings) {
                try {
                    setUserBookings(JSON.parse(storedBookings));
                } catch (error) {
                    console.error("Error parsing userBookings from localStorage:", error);
                    setUserBookings([]);
                }
            }
            hasLoaded.current = true;
        }

        // Check for new booking from Payment component
        if (location.state?.newBooking) {
            const newBooking = location.state.newBooking;

            setUserBookings(prevBookings => {
                const isDuplicate = prevBookings.some(booking => booking.id === newBooking.id);
                if (!isDuplicate) {
                    const updatedBookings = [...prevBookings, newBooking];
                    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
                    return updatedBookings;
                }
                return prevBookings;
            });

            // Clear the state AFTER processing the booking to prevent it from being processed again
            navigate('.', { replace: true, state: null });
        }
    }, [location, navigate]); // Removed hasLoaded from dependency array

    const handleLogout = () => {
        console.log("Logout button clicked!");
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('address');
        localStorage.removeItem('userBookings');
        console.log("AuthToken removed:", localStorage.getItem('authToken'));
        navigate('/');
        console.log("Navigating to /");
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="profile-section">
                    <img src={ProfilePicture} alt="User Profile" className="profile-image" />
                    <div className="details-section">
                        <div className="details-header">Details</div>
                        <button onClick={handleLogout} className="logout-button">Log-out</button>
                        <Link to="/edit-profile" className="edit-profile-button">Edit Profile</Link>
                        <Link to="/" className="home-button">Home</Link>
                    </div>
                    <div className="user-info">
                        <h2>Hi {localStorage.getItem('username') || 'User'} !</h2>
                        <p>Email: {localStorage.getItem('email') || ''}</p>
                        <p>Phone: {localStorage.getItem('phone') || ''}</p>
                        <p>Address: {localStorage.getItem('address') || ''}</p>
                        <button className="delete-account-button">Delete account</button>
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="bookings-header">
                    <button className="bookings-tab active">Bookings</button>
                    <button className="history-tab">History</button>
                </div>
                <div className="bookings-area">
                    <div className="search-bar">
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="bookings-list">
                        {userBookings && userBookings.length > 0 ? (
                            userBookings.map(booking => (
                                <div className="booking-item" key={booking.id}>
                                    {booking.image && <img src={booking.image} alt={booking.destination || booking.flight || booking.hotel} className="booking-image" />}
                                    <div className="booking-details">
                                        {booking.destination && <p className="destination">Destination: {booking.destination}</p>}
                                        {booking.flight && <p className="flight">Flight: {booking.flight}</p>}
                                        {booking.hotel && <p className="hotel">Hotel: {booking.hotel}</p>}
                                        {booking.reference && <p className="reference">Reference: {booking.reference}</p>}
                                        {booking.contactEmail && <p className="email">Email: {booking.contactEmail}</p>}
                                        {booking.date && <p className="date">Date: {booking.date}</p>}
                                        {booking.checkInDate && <p className="check-in">Check-in: {booking.checkInDate}</p>}
                                        {booking.checkOutDate && <p className="check-out">Check-out: {booking.checkOutDate}</p>}
                                        {booking.departDate && <p className="depart-date">Departure: {booking.departDate}</p>}
                                        {booking.returnDate && <p className="return-date">Return: {booking.returnDate}</p>}
                                        {booking.guests && <p className="guests">Guests: {booking.guests}</p>}
                                        {booking.passengers && <p className="passengers">Passengers: {booking.passengers}</p>}
                                        <p className="total-cost">Total Cost: ₹{booking.totalCost}</p>
                                    </div>
                                    <button className="cancel-button" onClick={() => console.log(`Cancel ${booking.id}`)}>Cancel</button>
                                </div>
                            ))
                        ) : (
                            <p className="empty-bookings">No current bookings.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
*/

// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProfilePicture from "../assets/default-profile.png";
import { Link, useNavigate } from "react-router-dom";
import { authService, bookingService } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        navigate("/login");
      }
    };

    const fetchBookings = async () => {
      try {
        const userBookings = await bookingService.getMyBookings();
        setBookings(userBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchBookings();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancel(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (err) {
      setError("Failed to cancel booking");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={ProfilePicture}
            alt="User Profile"
            className="profile-image"
          />
          <div className="details-section">
            <div className="details-header">Details</div>
            <button onClick={handleLogout} className="logout-button">
              Log-out
            </button>
            <Link to="/edit-profile" className="edit-profile-button">
              Edit Profile
            </Link>
            <Link to="/" className="home-button">
              Home
            </Link>
          </div>
          <div className="user-info">
            <h2>Hi {user?.name || "User"}!</h2>
            <p>Email: {user?.email || ""}</p>
            <p>Role: {user?.role || "user"}</p>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="bookings-header">
          <button className="bookings-tab active">Bookings</button>
          <button className="history-tab">History</button>
        </div>
        <div className="bookings-area">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="bookings-list">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div className="booking-item" key={booking._id}>
                  <img
                    src={booking.destination?.imageUrl || ProfilePicture}
                    alt={booking.destination?.name}
                    className="booking-image"
                  />
                  <div className="booking-details">
                    <p className="destination">
                      Destination: {booking.destination?.name}
                    </p>
                    <p className="date">
                      From: {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                    <p className="date">
                      To: {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                    <p className="guests">
                      Number of People: {booking.numberOfPeople}
                    </p>
                    <p className="total-cost">
                      Total Cost: ₹{booking.totalPrice}
                    </p>
                    <p className="status">Status: {booking.status}</p>
                  </div>
                  {booking.status !== "cancelled" && (
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-bookings">No current bookings.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
