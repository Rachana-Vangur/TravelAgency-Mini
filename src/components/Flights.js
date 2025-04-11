import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Flights.css';

const Flights = () => {
    const [tripType, setTripType] = useState('roundTrip');
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const navigate = useNavigate();
    const [recentSearches, setRecentSearches] = useState(() => {
        const storedSearches = localStorage.getItem('recentFlights');
        return storedSearches ? JSON.parse(storedSearches) : [];
    });
    const [availableFlights, setAvailableFlights] = useState([
        { id: 1, airline: 'SkyHigh Airlines', flightNumber: 'SH 101', from: 'New York', to: 'Dubai', duration: '7h 00m', image: '/images/flights/skyhigh.jpg', price: 450 },
        { id: 2, airline: 'Blue Sky', flightNumber: 'BS 202', from: 'Amsterdam', to: 'Tokyo', duration: '12h 15m', image: '/images/flights/bluesky.jpg', price: 780 },
        { id: 3, airline: 'Global Express', flightNumber: 'GE 303', from: 'Paris', to: 'Dubai', duration: '6h 15m', image: '/images/flights/globalexpress.jpg', price: 520 },
        { id: 4, airline: 'Oceanic Airways', flightNumber: 'OA 404', from: 'London', to: 'Sydney', duration: '22h 30m', image: '/images/flights/oceanic.jpg', price: 920 },
        { id: 5, airline: 'Polar Jet', flightNumber: 'PJ 505', from: 'Moscow', to: 'Beijing', duration: '8h 45m', image: '/images/flights/polarjet.jpg', price: 610 },
        { id: 6, airline: 'Sunrise Flights', flightNumber: 'SF 606', from: 'Los Angeles', to: 'Honolulu', duration: '5h 50m', image: '/images/flights/sunrise.jpg', price: 380 },
        { id: 7, airline: 'Desert Wings', flightNumber: 'DW 707', from: 'Cairo', to: 'Riyadh', duration: '2h 10m', image: '/images/flights/desertwings.jpg', price: 210 },
        { id: 8, airline: 'Alpine Air', flightNumber: 'AA 808', from: 'Zurich', to: 'Rome', duration: '1h 30m', image: '/images/flights/alpineair.jpg', price: 150 },
    ]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        localStorage.setItem('recentFlights', JSON.stringify(recentSearches));
    }, [recentSearches]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newSearch = { tripType, from: fromCity, to: toCity, date: departDate, passengers: Number(passengers) };
        setRecentSearches(prevSearches => {
            const isDuplicate = prevSearches.some(
                search => search.from === newSearch.from && search.to === newSearch.to && search.date === newSearch.date && search.passengers === newSearch.passengers && search.tripType === newSearch.tripType
            );
            if (isDuplicate) {
                return prevSearches; // Don't add if it's a duplicate
            }
            return [newSearch, ...prevSearches.slice(0, 2)]; // Add to top, keep max 3
        });
        console.log("Searching flights:", newSearch);

        // Filter available flights based on search criteria (basic matching)
        const results = availableFlights.filter(flight =>
            flight.from.toLowerCase().includes(fromCity.toLowerCase()) &&
            flight.to.toLowerCase().includes(toCity.toLowerCase())
        );
        setSearchResults(results);
    };

    const displayedFlights = searchResults.length > 0 ? searchResults : availableFlights;

    const handleBookFlight = (flight) => {
        navigate('/payment/flight', { // Use a generic identifier for flights
            state: {
                itemType: 'flight',
                flightDetails: flight,
                passengers: Number(passengers),
                tripType: tripType,
                departDate: departDate,
                totalCost: flight.price * Number(passengers), // Basic cost calculation
            },
        });
    };

    return (
        <div className="flights-container">
            {/* Header/Navigation Bar */}
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-icon">✈️</span> TripBliss
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/flights" className="active">Flights</Link>
                    <Link to="/hotels">Hotels</Link>
                    <Link to="/destinations">Destinations</Link>
                    <Link to="/about">About</Link>
                </nav>
                
            </header>

            {/* Hero Section with Flight Search */}
            <section className="flight-hero-section">
                <div className="hero-content">
                    <h1>Find Your Perfect Flight</h1>
                    <p>Explore global destinations with the best deals on flights</p>

                    {/* Flight Search Form */}
                    <form className="flight-search-form" onSubmit={handleSearch}>
                        <div className="trip-type-selector">
                            <label className={`trip-option ${tripType === 'roundTrip' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="roundTrip"
                                    checked={tripType === 'roundTrip'}
                                    onChange={() => setTripType('roundTrip')}
                                />
                                Round Trip
                            </label>
                            <label className={`trip-option ${tripType === 'oneWay' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="oneWay"
                                    checked={tripType === 'oneWay'}
                                    onChange={() => setTripType('oneWay')}
                                />
                                One Way
                            </label>
                            <label className={`trip-option ${tripType === 'multiCity' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="tripType"
                                    value="multiCity"
                                    checked={tripType === 'multiCity'}
                                    onChange={() => setTripType('multiCity')}
                                />
                                Multi-City
                            </label>
                        </div>

                        <div className="search-inputs">
                            <div className="input-row">
                                <div className="input-group">
                                    <div className="input-icon">✈️</div>
                                    <input
                                        type="text"
                                        placeholder="From (City or Airport)"
                                        value={fromCity}
                                        onChange={(e) => setFromCity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <div className="input-icon">✈️</div>
                                    <input
                                        type="text"
                                        placeholder="To (City or Airport)"
                                        value={toCity}
                                        onChange={(e) => setToCity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <div className="input-icon">📅</div>
                                    <input
                                        type="date"
                                        placeholder="dd-mm-yyyy"
                                        value={departDate}
                                        onChange={(e) => setDepartDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="input-group">
                                    <div className="input-icon">👥</div>
                                    <select
                                        value={passengers}
                                        onChange={(e) => setPassengers(Number(e.target.value))}
                                    >
                                        <option value="1">1 Passenger</option>
                                        <option value="2">2 Passengers</option>
                                        <option value="3">3 Passengers</option>
                                        <option value="4">4 Passengers</option>
                                        <option value="5">5+ Passengers</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="search-button">
                            <span className="search-icon">🔍</span> Search Flights
                        </button>
                    </form>
                </div>
            </section>

            {/* Recent Searches Section */}
            <section className="recent-searches-section">
                <div className="section-header">
                    <h2>Recent Searches</h2>
                </div>

                <div className="recent-searches-grid">
                    {recentSearches.map((search, index) => (
                        <div className="search-card" key={index}>
                            <h3>{search.from} to {search.to}</h3>
                            <p>Date: {search.date}</p>
                            <p>Passengers: {search.passengers}</p>
                            <p>Trip type: {search.tripType}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Available Flights Section */}
            <section className="available-flights-section">
                <div className="section-header">
                    <h2>Available Flights</h2>
                    <div className="sort-dropdown">
                        <select>
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Duration: Shortest</option>
                            <option>Duration: Longest</option>
                        </select>
                    </div>
                </div>

                <div className="flights-grid">
                    {displayedFlights.map((flight) => (
                        <div className="flight-card" key={flight.id}>
                            <div className="flight-image" style={{ backgroundImage: `url(${flight.image})` }}>
                                <div className="airline-overlay">
                                    <h3>{flight.airline}</h3>
                                    <p>{flight.flightNumber}</p>
                                </div>
                            </div>

                            <div className="flight-details">
                                <div className="route-info">
                                    <div className="city">
                                        <h4>From</h4>
                                        <p>{flight.from}</p>
                                    </div>

                                    <div className="duration">
                                        <p>{flight.duration}</p>
                                        <div className="flight-line">
                                            <div className="airplane-icon">✈️</div>
                                        </div>
                                    </div>

                                    <div className="city">
                                        <h4>To</h4>
                                        <p>{flight.to}</p>
                                    </div>
                                </div>

                                <div className="flight-price">
                                    <span>${flight.price}</span> per passenger
                                </div>

                                <button className="book-button" onClick={() => handleBookFlight(flight)}>Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <div className="footer-content">
                    <p>All material herein © 2005-2025 Agoda Company Pte. Ltd. All Rights Reserved.</p>
                    <p>Agoda is part of Booking Holdings Inc., the world leader in online travel & related services.</p>

                    <div className="partner-logos">
                        <img src="/images/logos/agoda.png" alt="Agoda" className="partner-logo" />
                        <img src="/images/logos/priceline.png" alt="Priceline" className="partner-logo" />
                        <img src="/images/logos/kayak.png" alt="KAYAK" className="partner-logo" />
                        <img src="/images/logos/booking.png" alt="Booking.com" className="partner-logo" />
                        <img src="/images/logos/opentable.png" alt="OpenTable" className="partner-logo" />
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

export default Flights;