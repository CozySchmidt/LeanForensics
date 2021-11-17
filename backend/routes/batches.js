const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Update samples in a batch */
router.put("/:batchId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        // not connected!
        return connection.rollback(function () {
          throw error;
        });
      }

      let deleteSampleList = req.body.deleteSampleList;
      let newSampleList = req.body.newSampleList;
      let batchObj = req.body.batch;
      let batchId = req.params.batchId;
      let sql = `
      UPDATE Batch
      SET ? 
      WHERE BatchId = ${batchId}
      `;
      connection.query(sql, batchObj, (err, batchResult) => {
        connection.release();
        // console.log(batchResult);
        if (err) {
          return connection.rollback(function () {
            throw err;
          });
        } else if (batchResult.affectedRows > 0) {
          let response = [];
          Promise.all(
            newSampleList.map(async (sample) => {
              let promise = new Promise(function (resolve, reject) {
                sample["BatchId"] = batchId;
                let sampleSql = `
                INSERT INTO BatchSample 
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
              const result_1 = await promise;
              // console.log(result_1);
              response.push(result_1);
            })
          ).then(function () {
            let response = [];
            // Removing sample in batchsample table
            Promise.all(
              deleteSampleList.map(async (sample) => {
                let promise = new Promise(function (resolve, reject) {
                  let caseId = sample.CaseId;
                  let sampleId = sample.SampleId;
                  let sampleSql = `
                  DELETE FROM BatchSample
                  WHERE CaseId = ${caseId} 
                    AND BatchId = ${batchId} 
                    AND SampleId = ${sampleId} 
                  ;
                `;
                  connection.query(sampleSql, (err, result) => {
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
                // console.log(result_3);
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

/* Create and save a new Batch */
router.post("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        return connection.rollback(() => {
          throw err;
        });
      }

      let batch = req.body.batch;
      let sql = `INSERT INTO Batch SET ?`;

      // Validate request
      if (!batch) {
        res.status(400).send({
          success: false,
          message: "Fields cannot be blank!",
        });
      }

      connection.query(sql, batch,(err, batchResult) => {
        connection.release();
        // console.log(batchResult);
        if (err) {
          return connection.rollback(() => {
            throw err;
          });
        } else if (batchResult.affectedRows > 0) {
          let sampleList = req.body.samples;
          let results = [];
          Promise.all(sampleList.map((sample) => {
            let promise = new Promise((resolve, reject) => {
              sample["BatchId"] = batchResult.insertId;

              let sampleSql = `INSERT INTO BatchSample SET ?`;
              connection.query(sampleSql, sample, (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    reject();
                    throw err;
                  });
                } else if (result.affectedRows > 0) {
                  resolve(result);
                }
              });
            });
            return promise.then((result) => {
              // console.log(result);
              results.push(result);
            });
          })).then(() => {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }
              res.status(200).send({
                success: true,
                message: "Batch successfully created",
              });
            });
          });
        }
      });
    });
  });
});

/* Retrieve all Batches from the db */
router.get("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql = `SELECT * FROM Batch`;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (result.length > 0) {
        console.log("Batches: ", result);
        res.status(200).send({
          success: true,
          body: result,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "No batch found!",
        });
      }
    });
  });
});

/* Get a Batch with batchId */
router.get("/:batchId", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let batchId = req.params.batchId;
    let sql = `SELECT * FROM Batch WHERE BatchId = ${batchId}`;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (result.length) {
        console.log("Batch: ", result[0]);
        res.status(200).send({
          success: true,
          body: result[0],
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Batch ${batchId} not found!`,
        });
      }
    });
  });
});

