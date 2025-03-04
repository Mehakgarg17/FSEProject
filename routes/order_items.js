const connection = require("../connection");
const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const orderItems = express.Router();

//  Get all order items
orderItems.get("/", (req, res) => {
    connection.query("SELECT * FROM Order_Items", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

//  Get order item by ID
orderItems.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM orderItems WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});
//  Add new order item (POST)
orderItems.post("/", (req, res) => {
    let body = req.body;

    if (!body.order_id || !body.product_id || body.quantity === undefined || body.subtotal === undefined) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Order_Items 
        (order_id, product_id, quantity, subtotal) 
        VALUES (
        '${body.order_id}',
        '${body.product_id}',
        '${body.quantity}',
        '${body.subtotal}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order item added successfully" });
        }
    });
});

//  Update order item (PUT)
orderItems.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.order_id || !body.product_id || body.quantity === undefined || body.subtotal === undefined) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Order_Items SET 
        order_id = '${body.order_id}', 
        product_id = '${body.product_id}', 
        quantity = '${body.quantity}', 
        subtotal = '${body.subtotal}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order item updated successfully" });
        }
    });
});

orderItems.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.order_id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Order_Items SET 
        order_id = '${body.order_id}', 
        product_id = '${body.product_id}', 
        quantity = '${body.quantity}', 
        subtotal = '${body.subtotal}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ msg: error });
            } else {
                return res.status(200).json({ msg: "Order item updated successfully" });
            }
        }
    );
});


//  Delete order item
orderItems.delete("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`DELETE FROM Order_Items WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Order item deleted successfully" });
        }
    });
});

module.exports = orderItems;