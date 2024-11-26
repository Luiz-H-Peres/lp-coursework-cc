// Importing required libraries and the User model
const express = require('express');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens
const User = require('../models/user'); // Import the User model to interact with the database

// Creating a new router instance to define authentication-related routes
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
  // Extracting name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    // Hash the user's password for security before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with the provided details and the hashed password
    const user = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Respond with a success message
    res.status(201).send(`User ${name} created successfully!`);
  } catch (err) {
    // Handle errors, such as duplicate emails or database issues
    res.status(400).send('Error creating user: ' + err.message);
  }
});

// Route to log in an existing user
router.post('/login', async (req, res) => {
  // Extracting email and password from the request body
  const { email, password } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    // Generate a JSON Web Token for the user
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with a success message and the token
    res.status(200).send({ message: 'Logged in successfully', token });
  } catch (err) {
    // Handle server errors
    res.status(500).send('Error logging in: ' + err.message);
  }
});

// Exporting the router so it can be used in the app
module.exports = router;
