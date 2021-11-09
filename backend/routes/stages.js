const pool = require("../config/db");
const express = require('express');
const router = express.Router();


/* Retrieve all stages from the db */
router.get("/", async (req, res) => {
    await pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query(
            "SELECT * FROM Stage",
            (err, stageResult) => {
                connection.release();
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send({
                        success: false,
                        message: err.message || "Error: Cannot get stages",
                    });
                } else if (stageResult.length) {
                    console.log("Stages: ", Object.values(JSON.parse(JSON.stringify(stageResult))));
                    let stages = Object.values(JSON.parse(JSON.stringify(stageResult)));
                    stages.forEach(stage => {
                       let stageId = stage.StageId;
                       connection.query(
                           `SELECT * FROM Batch
                                WHERE StageId = ${stageId}`,
                           (err, result) => {
                               if (err) {
                                   console.log(err);
                               } else {
                                   let formatResult = {...stageResult, Batches: result};
                                   res.status(200).send({
                                       success: true,
                                       body: formatResult,
                                   });
                                   console.log(formatResult);
                               }

                           });
                    });
                } else {
                    res.status(404).send({
                        success: false,
                        message: err.message || "Stages not found!",
                    })
                }
            });

    });
});


module.exports = router;