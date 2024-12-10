// Import required libraries and models
const express = require('express');
const Post = require('../models/post'); // Import the Post model for database operations.
const User = require('../models/User'); // Import the User model for user-related data.
const router = express.Router(); // Create an instance of an Express router.

// Helper function for consistent error handling
// This function standardises error responses with a message and HTTP status code.
const handleError = (res, message, status = 500) => {
  res.status(status).json({ error: message });
};

// Middleware to check if a post is live
// Ensures that interactions (like, dislike, comment) are only allowed for "Live" posts.
const checkPostStatus = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id); // Find the post by its ID.
    if (!post) return handleError(res, 'Post not found.', 404); // Return 404 if not found.

    if (post.status === 'Expired') {
      // Prevent interactions with expired posts.
      return res
        .status(403)
        .json({ error: 'This post has expired and cannot be interacted with.' });
    }

    req.post = post; // Attach the post object to the request for the next middleware or route handler.
    next(); // Proceed to the next step in the request handling.
  } catch (err) {
    console.error('Error checking post status:', err.message); // Log any errors.
    handleError(res, 'Failed to check post status.'); // Return a generic error response.
  }
};

// Create a new post
// Endpoint: POST /posts/create
router.post('/create', async (req, res) => {
  const { title, content, user, expiresAt, topic } = req.body;

  // Validate that all required fields are provided.
  if (!title || !content || !user || !topic || !expiresAt) {
    return handleError(res, 'Title, content, user, topic, and expiration date are required.', 400);
  }

  try {
    // Create a new post with the provided data.
    const post = new Post({
      title,
      content,
      user,
      expiresAt,
      topic: topic.toLowerCase(), // Convert topic to lowercase for consistency.
      status: 'Live', // Set initial status to "Live".
    });

    await post.save(); // Save the post to the database.
    res.status(201).json({ message: 'Post created successfully!', post });
  } catch (err) {
    console.error('Error creating post:', err.message);
    handleError(res, 'Failed to create post.');
  }
});

// Fetch live posts by topic
// Endpoint: GET /posts/topic/:topic
router.get('/topic/:topic', async (req, res) => {
  try {
    // Find posts with the specified topic and "Live" status.
    const posts = await Post.find({ topic: req.params.topic.toLowerCase(), status: 'Live' })
      .populate('user', 'name email') // Populate user data (name and email).
      .populate('comments.user', 'name email'); // Populate comment user data.

    if (!posts.length) {
      return res.status(404).json({ message: `No live posts found for topic: ${req.params.topic}` });
    }

    res.status(200).json({ message: `Live posts for topic: ${req.params.topic}`, posts });
  } catch (err) {
    console.error('Error fetching posts by topic:', err.message);
    handleError(res, 'Failed to fetch posts by topic.');
  }
});

// Fetch the most active post by topic
// Endpoint: GET /posts/topic/:topic/most-active
router.get('/topic/:topic/most-active', async (req, res) => {
  try {
    // Find the most active post based on the number of likes.
    const post = await Post.findOne({ topic: req.params.topic.toLowerCase(), status: 'Live' })
      .sort({ likes: -1 }) // Sort by likes in descending order.
      .populate('user', 'name email') // Populate user data.
      .populate('comments.user', 'name email'); // Populate comment user data.

    if (!post) {
      return res
        .status(404)
        .json({ message: `No most active post found for topic: ${req.params.topic}` });
    }

    res.status(200).json({ message: `Most active post for topic: ${req.params.topic}`, post });
  } catch (err) {
    console.error('Error fetching the most active post:', err.message);
    handleError(res, 'Failed to fetch the most active post.');
  }
});

// Fetch expired posts by topic
// Endpoint: GET /posts/topic/:topic/expired
router.get('/topic/:topic/expired', async (req, res) => {
  try {
    // Find posts with the specified topic and "Expired" status.
    const posts = await Post.find({ topic: req.params.topic.toLowerCase(), status: 'Expired' })
      .populate('user', 'name email') // Populate user data.
      .populate('comments.user', 'name email'); // Populate comment user data.

    if (!posts.length) {
      return res.status(404).json({ message: `No expired posts found for topic: ${req.params.topic}` });
    }

    res.status(200).json({ message: `Expired posts for topic: ${req.params.topic}`, posts });
  } catch (err) {
    console.error('Error fetching expired posts:', err.message);
    handleError(res, 'Failed to fetch expired posts.');
  }
});

// Update post status automatically
// Endpoint: PUT /posts/check-status/:id
router.put('/check-status/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Find the post by its ID.
    if (!post) return handleError(res, 'Post not found.', 404);

    // Check if the post has expired.
    if (new Date() > new Date(post.expiresAt)) {
      post.status = 'Expired'; // Update status to "Expired".
      await post.save(); // Save the updated post.
    }

    res.status(200).json({ message: 'Post status updated.', post });
  } catch (err) {
    console.error('Error updating post status:', err.message);
    handleError(res, 'Failed to update post status.');
  }
});

// Like a post
// Endpoint: POST /posts/:id/like
router.post('/:id/like', checkPostStatus, async (req, res) => {
  try {
    req.post.likes += 1; // Increment the likes count.
    await req.post.save(); // Save the updated post.

    res.status(200).json({ message: 'Post liked!', post: req.post });
  } catch (err) {
    console.error('Error liking post:', err.message);
    handleError(res, 'Failed to like post.');
  }
});

// Dislike a post
// Endpoint: POST /posts/:id/dislike
router.post('/:id/dislike', checkPostStatus, async (req, res) => {
  try {
    req.post.dislikes += 1; // Increment the dislikes count.
    await req.post.save(); // Save the updated post.

    res.status(200).json({ message: 'Post disliked!', post: req.post });
  } catch (err) {
    console.error('Error disliking post:', err.message);
    handleError(res, 'Failed to dislike post.');
  }
});

// Add a comment to a post
// Endpoint: POST /posts/:id/comment
router.post('/:id/comment', checkPostStatus, async (req, res) => {
  const { user, message } = req.body;

  // Validate that user and message fields are provided.
  if (!user || !message) {
    return handleError(res, 'User and message are required.', 400);
  }

  try {
    // Add the comment to the post's comments array.
    req.post.comments.push({ user, message });
    await req.post.save(); // Save the updated post.

    res.status(201).json({ message: 'Comment added successfully!', post: req.post });
  } catch (err) {
    console.error('Error adding comment:', err.message);
    handleError(res, 'Failed to add comment.');
  }
});

// Delete a comment from a post
// Endpoint: DELETE /posts/:postId/comment/:commentId
router.delete('/:postId/comment/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId); // Find the post by its ID.

    if (!post) return handleError(res, 'Post not found.', 404);

    // Filter out the comment to be deleted.
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save(); // Save the updated post.

    res.status(200).json({ message: 'Comment deleted successfully!', post });
  } catch (err) {
    console.error('Error deleting comment:', err.message);
    handleError(res, 'Failed to delete comment.');
  }
});

// Export the router for use in the application
module.exports = router;
