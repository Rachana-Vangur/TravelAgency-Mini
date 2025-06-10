import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  hotelService,
  destinationService,
  flightService,
} from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hotels");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    location: "",
    image: "",
    // Additional fields for specific types
    checkIn: "",
    checkOut: "",
    rooms: "",
    amenities: "",
    departureTime: "",
    arrivalTime: "",
    airline: "",
    duration: "",
  });

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    // Only fetch items if user is admin
    fetchItems();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let data;
      switch (activeTab) {
        case "hotels":
          data = await hotelService.getAll();
          break;
        case "destinations":
          data = await destinationService.getAll();
          break;
        case "flights":
          data = await flightService.getAll();
          break;
        default:
          data = [];
      }
      setItems(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Failed to fetch items");
      setLoading(false);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      switch (activeTab) {
        case "hotels":
          await hotelService.createHotel(formData);
          break;
        case "destinations":
          await destinationService.createDestination(formData);
          break;
        case "flights":
          await flightService.createFlight(formData);
          break;
        default:
          break;
      }
      // Refresh the list
      await fetchItems();
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        location: "",
        image: "",
        checkIn: "",
        checkOut: "",
        rooms: "",
        amenities: "",
        departureTime: "",
        arrivalTime: "",
        airline: "",
        duration: "",
      });
    } catch (err) {
      setError("Failed to create item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        switch (activeTab) {
          case "hotels":
            await hotelService.deleteHotel(id);
            break;
          case "destinations":
            await destinationService.deleteDestination(id);
            break;
          case "flights":
            await flightService.deleteFlight(id);
            break;
          default:
            break;
        }
        // Refresh the list
        await fetchItems();
      } catch (err) {
        setError("Failed to delete item");
      }
    }
  };

  const renderForm = () => {
    const commonFields = (
      <>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            required
          />
        </div>
      </>
    );

    switch (activeTab) {
      case "hotels":
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label>Check-in Time:</label>
              <input
                type="text"
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData({ ...formData, checkIn: e.target.value })
                }
                placeholder="e.g., 2:00 PM"
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Time:</label>
              <input
                type="text"
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData({ ...formData, checkOut: e.target.value })
                }
                placeholder="e.g., 11:00 AM"
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Rooms:</label>
              <input
                type="number"
                value={formData.rooms}
                onChange={(e) =>
                  setFormData({ ...formData, rooms: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Amenities:</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
                placeholder="e.g., WiFi, Pool, Gym"
                required
              />
            </div>
          </>
        );
      case "flights":
        return (
          <>
            {commonFields}
            <div className="form-group">
              <label>Airline:</label>
              <input
                type="text"
                value={formData.airline}
                onChange={(e) =>
                  setFormData({ ...formData, airline: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Departure Time:</label>
              <input
                type="text"
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                placeholder="e.g., 10:00 AM"
                required
              />
            </div>
            <div className="form-group">
              <label>Arrival Time:</label>
              <input
                type="text"
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                placeholder="e.g., 2:00 PM"
                required
              />
            </div>
            <div className="form-group">
              <label>Duration:</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 4h 30m"
                required
              />
            </div>
          </>
        );
      case "destinations":
        return commonFields;
      default:
        return null;
    }
  };

  const renderItems = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    return (
      <div className="items-list">
        {items.map((item) => (
          <div key={item._id} className="item-card">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Price: ₹{item.price}</p>
              <p>Location: {item.location}</p>
              {activeTab === "hotels" && (
                <>
                  <p>Check-in: {item.checkIn}</p>
                  <p>Check-out: {item.checkOut}</p>
                  <p>Rooms: {item.rooms}</p>
                  <p>Amenities: {item.amenities}</p>
                </>
              )}
              {activeTab === "flights" && (
                <>
                  <p>Airline: {item.airline}</p>
                  <p>Departure: {item.departureTime}</p>
                  <p>Arrival: {item.arrivalTime}</p>
                  <p>Duration: {item.duration}</p>
                </>
              )}
              <button
                className="delete-button"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === "hotels" ? "active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          Hotels
        </button>
        <button
          className={`tab ${activeTab === "destinations" ? "active" : ""}`}
          onClick={() => setActiveTab("destinations")}
        >
          Destinations
        </button>
        <button
          className={`tab ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          Flights
        </button>
      </div>

      <div className="admin-content">
        <div className="add-item-form">
          <h2>
            Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <button type="submit" className="submit-button">
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </form>
        </div>

        <div className="items-container">
          <h2>
            Existing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          {renderItems()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
