const express = require("express");
const router = express.Router();
const { getProducts, add_category, get_categories, edit_category, get_category_by_id, delete_category, add_product } = require("../../controllers/productController")
const passport = require("passport");
const { signup, signout, adminSignout } = require("../../controllers/authController")
const { get_users, get_user_by_id, edit_user, delete_user, user_count, add_user } = require("../../controllers/userController")

router.post("/login", passport.authenticate("local", { successRedirect: "/dashboard", failureRedirect: "/login" }));
router.post("/signin", passport.authenticate("local", { successRedirect: "/admin", failureRedirect: "/admin/login" }));
router.post("/signup", signup);
router.get("/logout", signout);
router.get("/signout", adminSignout);

router.get("/products", getProducts);
router.post("/add_product", add_product);

router.post("/add_category", add_category);
router.get("/categories", get_categories);
router.get("/categories/:id", get_category_by_id);
router.put("/edit_category", edit_category);
router.delete("/delete_category/:id", delete_category);

router.get("/users", get_users);
router.post("/add_user", add_user);
router.get("/user/:id", get_user_by_id);
router.put("/edit_user", edit_user);
router.delete("/delete_user/:id", delete_user);

router.get("/usercount", user_count);
module.exports = router;
