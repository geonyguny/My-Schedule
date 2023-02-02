const mysql = require("mysql2/promise");
const {databaseSecret} = require("./secret");

exports.pool = mysql.createPool(databaseSecret);
