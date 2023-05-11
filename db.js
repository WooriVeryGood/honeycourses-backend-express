const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PW,
  database: 'railgun',
});

module.exports = pool;
