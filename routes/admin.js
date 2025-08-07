const express = require("express");
const router = express.Router();
const path = require("path");
const { isAdmin, isAdminAuth } = require("../middlewares/identifier");
const { makeActive } = require("../controllers/authController");


router.get("/", [isAdmin, makeActive], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "dashboard.html"));
});

router.get("/login", isAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "login.html"));
});


router.get("/signup", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "register.html"));
});

router.get("/logout", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "logout.html"));
});

router.get("/orders", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "orders.html"));
});

router.get("/product", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "product.html"));
});

router.get("/categories", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "categories.html"));
});

router.get("/view_category", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "view_category.html"));
});

router.get("/add_category", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "add_category.html"));
});

router.get("/add_product", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "add_product.html"));
});

router.get("/manage_users", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "manage_users.html"));
});

router.get("/order_details", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "order_details.html"));
});

router.get("/edit_category", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "edit_category.html"));
});

router.get("/edit_product", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "edit_product.html"));
});

router.get("/add_brand", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "add_brand.html"))
})

router.get("/chat", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "chat.html"));
})

router.get("/brands", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "brand.html"));
})

router.get("/add_brand", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "add_brand.html"))
})
router.get("/view_brand", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "view_brand.html"))
})
router.get("/edit_brand", isAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "admin", "edit_brand.html"))
})
module.exports = router;

