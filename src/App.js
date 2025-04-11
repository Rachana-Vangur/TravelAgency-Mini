// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Stays from "./components/Stays";
import Flights from "./components/Flights";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Payment from "./components/Payment";
import HotelDetail from "./components/HotelDetail";
import EditProfile from "./components/EditProfile"; // Import EditProfile
import Destinations from "./components/Destinations"; // Import Destinations
import DestinationDetail from "./components/DestinationDetail"; // Import DestinationDetail
import Hotels from "./components/Hotels";
import Contact from "./components/Contact";
import FlightDetail from "./components/FlightDetail";
import ImageTest from "./components/ImageTest"; // Import ImageTest
import BookingConfirmation from "./components/BookingConfirmation";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {" "}
            {/* Use Routes instead of Switch */}
            <Route path="/" element={<Home />} />{" "}
            {/* Use element prop instead of component */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />{" "}
            {/* Assuming you are using /signup */}
            <Route
              path="/register"
              element={<Navigate to="/signup" replace />}
            />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/:id" element={<Payment />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/:id" element={<FlightDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />{" "}
            {/* Add the route for EditProfile */}
            <Route path="/destinations" element={<Destinations />} />{" "}
            {/* Add the route for Destinations */}
            <Route
              path="/destinations/:id"
              element={<DestinationDetail />}
            />{" "}
            {/* Add the route for DestinationDetail */}
            <Route path="/image-test" element={<ImageTest />} />{" "}
            {/* Add the route for ImageTest */}
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
