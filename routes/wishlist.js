const connection = require("../connection"); 
const express = require('express');
const wishlists = express.Router();

// Get all wishlists
wishlists.get("/", (req, res) => {
    connection.query("SELECT * FROM Wishlists", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get a wishlist by ID
wishlists.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Wishlists WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});
// Create a new wishlist entry (POST)
wishlists.post("/", (req, res) => {
    let body = req.body;

    if (!body.user_id || !body.product_id) {
        return res.status(404).json({ "msg": "Mandatory fields are missing" });
    }

    connection.query(`INSERT INTO Wishlists (user_id, product_id) 
        VALUES ('${body.user_id}', '${body.product_id}')`, 
        (error, result) => {
            if (error) {
                return res.status(404).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Wishlist entry added successfully" });
            }
        }
    );
});

// Update a wishlist entry (PUT - Full Update)
wishlists.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.user_id || !body.product_id) {
        return res.status(404).json({ "msg": "Mandatory fields are missing" });
    }

    connection.query(`UPDATE Wishlists SET 
        user_id = '${body.user_id}', 
        product_id = '${body.product_id}' 
        WHERE id = ${id}`, 
        (error, result) => {
            if (error) {
                return res.status(400).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Wishlist updated successfully" });
            }
        }
    );
});

// Partial update (PATCH)
wishlists.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.user_id || !body.product_id) {
        return res.status(404).json({ "msg": "Mandatory fields are missing" });
    }

    connection.query(
        `UPDATE Wishlists SET 
        user_id = '${body.user_id}', 
        product_id = '${body.product_id}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(400).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Wishlist record updated successfully" });
            }
        }
    );
});

// Delete a wishlist entry (DELETE)
wishlists.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Wishlists WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Wishlist deleted successfully" });
        }
    });
});

module.exports = wishlists;
