var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'psword',
    database : 'databasename'
  });
  
  db.connect();

  module.exports =db;
  