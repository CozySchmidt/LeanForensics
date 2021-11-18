const pool = require("../config/db");
const express = require('express');
const router = express.Router();


/* Retrieve all Kit Types from the db */
router.get("/kitTypes", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query("SELECT * FROM KitType",
            (err, result) => {
            connection.release();
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Invalid request!",
                });
            } else {
                console.log("Kit Types: ", result);
                res.status(200).send({
                    success: true,
                    body: result,
                });
            }
        })
    });
});


/* Retrieve all Screening Methods from the db */
router.get("/screeningMethods", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query("SELECT * FROM ScreeningMethod",
            (err, result) => {
            connection.release();
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Invalid request!",
                });
            } else {
                console.log("Screening Methods: ", result);
                res.status(200).send({
                    success: true,
                    body: result,
                });
            }
        })
    });
});


/* Retrieve all Extraction Methods from the db */
router.get("/extractionMethods", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query("SELECT * FROM ExtractionMethod",
            (err, result) => {
            connection.release();
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Invalid request!",
                });
            } else {
                console.log("Extraction Methods: ", result);
                res.status(200).send({
                    success: true,
                    body: result,
                });
            }
        })
    });
});


module.exports = router;