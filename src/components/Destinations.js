
// src/components/Destinations.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Destinations.css'; // Create this CSS file

const Destinations = () => {
    const destinationsData = [
        {
            id: 1,
            name: 'Santorini',
            country: 'Greece',
            description: 'Beautiful island with white and blue buildings overlooking the sea.',
            image: '/images/destinations/santorini.jpg', // Add your image paths
            price: 1200,
            rating: 4.8,
        },
        {
            id: 2,
            name: 'Bali',
            country: 'Indonesia',
            description: 'Tropical paradise with lush jungles and pristine beaches.',
            image: '/images/destinations/bali.jpg',
            price: 950,
            rating: 4.7,
        },
        {
            id: 3,
            name: 'Tokyo',
            country: 'Japan',
            description: 'Vibrant metropolis blending ultramodern and traditional.',
            image: '/images/destinations/tokyo.jpg',
            price: 1400,
            rating: 4.9,
        },
        {
            id: 4,
            name: 'Maldives',
            country: 'Maldives',
            description: 'Luxury resorts on stunning atolls with crystal-clear waters.',
            image: '/images/destinations/maldives.jpg',
            price: 1800,
            rating: 4.9,
        },
        {
            id: 5,
            name: 'Paris',
            country: 'France',
            description: 'Iconic city with romantic ambiance, museums, and historical landmarks.',
            image: '/images/destinations/paris.jpg',
            price: 1300,
            rating: 4.7,
        },
        {
            id: 6,
            name: 'Rome',
            country: 'Italy',
            description: 'Ancient city with historical ruins, art, and delicious cuisine.',
            image: '/images/destinations/rome.jpg',
            price: 1100,
            rating: 4.6,
        },
        {
            id: 7,
            name: 'New York City',
            country: 'USA',
            description: 'The city that never sleeps, with iconic skyscrapers and cultural experiences.',
            image: '/images/destinations/nyc.jpg',
            price: 1500,
            rating: 4.8,
        },
        {
            id: 8,
            name: 'Barcelona',
            country: 'Spain',
            description: 'Lively city with unique architecture, beaches, and vibrant nightlife.',
            image: '/images/destinations/barcelona.jpg',
            price: 1250,
            rating: 4.7,
        },
        {
            id: 9,
            name: 'Machu Picchu',
            country: 'Peru',
            description: 'Ancient Inca citadel high in the Andes Mountains.',
            image: '/images/destinations/machu_picchu.jpg',
            price: 1600,
            rating: 4.9,
        },
        {
            id: 10,
            name: 'Cairo',
            country: 'Egypt',
            description: 'City with ancient wonders like the Pyramids of Giza and the Sphinx.',
            image: '/images/destinations/cairo.jpg',
            price: 1000,
            rating: 4.5,
        },
        {
            id: 11,
            name: 'Sydney',
            country: 'Australia',
            description: 'Famous for its Opera House, Harbour Bridge, and beautiful beaches.',
            image: '/images/destinations/sydney.jpg',
            price: 1700,
            rating: 4.8,
        },
        {
            id: 12,
            name: 'Rio de Janeiro',
            country: 'Brazil',
            description: 'Known for its stunning beaches, Carnival, and Christ the Redeemer statue.',
            image: '/images/destinations/rio.jpg',
            price: 1350,
            rating: 4.7,
        },
        {
            id: 13,
            name: 'Amsterdam',
            country: 'Netherlands',
            description: 'Charming city with canals, historic houses, and art museums.',
            image: '/images/destinations/amsterdam.jpg',
            price: 1200,
            rating: 4.6,
        },
        {
            id: 14,
            name: 'Venice',
            country: 'Italy',
            description: 'Unique city built on water with canals and gondolas.',
            image: '/images/destinations/venice.jpg',
            price: 1450,
            rating: 4.8,
        },
        {
            id: 15,
            name: 'Cape Town',
            country: 'South Africa',
            description: 'Scenic city with Table Mountain and diverse landscapes.',
            image: '/images/destinations/cape_town.jpg',
            price: 1150,
            rating: 4.7,
        },
        {
            id: 16,
            name: 'Kyoto',
            country: 'Japan',
            description: 'Traditional Japanese city with temples, gardens, and geishas.',
            image: '/images/destinations/kyoto.jpg',
            price: 1550,
            rating: 4.9,
        },
        {
            id: 17,
            name: 'Prague',
            country: 'Czech Republic',
            description: 'Beautiful city with a fairytale castle, Charles Bridge, and Old Town Square.',
            image: '/images/destinations/prague.jpg',
            price: 1050,
            rating: 4.6,
        },
        {
            id: 18,
            name: 'Seville',
            country: 'Spain',
            description: 'Andalusian capital known for flamenco, Moorish architecture, and tapas.',
            image: '/images/destinations/seville.jpg',
            price: 1180,
            rating: 4.7,
        },
        {
            id: 19,
            name: 'Bora Bora',
            country: 'French Polynesia',
            description: 'Luxurious tropical island with overwater bungalows and turquoise lagoons.',
            image: '/images/destinations/bora_bora.jpg',
            price: 2000,
            rating: 4.9,
        },
        {
            id: 20,
            name: 'Istanbul',
            country: 'Turkey',
            description: 'Historic city at the crossroads of Europe and Asia, with stunning mosques and bazaars.',
            image: '/images/destinations/istanbul.jpg',
            price: 980,
            rating: 4.5,
        },
    ];

    return (
        <div className="destinations-container">
            <header className="destinations-header">
                <h1>Explore Our Amazing Destinations</h1>
                {/* You can add a filter component here if needed */}
            </header>
            <div className="destinations-grid">
                {destinationsData.map(destination => (
                    <div className="destination-card" key={destination.id}>
                        <img src={destination.image} alt={destination.name} className="destination-image" />
                        <div className="destination-info">
                            <h3>{destination.name}</h3>
                            <p className="country">{destination.country}</p>
                            <p className="description">{destination.description.substring(0, 100)}...</p>
                            <div className="destination-details">
                                <span className="price">From ${destination.price}</span>
                                <span className="rating">★ {destination.rating}</span>
                            </div>
                            <Link to={`/payment/${destination.id}`} state={{ destination: destination }}>
                                <button className="book-now-button">Book Now</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
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

export default Destinations;