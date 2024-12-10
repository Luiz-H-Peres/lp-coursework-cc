// Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import route files
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Import Passport configuration
require('./config/passport');

// Initialise Express application
const app = express();

// Middleware for parsing JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialise Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

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

// MongoDB Connection
const isTestEnv = process.env.NODE_ENV === 'test';
const dbURI = isTestEnv
  ? 'mongodb://localhost:27017/testDB' // Use local DB for testing
  : process.env.MONGODB_URI; // Use .env DB URI for production/Docker

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server only if not in test mode
if (!isTestEnv) {
  const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export the app module
module.exports = app;
