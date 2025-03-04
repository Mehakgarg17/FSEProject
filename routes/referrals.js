const connection = require("../connection");
const express = require("express");
const referral = express.Router();

// Get all referrals
referral.get("/", (req, res) => {
    connection.query("SELECT * FROM Referrals", (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": result });
        }
    });
});

referral.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT * FROM Referrals WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        }
        if (result.length === 0) {
            return res.status(404).json({ "msg": "User not found" });
        }
        return res.status(200).json({ "msg": result });
    });
});

// Create a new referral (POST)
referral.post("/", (req, res) => {
    let body = req.body;

    if (!body.referrer_id ) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`INSERT INTO Referrals 
        (referrer_id, referred_email, reward_amount, status) 
        VALUES (
        '${body.referrer_id}',
        '${body.referred_email}',
        '${body.reward_amount}',
        '${body.status}'
        )`, (error, result) => {
        if (error) {
            return res.status(404).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Referral inserted successfully" });
        }
    });
});

// Update a referral (PUT - Full Update)
referral.put("/:id", (req, res) => {
    let id = req.params.id;
    let body = req.body;

    if (!body.referrer_id ) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(`UPDATE Referrals SET 
        referrer_id = '${body.referrer_id}', 
        referred_email = '${body.referred_email}', 
        reward_amount = '${body.reward_amount}',
        status = '${body.status}'
        WHERE id = ${id}`, (error, result) => {
        if (error) {
            return res.status(400).json({ "msg": error });
        } else {
            return res.status(200).json({ "msg": "Referral updated successfully" });
        }
    });
});

// Partial update (PATCH)
referral.patch("/", (req, res) => {
    let body = req.body;
    let id = body.id;

    if (!body.id) {
        return res.status(404).json({ "msg": "Mandatory field is missing" });
    }

    connection.query(
        `UPDATE Referrals SET 
        reward_amount = '${body.reward_amount}', 
        status = '${body.status}' 
        WHERE id = ${id}`,
        (error, result) => {
            if (error) {
                return res.status(404).json({ "msg": error });
            } else {
                return res.status(200).json({ "msg": "Referral record updated successfully" });
            }
        }
    );
});

// Delete a referral (DELETE)
referral.delete("/:id", (req, res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM Referrals WHERE id = ${id}`, (error, result) => {
        if (error) {
            res.status(400).json({ "msg": error });
        } else {
            res.status(200).json({ "msg": "Referral deleted successfully" });
        }
    });
});

module.exports = referral;
