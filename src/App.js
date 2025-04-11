// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Stays from './components/Stays';
import Flights from './components/Flights';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Payment from './components/Payment';
import HotelDetail from './components/HotelDetail';
import EditProfile from './components/EditProfile'; // Import EditProfile
import Destinations from './components/Destinations'; // Import Destinations

const App = () => {
    return (
        <Router>
            <Routes> {/* Use Routes instead of Switch */}
                <Route path="/" element={<Home />} /> {/* Use element prop instead of component */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} /> {/* Assuming you are using /signup */}
                <Route path="/hotels" element={<Stays />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/payment/:hotelId" element={<Payment />} />
                <Route path="/flights" element={<Flights />} />
                
                <Route path="/about" element={<About />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/edit-profile" element={<EditProfile />} /> {/* Add the route for EditProfile */}
                <Route path="/destinations" element={<Destinations />} /> {/* Add the route for Destinations */}
            </Routes>
        </Router>
    );
};

export default App;