const Batch = require("../models/batch.model");
const pool = require("../models/db");

/* Create and save a new Batch */
exports.create = (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    // Validate request
    if (!req.body) {
      res.status(400).send({
        success: false,
        message: "Content cannot be empty",
      });
    }

    const batch = req.body;

    // Create Batch in db
    connection.query("INSERT INTO Batch SET ?", batch, (err, result) => {
      connection.release();
      if (err) {
        res.status(500).send({
          success: false,
          message: err.message || "Error: Unable to create batch",
        });
      } else {
        console.log("Batch recorded: ", { id: result.insertId, ...batch });
        res.status(200).send({
          success: true,
          body: { id: result.insertId, ...batch },
        });
      }
    });
    // Batch.create(batch, (err, data) => {
    //   if (err)
    //     res.status(500).send({
    //       message: err.message || "Error: Unable to create batch",
    //     });
    //   else res.send(data);
    // });
  });
};

/* Retrieve all Batches from the db */
exports.findAll = (req, res) => {
  pool.getConnection(function (err, connection) {
    if (err) throw err; // not connected!
    connection.query("SELECT * FROM Batch", (err, result) => {
      connection.release();
      if (err) {
        console.log("error: ", err);
        res.status(500).send({
          success: false,
          message: err.message || "Error: Unable to create batch",
        });
      }

      console.log("Batches: ", result);
      res.status(200).send({
        success: false, body: result});
    });
  });
  //   Batch.getAll((err, data) => {
  //     if (err)
  //       res.status(500).send({
  //         message: err.message || "Problem occurred: Could not retrieve batches!",
  //       });
  //     else res.send(data);
  //   });
};

/* Find a Batch with batchId */
exports.findOne = (req, res) => {
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
            message: err.message || "Error: Unable to create batch",
          });
        } else if (result.length) {
          console.log("Batch found: ", result[0]);
          res.status(200).send({ success: true, body: result[0] });
        } else {
          res.status(404).send({
            success: false,
            message: `Batch #${batchId} not found!`,
          });
        }
      }
    );
  });
  //   Batch.findById(req.params.batchId, (err, data) => {
  //     if (err) {
  //       if (err.kind === "not_found") {
  //         res.status(404).send({
  //           message: `Batch #${req.params.batchId} not found!`,
  //         });
  //       } else {
  //         res.status(500).send({
  //           message: "Error retrieving Batch #" + req.params.batchId,
  //         });
  //       }
  //     } else res.send(data);
  //   });
};

/* Update a Batch */
exports.update = (req, res) => {};

/* Delete a Batch */
exports.delete = (req, res) => {
  Batch.remove(req.params.batchId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Batch #${req.params.batchId} not found!`,
        });
      } else {
        res.status(500).send({
          message: "Unable to delete Batch #" + req.params.batchId,
        });
      }
    } else res.send({ message: `Batch #${req.params.batchId} deleted!` });
  });
};
