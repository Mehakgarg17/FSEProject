const connection = require("../connection"); 
const express = require('express');

const products = express.Router();

// Get all products
products.get("/", (req, res) => {
    connection.query("SELECT * FROM Products", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get product by ID
products.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Products WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});
// Add new product (POST)
products.post("/", (req, res) => {
    let body = req.body;

    if (!body.name || !body.price || !body.category || body.stock === undefined) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Products 
        (name, description, price, category, stock, image_url, is_featured) 
        VALUES (
        '${body.name}',
        '${body.description || null}',
        '${body.price}',
        '${body.category}',
        '${body.stock}',
        '${body.image_url || null}',
        ${body.is_featured ? 1 : 0}  
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Product added successfully" });
        }
    });
});

// Update entire product (PUT)
products.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.name || !body.price || !body.category || body.stock === undefined) {
        return res.status(400).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Products SET 
        name = '${body.name}',
        description = '${body.description || null}',
        price = '${body.price}',
        category = '${body.category}',
        stock = '${body.stock}',
        image_url = '${body.image_url || null}',
        is_featured = ${body.is_featured ? 1 : 0}
        WHERE id = ${id}`, 
        (error, result) => {
            if (error) {
                return res.status(500).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Product updated successfully" });
            }
        }
    );
});


// Update specific fields in a product (PATCH)
products.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;
    //if (!body.name) 
    if (!id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Products SET 
        name = '${body.name}', 
        description = '${body.description}', 
        price = '${body.price}', 
        stock = '${body.stock}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ msg: error });
            } else {
                return res.status(200).json({ msg: "Product updated successfully" });
            }
        }
    );
});


// Delete product (DELETE)
products.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Products WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Product deleted successfully" });
        }
    });
});

module.exports = products;