/* Get a Batch with samples */
router.get("/:batchId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let batchId = req.params.batchId;
    let sql = `SELECT * 
               FROM Batch b
               LEFT JOIN ExtractionMethod e
               ON b.ExtractionId = e.ExtractionId
               WHERE BatchId = ${batchId}
               `;
    connection.query(sql, (err, batchResult) => {
      connection.release();
      // console.log(batchResult);
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (batchResult.length > 0) {
        let sampleSql =
            `SELECT b.SampleId, s.SampleName, b.BatchId, 
              s.OnHold, s.ScreeningId, m.ScreeningName, 
              s.KitId, k.KitName, s.CaseId
            FROM BatchSample b
            INNER JOIN Sample s
              ON b.SampleId = s.SampleId
              AND b.CaseId = s.CaseId
            left join KitType k
              on k.KitId = s.KitId
            left join ScreeningMethod m
              on s.ScreeningId = m.ScreeningId
            left join CaseTable c
              on s.CaseId = c.CaseId
            WHERE BatchId = ${batchId}
            ORDER BY s.SampleId ASC
            `;
        connection.query(sampleSql, (err, result) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: "Invalid request!",
            });
          } else if (result.length > 0) {
            let formatResult = { ...batchResult[0], Samples: result };
            res.status(200).send({
              success: true,
              body: formatResult,
            });
            console.log(formatResult);
          } else {
            res.status(404).send({
              success: false,
              message: `Samples not found!`,
            });
          }
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Batch ${batchId} not found!`,
        });
      }
    });
  });
});

/* Delete a Batch */
router.delete("/:batchId", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected
    let batchId = req.params.batchId;
    let sql = `DELETE FROM Batch WHERE BatchId = ${batchId}`;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (res.affectedRows === 0) {
        res.status(404).send({
          success: false,
          message: `Batch ${batchId} not found!`,
        });
      } else {
        console.log(`Batch ${batchId} deleted!`);
        res.status(200).send({
          success: true,
          message: `Batch ${batchId} deleted!`,
          body: result,
        });
      }
    });
  });
});

/* Delete a BatchSample Data */
router.delete("/:batchId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    connection.beginTransaction(function (err) {
      if (err) {
        return connection.rollback(function () {
          throw err;
        });
      } // not connected
      let batchId = req.params.batchId;
      let deleteSampleList = req.body.deleteSampleList;
      let newSampleList = req.body.newSampleList;
      // Create Batch part
      let batchObj = {
        BatchName: req.body.BatchName,
      };
      let createBatchSql = `
      INSERT INTO Batch SET ?
      `;
      connection.query(createBatchSql, batchObj, (err, postResult) => {
        if (err) {
          return connection.rollback(function () {
            throw err;
          });
        } else if (postResult.affectedRows > 0) {
          let response = [];
          Promise.all(
            newSampleList.map(async (sample) => {
              let promise = new Promise(function (resolve, reject) {
                sample["BatchId"] = postResult.insertId;
                let sampleSql = `
                INSERT INTO BatchSample 
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
              const result_1 = await promise;
              console.log(result_1);
              response.push(result_1);
            })
          ).then(function () {
            let response = [];
            // Removing sample in batchsample table
            Promise.all(
              deleteSampleList.map(async (sample) => {
                let promise = new Promise(function (resolve, reject) {
                  console.log(sample);
                  let caseId = sample.CaseId;
                  let sampleId = sample.SampleId;
                  let sampleSql = `
                  UPDATE BatchSample
                  SET BatchId = ${postResult.insertId} 
                  WHERE CaseId = ${caseId} 
                    AND SampleId = ${sampleId} 
                  ;
                `;
                  connection.query(sampleSql, (err, result) => {
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

/* Update a Batch's status */
router.patch("/:batchId/stages/:stageId", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected
    let batchId = req.params.batchId;
    let stageId = req.params.stageId;
    let sql = `
      UPDATE Batch
      SET StageId = ${stageId}
      WHERE BatchId = ${batchId};
    `;
    connection.query(sql, (err, result) => {
      connection.release();
      if (err) {
        console.log("error: ", err);
        res.status(500).send({
          success: false,
          message: err.message,
        });
      } else if (result.affectedRows > 0) {
        console.log(`Batch ${batchId} updated!`);
        res.status(200).send({
          success: true,
          message: `Batch ${batchId} updated!`,
          body: result,
        });
      } else {
        res.status(404).send({
          success: false,
          message: `Batch ${batchId} not found!`,
        });
      }
    });
  });
});

module.exports = router;
