const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv/types');
const cors = require("cors");

/* Route paths */
const batches = require('./routes/batches');
const samples = require('./routes/samples');
const cases = require('./routes/cases');
const methods = require('./routes/methods');
const stages = require('./routes/stages');

// init express
const app = express();
// init environment
dotenv.config();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({message: "OK"});
});

/* Routes */
app.use("/batches", batches);
app.use("/samples", samples);
app.use("/cases", cases);
app.use("/", methods);
app.use("/stages", stages);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});