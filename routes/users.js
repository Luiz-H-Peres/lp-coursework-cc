// Importing the required libraries and model
const express = require('express');
const bcrypt = require('bcrypt'); // For securely hashing passwords
const jwt = require('jsonwebtoken'); // For creating JWT tokens
const User = require('../models/User'); // Import the User model for database operations

// Create a new router instance for user-related routes
const router = express.Router();

// Create a new user (registration)
// Endpoint: POST /users/create
router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;

  // Ensure all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required!' });
  }

  try {
    // Hash the user's password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save(); // Save the user to the database

    // Return a success response with user details (excluding password)
    res.status(201).json({
      message: `User ${name} created successfully!`,
      user: {
        id: savedUser._id, // Include the user ID
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (err) {
    // Handle any errors that occur during user creation
    res.status(400).json({ error: 'Error creating user: ' + err.message });
  }
});

// Retrieve all users
// Endpoint: GET /users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the response
    res.status(200).json(users); // Return a list of all users
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users: ' + err.message });
  }
});

// Retrieve a single user by their ID
// Endpoint: GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Find user and exclude password
    if (!user) return res.status(404).json({ error: 'User not found' }); // Handle case where user is not found

    res.status(200).json(user); // Return user details
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user: ' + err.message });
  }
});

// Update an existing user by their ID
// Endpoint: PUT /users/:id
router.put('/:id', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Prepare updates based on provided data
    const updates = { name, email };
    if (password) {
      updates.password = await bcrypt.hash(password, 10); // Hash the new password if provided
    }

    // Find and update the user, returning the updated user details
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User updated successfully!', user });
  } catch (err) {
    res.status(400).json({ error: 'Error updating user: ' + err.message });
  }
});

// Delete a user by their ID
// Endpoint: DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // Find and delete the user by ID
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user: ' + err.message });
  }
});

// Export the router for use in the main application
module.exports = router;
