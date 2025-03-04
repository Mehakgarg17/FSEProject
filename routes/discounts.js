const connection = require("../connection"); 
const express = require("express");

const discounts = express.Router();

// Get all discounts
discounts.get("/", (req, res) => {
    connection.query("SELECT * FROM Discounts", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

//  Get a discount by ID
discounts.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Discounts WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

//  Add new discount (POST)
discounts.post("/", (req, res) => {
    let body = req.body;

    // Validate mandatory fields
    if (!body.code || body.discount_percentage === undefined) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    // Insert query
    connection.query(`INSERT INTO Discounts 
        (code, discount_percentage, expiry_date, is_active) 
        VALUES (
        '${body.code}',
        '${body.discount_percentage}',
        ${body.expiry_date ? `'${body.expiry_date}'` : "NULL"},
        ${body.is_active ? 1 : 0}  
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Discount added successfully" });
        }
    });
});




// Update a discount (PUT)
discounts.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    connection.query(`UPDATE Discounts SET 
        code='${body.code}',
        discount_percentage='${body.discount_percentage}',
        expiry_date=${body.expiry_date ? `'${body.expiry_date}'` : "NULL"},
        is_active=${body.is_active ? 1 : 0}
        WHERE id=${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Discount updated successfully" });
        }
    });
});


//  Update specific fields (PATCH)
discounts.patch("/:id", (req, res) => {
    let id = req.params.id;
    let updates = [];

    for (let key in req.body) {
        updates.push(`${key}='${req.body[key]}'`);
    }

    let query = `UPDATE Discounts SET ${updates.join(", ")} WHERE id=${id}`;
    
    connection.query(query, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Discount updated successfully" });
        }
    });
});

//  Delete a discount (DELETE)
discounts.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Discounts WHERE id=${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Discount deleted successfully" });
        }
    });
});

module.exports = discounts;
