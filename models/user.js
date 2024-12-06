// Importing the mongoose library to interact with MongoDB
const mongoose = require('mongoose');

// Define the User schema, which represents the structure of the data in MongoDB
const userSchema = new mongoose.Schema({
  // 'name' is a string field that is required for each user
  name: { type: String, required: true },

  // 'email' is a string field that must be unique for each user and is also required
  email: { type: String, required: true, unique: true },

  // 'password' is a string field to store the user's hashed password, also required
  password: { type: String, required: true },

  // 'createdAt' stores the date and time the user was created. Defaults to the current date/time
  createdAt: { type: Date, default: Date.now },
});

// Export the User model, which allows us to perform operations like creating, reading, and updating users in the database
module.exports = mongoose.model('User', userSchema);
