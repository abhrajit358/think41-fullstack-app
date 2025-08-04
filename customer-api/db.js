const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // your MySQL username
  password: 'abhra2004',         // your MySQL password
  database: 'think41_ecommerce'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

module.exports = db;