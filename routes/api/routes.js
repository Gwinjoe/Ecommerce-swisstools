
const express = require("express");
const router = express.Router();
const { delete_multiple_products, editMultipleProducts, get_product_by_id, category_count, product_count, edit_product, delete_product, getProducts, add_category, get_categories, edit_category, get_category_by_id, delete_category, add_product } = require("../../controllers/productController")
const { addTo_cart, addTo_wishlist, deletefrom_cart, deletefrom_wishlist } = require("../../controllers/userController")
const passport = require("passport");
const { signup, signout, adminSignout } = require("../../controllers/authController")
const { get_users, get_user_by_id, edit_user, delete_user, user_count, add_user, get_user } = require("../../controllers/userController")
const path = require("path");
const multer = require('multer');
const { getChatsThread, getAdminChatsThread, getChats } = require("../../controllers/chat/chatController");
const { get_order_by_id, add_order, getOrders, delete_multiple_orders, delete_order, edit_order, editMultipleOrders, order_count } = require("../../controllers/orderController")
const { get_brand_by_id, add_brand, getBrands, delete_brand, edit_brand, brand_count } = require("../../controllers/brandController")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "tmp", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post("/login", passport.authenticate("local", { successRedirect: "/dashboard", failureRedirect: "/login" }));
router.post("/signin", passport.authenticate("local", { successRedirect: "/admin", failureRedirect: "/admin/login" }));
router.post("/signup", signup);
router.get("/logout", signout);
router.get("/signout", adminSignout);

router.get("/products", getProducts);
router.get("/edit_product/:id", get_product_by_id);
router.post('/add_product',
  upload.fields([
    { name: 'mainImage', maxcount: 1 },
    { name: 'thumbnails', maxcount: 6 }
  ]), add_product);
router.delete("/delete_product/:id", delete_product);
router.put("/edit_product", upload.fields([
  { name: 'mainImage', maxcount: 1 },
  { name: 'thumbnails', maxcount: 6 }
]), edit_product);
router.post("/delete_multiple", delete_multiple_products);
router.post("/edit_multiple", editMultipleProducts);

router.post("/add_category", add_category);
router.get("/categories", get_categories);
router.get("/categories/:id", get_category_by_id);
router.put("/edit_category", edit_category);
router.delete("/delete_category/:id", delete_category);

router.get("/user", get_user);
router.get("/users", get_users);
router.post("/add_user", add_user);
router.get("/user/:id", get_user_by_id);
router.put("/edit_user", edit_user);
router.delete("/delete_user/:id", delete_user);
router.post("/add_to_cart", addTo_cart);
router.post("/add_to_wishlist", addTo_wishlist);
router.post("/delete_from_cart", deletefrom_cart);
router.post("/delete_from_wishlist", deletefrom_wishlist);

router.post("/add_order", add_order);
router.get("/orders", getOrders);
router.get("/order/:id", get_order_by_id);
router.put("/edit_order", edit_order);
router.delete("/delete_order/:id", delete_order);
router.post("/delete_multiple", delete_multiple_orders);
router.post("/edit_multiple", editMultipleOrders);

router.post("/add_brand", add_brand);
router.get("/brands", getBrands);
router.get("/brand/:id", get_brand_by_id);
router.put("/edit_brand", edit_brand);
router.delete("/delete_brand/:id", delete_brand);


router.get("/usercount", user_count);
router.get("/productcount", product_count);
router.get("/brandcount", brand_count);
router.get("/categorycount", category_count);
router.get("/ordercount", order_count);

router.get("/chats_thread", getChatsThread);
router.get("/admin_chats_thread", getAdminChatsThread)
router.get("/chats", getChats)
module.exports = router;
