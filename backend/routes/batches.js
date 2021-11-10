const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Create and save a new Batch */
router.post("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    // Validate request
    if (!req.body) {
      res.status(400).send({
        success: false,
        message: "Content cannot be empty",
      });
    }

    let batch = req.body;

    // check if result is an array or single object
    // add samples too using transaction: Batch Obj + sample []
    // iterate thru samples in batch make a query
    if (batch.hasOwnProperty("Samples")) {
      connection.beginTransaction(function (err) {
        if (err) throw err;
        connection.query();
      });
    } else {
      connection.query("INSERT INTO Batch SET ?", batch, (err, result) => {
        connection.release();
        if (err) {
          res.status(500).send({
            success: false,
            message: err.message,
          });
        } else {
          console.log("Batch recorded: ", { id: result.insertId, ...batch });
          console.log(Array.isArray(result));
          res.status(200).send({
            success: true,
            body: { id: result.insertId, ...batch },
          });
        }
      });
    }
  });
});

/* Retrieve all Batches from the db */
router.get("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM Batch", (err, result) => {
      connection.release();
      if (err) {
        console.log("error: ", err);
        res.status(500).send({
          success: false,
          message: err.message,
        });
      } else if (result.length > 0) {
        // console.log("Batches: ", result);
        res.status(200).send({
          success: true,
          body: result,
        });
      } else {
        res.status(404).send({
          success: false,
          message: err.message || "No batch found!",
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
    connection.query(
      `SELECT * FROM Batch WHERE BatchId = ${batchId}`,
      (err, result) => {
        connection.release();
        if (err) {
          console.log("error: ", err);
          res.status(500).send({
            success: false,
            message: err.message,
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
      }
    );
  });
});

/* Get a Batch with batchId */
router.get("/:batchId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let batchId = req.params.batchId;
    connection.query(
      `
      SELECT * 
      FROM Batch b
      left join ExtractionMethod e
        on b.ExtractionId = e.ExtractionId
      WHERE BatchId = ${batchId}`,
      (err, batchResult) => {
        connection.release();
        console.log(batchResult);
        if (err) {
          console.log("error: ", err);
          res.status(500).send({
            success: false,
            message: err.message,
          });
        } else if (batchResult.length > 0) {
          connection.query(
            `
            SELECT b.SampleId, s.SampleName, b.BatchId, s.OnHold, s.ScreeningId, m.ScreeningName, 
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
            `,
            (err, result) => {
              if (err) {
                console.log("error: ", err);
                res.status(500).send({
                  success: false,
                  message: err.message,
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
            }
          );
        } else {
          res.status(404).send({
            success: false,
            message: `Batch ${batchId} not found!`,
          });
        }
      }
    );
  });
});

/* Update a Batch */
router.put("/:batchId/samples", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    let batchId = req.params.batchId;
    let batch = req.body;
    connection.query(
      `UPDATE Batch SET ? WHERE BatchId = ${batchId}`,
      batch,
      (err, result) => {
        connection.release();
        if (err) {
          res.status(500).send({
            success: false,
            message: err.message,
          });
        } else {
          console.log("Batch updated: ", { id: result.insertId, ...batch });
          res.status(200).send({
            success: true,
            body: { id: result.insertId, ...batch },
          });
        }
      }
    );
  });
});

/* Delete a Batch */
router.delete("/:batchId", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected
    let batchId = req.params.batchId;
    connection.query(
      `DELETE FROM Batch WHERE BatchId = ${batchId}`,
      (err, result) => {
        connection.release();
        if (err) {
          console.log("error: ", err);
          res.status(500).send({
            success: false,
            message: err.message,
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
      }
    );
  });
});

module.exports = router;
