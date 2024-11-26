// Importing the Express library
const express = require('express');

// Creating a new router instance to handle routes related to posts
const router = express.Router();

// Define a basic GET route for posts
// This route handles GET requests to the `/posts` endpoint
router.get('/', (req, res) => {
  // Send a response indicating that this is the posts route
  res.send('Posts route');
});

// Export the router so it can be used in the main app
module.exports = router;
