const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Flight = require("./models/Flight");
const Hotel = require("./models/Hotel");
const Destination = require("./models/Destination");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample flights data
const flights = [
  {
    airline: "Emirates",
    flightNumber: "EK123",
    from: "New York",
    to: "Dubai",
    departureDate: new Date("2023-06-15"),
    departureTime: "10:30",
    arrivalTime: "08:30",
    duration: "12h 0m",
    price: 85000,
    seatsAvailable: 45,
    airlineLogo: "/images/emirates.png",
  },
  {
    airline: "Delta",
    flightNumber: "DL456",
    from: "Los Angeles",
    to: "London",
    departureDate: new Date("2023-06-16"),
    departureTime: "14:15",
    arrivalTime: "06:45",
    duration: "10h 30m",
    price: 72000,
    seatsAvailable: 32,
    airlineLogo: "/images/delta.png",
  },
  {
    airline: "Lufthansa",
    flightNumber: "LH789",
    from: "Chicago",
    to: "Frankfurt",
    departureDate: new Date("2023-06-17"),
    departureTime: "18:45",
    arrivalTime: "09:15",
    duration: "8h 30m",
    price: 68000,
    seatsAvailable: 28,
    airlineLogo: "/images/lufthansa.png",
  },
  {
    airline: "Singapore Airlines",
    flightNumber: "SQ234",
    from: "San Francisco",
    to: "Singapore",
    departureDate: new Date("2023-06-18"),
    departureTime: "23:30",
    arrivalTime: "06:45",
    duration: "15h 15m",
    price: 95000,
    seatsAvailable: 15,
    airlineLogo: "/images/singapore-airlines.png",
  },
  {
    airline: "Qatar Airways",
    flightNumber: "QR567",
    from: "Miami",
    to: "Doha",
    departureDate: new Date("2023-06-19"),
    departureTime: "22:15",
    arrivalTime: "18:30",
    duration: "14h 15m",
    price: 88000,
    seatsAvailable: 22,
    airlineLogo: "/images/qatar-airways.png",
  },
];

// Sample hotels data
const hotels = [
  {
    name: "Grand Plaza Hotel",
    location: "New York City",
    description:
      "Luxury hotel in the heart of Manhattan with stunning views of the city skyline.",
    price: 25000,
    rating: 4.5,
    image: "/images/hotels/grand-plaza.jpg",
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym"],
    roomsAvailable: 15,
  },
  {
    name: "Seaside Resort",
    location: "Miami Beach",
    description:
      "Beachfront resort with direct access to the ocean and multiple pools.",
    price: 18000,
    rating: 4.2,
    image: "/images/hotels/seaside-resort.jpg",
    amenities: ["WiFi", "Pool", "Beach Access", "Restaurant", "Bar"],
    roomsAvailable: 25,
  },
  {
    name: "Mountain View Lodge",
    location: "Aspen",
    description:
      "Cozy lodge with breathtaking mountain views and ski-in/ski-out access.",
    price: 30000,
    rating: 4.7,
    image: "/images/hotels/mountain-view.jpg",
    amenities: ["WiFi", "Spa", "Restaurant", "Ski Storage", "Fireplace"],
    roomsAvailable: 10,
  },
  {
    name: "Urban Boutique Hotel",
    location: "San Francisco",
    description:
      "Stylish boutique hotel in the vibrant Mission District with modern amenities.",
    price: 20000,
    rating: 4.3,
    image: "/images/hotels/urban-boutique.jpg",
    amenities: ["WiFi", "Restaurant", "Bar", "Bike Rental", "Concierge"],
    roomsAvailable: 20,
  },
  {
    name: "Luxury Palace Hotel",
    location: "Las Vegas",
    description:
      "Extravagant hotel on the Las Vegas Strip with world-class entertainment.",
    price: 28000,
    rating: 4.6,
    image: "/images/hotels/luxury-palace.jpg",
    amenities: ["WiFi", "Pool", "Casino", "Restaurant", "Show Venue"],
    roomsAvailable: 50,
  },
];

// Sample destinations data
const destinations = [
  {
    name: "Paris",
    location: "France",
    description:
      "The City of Light, known for its art, fashion, gastronomy, and culture.",
    price: 120000,
    rating: 4.8,
    imageUrl: "/images/destinations/paris.jpg",
    duration: 7,
    availableSpots: 25,
    activities: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame",
      "Seine River Cruise",
    ],
  },
  {
    name: "Tokyo",
    location: "Japan",
    description:
      "A fascinating blend of traditional and modern, offering visitors a seemingly unlimited choice of shopping, entertainment, culture, and dining.",
    price: 150000,
    rating: 4.7,
    imageUrl: "/images/destinations/tokyo.jpg",
    duration: 10,
    availableSpots: 20,
    activities: [
      "Shibuya Crossing",
      "Tsukiji Outer Market",
      "Senso-ji Temple",
      "Tokyo Skytree",
    ],
  },
  {
    name: "New York City",
    location: "USA",
    description:
      "The city that never sleeps, offering world-class museums, theaters, restaurants, and shopping.",
    price: 100000,
    rating: 4.6,
    imageUrl: "/images/destinations/new-york.jpg",
    duration: 5,
    availableSpots: 30,
    activities: [
      "Central Park",
      "Times Square",
      "Statue of Liberty",
      "Empire State Building",
    ],
  },
  {
    name: "Rome",
    location: "Italy",
    description:
      "The Eternal City, home to ancient ruins, Renaissance art, and delicious cuisine.",
    price: 1100,
    rating: 4.5,
    imageUrl: "/images/destinations/rome.jpg",
    duration: 6,
    availableSpots: 18,
    activities: [
      "Colosseum",
      "Vatican Museums",
      "Trevi Fountain",
      "Roman Forum",
    ],
  },
  {
    name: "Sydney",
    location: "Australia",
    description:
      "A vibrant metropolis with stunning harbor views, beautiful beaches, and a laid-back lifestyle.",
    price: 1300,
    rating: 4.4,
    imageUrl: "/images/destinations/sydney.jpg",
    duration: 8,
    availableSpots: 22,
    activities: [
      "Sydney Opera House",
      "Bondi Beach",
      "Harbor Bridge",
      "Darling Harbor",
    ],
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Flight.deleteMany({});
    await Hotel.deleteMany({});
    await Destination.deleteMany({});

    // Insert new data
    await Flight.insertMany(flights);
    await Hotel.insertMany(hotels);
    await Destination.insertMany(destinations);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
