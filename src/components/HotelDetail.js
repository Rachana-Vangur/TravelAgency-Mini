import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const HotelDetails = () => {
    console.log("HotelDetails component rendered");
    const { id } = useParams();
    console.log("Hotel ID from URL:", id);
    const navigate = useNavigate();

    const hotels = [
        { id: 1, name: 'Grand Luxury Resort & Spa', images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3H0ViK-wk3UIjtGhLGNwyJHOuy4MWNNZlzw&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmquPjkw63Na5S2A1eDSOfvMjJKxO5JJE0Pw&s'], description: 'Grand Luxury offers premium, world-class experiences with opulent accommodations, personalized services, and unmatched comfort for discerning travelers.', price: 350 },
        { id: 2, name: 'Azure Boutique Hotel', images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs5UiDDHgGJGpFL2f9la3vRvW2I7g1ubqN9Q&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxFbebzTgJghx6Zj4Yu30OI4hiKRIVnd3IPA&s'], description: 'Azure Boutique blends elegance and charm, offering stylish, intimate stays with personalized service and a serene ambiance.', price: 280 },
        { id: 3, name: 'Tropical Paradise Resort', images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOdCSWn72mR6c5D1PNAFXZXpCwfzwH5fYCFg&s','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5DG_UAcu_qyL9SwHxHhvzKSh8o4Bprz4uzA&s'], description: 'Tropical Paradise Resort is a lush escape nestled in nature, offering vibrant surroundings, relaxing vibes, and luxurious island-style comfort.', price: 200 },
    ];

    const hotel = hotels.find(h => h.id === parseInt(id));
    console.log("Found hotel:", hotel);

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [nights, setNights] = useState(0);

    const calculateCost = () => {
        if (checkInDate && checkOutDate && hotel) {
            const startDate = new Date(checkInDate);
            const endDate = new Date(checkOutDate);
            const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
            const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setNights(numNights);
            setTotalCost(numNights * hotel.price);
        } else {
            setTotalCost(0);
            setNights(0);
        }
    };

    const handleBookClick = () => {
        if (totalCost > 0) {
            // Navigate to the payment page, passing relevant information
            navigate(`/payment/${id}`, { state: { hotelName: hotel.name, totalCost, checkInDate, checkOutDate, nights } });
        } else {
            alert("Please select check-in and check-out dates to calculate the cost.");
        }
    };

    if (!hotel) {
        return <div>Hotel not found</div>;
    }

    return (
        <div className="hotel-details-page">
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <span className="logo-icon">✈️</span> TripBliss
                    </Link>
                </div>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/hotels">Hotels</Link>
                </nav>
            </header>

            <div className="hotel-details-content">
                <h1>{hotel.name}</h1>

                <div className="hotel-images">
                    {hotel.images && hotel.images.map((image, index) => (
                        <img key={index} src={image} alt={`${hotel.name} View ${index + 1}`} />
                    ))}
                </div>

                <div className="hotel-info">
                    <p>{hotel.description}</p>
                    <p>Price per night: ${hotel.price}</p>

                    <div className="booking-inputs">
                        <div>
                            <label htmlFor="checkin">Check-in Date:</label>
                            <input
                                type="date"
                                id="checkin"
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="checkout">Check-out Date:</label>
                            <input
                                type="date"
                                id="checkout"
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                            />
                        </div>
                        <button onClick={calculateCost}>Calculate Cost</button>
                    </div>

                    {totalCost > 0 && (
                        <div className="cost-summary">
                            <p>Number of nights: {nights}</p>
                            <p>Total Cost: ${totalCost}</p>
                        </div>
                    )}
                </div>

                <button className="book-button" onClick={handleBookClick}>Book Now</button>
            </div>
        </div>
    );
};

export default HotelDetails;