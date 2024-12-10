const express = require('express');
const Post = require('../models/post'); // Importing the Post model
const User = require('../models/user'); // Importing the User model
const router = express.Router();

// Create a New Post
router.post('/', async (req, res) => {
  try {
    const { title, content, user } = req.body;

    // Create a new post document
    const post = new Post({ title, content, user });

    // Save the post to the database
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Posts
router.get('/', async (req, res) => {
  try {
    // Fetch all posts and populate the user and comments
    const posts = await Post.find()
      .populate('user', 'name email') // Populate user details
      .populate('comments.user', 'name email'); // Populate commenter details

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a Single Post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name email') // Populate user details
      .populate('comments.user', 'name email'); // Populate commenter details

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Post by ID
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Find the post by ID and update it
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // Return the updated post
    );

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Post by ID
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Like to a Post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes += 1; // Increment the like count
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a Comment to a Post
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, message } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Add the new comment to the post
    post.comments.push({ user, message });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Comment from a Post
router.delete('/:postId/comment/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Remove the comment by its ID
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
