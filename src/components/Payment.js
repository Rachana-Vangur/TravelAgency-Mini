/*import React, { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import './Payment.css'; // Make sure you have a Payment.css file

const Payment = () => {
    console.log("Payment component rendered");
    const { id } = useParams();
    console.log("Item ID from URL (Payment):", id); // Will be 'flight' for flights
    const location = useLocation();
    console.log("Location state (Payment):", location.state);
    const navigate = useNavigate();
    const { itemType, flightDetails, hotelName, totalCost: passedTotalCost, checkInDate, checkOutDate, nights, passengers, tripType, departDate: flightDepartDate } = location.state || {};
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentDate, setPaymentDate] = useState(flightDepartDate || ''); // Initialize with passed departDate or empty
    const totalCost = passedTotalCost || 0; // Use passed total cost, default to 0

    const handlePayment = () => {
        if (cardNumber.length >= 15 && expiryDate.length >= 4 && cvv.length >= 3) {
            setPaymentSuccess(true);
            setTimeout(() => {
                setPaymentSuccess(false);
                navigate('/dashboard'); // Redirect after successful payment
            }, 3000);
        } else {
            alert("Please enter valid card details.");
        }
    };

    if (!location.state) {
        return <div>No booking details found. Please go back to the previous page.</div>;
    }

    return (
        <div className="payment-page">
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
                </nav>
            </header>

            <div className="payment-content">
                <h2>Payment Details</h2>

                {itemType === 'hotel' && (
                    <>
                        <p>Booking for Hotel: {hotelName}</p>
                        <p>Check-in Date: {checkInDate}</p>
                        <p>Check-out Date: {checkOutDate}</p>
                        <p>Number of Nights: {nights}</p>
                        <p>Number of Guests: {passengers}</p>
                        <p>Total Cost: ${totalCost}</p>
                    </>
                )}

                {itemType === 'flight' && flightDetails && (
                    <>
                        <h3>Flight Details:</h3>
                        <p>Airline: {flightDetails.airline}</p>
                        <p>Flight Number: {flightDetails.flightNumber}</p>
                        <p>From: {flightDetails.from}</p>
                        <p>To: {flightDetails.to}</p>
                        <p>Duration: {flightDetails.duration}</p>
                        <p>Number of Passengers: {passengers}</p>
                        <p>Trip Type: {tripType}</p>
                        {flightDepartDate ? (
                            <p>Departure Date: {flightDepartDate}</p>
                        ) : (
                            <div className="payment-input-group">
                                <label htmlFor="paymentDate">Departure Date:</label>
                                <input
                                    type="date"
                                    id="paymentDate"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <p>Total Cost: ${totalCost}</p>
                    </>
                )}

                <div className="payment-form">
                    <h3>Enter Payment Information</h3>
                    <div className="payment-input-group">
                        <label htmlFor="cardNumber">Card Number:</label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            required
                        />
                    </div>
                    <div className="payment-input-group">
                        <label htmlFor="expiryDate">Expiry Date:</label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div className="payment-input-group">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            type="text"
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="XXX"
                            required
                        />
                    </div>
                    <button className="pay-button" onClick={handlePayment} disabled={paymentSuccess}>
                        {paymentSuccess ? 'Payment Successful!' : 'Pay Now'}
                    </button>
                    {paymentSuccess && <p className="success-message">Redirecting to dashboard...</p>}
                </div>
            </div>
        </div>
    );
};

export default Payment;
*/

