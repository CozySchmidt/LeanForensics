const pool = require("../config/db");
const express = require('express');
const router = express.Router();


/* Get a case with caseId */
router.get("/:caseId/samples", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        let caseId = req.params.caseId;
        connection.query(
            `SELECT * FROM CaseTable WHERE CaseId = "${ caseId }"`,
            (err, caseResult) => {
                connection.release();
                console.log(caseResult);
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send({
                        success: false,
                        message: err.message || "Error: Cannot get case",
                    });
                } else if (caseResult.length) {
                    connection.query(
                        `SELECT s.SampleId, s.KitId, s.OnHold, s.KitId,
                                    s.MethodId, s.ExtractionId
                              FROM Sample s
                              INNER JOIN CaseTable c
                              ON s.CaseId = c.CaseId
                              WHERE s.CaseId = "${ caseId }"`,
                        (err, result) => {
                            let formatResult = { ...caseResult[0], samples: result };
                            res.status(200).send({
                                success: true,
                                body: formatResult,
                            });
                            console.log(formatResult);
                        });
                } else {
                    res.status(404).send({
                        success: false,
                        message: `Case ${ caseId } not found!`,
                    });
                }
            }
        );
    });
});


/* Delete a case */
router.delete("/:caseId", (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected
        let caseId = req.params.caseId;
        connection.query(
            `DELETE FROM CaseTable WHERE CaseId = "${ caseId }"`,
            (err, result) => {
                connection.release();
                if (err) {
                    console.log("error: ", err);
                    res.status(500).send({
                        success: false,
                        message: err.message || "Error: Cannot delete case",
                    });
                } else if (res.affectedRows === 0) {
                    res.status(404).send({
                        success: false,
                        message: `Case ${ caseId } not found!`,
                    });
                } else {
                    console.log(`Case ${ caseId } deleted!`);
                    res.status(200).send({
                        success:true,
                        message: `Case ${ caseId } deleted!`,

                    });
                }
            }
        );
    });
});


module.exports = router;