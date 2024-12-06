// 1. Import the libraries 
const express = require('express')
const { restart } = require('nodemon')
const app = express()

const movieRoute = require('./routes/movies')
const userRoute = require('./routes/users')


// 2. Middleware
app.use('/movies', movieRoute)
app.use('/users',userRoute)

// 3. Create a route 
app.get('/', (req,res)=> {
    res.send('You are in your home page!')
})
 
// 4. Start the server 
app.listen(3000, ()=> {
    console.log('Server is up and running...')
})
=======
const express = require('express'); // Web framework for building APIs
const mongoose = require('mongoose'); // Library to interact with MongoDB
const session = require('express-session'); // Middleware to manage sessions
const userRoutes = require('./routes/users'); // Import user-related routes
const authRoutes = require('./routes/auth'); // Import authentication-related routes
const postRoutes = require('./routes/posts'); // Import post-related routes
require('dotenv').config(); // To manage environment variables securely

// Initialize Express application
const app = express();
const port = process.env.PORT || 3000; // Define the port for the server

// Middleware to parse JSON request bodies
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret key from .env
    resave: false,
    saveUninitialized: true,
  })
);

// Define routes
app.use('/users', userRoutes); // User-related routes, e.g., creating users
app.use('/auth', authRoutes); // Authentication routes, e.g., login and Google OAuth
app.use('/posts', postRoutes); // Post-related routes, e.g., create, fetch, update, delete posts

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/piazzaSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB')) // Log success
  .catch((err) => console.error('Could not connect to MongoDB:', err)); // Log errors

// Define a basic GET route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Piazza system!'); // Response to the root URL
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log server URL
});
>>>>>>> dd40aaf (Fix: Removed embedded Git repository and updated .gitignore)
