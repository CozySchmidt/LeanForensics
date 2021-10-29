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
