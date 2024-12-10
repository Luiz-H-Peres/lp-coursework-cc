// Importing the Passport library for authentication
const passport = require('passport');
// Importing the Google OAuth 2.0 strategy for Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Importing the User model to interact with the database
const User = require('../models/User'); // Ensure the file path matches your project structure

// Serialise the user to store their ID in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Save the user's ID in the session
});

// Deserialise the user by retrieving their details from the database using their ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Fetch the user from the database
    done(null, user); // Pass the user object to the request
  } catch (err) {
    done(err, null); // Handle errors during deserialisation
  }
});

// Configuring the Google OAuth strategy for Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID stored in the .env file
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret stored in the .env file
      callbackURL: '/auth/google/callback', // URL to redirect after Google login; must match Google Cloud Console settings
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with the Google ID already exists in the database
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // If the user already exists, return the existing user
          return done(null, existingUser);
        }

        // If the user does not exist, create a new user
        const newUser = new User({
          googleId: profile.id, // Store the Google ID
          name: profile.displayName, // Use the name provided in the Google profile
          email: profile.emails && profile.emails[0].value, // Use the first email, if available
        });

        await newUser.save(); // Save the new user to the database
        done(null, newUser); // Return the newly created user
      } catch (err) {
        done(err, null); // Handle errors during user creation
      }
    }
  )
);

// Exporting the configured Passport instance to use it in the application
module.exports = passport;
