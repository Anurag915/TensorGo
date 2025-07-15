const express = require("express");
const passport = require("passport");

const router = express.Router();

// Google Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Get current user
router.get("/current-user", (req, res) => {
  console.log("User from session:", req.user); // Debug
  res.send(req.user || null);
});


module.exports = router;
