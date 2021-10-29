const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({message: "Lean Forensics App"});
});

/* Routes */
require('./routes/batches')(app);
// require('./routes/samples')(app);
// require('./routes/cases')(app);
// require('./routes/stages')(app);
// require('./routes/kitTypes')(app);
// require('./routes/screeningMethods')(app);
// require('./routes/extractionMethods')(app);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});