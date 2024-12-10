// Import required libraries and modules
const express = require('express');
const bcrypt = require('bcrypt'); // Library for hashing passwords securely.
const jwt = require('jsonwebtoken'); // Library for creating and verifying JWT tokens.
const passport = require('passport'); // Middleware for handling Google OAuth authentication.
const User = require('../models/User'); // Import the User model for database interaction.
require('dotenv').config(); // Load environment variables from the .env file.

const router = express.Router(); // Create an instance of an Express router for defining routes.

// Register a New User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extract user data from the request body.

  try {
    // Hash the user's password for security.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new user in the database.
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Respond with a success message and HTTP status 201 (Created).
    res.status(201).json({ message: `User ${name} registered successfully!` });
  } catch (err) {
    // Handle errors and send an appropriate response.
    res.status(400).json({ error: 'Error registering user: ' + err.message });
  }
});

// Log in an Existing User
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract login credentials from the request body.

  try {
    // Look for the user in the database by email.
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate a JWT token with user details and a 1-hour expiry time.
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SESSION_SECRET, {
      expiresIn: '1h',
    });

    // Respond with the token and success message.
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    // Handle errors and send an appropriate response.
    res.status(500).json({ error: 'Error logging in: ' + err.message });
  }
});

// Protected Route Example (Requires JWT authentication)
router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    // Fetch the user's profile by ID, excluding the password field.
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Respond with the user's profile data.
    res.status(200).json(user);
  } catch (err) {
    // Handle errors and send an appropriate response.
    res.status(500).json({ error: 'Error fetching user profile: ' + err.message });
  }
});

// Google OAuth Login Route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Redirects the user to Google's login page with permissions to access profile and email.

// Google OAuth Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }), // Redirect to home on failure.
  (req, res) => {
    // Redirect to the homepage on successful authentication.
    res.redirect('/');
  }
);

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      // Log any errors that occur during the logout process.
      console.error('Error during logout:', err);
    }
    res.redirect('/'); // Redirect to the homepage after logging out.
  });
});

// Middleware to Authenticate JWT (Protect Routes)
function authenticateJWT(req, res, next) {
  // Extract the token from the request's "Authorization" header.
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, token missing' }); // Respond with an error if no token is provided.

  try {
    // Verify the token and extract the user data.
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded; // Attach the decoded user information to the request object.
    next(); // Allow the request to proceed to the next middleware or route.
  } catch (err) {
    // Respond with an error if the token is invalid.
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Export the router for use in other parts of the application.
module.exports = router;

