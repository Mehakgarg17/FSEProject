const connection = require("../connection"); 
const express = require('express');
const subscription = express.Router();

// Get all subscriptions
subscription.get("/", (req, res) => {
    connection.query("SELECT * FROM Subscriptions", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get a subscription by ID
subscription.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Subscriptions WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

// Create a new subscription (POST)
subscription.post("/", (req, res) => {
    let body = req.body;

    if (!body.user_id || !body.subscription_type || !body.start_date || !body.end_date || !body.status) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Subscriptions 
        (user_id, subscription_type, start_date, end_date, status) 
        VALUES (
        '${body.user_id}',
        '${body.subscription_type}',
        '${body.start_date}',
        '${body.end_date}',
        '${body.status}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Subscription inserted successfully" });
        }
    });
});

// Update a subscription (PUT - Full Update)
subscription.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.user_id || !body.subscription_type || !body.start_date || !body.end_date || !body.status) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Subscriptions SET 
        user_id = '${body.user_id}', 
        subscription_type = '${body.subscription_type}',
        start_date = '${body.start_date}',
        end_date = '${body.end_date}',
        status = '${body.status}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Subscription updated successfully" });
        }
    });
});

// Partial update (PATCH)
// Partial update (PATCH)
subscription.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.subscription_type) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Subscriptions SET 
        subscription_type = '${body.subscription_type}', 
        start_date = '${body.start_date}', 
        end_date = '${body.end_date}', 
        status = '${body.status}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Record updated successfully" });
            }
        }
    );
});

// Delete a subscription (DELETE)
subscription.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Subscriptions WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Subscription deleted successfully" });
        }
    });
});

module.exports = subscription;
