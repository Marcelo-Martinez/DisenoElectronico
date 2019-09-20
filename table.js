var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'mydbinstancedesign.coxt8euwrxba.us-east-1.rds.amazonaws.com',
    user: "marcelo",
    password: "carpediem0599$",
    database: "electronic_design"
});

//crear tabla
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE information (ID_name int,message VARCHAR(255))";
    con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table created");
    });
});