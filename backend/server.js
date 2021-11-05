const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");
const db = require('./models/db');

const batchesRouter = require('./routes/batches');

// init express
const app = express();
// init environment
dotenv.config();
const port = process.env.PORT || 8888;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({message: "OK"});
});

/* Routes */
// app.use("/batches", batchesRouter);
require('./routes/batches')(app);
// require('./routes/samples')(app);
// require('./routes/cases')(app);
// require('./routes/stages')(app);
// require('./routes/kitTypes')(app);
// require('./routes/screeningMethods')(app);
// require('./routes/extractionMethods')(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});