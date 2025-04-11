import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS file

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/register', { username, email, password, address, phone });
            console.log(response.data);
            if (response.status === 201) {
                // Assuming successful registration returns a success status
                navigate('/login'); // Redirect to login page after successful registration
            } else if (response.data.message) {
                setError(response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError('An error occurred during registration. Please try again later.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Your Address (Optional)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Your Phone Number (Optional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="register-button">
                        Signup
                    </button>
                </form>
                <p className="login-link">
                    Have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;