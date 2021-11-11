const pool = require("../config/db");
const express = require("express");
const router = express.Router();

/* Retrieve all stages from the db */
router.get("/", async (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM Stage", (err, stageResult) => {
      connection.release();
      if (err) {
        console.log("error: ", err);
        res.status(500).send({
          success: false,
          message: err.message || "Error: Cannot get stages",
        });
      } else if (stageResult.length) {
        console.log(
          "Stages: ",
          Object.values(JSON.parse(JSON.stringify(stageResult)))
        );
        let stages = Object.values(JSON.parse(JSON.stringify(stageResult)));
        stages.forEach((stage) => {
          let stageId = stage.StageId;
          connection.query(
            `SELECT * FROM Batch
                                WHERE StageId = ${stageId}`,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                let formatResult = { ...stageResult, Batches: result };
                res.status(200).send({
                  success: true,
                  body: formatResult,
                });
                console.log(formatResult);
              }
            }
          );
        });
      } else {
        res.status(404).send({
          success: false,
          message: err.message || "Stages not found!",
        });
      }
    });
  });
});

/* Retrieve all stages with batches from the db */
router.get("/batches", async (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    connection.query(
      `
			SELECT s.StageId, s.StageName, s.StageOrder, b.BatchId, b.Name, b.IsCompleted, b.CreatedDate, b.ExtractionId
			FROM ForensicsTest.Stage s
			LEFT JOIN Batch b
				ON s.StageId = b.StageId
			ORDER BY s.StageOrder ASC
			;
			`,
      (err, stageResult) => {
        connection.release();
        if (err) {
          console.log("error: ", err);
          res.status(500).send({
            success: false,
            message: err.message || "Error: Cannot get stages",
          });
        } else if (stageResult.length > 0) {
          let statusArrKeyHolder = [];
          let statusArr = [];
          // Sort batches by status
          stageResult.forEach(function (item) {
            statusArrKeyHolder[item.StageOrder] =
              statusArrKeyHolder[item.StageOrder] || {};
            let obj = statusArrKeyHolder[item.StageOrder];
            if (Object.keys(obj).length == 0) statusArr.push(obj);

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
            message: err.message || "Stages not found!",
          });
        }
      }
    );
  });
});

module.exports = router;
