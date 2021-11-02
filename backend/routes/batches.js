// const express = require('express');
// const router = express.Router();
// const db = require('../models/db');
//
// /* Create new batch */
// router.post("/", (req, res) => {
//     const batchId = req.body.batchId;
//     const name = req.body.name;
//     const stageId = req.body.stageId;
//     const isCompleted = req.body.isCompleted;
//     const date = req.body.date;
//
//     db.query(
//         "INSERT INTO batches " +
//         "(batchId, name, stageId, isCompleted, date) VALUES (?,?,?,?,?)",
//         [batchId, name, stageId, isCompleted, date],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.send("Batch recorded");
//             }
//         }
//     )
// });
//
// /* Get all batches */
// router.get("/", (req, res) => {
//    db.query("SELECT * from batches", (err, rows, fields) => {
//       if (!err) {
//           res.send(rows);
//       }
//       else {
//           console.log(err);
//
//       }
//    });
// });
//
// /* Get batch by id */
// router.get("/:batchid", (req, res) => {
//    db.query(`SELECT * FROM batches WHERE batchId = ${req.params.batchId}`, (err, res) => {
//        if (!err) {
//            res.send(req.params.batchId);
//        } else {
//            console.log(err);
//        }
//
//    });
// });
//
// module.exports = router;

module.exports = app => {
    const batches = require('../controllers/batch.controller');

    // Create a new Batch
    app.post("/batches", batches.create);

    // Retrieve all Batches
    app.get("/batches", batches.findAll);

    // Retrieve a single Batch with batchId
    app.get("/batches/:batchId", batches.findOne);

    // Update a Batch with batchId
    app.put("/batches/:batchId", batches.update);

    // Delete a Batch with batchId
    app.delete("/batches/:batchId", batches.delete);

};
