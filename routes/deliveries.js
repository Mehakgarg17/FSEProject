const express = require('express');
const connection = require('../connection');

const deliveries = express.Router();

//  Get all deliveries
deliveries.get("/", (req, res) => {
    connection.query("SELECT * FROM Deliveries", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

deliveries.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Deliveries WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

//  Add new delivery (POST)
deliveries.post("/", (req, res) => {
    let body = req.body;

    if (!body.order_id || !body.delivery_partner || !body.tracking_number || !body.status || !body.delivery_person_id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Deliveries 
        (order_id, delivery_partner, tracking_number, status, delivery_person_id) 
        VALUES (
        '${body.order_id}',
        '${body.delivery_partner}',
        '${body.tracking_number}',
        '${body.status}',
        '${body.delivery_person_id}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Delivery added successfully" });
        }
    });
});

//  Update delivery (PUT)
deliveries.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.order_id || !body.delivery_partner || !body.tracking_number || !body.status || !body.delivery_person_id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Deliveries SET 
        order_id = '${body.order_id}', 
        delivery_partner = '${body.delivery_partner}', 
        tracking_number = '${body.tracking_number}', 
        status = '${body.status}', 
        delivery_person_id = '${body.delivery_person_id}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Delivery updated successfully" });
        }
    });
});

//  Partial update delivery (PATCH)
deliveries.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.status) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Deliveries 
         SET delivery_partner = '${body.delivery_partner}', 
             tracking_number = '${body.tracking_number}', 
             status = '${body.status}', 
             delivery_person_id = '${body.delivery_person_id}'
         WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ msg: error });
            } else {
                return res.status(200).json({ msg: "Delivery record updated successfully" });
            }
        }
    );
});


//  Delete delivery
deliveries.delete("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`DELETE FROM Deliveries WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Delivery deleted successfully" });
        }
    });
});

module.exports = deliveries;
