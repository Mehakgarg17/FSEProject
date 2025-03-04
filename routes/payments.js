const connection = require("../connection");
const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const payments = express.Router();

// Get all payments
payments.get("/", (req, res) => {
    connection.query("SELECT * FROM Payments", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get payment by ID
payments.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Payments WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});
// Add a new payment
payments.post("/", (req, res) => {
    let body = req.body;

    if (!body.order_id || !body.amount || !body.payment_method || !body.status) {
        return res.status(400).json({ "msg": "Mandatory field is missing" });
    }

    const query = `
        INSERT INTO Payments (order_id, amount, payment_method, status, transaction_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, 
        [body.order_id, body.amount, body.payment_method, body.status, body.transaction_id || null], 
        (error, result) => {
            if (error) {
                return res.status(400).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Payment added successfully" });
            }
        }
    );
});

// Update payment (full update)
payments.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.order_id || !body.amount || !body.payment_method || !body.status) {
        return res.status(400).json({ "msg": "Mandatory field is missing" });
    }

    const query = `
        UPDATE Payments SET 
            order_id = ?, 
            amount = ?, 
            payment_method = ?, 
            status = ?, 
            transaction_id = ? 
        WHERE id = ?
    `;

    connection.query(query, 
        [body.order_id, body.amount, body.payment_method, body.status, body.transaction_id || null, id], 
        (error, result) => {
            if (error) {
                return res.status(400).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Payment updated successfully" });
            }
        }
    );
});

// Delete payment
payments.delete("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`DELETE FROM Payments WHERE id = ?`, [id], (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Payment deleted successfully" });
        }
    });
});

module.exports = payments;
