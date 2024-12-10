// Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport'); // Add Passport for authentication
require('dotenv').config(); // Load environment variables

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Import Passport configuration
require('./config/passport'); // Adjust this path if needed

// Initialize Express application
const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Use secret from .env file
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define routes
app.use('/users', userRoutes); // Routes for user-related actions
app.use('/auth', authRoutes); // Routes for authentication
app.use('/posts', postRoutes); // Routes for posts

// Define a basic GET route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Piazza system!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Route not found!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
