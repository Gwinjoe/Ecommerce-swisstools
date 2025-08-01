const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");
const { doHash, doHashValidation } = require("../utils/hashing");
const { signin } = require("../controllers/authController.js");

const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const strategy = new LocalStrategy(customFields, signin);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id)
});
passport.deserializeUser((userId, done) => {
  User.findById(userId).then((user) => {
    done(null, user)
  }).catch(err => done(err));
})
