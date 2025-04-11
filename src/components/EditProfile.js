// src/components/EditProfile.js
import React, { useState } from 'react';
import './EditProfile.css';
import { useNavigate, Link } from 'react-router-dom';

const EditProfile = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
    const [address, setAddress] = useState(localStorage.getItem('address') || '');

    const handleSaveProfile = () => {
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('address', address);
        navigate('/dashboard');
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <div className="button-group">
                <button onClick={handleSaveProfile} className="save-button">Save</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
                <Link to="/" className="home-button">Home</Link>
            </div>
        </div>
    );
};

export default EditProfile;