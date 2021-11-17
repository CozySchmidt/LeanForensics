const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Retrieve all stages from the db */
router.get("/", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql = `SELECT * FROM Stage`;
    connection.query(sql, (err, stageResult) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (stageResult.length > 0) {
        console.log("Stages: ", stageResult);
        res.status(200).send({
          success: true,
          body: stageResult,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Stages not found!",
        });
      }
    });
  });
});

/* Retrieve all stages with batches from the db */
router.get("/batches", (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    let sql = `SELECT s.StageId, s.StageName, s.StageOrder, b.BatchId, 
                b.Name, b.IsCompleted, b.CreatedDate, b.ExtractionId
              FROM ForensicsTest.Stage s
              LEFT JOIN Batch b
                  ON s.StageId = b.StageId
              ORDER BY s.StageOrder ASC
              `;
    connection.query(sql, (err, stageResult) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: "Invalid request!",
        });
      } else if (stageResult.length > 0) {
        let statusArrKeyHolder = [];
        let statusArr = [];
        // Sort batches by status
        stageResult.forEach(function (item) {
          statusArrKeyHolder[item.StageOrder] =
            statusArrKeyHolder[item.StageOrder] || {};
          let obj = statusArrKeyHolder[item.StageOrder];
          if (Object.keys(obj).length === 0) statusArr.push(obj);

          obj.StageName = item.StageName;
          obj.StageName = item.StageName;
          obj.StageOrder = item.StageOrder;
          obj.Batches = obj.Batches || [];
          if (item.BatchId !== null) {
            obj.Batches.push(item);
          }
        });
        res.status(200).send({
          success: true,
          body: statusArr,
        });
        console.log(statusArr);
      } else {
        res.status(404).send({
          success: false,
          message: "Could not find stages!",
        });
      }
    });
  });
});

module.exports = router;
