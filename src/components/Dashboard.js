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
  const [activeTab, setActiveTab] = useState("current"); // "current" or "history"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "destination", "flight", "hotel"

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
        setLoading(true);
        const userBookings = await bookingService.getMyBookings();
        setBookings(userBookings);
        setError(null);
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || booking.itemType === filterType;

    const isHistory = new Date(booking.endDate || booking.date) < new Date();
    const matchesTab = activeTab === "history" ? isHistory : !isHistory;

    return matchesSearch && matchesType && matchesTab;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
          <div className="user-info">
            <h2>Welcome, {user?.name || "User"}!</h2>
            <p>Email: {user?.email || ""}</p>
            <p>Member since: {formatDate(user?.createdAt) || ""}</p>
          </div>
          <div className="profile-actions">
            <Link to="/edit-profile" className="edit-profile-button">
              Edit Profile
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="bookings-header">
          <div className="booking-tabs">
            <button
              className={`tab ${activeTab === "current" ? "active" : ""}`}
              onClick={() => setActiveTab("current")}
            >
              Current Bookings
            </button>
            <button
              className={`tab ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              Booking History
            </button>
          </div>

          <div className="booking-filters">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="destination">Destinations</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <p>
                No {activeTab === "current" ? "current" : "past"} bookings
                found.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <div className="booking-image">
                  <img
                    src={booking.image || "/images/placeholder.jpg"}
                    alt={booking.itemName}
                  />
                </div>
                <div className="booking-info">
                  <div className="booking-header">
                    <h3>{booking.itemName}</h3>
                    <span className={`booking-type ${booking.itemType}`}>
                      {booking.itemType}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p>
                      <strong>Reference:</strong> {booking.reference}
                    </p>
                    {booking.itemType === "destination" && (
                      <>
                        <p>
                          <strong>Dates:</strong>{" "}
                          {formatDate(booking.startDate)} -{" "}
                          {formatDate(booking.endDate)}
                        </p>
                        <p>
                          <strong>Travelers:</strong> {booking.travelers}
                        </p>
                        <p>
                          <strong>Package:</strong>{" "}
                          <span className="capitalize">{booking.package}</span>
                        </p>
                      </>
                    )}
                    {booking.itemType === "flight" && (
                      <>
                        <p>
                          <strong>Flight:</strong> {booking.flightNumber}
                        </p>
                        <p>
                          <strong>Date:</strong> {formatDate(booking.date)}
                        </p>
                        <p>
                          <strong>Class:</strong>{" "}
                          <span className="capitalize">{booking.class}</span>
                        </p>
                      </>
                    )}
                    {booking.itemType === "hotel" && (
                      <>
                        <p>
                          <strong>Check-in:</strong>{" "}
                          {formatDate(booking.checkIn)}
                        </p>
                        <p>
                          <strong>Check-out:</strong>{" "}
                          {formatDate(booking.checkOut)}
                        </p>
                        <p>
                          <strong>Guests:</strong> {booking.guests}
                        </p>
                      </>
                    )}
                    <p className="booking-price">
                      <strong>Total:</strong> ₹
                      {booking.totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {activeTab === "current" && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="cancel-button"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
