/*
* @Author: perry
* @Date:   2018-03-13 21:08:18
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 09:24:06
*/
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'test'
});
 
connection.connect();

 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});