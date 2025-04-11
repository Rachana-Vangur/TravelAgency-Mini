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
                                        <p className="total-cost">Total Cost: ${booking.totalCost}</p>
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
    }, [location, navigate]);

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

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (confirmDelete) {
            // In a real application, you would make an API call to your backend
            // to delete the user account from the database.
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            localStorage.removeItem('address');
            localStorage.removeItem('userBookings');
            alert("Your account has been deleted.");
            navigate('/');
        }
    };

    const handleCancelBooking = (bookingId) => {
        const confirmCancel = window.confirm(`Are you sure you want to cancel booking ID: ${bookingId}?`);
        if (confirmCancel) {
            // In a real application, you would make an API call to your backend
            // to cancel the booking in the database.
            const updatedBookings = userBookings.filter(booking => booking.id !== bookingId);
            setUserBookings(updatedBookings);
            localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
            alert(`Booking ID: ${bookingId} has been cancelled.`);
        }
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
                        <button className="delete-account-button" onClick={handleDeleteAccount}>Delete account</button>
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
                                        <p className="total-cost">Total Cost: ${booking.totalCost}</p>
                                    </div>
                                    <button className="cancel-button" onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
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