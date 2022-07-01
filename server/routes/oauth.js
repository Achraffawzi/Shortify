const express = require("express");
const router = express.Router();
const passport = require("passport");
const { redirect } = require("../controllers/auth.js");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// we get user profile & email from google
router.get("/google/redirect", passport.authenticate("google"), redirect);

module.exports = router;
