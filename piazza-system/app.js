const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users'); // Ensure the path is correct

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/piazzaSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to the Piazza system!');
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
