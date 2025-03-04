const connection = require("../connection");
const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const orders = express.Router();

//  Get all orders
orders.get("/", (req, res) => {
    connection.query("SELECT * FROM Orders", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

//  Get order by ID
orders.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Orders WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

//  Create new order (POST)
orders.post("/", (req, res) => {
    let body = req.body;

    if (!body.user_id || !body.total || !body.status || !body.payment_status) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Orders 
        (user_id, total, status, order_date, delivery_date, payment_status, discount_id) 
        VALUES (
        '${body.user_id}',
        '${body.total}',
        '${body.status}',
        '${body.order_date || new Date().toISOString().slice(0, 19).replace('T', ' ')}',
        '${body.delivery_date || null}',
        '${body.payment_status}',
        '${body.discount_id || null}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order created successfully" });
        }
    });
});

//  Update entire order (PUT)
orders.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.user_id || !body.total || !body.status || !body.payment_status) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Orders SET 
        user_id = '${body.user_id}',
        total = '${body.total}',
        status = '${body.status}',
        order_date = '${body.order_date}',
        delivery_date = '${body.delivery_date}',
        payment_status = '${body.payment_status}',
        discount_id = '${body.discount_id}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order updated successfully" });
        }
    });
});

//  Update specific fields (PATCH)
orders.patch("/:id", (req, res) => {
    let id = req.params.id;
    let updates = [];

    Object.keys(req.body).forEach(key => {
        updates.push(`${key} = '${req.body[key]}'`);
    });

    if (updates.length === 0) {
        return res.status(400).json({ "msg": "No fields to update" });
    }

    connection.query(`UPDATE Orders SET ${updates.join(", ")} WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order updated successfully" });
        }
    });
});

//  Delete order (DELETE)
orders.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Orders WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Order deleted successfully" });
        }
    });
});

module.exports = orders;
