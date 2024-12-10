const mongoose = require('mongoose');

// Define the schema for the Post model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // The title of the post
  content: { type: String, required: true }, // The main content of the post
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
  topic: { type: String, required: true, lowercase: true }, // The topic of the post, stored in lowercase
  createdAt: { type: Date, default: Date.now }, // The date and time when the post was created (defaults to the current date and time)
  expiresAt: { type: Date, required: true }, // The date and time when the post expires
  likes: { type: Number, default: 0 }, // The number of likes on the post
  dislikes: { type: Number, default: 0 }, // The number of dislikes on the post
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who added the comment
      message: { type: String, required: true }, // The text of the comment
      createdAt: { type: Date, default: Date.now }, // The date and time when the comment was created (defaults to the current date and time)
    },
  ],
  status: { type: String, default: 'Live' }, // The status of the post, which can be either "Live" or "Expired"
});

// Middleware to automatically update the status of a post based on its expiration date
postSchema.pre('save', function (next) {
  // If the current date is past the expiration date, set the status to "Expired"
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.status = 'Expired';
  } else {
    // Otherwise, set the status to "Live"
    this.status = 'Live';
  }
  next(); // Proceed to save the post
});

// Export the Post model so it can be used in other parts of the application
module.exports = mongoose.model('Post', postSchema);
