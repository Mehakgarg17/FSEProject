const connection = require("../connection");
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');


const user= express.Router();


// Users
user.get("/", (req, res) => {
    connection.query("SELECT * FROM Users", (error, result) => {
        if(error){
            res.status(400).json({"msg":error});
        }else{
            res.status(200).json({"msg":result});
        }
    });
});

user.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Users WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});
user.post("/", (req, res) => {
    let body = req.body;

    // Validate mandatory fields
    if (!body.name || !body.email || !body.password || !body.role) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    // Insert query
    connection.query(`INSERT INTO Users 
        (name, email, password, phone, address, role) 
        VALUES (
        '${body.name}',
        '${body.email}',
        '${body.password}',
        '${body.phone || null}',
        '${body.address || null}',
        '${body.role}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Record inserted successfully" });
        }
    });
});
user.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.name ) {
        return res.status(400).json({ "msg": "All fields are required for PUT update" });
    }

    connection.query(`UPDATE Users SET 
        name = '${body.name}', 
        email = '${body.email}', 
        password = '${body.password}', 
        phone = '${body.phone}', 
        address = '${body.address}', 
        role = '${body.role}' 
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Record fully updated successfully" });
        }
    });
});
user.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.name) {
        return res.status("404").json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Users SET 
        name = '${body.name}', 
        email = '${body.email || null}', 
        password = '${body.password || null}', 
        phone = '${body.phone || null}', 
        address = '${body.address || null}', 
        role = '${body.role || null}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status("404").json({ msg: error });
            } else {
                return res.status("200").json({ msg: "Record updated successfully" });
            }
        }
    );
});


module.exports=user;