import React, { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import './Payment.css'; // Make sure you have a Payment.css file

const Payment = () => {
    console.log("Payment component rendered");
    const { id } = useParams();
    console.log("Item ID from URL (Payment):", id); // Will be 'flight' for flights
    const location = useLocation();
    console.log("Location state (Payment):", location.state);
    const navigate = useNavigate();
    const {
        itemType,
        flightDetails,
        hotelName,
        totalCost: passedTotalCost,
        checkInDate,
        checkOutDate,
        nights,
        guests, // For hotels
        passengers, // For flights
        tripType,
        departDate: flightDepartDate,
        image: itemImage, // Image URL passed from previous page
        name: itemName, // Name of the destination/hotel
        airline,
        flightNumber,
        from,
        to,
        duration,
    } = location.state || {};
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [paymentDate, setPaymentDate] = useState(flightDepartDate || ''); // Initialize with passed departDate or empty
    const totalCost = passedTotalCost || 0; // Use passed total cost, default to 0

    const handlePayment = () => {
        if (cardNumber.length >= 15 && expiryDate.length >= 4 && cvv.length >= 3) {
            setPaymentSuccess(true);
            const bookingDetails = {
                id: `BOOKING-${Date.now()}`,
                itemType: itemType,
                totalCost: totalCost,
                date: new Date().toLocaleDateString(),
                contactEmail: localStorage.getItem('email') || '',
                image: itemImage,
                ...(itemType === 'hotel' && {
                    hotel: itemName,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    nights: nights,
                    guests: guests,
                }),
                ...(itemType === 'flight' && flightDetails && {
                    flight: `${from} to ${to}`,
                    airline: airline,
                    flightNumber: flightNumber,
                    departDate: paymentDate || flightDepartDate,
                    passengers: passengers,
                    tripType: tripType,
                }),
                ...(itemType === 'destination' && {
                    destination: itemName,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    nights: nights,
                    guests: guests,
                }),
            };

            setTimeout(() => {
                setPaymentSuccess(false);
                navigate('/dashboard', { state: { newBooking: bookingDetails } });
            }, 3000);
        } else {
            alert("Please enter valid card details.");
        }
    };

    if (!location.state) {
        return <div>No booking details found. Please go back to the previous page.</div>;
    }

    return (
        <div className="payment-page">
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
                </nav>
            </header>

            <div className="payment-content">
                <h2>Payment Details</h2>

                {itemType === 'hotel' && (
                    <>
                        <p>Booking for Hotel: {hotelName}</p>
                        <p>Check-in Date: {checkInDate}</p>
                        <p>Check-out Date: {checkOutDate}</p>
                        <p>Number of Nights: {nights}</p>
                        <p>Number of Guests: {guests}</p>
                        <p>Total Cost: ${totalCost}</p>
                    </>
                )}

                {itemType === 'flight' && flightDetails && (
                    <>
                        <h3>Flight Details:</h3>
                        <p>Airline: {airline}</p>
                        <p>Flight Number: {flightNumber}</p>
                        <p>From: {from}</p>
                        <p>To: {to}</p>
                        <p>Duration: {duration}</p>
                        <p>Number of Passengers: {passengers}</p>
                        <p>Trip Type: {tripType}</p>
                        {flightDepartDate ? (
                            <p>Departure Date: {flightDepartDate}</p>
                        ) : (
                            <div className="payment-input-group">
                                <label htmlFor="paymentDate">Departure Date:</label>
                                <input
                                    type="date"
                                    id="paymentDate"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <p>Total Cost: ${totalCost}</p>
                    </>
                )}

                {itemType === 'destination' && (
                    <>
                        <p>Booking for Destination: {itemName}</p>
                        <p>Check-in Date: {checkInDate}</p>
                        <p>Check-out Date: {checkOutDate}</p>
                        <p>Number of Nights: {nights}</p>
                        <p>Number of Guests: {guests}</p>
                        <p>Total Cost: ${totalCost}</p>
                    </>
                )}

                <div className="payment-form">
                    <h3>Enter Payment Information</h3>
                    <div className="payment-input-group">
                        <label htmlFor="cardNumber">Card Number:</label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX-XXXX"
                            required
                        />
                    </div>
                    <div className="payment-input-group">
                        <label htmlFor="expiryDate">Expiry Date:</label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div className="payment-input-group">
                        <label htmlFor="cvv">CVV:</label>
                        <input
                            type="text"
                            id="cvv"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            placeholder="XXX"
                            required
                        />
                    </div>
                    <button className="pay-button" onClick={handlePayment} disabled={paymentSuccess}>
                        {paymentSuccess ? 'Payment Successful!' : 'Pay Now'}
                    </button>
                    {paymentSuccess && <p className="success-message">Redirecting to dashboard...</p>}
                </div>
            </div>
        </div>
    );
};

export default Payment;