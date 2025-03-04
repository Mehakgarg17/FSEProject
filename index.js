const connection = require("./connection");
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());

const usersRoutes = require("./routes/users"); // Adjust the path as needed
const categoryRoutes = require("./routes/categories");
const productRoutes= require("./routes/products");
const discountRoutes=require("./routes/discounts");
const ordersRoutes = require("./routes/orders"); 
const orderItemsRoutes = require("./routes/order_items"); 
const deliveriesRoutes = require("./routes/deliveries");
const reviewsRoutes= require("./routes/reviews");
const wishlistRoutes=require("./routes/wishlist");
const subscriptionRoutes=require("./routes/subscriptions");
const giftCardsRoutes=require("./routes/gift_cards");
const referralRoutes=require("./routes/referrals");
const paymentsRoutes=require("./routes/payments");

app.use("/api/users", usersRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/discounts",discountRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/order-items", orderItemsRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/reviews",reviewsRoutes);
app.use("/api/wishlists",wishlistRoutes);
app.use("/api/subscriptions",subscriptionRoutes);
app.use("/api/gift_cards",giftCardsRoutes);
app.use("/api/referrals",referralRoutes);
app.use("/api/payments",paymentsRoutes);
// Start Server
app.listen(3020, () => {
    console.log('Server running on port 3020');
});