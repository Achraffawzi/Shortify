const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const ApiError = require("../classes/ApiError");
const User = require("../models/users.js");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth/google/redirect",
      // prompt: "consent",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("entered callback func : ", profile);
      try {
        let user = await User.findOne({
          // googleId: profile.id,
          email: profile.emails[0].value,
        });
        if (!user) {
          user = new User({
            googleID: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            links: [],
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        console.log(error);
      }
    }
  )
);
