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
  let HOST = "172.31.35.142";
  //let HOST = "localhost";
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

  let lat = parseInt(message.slice(0, 8)) / 100000;
  let long = parseInt(message.slice(8, 15)) / 100000;
  let realdata = parseInt(message.slice(15, 23));
  let realhour = parseInt(message.slice(23, 27));
  let realdateTotal = parseInt(message.slice(15, 27));
  let speed = parseInt(message.slice(15, 27));
  let rpm = parseInt(message.slice(15, 27));

  // TRANSFORM THE GPS TIME TO UTC TIME

  var data = {
    date: realdateTotal,
    lat: lat,
    long: long,
    speed: speed,
    rpm: rpm
  };
  return data;
};

insert = message => {
  const connection = mysql.createConnection(dbCon);
  console.log(message);
  // INSERT THE POST OBJETO INTO THE DATABASE
  let query = connection.query(
    `insert into designdatabase(latitude,longitude,time,speed,rpm)  values (${message.lat},${message.long},${message.date}, ${message.speed}, ${message.rpm});
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
  const express = require("express");
  const bodyParser = require("body-parser");
  const app = express();
  app.use(express.static(path.join(__dirname + "/public/mapa")));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/mapa/index.html"));
  });
  app.get("/sendR", get);
  app.post("/getCarPos", getCarPos);
  app.post("/historical", historical);
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

getCarPos = (req, res) => {
  const connection = mysql.createConnection(dbCon);
  console.log(req.body);

  connection.connect();
  let carId = req.body.carId;
  const sql = `select latitude ,longitude,time, speed, rpm FROM designdatabase WHERE car_id = '${carId}' order by id desc limit 1;`;
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result[0]);
    res.json(result[0]);
  });
  connection.end();
};

historical = (req, res) => {
  const connection = mysql.createConnection(dbCon);
  connection.connect();
  let carId = req.body.carId;
  const sql = `SELECT Latitude AS latitude, Longitude AS longitude, Time AS time FROM designdatabase WHERE car_id = '${carId}'and time BETWEEN ${req.body.initTime} and ${req.body.finalTime} ORDER BY time;`;
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
  connection.end();
};
