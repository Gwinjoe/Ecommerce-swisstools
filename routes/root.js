const express = require("express");
const router = express.Router();
const path = require("path");
const { isLoggedIn, isAuth } = require("../middlewares/identifier")
const { makeActive } = require("../controllers/authController")

// root routes

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "root.html"));
});

router.get("/login", isAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "register.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "about.html"));
});

router.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "contact.html"));
});

router.get("/authorise", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "authentication.html"));
});

router.get("/faq", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "faq.html"));
})


router.get("/product", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "product.html"));
});

router.get("/shop", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "shop.html"));
});

router.get("/chat", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "chat.html"));
});
router.get("/cart", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "cart.html"));
});
//user routes
router.get("/dashboard", [isLoggedIn, makeActive], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "users", "dashboard.html"))
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "users", "logout.html"))
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "users", "profile.html"))
});

router.get("/orders", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "users", "orders.html"))
});

router.get("/wishlist", isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "users", "wishlist.html"))
});





// on hold for routes for checkout

module.exports = router;
