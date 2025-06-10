// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Flights from "./components/Flights";
import About from "./components/About";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import Payment from "./components/Payment";
import HotelDetail from "./components/HotelDetail";
import EditProfile from "./components/EditProfile";
import Destinations from "./components/Destinations";
import DestinationDetail from "./components/DestinationDetail";
import Hotels from "./components/Hotels";
import Contact from "./components/Contact";
import FlightDetail from "./components/FlightDetail";
import ImageTest from "./components/ImageTest";
import BookingConfirmation from "./components/BookingConfirmation";
import AdminDashboard from "./components/AdminDashboard";
import Signup from "./components/Signup";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAuthenticated(!!token);
    setIsAdmin(user.role === "admin");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: window.location.pathname,
          message: "Please log in to access this page",
        }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/:id" element={<FlightDetail />} />
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hotels"
              element={
                <ProtectedRoute>
                  <Hotels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hotels/:id"
              element={
                <ProtectedRoute>
                  <HotelDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:id"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/destinations"
              element={
                <ProtectedRoute>
                  <Destinations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/destinations/:id"
              element={
                <ProtectedRoute>
                  <DestinationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/image-test"
              element={
                <ProtectedRoute>
                  <ImageTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            {/* Admin Only Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
