const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const usersRoutes = require('./routes/user'); // Import user routes

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application instance

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE', // Allow these HTTP methods
  credentials: false, // Disable cookies/authorization headers for all origins
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist"))); // Serve static files from 'dist'

// Serve the index.html file when the root is accessed
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// MongoDB Connection URI from .env
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true, // Enable strict mode
    deprecationErrors: true, // Show warnings for deprecated features
  },
});

// MongoDB Connection Function
async function connectToMongoDB() {
  try {
    await client.connect(); // Establish connection
    console.log('Connected to MongoDB successfully!');
    return client.db(); // Return the default database instance
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit the process if connection fails
  }
}

// Connect to MongoDB before starting the server
(async () => {
  await connectToMongoDB(); // Ensure DB connection is established first
  
  // Root route
  app.get('/', (req, res) => {
    res.send("Welcome to the homepage!");
  });

  // Use routes
  app.use('/user', usersRoutes); // Mount the users route on '/user'

  // Start the server
  const PORT =  3000; // Use environment variable for port or default to 3001
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
