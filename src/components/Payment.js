import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingService } from "../services/api";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAuthenticated(false);
      setError("Please log in to complete your booking");
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Please log in to complete your booking",
        },
      });
      return;
    }
    setIsAuthenticated(true);

    // Check if booking data exists
    if (!location.state) {
      setError("Invalid booking data. Please try again.");
      navigate("/");
      return;
    }

    const { type, itemId, itemName, price, bookingDetails } = location.state;
    if (!type || !itemId || !itemName || !price || !bookingDetails) {
      setError("Missing booking information. Please try again.");
      navigate("/");
      return;
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to complete your booking");
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Please log in to complete your booking",
        },
      });
      return;
    }

    // Validate booking data
    if (
      !location.state?.itemId ||
      !location.state?.itemType ||
      !location.state?.itemName
    ) {
      setError("Invalid booking data. Please try again.");
      return;
    }

    // Validate payment data
    if (
      !paymentData.cardNumber ||
      !paymentData.cardName ||
      !paymentData.expiryDate ||
      !paymentData.cvv
    ) {
      setError("Please fill in all payment details");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { type, itemId, itemName, price, bookingDetails } = location.state;

      // Structure the booking data based on type
      const bookingData = {
        itemType: type,
        itemId,
        itemName,
        totalPrice: price,
        status: "Confirmed",
        ...bookingDetails,
      };

      // Add type-specific fields
      if (type === "flight") {
        bookingData.departureDate = bookingDetails.departureDate;
        bookingData.returnDate = bookingDetails.returnDate;
        bookingData.passengers = bookingDetails.passengers;
        bookingData.class = bookingDetails.class;
      } else if (type === "hotel") {
        bookingData.checkIn = bookingDetails.checkIn;
        bookingData.checkOut = bookingDetails.checkOut;
        bookingData.guests = bookingDetails.guests;
        bookingData.rooms = bookingDetails.rooms;
      } else if (type === "destination") {
        bookingData.startDate = bookingDetails.startDate;
        bookingData.endDate = bookingDetails.endDate;
        bookingData.travelers = bookingDetails.travelers;
        bookingData.package = bookingDetails.package;
      }

      console.log("Submitting booking:", bookingData);
      const response = await bookingService.create(bookingData);
      console.log("Booking response:", response);

      // Navigate to success page or dashboard
      navigate("/dashboard", {
        state: { message: "Booking confirmed successfully!" },
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="payment-container">
        <div className="payment-error">
          <h2>Authentication Required</h2>
          <p>Please log in to complete your booking</p>
          <button
            className="login-button"
            onClick={() =>
              navigate("/login", {
                state: {
                  from: location.pathname,
                  message: "Please log in to complete your booking",
                },
              })
            }
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-container">
        <div className="payment-error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-content">
        <h1>Complete Your Booking</h1>
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <p>
            <strong>Item:</strong> {location.state?.itemName}
          </p>
          <p>
            <strong>Type:</strong> {location.state?.type}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹
            {location.state?.price?.toLocaleString("en-IN")}
          </p>
        </div>

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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardName">Cardholder Name</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={paymentData.cardName}
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

          <button type="submit" className="pay-button" disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
