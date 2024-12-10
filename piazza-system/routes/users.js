// Importing the necessary libraries
const express = require('express');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens
const User = require('../models/user'); // Import the User model

// Creating a new router instance
const router = express.Router();

// Create a New User (Register)
router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required!' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: `User ${name} created successfully!` });
  } catch (err) {
    res.status(400).json({ error: 'Error creating user: ' + err.message });
  }
});

// Get All Users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password from the response
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users: ' + err.message });
  }
});

// Get a Single User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user: ' + err.message });
  }
});

// Update a User by ID
router.put('/:id', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const updates = { name, email };
    if (password) {
      updates.password = await bcrypt.hash(password, 10); // Hash the new password if provided
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User updated successfully!', user });
  } catch (err) {
    res.status(400).json({ error: 'Error updating user: ' + err.message });
  }
});

// Delete a User by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user: ' + err.message });
  }
});

module.exports = router;
