// Import required modules
const express = require('express'); // Web framework for building APIs
const mongoose = require('mongoose'); // Library to interact with MongoDB
const userRoutes = require('./routes/users'); // Import user-related routes
const authRoutes = require('./routes/auth'); // Import authentication-related routes
const bcrypt = require('bcryptjs'); // Library to hash passwords securely

// Initialize Express application
const app = express();
const port = 3000; // Define the port for the server

// Middleware to parse JSON request bodies
app.use(express.json());

// Define routes
app.use('/users', userRoutes); // User-related routes, e.g., creating users
app.use('/auth', authRoutes); // Authentication routes, e.g., login and register

// Connect to MongoDB database
mongoose
  .connect('mongodb://127.0.0.1:27017/piazzaSystem', { // Connect to local MongoDB
    useNewUrlParser: true, // Parse MongoDB connection string
    useUnifiedTopology: true, // Use new MongoDB server discovery engine
  })
  .then(() => console.log('Connected to MongoDB')) // Log success
  .catch(err => console.error('Could not connect to MongoDB', err)); // Log errors

// Define a basic GET route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Piazza system!'); // Response to the root URL
});

// Define a POST route for the home page
app.post('/', (req, res) => {
  const { name, message } = req.body; // Extract `name` and `message` from request body

  // Check if both `name` and `message` are provided
  if (!name || !message) {
    return res.status(400).send('Both "name" and "message" fields are required!'); // Return error if fields are missing
  }

  // Send a success response if fields are provided
  res.send(`Hello, ${name}. Your message: "${message}" has been received!`);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log server URL
});
