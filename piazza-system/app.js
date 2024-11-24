const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users'); // User routes
const authRoutes = require('./routes/auth'); // Authentication routes
const bcrypt = require('bcryptjs'); // Ensure bcryptjs is used correctly

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes); // Add auth routes

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/piazzaSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Basic Route for GET
app.get('/', (req, res) => {
  res.send('Welcome to the Piazza system!');
});

// POST Route for `/`
app.post('/', (req, res) => {
  const { name, message } = req.body; // Destructure request body
  if (!name || !message) { // Check for missing fields
    return res.status(400).send('Both "name" and "message" fields are required!');
  }
  res.send(`Hello, ${name}. Your message: "${message}" has been received!`);
});


// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
