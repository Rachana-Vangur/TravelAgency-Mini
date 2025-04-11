import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hotels.css';

const Hotels = () => {
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedFilters, setSelectedFilters] = useState({
        propertyType: [],
        amenities: []
    });

    // Sample hotel data
    const [hotels, setHotels] = useState([ // Using useState for hotels to potentially track changes
        {
            id: 1,
            name: 'Grand Luxury Resort & Spa',
            location: 'Maldives',
            description: 'Overwater villas with private pools',
            rating: 4.9,
            reviews: 245,
            price: 350,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqC98qgPbJiPGnyMZhSeWo7exRn11nFPmUag&s',
            tags: ['Pool', 'Spa', 'Beach'],
            discount: '20% OFF'
        },
        {
            id: 2,
            name: 'Azure Boutique Hotel',
            location: 'Bangkok, Thailand',
            description: 'Modern urban retreat with rooftop pool',
            rating: 4.8,
            reviews: 189,
            price: 280,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCaCQh6jtvvld9lRksad4GaQ3xgauyFoxkyg&s',
            tags: ['Pool', 'Restaurant', 'Breakfast']
        },
        {
            id: 3,
            name: 'Tropical Paradise Resort',
            location: 'Koh Samui, Thailand',
            description: 'Beachfront bungalows surrounded by palm trees',
            rating: 4.6,
            reviews: 312,
            price: 175,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7GnClZncPhE04h-dsQ4Pbdgc1onx_zT0O8w&s',
            tags: ['Cultural', 'Spa', 'Villa'],
            promotion: 'Free Breakfast'
        },
        {
            id: 4,
            name: 'Alpine Chalet & Spa',
            location: 'Swiss Alps',
            description: 'Luxury mountain retreat with ski-in/ski-out access',
            rating: 4.9,
            reviews: 173,
            price: 420,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEovbPBf1QkxuxNoRvvMLpi0bUlDcJ0-tNQ&s',
            tags: ['Skiing', 'Spa', 'Mountain View']
        },
        {
            id: 5,
            name: 'Sunset Bay Resort',
            location: 'Phuket, Thailand',
            description: 'Beachfront resort with stunning sunset views',
            rating: 4.5,
            reviews: 289,
            price: 120,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2EH4jYgrOljwvSn8x5fQNL2ZxkYA6PhGv0g&s',
            tags: ['Beach', 'Pool', 'Restaurant'],
            discount: '40% OFF'
        },
        {
            id: 6,
            name: 'Urban Loft Hotel',
            location: 'New York, USA',
            description: 'Contemporary urban retreat in the heart of downtown',
            rating: 4.7,
            reviews: 211,
            price: 210,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWLAmkm4RFJs3eBOMsMWH0Jo1pcI7FDL4lrA&s',
            tags: ['City View', 'Restaurant', 'Bar'],
            promotion: 'Last Minute Deal'
        },
        {
            id: 7,
            name: 'Vineyard Retreat',
            location: 'Bali, Indonesia',
            description: 'Luxury villas overlooking rice terraces',
            rating: 4.8,
            reviews: 156,
            price: 195,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJB1XNOoceuT-FMud4G0OA3a3Ix9LLDPgNw&s',
            tags: ['Pool', 'Spa', 'Nature'],
            promotion: 'Free Cancellation'
        },
        {
            id: 8,
            name: 'Desert Oasis Resort',
            location: 'Dubai, UAE',
            description: 'Luxury desert resort with infinity pools',
            rating: 4.6,
            reviews: 224,
            price: 290,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu9SKcavBmioY_PgjYZW9ScKGQXfKBMYB8kQ&s',
            tags: ['Spa', 'Pool', 'Activities'],
            promotion: 'Includes Activities'
        }
    ]);

    const handlePropertyTypeChange = (type) => {
        const currentFilters = [...selectedFilters.propertyType];
        if (currentFilters.includes(type)) {
            setSelectedFilters({
                ...selectedFilters,
                propertyType: currentFilters.filter(item => item !== type)
            });
        } else {
            setSelectedFilters({
                ...selectedFilters,
                propertyType: [...currentFilters, type]
            });
        }
    };

    const handleAmenityChange = (amenity) => {
        const currentFilters = [...selectedFilters.amenities];
        if (currentFilters.includes(amenity)) {
            setSelectedFilters({
                ...selectedFilters,
                amenities: currentFilters.filter(item => item !== amenity)
            });
        } else {
            setSelectedFilters({
                ...selectedFilters,
                amenities: [...currentFilters, amenity]
            });
        }
    };

    // Console log to check if hotels data is available during rendering
    console.log("Hotels data:", hotels);

    return (
        <div className="hotels-container">
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
                    <Link to="/hotels" className="active">Hotels</Link>
                    <Link to="/destinations">Destinations</Link>
                    <Link to="/about">About</Link>
                </nav>
                
            </header>

            {/* Main Content */}
            <div className="search-banner">
                <div className="search-container">
                    <h1>Find Your Perfect Stay</h1>
                    <div className="search-form">
                        <div className="search-input">
                            <input type="text" placeholder="Search hotels, cities or destinations" />
                            <span className="search-icon">🔍</span>
                        </div>
                        <div className="location-input">
                            <input type="text" placeholder="Location" />
                            <span className="location-icon">📍</span>
                        </div>
                        <button className="search-button">Search</button>
                    </div>
                </div>
            </div>

            {/* Hotels Listing */}
            <div className="hotels-content">
                {/* Filters Sidebar */}
                <div className="filters-sidebar">
                    <div className="filters-section">
                        <h3>Filters</h3>

                        <div className="filter-group">
                            <h4>Price Range</h4>
                            <div className="price-slider">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                />
                                <div className="price-range-values">
                                    <span>${priceRange[0]}</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="filter-group">
                            <h4>Star Rating</h4>
                            <div className="star-filter">
                                <label>
                                    <input type="checkbox" />
                                    <span>⭐⭐⭐⭐⭐ 5+ Stars</span>
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    <span>⭐⭐⭐⭐ 4+ Stars</span>
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    <span>⭐⭐⭐ 3+ Stars</span>
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    <span>⭐⭐ 2+ Stars</span>
                                </label>
                                <label>
                                    <input type="checkbox" />
                                    <span>⭐ 1+ Stars</span>
                                </label>
                            </div>
                        </div>
                        <div className="filter-group">
                            <h4>Property Type</h4>
                            <div className="property-type-filter">
                                {['Hotel', 'Resort', 'Villa', 'Apartment', 'Cottage'].map(type => (
                                    <label key={type}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.propertyType.includes(type)}
                                            onChange={() => handlePropertyTypeChange(type)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <h4>Amenities</h4>
                            <div className="amenities-filter">
                                {['Swimming Pool', 'Free WiFi', 'Breakfast Included', 'Free Parking',
                                   'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Bar/Lounge',
                                   'Airport Shuttle', 'Pet Friendly'].map(amenity => (
                                    <label key={amenity}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.amenities.includes(amenity)}
                                            onChange={() => handleAmenityChange(amenity)}
                                        />
                                        <span>{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hotels Listing */}
                <div className="hotels-listing">
                    <div className="listing-header">
                        <span>{hotels.length} properties found</span>
                        <div className="sort-options">
                            <span>Sort by:</span>
                            <select>
                                <option>Recommended</option>
                                <option>Price (Low to High)</option>
                                <option>Price (High to Low)</option>
                                <option>Rating (Highest First)</option>
                                <option>Most Reviews</option>
                            </select>
                        </div>
                    </div>
                    <div className="hotel-cards">
                        {hotels.map(hotel => (
                            <div className="hotel-card" key={hotel.id}>
                                <div className="hotel-image">
                                    <img src={hotel.image} alt={hotel.name} />
                                    <button className="favorite-button">❤️</button>
                                    {hotel.discount && <span className="discount-badge">{hotel.discount}</span>}
                                    {hotel.promotion && <span className="promotion-badge">{hotel.promotion}</span>}
                                </div>
                                <div className="hotel-details">
                                    <div className="hotel-header">
                                        <h3>{hotel.name}</h3>
                                        <div className="hotel-rating">
                                            <span className="rating-value">⭐ {hotel.rating}</span>
                                        </div>
                                    </div>
                                    <p className="hotel-location">📍 {hotel.location}</p>
                                    <p className="hotel-description">{hotel.description}</p>
                                    <div className="hotel-tags">
                                        {hotel.tags.map((tag, index) => (
                                            <span className="hotel-tag" key={index}>{tag}</span>
                                        ))}
                                    </div>
                                    <div className="hotel-footer">
                                        <div className="hotel-price">
                                            <span className="price-value">${hotel.price}</span>
                                            <span className="price-period">/night</span>
                                        </div>
                                        <Link to={`/hotels/${hotel.id}`} className="view-details-button">View Details</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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

export default Hotels;