import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get booking details from location state
  const bookingDetails = location.state?.bookingDetails || {};
  const itemType = location.state?.type || "";
  const itemId = location.state?.itemId || "";
  const itemName = location.state?.itemName || "";
  const price = location.state?.price || 0;

  useEffect(() => {
    // Redirect if no booking details or if price is negative
    if (!location.state || price < 0) {
      navigate("/");
    }
  }, [location.state, navigate, price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces and ensure only numbers
    if (name === "cardNumber") {
      // Remove any non-digit characters
      const numbersOnly = value.replace(/\D/g, "");

      // Format with spaces after every 4 digits
      formattedValue = numbersOnly.replace(/(\d{4})/g, "$1 ").trim();
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{2})/, "$1/$2")
        .slice(0, 5);
    }

    // Ensure CVV only contains numbers
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate price is not negative
    if (price < 0) {
      setError("Invalid price. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real application, you would:
      // 1. Validate the card details
      // 2. Send the payment information to a payment gateway
      // 3. Handle the response from the payment gateway
      // 4. Update the booking status in your database

      // For now, we'll just simulate a successful payment
      navigate("/booking-confirmation", {
        state: {
          type: itemType,
          itemId,
          itemName,
          price,
          bookingDetails,
          paymentDetails: {
            ...paymentData,
            cardNumber: "**** **** **** " + paymentData.cardNumber.slice(-4),
          },
        },
      });
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!location.state || price < 0) {
    return null;
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p className="payment-subtitle">
          {itemType === "destination"
            ? "Destination Booking"
            : itemType === "flight"
            ? "Flight Booking"
            : "Hotel Booking"}
        </p>
      </div>

      <div className="payment-content">
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-item">
            <span>Item:</span>
            <span>{itemName}</span>
          </div>
          {itemType === "destination" && (
            <>
              <div className="summary-item">
                <span>Start Date:</span>
                <span>{bookingDetails.startDate}</span>
              </div>
              <div className="summary-item">
                <span>End Date:</span>
                <span>{bookingDetails.endDate}</span>
              </div>
              <div className="summary-item">
                <span>Travelers:</span>
                <span>{bookingDetails.travelers}</span>
              </div>
              <div className="summary-item">
                <span>Package:</span>
                <span className="capitalize">{bookingDetails.package}</span>
              </div>
            </>
          )}
          {itemType === "flight" && (
            <>
              <div className="summary-item">
                <span>Flight:</span>
                <span>{bookingDetails.flightNumber}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{bookingDetails.date}</span>
              </div>
              <div className="summary-item">
                <span>Passengers:</span>
                <span>{bookingDetails.passengers}</span>
              </div>
              <div className="summary-item">
                <span>Class:</span>
                <span className="capitalize">{bookingDetails.class}</span>
              </div>
            </>
          )}
          {itemType === "hotel" && (
            <>
              <div className="summary-item">
                <span>Check-in:</span>
                <span>{bookingDetails.checkIn}</span>
              </div>
              <div className="summary-item">
                <span>Check-out:</span>
                <span>{bookingDetails.checkOut}</span>
              </div>
              <div className="summary-item">
                <span>Guests:</span>
                <span>{bookingDetails.guests}</span>
              </div>
              <div className="summary-item">
                <span>Room Type:</span>
                <span className="capitalize">{bookingDetails.roomType}</span>
              </div>
            </>
          )}
          <div className="summary-item total">
            <span>Total Amount:</span>
            <span>₹{Math.max(0, price).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="payment-form-container">
          <h2>Payment Details</h2>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                pattern="[0-9\s]*"
                inputMode="numeric"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardHolder">Card Holder Name</label>
              <input
                type="text"
                id="cardHolder"
                name="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="pay-button"
              disabled={loading || price < 0}
            >
              {loading
                ? "Processing..."
                : `Pay ₹${Math.max(0, price).toLocaleString("en-IN")}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
