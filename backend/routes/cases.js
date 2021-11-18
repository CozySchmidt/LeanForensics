const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Update samples in a case */
router.put("/:caseId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        return connection.rollback(function () {
          throw err;
        });
      } // not connected
      let caseId = req.params.caseId;
      let deleteSampleList = req.body.deleteSampleList;
      let newSampleList = req.body.newSampleList;
      // Create Batch part
      let caseObj = {
        Comment: req.body.Comment,
      };
      let udpateCaseSql = `
      UPDATE CaseTable 
      SET ?
      WHERE CaseId = ${caseId}
      `;
      connection.query(udpateCaseSql, caseObj, (err, caseResult) => {
        if (err) {
          return connection.rollback(function () {
            throw err;
          });
        } else if (caseResult.affectedRows > 0) {
          let response = [];
          Promise.all(
            deleteSampleList.map(async (sample) => {
              let promise = new Promise(function (resolve, reject) {
                let deleteSql = `
                  DELETE FROM Sample 
                  WHERE CaseId=${sample.CaseId}
                    AND SampleId="${sample.SampleId}"
                `;
                connection.query(deleteSql, (err, result) => {
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
              const result_1 = await promise;
              response.push(result_1);
            })
          ).then(function () {
            let response = [];
            // Removing sample in batchsample table
            Promise.all(
              newSampleList.map(async (sample) => {
                let newSample = {
                  SampleId: sample.SampleId,
                  CaseId: req.params.caseId,
                  SampleName: `BCIT-${new Date().getFullYear()}-${
                    sample.SampleId
                  }-${sample["SampleId"]}`,
                  OnHold: sample.OnHold,
                  KitId: sample.KitId,
                  ScreeningId: sample.ScreeningId
                };
                let promise = new Promise(function (resolve, reject) {
                  let newSampleSql = `
                  INSERT INTO Sample
                  SET ?
                  ;
                `;
                  connection.query(newSampleSql, newSample, (err, result) => {
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
                const result_3 = await promise;
                response.push(result_3);
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
          });
        } else {
          return connection.rollback(function () {
            throw err;
          });
        }
      });
    });
  });
});

/* Get all cases */
router.get("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql = `SELECT * FROM CaseTable`;
    connection.query(sql, (err, caseResult) => {
      connection.release();
      console.log(caseResult);
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (caseResult.length > 0) {
        res.status(200).send({
          success: true,
          body: caseResult,
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Cases not found!`,
        });
      }
    });
  });
});

/* Get a case with caseId */
router.get("/:caseId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let caseId = req.params.caseId;
    let sql = `SELECT * FROM CaseTable WHERE CaseId = ${caseId}`;
    connection.query(sql, (err, caseResult) => {
      console.log(caseResult);
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (caseResult.length > 0) {
        let sampleSql = `SELECT s.SampleId, s.SampleName, s.OnHold, c.CaseId, c.Comment, s.KitId, k.KitName, s.ScreeningId, m.ScreeningName
            FROM Sample s
            INNER JOIN CaseTable c
              ON s.CaseId = c.CaseId
            LEFT JOIN KitType k
              on k.KitId = s.KitId
            LEFT JOIN ScreeningMethod m
              on s.ScreeningId = m.ScreeningId
            WHERE s.CaseId = ${caseId}
            ORDER BY s.SampleId ASC
            `;
        connection.query(sampleSql, (err, result) => {
          let formatResult = { ...caseResult[0], Samples: result };
          connection.release();
          res.status(200).send({
            success: true,
            body: formatResult,
          });
          console.log(formatResult);
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Case ${caseId} not found!`,
        });
      }
    });
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

      // Validate request
      if (!caseObj) {
        res.status(400).send({
          success: false,
          message: "Fields cannot be blank!",
        });
      }

      connection.query(sql, caseObj, (err, caseResult) => {
        connection.release();
        console.log(caseResult);
        if (err) {
          return connection.rollback(function () {
            throw err;
          });
        } else if (caseResult.affectedRows > 0) {
          let sampleList = req.body.samples;
          let responses = [];
          Promise.all(
            sampleList.map((sample) => {
              let promise = new Promise(function (resolve, reject) {
                sample["CaseId"] = caseResult.insertId;
                sample["SampleName"] = `BCIT-${new Date().getFullYear()}-${
                  caseResult.insertId
                }-${sample["SampleId"]}`;
                console.log(sample);
                let sampleSql = `INSERT INTO Sample 
                               SET ?`;
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
                responses.push(result);
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
                message: "Case successfully created",
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
    let sql = `DELETE FROM CaseTable WHERE CaseId = ${caseId}`;
    connection.query(sql, (err) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
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
    });
  });
});

module.exports = router;
