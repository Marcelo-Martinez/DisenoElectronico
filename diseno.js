const mysql = require("mysql");
const gpstime = require("gpstime");
const path = require("path");
// PARAMETROS DE LA BASE DE DATOS
const dbCon = {
  host: "mydbinstancedesign.coxt8euwrxba.us-east-1.rds.amazonaws.com",
  user: "marcelo",
  password: "carpediem0599$",
  database: "electronic_design",
  port: "3306"
};

// sniffer
exports.sniffer = () => {
  const PORT = 60060;
  //let HOST = "172.31.16.173";
  let HOST = "localhost";
  let dgram = require("dgram");
  let server = dgram.createSocket("udp4");
  server.bind(PORT, HOST);

  //FUNCTION TO HANDLE MESSAGES
  server.on("message", function(message, remote) {
    console.log(remote.address + ":" + remote.port + " - " + message);
    //WHEN NEW MESSAGE ARRIVES, MAKE A POST OBJECT WITH THE MESSAGE IN IT
    // NEXT, INSERT THAT POST OBJECT INTO THE DATABASE
    insert(deco(message));
  });
  server.on("listening", function() {
    let address = server.address();
    console.log(
      "UDP Server listening on " + address.address + ":" + address.port
    );
  });
};

deco = message => {
  // SPLIT THE MESSAGE FROM THE SYRUS AND TURN IT INTO A INT
  let msg = message.toString();
  let numWeeks = parseInt(msg.slice(6, 10));
  let numDay = parseInt(msg[10]);
  let dayTime = parseInt(msg.slice(11, 16)) - 5 * 3600;
  let totalSeconds = numWeeks * 604800 + numDay * 86400 + dayTime;
  let totalMilis = totalSeconds * 1000;
  var realdate = totalMilis + new Date(1980, 0, 6).getTime();
  let lat = parseInt(message.slice(16, 24)) / 100000;
  let long = parseInt(message.slice(24, 32)) / 10000;
  // TRANSFORM THE GPS TIME TO UTC TIME

  var data = {
    date: realdate,
    lat: lat,
    long: long
  };
  return data;
};

insert = message => {
  const connection = mysql.createConnection(dbCon);
  console.log(message);
  // INSERT THE POST OBJETO INTO THE DATABASE
  let query = connection.query(
    `insert into designdatabase(latitude,longitude,time)  values (${message.lat},${message.long},${message.date});
  `,
    function(error, results, fields) {
      if (error) throw error;
    }
  );
  console.log(query.sql);
  connection.end();
};
// server
exports.webserver = function() {
  let express = require("express");
  let app = express();
  app.use(express.static(path.join(__dirname + "/public/mapa")));
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/mapa/index.html"));
  });
  app.get("/sendR", get);
  app.listen(50050);
};

get = (req, res) => {
  const connection = mysql.createConnection(dbCon);

  connection.connect();
  const sql =
    "select latitude ,longitude,time FROM designdatabase WHERE id = (SELECT Max(id) FROM designdatabase);";
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result[0]);
    res.json(result[0]);
  });
  connection.end();
};
