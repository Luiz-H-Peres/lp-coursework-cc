// Import necessary libraries and the application
const request = require('supertest'); // Supertest is used for testing HTTP requests.
const mongoose = require('mongoose'); // Mongoose is used for interacting with the test database.
const app = require('../app'); // Import the main application (adjust the path if necessary).

let server; // Placeholder for the server instance.

describe('Posts API', () => {
  let createdPostId; // Placeholder for storing the ID of a created post.

  // Runs before all tests in this suite
  beforeAll(async () => {
    // Connect to a local test database for isolation of test data
    await mongoose.connect('mongodb://localhost:27017/testDB', {
      useNewUrlParser: true, // Use the newer URL parser to avoid warnings.
      useUnifiedTopology: true, // Enables the new MongoDB driver connection engine.
    });

    // Start a mock server for testing, on a separate port to avoid conflicts
    server = app.listen(4000); // Mock server running on port 4000.
  });

  // Runs after all tests in this suite
  afterAll(async () => {
    // Drop the test database to clean up after tests
    await mongoose.connection.dropDatabase();

    // Close the database connection
    await mongoose.connection.close();

    // Stop the mock server
    if (server) {
      server.close();
    }
  });

  // Test case: Create a new post
  it('should create a new post', async () => {
    const postData = {
      title: 'Test Post', // Title of the post.
      content: 'This is a test post content.', // Content of the post.
      user: '67548cc9b6441e36c38d19bf', // Example user ID (replace with a valid one if necessary).
      topic: 'tech', // The topic category for the post.
      expiresAt: '2024-12-31T23:59:59.000Z', // Expiration date for the post.
    };

    // Send a POST request to create a new post
    const response = await request(app).post('/posts/create').send(postData);

    // Check if the response is successful
    expect(response.status).toBe(201); // Expect HTTP status 201 (Created).
    expect(response.body).toHaveProperty('message', 'Post created successfully!'); // Confirm the success message.
    expect(response.body.post).toHaveProperty('title', 'Test Post'); // Verify the post title.
    expect(response.body.post).toHaveProperty('topic', 'tech'); // Verify the post topic.

    // Save the created post ID for use in later tests
    createdPostId = response.body.post._id;
  });

  // Test case: Fetch live posts by topic
  it('should fetch live posts by topic', async () => {
    // Send a GET request to fetch live posts for the "tech" topic
    const response = await request(app).get('/posts/topic/tech');

    // Check if the response contains live posts for the topic
    expect(response.status).toBe(200); // Expect HTTP status 200 (OK).
    expect(response.body).toHaveProperty('message', 'Live posts for topic: tech'); // Confirm the success message.
    expect(response.body.posts).toBeInstanceOf(Array); // Ensure the response contains an array of posts.
    expect(response.body.posts[0]).toHaveProperty('topic', 'tech'); // Verify the topic of the posts.
  });

  // Test case: Fetch the most active post for a topic
  it('should fetch the most active post for a topic', async () => {
    // Add likes to the created post
    await request(app).post(`/posts/${createdPostId}/like`); // Like the post once.
    await request(app).post(`/posts/${createdPostId}/like`); // Like the post again.

    // Send a GET request to fetch the most active post for the "tech" topic
    const response = await request(app).get('/posts/topic/tech/most-active');

    // Check if the response contains the most active post
    expect(response.status).toBe(200); // Expect HTTP status 200 (OK).
    expect(response.body).toHaveProperty('message', 'Most active post for topic: tech'); // Confirm the success message.
    expect(response.body.post).toHaveProperty('topic', 'tech'); // Verify the topic of the post.
    expect(response.body.post).toHaveProperty('likes', 2); // Confirm the post has two likes.
  });

  // Test case: Fetch expired posts by topic
  it('should fetch expired posts by topic', async () => {
    // Update the created post to mark it as expired
    await mongoose.connection.collection('posts').updateOne(
      { _id: new mongoose.Types.ObjectId(createdPostId) }, // Find the created post by its ID.
      { $set: { status: 'Expired' } } // Update the status to "Expired".
    );

    // Send a GET request to fetch expired posts for the "tech" topic
    const response = await request(app).get('/posts/topic/tech/expired');

    // Check if the response contains expired posts for the topic
    expect(response.status).toBe(200); // Expect HTTP status 200 (OK).
    expect(response.body).toHaveProperty('message', 'Expired posts for topic: tech'); // Confirm the success message.
    expect(response.body.posts).toBeInstanceOf(Array); // Ensure the response contains an array of posts.
    expect(response.body.posts[0]).toHaveProperty('status', 'Expired'); // Verify the status of the posts.
  });
});
