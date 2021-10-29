const Batch = require('../models/batch.model');

/* Create and save a new Batch */
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty"
        });
    }

    // Create a Batch
    const batch = new Batch({
        batchId: req.body.batchId,
        name: req.body.name,
        stageId: req.body.stageId,
        isCompleted: req.body.isCompleted,
        date: req.body.date
    });

    // Save Batch in db
    Batch.create(batch, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Error: Unable to create batch"
            });
        else res.send(data);
    });

};

/* Retrieve all Batches from the db */
exports.findAll = (req, res) => {
    Batch.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Problem occurred: Could not retrieve batches!"
            });
        else res.send(data);
    });
};

/* Find a single Batch with batchId */
exports.findOne = (req, res) => {
    Batch.findById(req.params.batchId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Batch #${req.params.batchId} not found!`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Batch #" + req.params.batchId
                });
            }
        } else res.send(data);
    });
};

/* Update a Batch */
exports.update = (req, res) => {

};

/* Delete a Batch */
exports.delete = (req, res) => {
    Batch.remove(req.params.batchId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Batch #${req.params.batchId} not found!`
                });
            } else {
                res.status(500).send({
                    message: "Unable to delete Batch #" + req.params.batchId
                });
            }
        } else res.send({ message: `Batch deleted!` });
    });
};