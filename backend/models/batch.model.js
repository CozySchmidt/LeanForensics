const sql = require('./db');

/* Constructor */
const Batch = function(batch)
{
  this.batchId = batch.batchId;
  this.name = batch.name;
  this.stageId = batch.stageId;
  this.isCompleted = batch.isCompleted;
  this.date = batch.date;

};

/* Add a new batch */
Batch.create = (newBatch, result) => {
  sql.query("INSERT INTO batches SET ?", newBatch, (err, res) => {
      if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
      }

      console.log("Batch created: ", { id: res.insertId, ...newBatch });
      result(null, { id: res.insertId, ...newBatch });
  });
};

/* Find a batch by id */
Batch.findById = (id, result) => {
  sql.query(`SELECT * FROM batches WHERE id = ${id}`, (err, res) => {
     if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
     }

     if (res.length) {
         console.log("Batch found: ", res[0]);
         result(null, res[0]);
         return;
     }

     // BatchID not found
      result({ kind: "not_found" }, null);
  });
};

/* Retrieve all batches */
Batch.getAll = result => {
    sql.query("SELECT * FROM batches", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("Batches: ", res);
        result(null, res);
    });
};

/* Delete a batch */
Batch.remove = (id, result) => {
    sql.query("DELETE FROM batches WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows === 0) {
            // batchId not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Deleted batch #", id);
        result(null, res);
    });
};

module.exports = Batch;