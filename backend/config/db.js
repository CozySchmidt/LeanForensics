const mysql = require("mysql-await");
const dbConfig = require("./db.config");


/* Create connection to the database */
const pool = mysql.createPool({
  connectionLimit: 20,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DATABASE,

});


module.exports = pool;



