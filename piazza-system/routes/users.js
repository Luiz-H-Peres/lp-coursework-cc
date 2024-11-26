// Import the Express library
const express = require('express');

// Create a new router instance
const router = express.Router();

// Define a POST route to create a new user
// This route will handle POST requests to the `/users/create` endpoint
router.post('/create', (req, res) => {
  // Destructure the `name` and `email` fields from the request body
  const { name, email } = req.body;

  // Check if both `name` and `email` are provided in the request
  if (!name || !email) {
    // If not, return a 400 Bad Request status with an error message
    return res.status(400).send('Name and email are required!');
  }

  // If both fields are present, send a success message back to the client
  res.send(`User ${name} with email ${email} created!`);
});

// Export the router so it can be used in the main app
module.exports = router;
