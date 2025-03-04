const connection = require("../connection"); 
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const category = express.Router();

// Get all categories
category.get("/", (req, res) => {
    connection.query("SELECT * FROM Categories", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

// Get a category by ID
category.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Category WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

// Create a new category (POST)
category.post("/", (req, res) => {
    let body = req.body;

    if (!body.category_name) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Categories 
        (category_name, description) 
        VALUES (
        '${body.category_name}',
        '${body.description || null}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Category inserted successfully" });
        }
    });
});

// Update a category (PUT - Full Update)
category.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.category_name) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Categories SET 
        category_name = '${body.category_name}', 
        description = '${body.description || null}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Category updated successfully" });
        }
    });
});

// Partial update (PATCH)
category.patch("/", (req, res) => {
    let body=req.body;
    let id= body.id;
    if(!body.category_name){
        return res.status("404").json({"msg":"Mandatory field is missing"});
    }
    connection.query(
        `UPDATE Categories SET category_name = '${body.category_name}',description='${body.description}'
        WHERE id = ${id}`,
        (error,result)=>{
            if(error){
                return res.status("404").json({msg:error});
            }else{
                return res.status("200").json({msg:"Record updated successfully"});
            }
        }
    );
});


// Delete a category (DELETE)
category.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Categories WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Category deleted successfully" });
        }
    });
});

module.exports = category;
