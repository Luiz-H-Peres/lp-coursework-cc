// Importing the mongoose library to facilitate interaction with MongoDB
const mongoose = require('mongoose');

// Check if the 'User' model already exists to avoid the OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: { 
    type: String, 
    required: true // The user's name is mandatory
  },
  email: { 
    type: String, 
    required: true, // The user's email address is mandatory
    unique: true // Ensures no two users can have the same email address
  },
  password: { 
    type: String, 
    required: false // Password is optional for users authenticated via OAuth
  },
  googleId: { 
    type: String, 
    required: false // Only required for users logging in with Google OAuth
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically sets the account creation date and time
  },
}));

// Exporting the User model to make it accessible in other parts of the application
module.exports = User;
