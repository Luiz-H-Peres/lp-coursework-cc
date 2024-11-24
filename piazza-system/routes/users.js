const express = require('express');
const router = express.Router(); // Create a new router instance

// POST route to create a new user
router.post('/create', (req, res) => {
  // Extract name and email from the request body
  const { name, email } = req.body;

  // Check if name and email are provided
  if (!name || !email) {
    return res.status(400).send('Name and email are required!');
  }

  // Respond with a success message
  res.send(`User ${name} with email ${email} created!`);
});

module.exports = router; // Export the router for use in other files
