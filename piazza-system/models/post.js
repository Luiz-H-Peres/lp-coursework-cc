const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the post
  content: { type: String, required: true }, // Content of the post
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the post
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date
  likes: { type: Number, default: 0 }, // Number of likes
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who commented
      message: { type: String, required: true }, // Comment text
      createdAt: { type: Date, default: Date.now }, // Date of comment
    },
  ],
});

// Export the Post model
module.exports = mongoose.model('Post', postSchema);

