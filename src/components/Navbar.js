import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { logo } from "../assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  console.log("Navbar user state:", user);

  useEffect(() => {
    // Update user state when localStorage changes
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser({}); // Update local state immediately
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Travel Agency Logo" className="nav-logo" />
          <span>TravelEase</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/destinations" className="nav-link">
            Destinations
          </Link>
          <Link to="/hotels" className="nav-link">
            Hotels
          </Link>
          <Link to="/flights" className="nav-link">
            Flights
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
          {user && Object.keys(user).length > 0 ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button login">
                Login
              </Link>
              <Link to="/signup" className="nav-button register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
