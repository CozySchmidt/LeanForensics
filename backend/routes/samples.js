const pool = require("../config/db");
const express = require('express');
const router = express.Router();


/* Retrieve all samples from the db */
router.get("/", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        let sql = `
        SELECT s.SampleId, s.MethodId, m.MethodName, s.ExtractionId, 
            e.ExtractionName, s.KitId, k.KitName, s.CaseId, s.OnHold, c.CreatedDate
        FROM Sample s
        left join KitType k
          on k.KitId = s.KitId
        left join ScreeningMethod m
          on s.MethodId = m.MethodId
        left join ExtractionMethod e
          on e.ExtractionId = s.ExtractionId
        left join CaseTable c
          on s.CaseId = c.CaseId
        ORDER BY s.CaseId ASC
        ;
        `
        connection.query(
            sql,
            (err, result) => {
            connection.release();
            if (err) {
                res.status(500).send({
                    success: false,
                    message: "Invalid request!",
                });
            } else if (result.length) {
                console.log("All Samples: ", result);
                res.status(200).send({
                    success: true,
                    body: result,
                });
            } else {
                res.status(404).send({
                    success: false,
                    message: "No samples found!",
                });
            }
        });

    });
});


module.exports = router;