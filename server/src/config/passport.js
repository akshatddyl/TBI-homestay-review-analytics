const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

/**
 * Configure Passport with Google OAuth 2.0.
 *
 * - Finds existing user by googleId or creates a new one.
 * - Serializes / deserializes by Mongoose _id.
 */
const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Look for an existing user
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create a new user from the Google profile
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              avatar: profile.photos?.[0]?.value || "",
            });
            console.log(`[AUTH] New user created: ${user.email}`);
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialize: store only the Mongoose _id in the session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize: look up the full user document by _id
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

module.exports = configurePassport;
