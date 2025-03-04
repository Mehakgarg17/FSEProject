const connection = require("../connection"); 
const express = require('express');
const giftCard = express.Router();

// Get all gift cards
giftCard.get("/", (req, res) => {
    connection.query("SELECT * FROM Gift_Cards", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});
giftCard.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Gift_Cards WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

// Create a new gift card (POST)
giftCard.post("/", (req, res) => {
    let body = req.body;

    // Validate mandatory fields
    if (!body.code || !body.amount || !body.user_id) {
        return res.status(400).json({ "msg": "Mandatory field is missing" });
    }

    // Insert query
    connection.query(`INSERT INTO Gift_Cards 
        (code, amount, expiry_date, user_id) 
        VALUES (
        '${body.code}',
        '${body.amount}',
        ${body.expiry_date ? `'${body.expiry_date}'` : "NULL"},
        '${body.user_id}'
        )`, (error, result) => {
        if (error) {
            return res.status(500).json({ "msg": error });
        } else {
            return res.status(201).json({ "msg": "Gift card inserted successfully" });
        }
    });
});

// Update a gift card (PUT - Full Update)
giftCard.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    // Validate mandatory fields
    if (!body.code || !body.amount || !body.user_id) {
        return res.status(400).json({ "msg": "Mandatory field is missing" });
    }

    // Update query
    connection.query(`UPDATE Gift_Cards SET 
        code = '${body.code}', 
        amount = '${body.amount}', 
        expiry_date = ${body.expiry_date ? `'${body.expiry_date}'` : "NULL"},
        user_id = '${body.user_id}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(500).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Gift card updated successfully" });
        }
    });
});


// Partial update (PATCH)
giftCard.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Gift_Cards SET  amount='${body.amount}', expiry_date='${body.expiry_date}'
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ msg: error });
            } else {
                return res.status(200).json({ msg: "Gift card updated successfully" });
            }
        }
    );
});

// Delete a gift card (DELETE)
giftCard.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Gift_Cards WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Gift card deleted successfully" });
        }
    });
});

module.exports = giftCard;
