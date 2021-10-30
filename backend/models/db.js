const mysql = require('mysql');
const dbConfig = require('../config/db.config');

// Create connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
});

// Open MySQL connection
connection.connect((err) => {
    if (!err) {
        console.log("Successfully connected to the database.");
    } else {
        console.log("Connection failed!")
    }
});

module.exports = connection;