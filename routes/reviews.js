const connection = require("../connection");
const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const reviews = express.Router();

// Get all reviews
reviews.get("/", (req, res) => {
    connection.query("SELECT * FROM Reviews", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get review by ID
reviews.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Reviews WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

// Add new review (POST)
reviews.post("/", (req, res) => {
    let body = req.body;

    if (!body.user_id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Reviews 
        (user_id, product_id, rating, review_text) 
        VALUES (
        '${body.user_id}', 
        '${body.product_id}', 
        '${body.rating}', 
        '${body.review_text}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Review added successfully" });
        }
    });
});

// Update entire review (PUT)
reviews.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.user_id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Reviews SET 
        user_id = '${body.user_id}', 
        product_id = '${body.product_id}', 
        rating = '${body.rating}', 
        review_text = '${body.review_text}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Review updated successfully" });
        }
    });
});

// Update specific fields in a review (PATCH)
reviews.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.rating) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Reviews SET 
        rating = '${body.rating}', 
        review_text = '${body.review_text}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ msg: error });
            } else {
                return res.status(200).json({ msg: "Review updated successfully" });
            }
        }
    );
});

// Delete review (DELETE)
reviews.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Reviews WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Review deleted successfully" });
        }
    });
});

module.exports = reviews;
