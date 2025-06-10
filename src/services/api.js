import axios from "axios";

const API_URL = "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  isAdmin() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "admin";
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  },

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// Destination services
export const destinationService = {
  getAll: async () => {
    const response = await api.get("/destinations");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },
  create: async (destinationData) => {
    const response = await api.post("/destinations", destinationData);
    return response.data;
  },
  update: async (id, destinationData) => {
    const response = await api.put(`/destinations/${id}`, destinationData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/destinations/${id}/reviews`, reviewData);
    return response.data;
  },
};

// Flight services
export const flightService = {
  getAll: async () => {
    const response = await api.get("/flights");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },
  search: async (searchParams) => {
    const response = await api.get("/flights/search", { params: searchParams });
    return response.data;
  },
  create: async (flightData) => {
    const response = await api.post("/flights", flightData);
    return response.data;
  },
  update: async (id, flightData) => {
    const response = await api.put(`/flights/${id}`, flightData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/flights/${id}`);
    return response.data;
  },
};

// Hotel services
export const hotelService = {
  getAll: async () => {
    const response = await api.get("/hotels");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },
  search: async (searchParams) => {
    const response = await api.get("/hotels/search", { params: searchParams });
    return response.data;
  },
  create: async (hotelData) => {
    const response = await api.post("/hotels", hotelData);
    return response.data;
  },
  update: async (id, hotelData) => {
    const response = await api.put(`/hotels/${id}`, hotelData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },
};

// Booking services
export const bookingService = {
  getAll: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  create: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
