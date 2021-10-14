const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors")

const app = express()
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors())

var mysql = require('mysql')

var con = mysql.createConnection({
  host:"database-lean-management.cochwqctqqfi.us-east-2.rds.amazonaws.com",
  user:"admin",
  password:"BCIT_COMP4800",
  database:"Sample_Case"
});

con.connect(function(err){
  if (err) throw err;

  console.log('connection successful')
});

app.get('/',(req,res)=>{
  res.json("OK")
})

app.post("/", (req,res)=>{
  var {sampleid, sampletype} = req.body
  var records = [[req.body.sampleid, req.body.sampletype]]
  if(records[0][0] != null){
    con.query("INSERT into Samples (sample_id,sample_type) \
    VALUES ?", [records], function(err,res,fields){

      if(err) throw err

      console.log(res)
    })
  }
  res.json("Form recieved")
})

app.listen(3001, () =>{
  console.log("Port 3001")
})