import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { destinationService, bookingService } from "../services/api";
import "./Payment.css";

const Payment = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    numberOfPeople: 1,
    specialRequests: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Check if we have flight details in location state
        if (location.state && location.state.type === "flight") {
          setItem(location.state.details);
          setLoading(false);
          return;
        }

        // Otherwise fetch destination by ID
        if (id) {
          const data = await destinationService.getById(id);
          setItem(data);
        }
      } catch (err) {
        setError("Failed to load details");
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (
      formData.cardNumber.length < 15 ||
      formData.expiryDate.length < 4 ||
      formData.cvv.length < 3
    ) {
      setError("Please enter valid card details");
      return;
    }

    try {
      const bookingData = {
        itemId: id || item.id,
        itemType: location.state?.type || "destination",
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfPeople: parseInt(formData.numberOfPeople),
        specialRequests: formData.specialRequests,
      };

      const response = await bookingService.create(bookingData);
      setPaymentSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading details...</div>;
  }

  if (error && !item) {
    return <div className="error-message">{error}</div>;
  }

  if (!item) {
    return <div className="error-message">Item not found</div>;
  }

  const isFlight = location.state?.type === "flight";
  const totalAmount = isFlight
    ? location.state.totalCost
    : item.price * formData.numberOfPeople;

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
          <Link to="/destinations">Destinations</Link>
        </nav>
      </header>

      <div className="payment-content">
        <h2>Complete Your Booking</h2>

        <div className="destination-summary">
          <img
            src={item.image || item.imageUrl}
            alt={item.name}
            className="destination-image"
          />
          <div className="destination-details">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {isFlight ? (
              <>
                <p>From: {item.from}</p>
                <p>To: {item.to}</p>
                <p>Duration: {item.duration}</p>
                <p>Airline: {item.airline}</p>
                <p>Flight Number: {item.flightNumber}</p>
              </>
            ) : (
              <>
                <p>Location: {item.location}</p>
                <p>Price per person: ₹{item.price}</p>
                <p>Available spots: {item.availableSpots}</p>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handlePayment} className="payment-form">
          <div className="form-section">
            <h3>Trip Details</h3>
            <div className="form-group">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            {!isFlight && (
              <div className="form-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={
                    formData.startDate || new Date().toISOString().split("T")[0]
                  }
                />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="numberOfPeople">Number of People:</label>
              <input
                type="number"
                id="numberOfPeople"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleInputChange}
                required
                min="1"
                max={isFlight ? 9 : item.availableSpots}
              />
            </div>
            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests:</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements or requests?"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="XXX"
                required
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="total-section">
            <h3>Total Amount</h3>
            <p className="total-amount">₹{totalAmount.toFixed(2)}</p>
          </div>

          <button
            type="submit"
            className="pay-button"
            disabled={paymentSuccess}
          >
            {paymentSuccess ? "Payment Successful!" : "Complete Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
