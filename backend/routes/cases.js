const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Get a case with caseId */
router.get("/:caseId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let caseId = req.params.caseId;
    connection.query(
      `SELECT * FROM CaseTable WHERE CaseId = "${caseId}"`,
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
                                    s.ScreeningId, s.ExtractionId
                              FROM Sample s
                              INNER JOIN CaseTable c
                              ON s.CaseId = c.CaseId
                              WHERE s.CaseId = "${caseId}"`,
            (err, result) => {
              let formatResult = { ...caseResult[0], samples: result };
              res.status(200).send({
                success: true,
                body: formatResult,
              });
              console.log(formatResult);
            }
          );
        } else {
          res.status(404).send({
            success: false,
            message: `Case ${caseId} not found!`,
          });
        }
      }
    );
  });
});
/* Create a Case with Samples */
router.post("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        // not connected!
        return connection.rollback(function () {
          throw error;
        });
      }
      let caseObj = req.body.case;
      let sql = `
        INSERT INTO CaseTable 
        SET ?
      `;
      connection.query(sql, caseObj, (err, caseResult) => {
        connection.release();
        console.log(caseResult);
        if (err) {
          return connection.rollback(function () {
            throw err;
          });
        } else if (caseResult.affectedRows > 0) {
          let sampleList = req.body.sampleList;
          let response = [];
          Promise.all(
            sampleList.map((sample) => {
              let promise = new Promise(function (resolve, reject) {
                sample["CaseId"] = caseResult.insertId;
								sample["SampleName"] = `BCIT-${new Date().getFullYear()}-${caseResult.insertId}-${sample['SampleId']}`
								console.log(sample)
                let sampleSql = `
									INSERT INTO Sample 
									SET ?
								`;
                connection.query(sampleSql, sample, (err, result) => {
                  if (err) {
                    return connection.rollback(function () {
											reject();
                      throw err;
                    });
                  } else if (result.affectedRows > 0) {
                    resolve(result);
                  }
                });
              });
              return promise.then(function (result) {
                console.log(result);
                response.push(result);
              });
            })
          ).then(function () {
            connection.commit(function (err) {
              if (err) {
                return connection.rollback(function () {
                  throw err;
                });
              }
              res.status(200).send({
                success: true,
              });
            });
          });
        }
      });
    });
  });
});

/* Delete a case */
router.delete("/:caseId", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected
    let caseId = req.params.caseId;
    connection.query(
      `DELETE FROM CaseTable WHERE CaseId = "${caseId}"`,
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
            message: `Case ${caseId} not found!`,
          });
        } else {
          console.log(`Case ${caseId} deleted!`);
          res.status(200).send({
            success: true,
            message: `Case ${caseId} deleted!`,
          });
        }
      }
    );
  });
});

module.exports = router;
