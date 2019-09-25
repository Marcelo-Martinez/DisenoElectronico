const mysql = require("mysql");
const gpstime = require("gpstime");
const path = require("path");
// PARAMETROS DE LA BASE DE DATOS
const connection = mysql.createConnection({
  host: "mydbinstancedesign.coxt8euwrxba.us-east-1.rds.amazonaws.com",
  user: "marcelo",
  password: "carpediem0599$",
  database: "electronic_design",
  port: "3306"
});

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
    exports.insert(exports.deco(message));
  });
  server.on("listening", function() {
    let address = server.address();
    console.log(
      "UDP Server listening on " + address.address + ":" + address.port
    );
  });
};

exports.deco = message => {
  // SPLIT THE MESSAGE FROM THE SYRUS AND TURN IT INTO A INT
  let weeks = parseInt(databaseResponse.slice(6, 10));
  let seconds = parseInt(databaseResponse.slice(11, 16));
  let lat = parseInt(databaseResponse.slice(16, 24));
  let long = parseInt(databaseResponse.slice(24, 32));
  // TRANSFORM THE GPS TIME TO UTC TIME
  let dateUtc = gpstime.wnTowToUtcTimestamp(weeks, seconds);

  var data = {
    date:
      dateUtc.getUTCFullYear() +
      "-" +
      (dateUtc.getUTCMonth() + 1) +
      "-" +
      (dateUtc.getUTCDate() + 2) +
      ", Hour: " +
      (dateUtc.getUTCHours() - 5) +
      ":" +
      dateUtc.getMinutes() +
      " ",
    lat: lat,
    long: long
  };
  return data;
};

exports.insert = message => {
  // INSERT THE POST OBJETO INTO THE DATABASE
  let query = connection.query(
    `insert into designdatabase(latitude,longitude,time)  values (${message.lat},${message.long},${message.date});
  `,
    post,
    function(error, results, fields) {
      if (error) throw error;
    }
  );
  console.log(query.sql);
};
// server
exports.webserver = function() {
  let express = require("express");
  let app = express();
  app.use(express.static(path.join(__dirname + "/public/mapa")));
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/mapa/index.html"));
  });
  app.get("/sendR", function(req, res) {
    // READ FROM A THE DATABASE
    connection.query("SELECT* FROM `information`", function(
      err,
      results,
      fields
    ) {
      if (err) {
        console.log("error in query" + err);
      } else {
        // SELECT THE LAST RESULT OF THE DATABASE
        let databaseResponse = results[results.length - 1].message;
        // SPLIT THE MESSAGE FROM THE SYRUS AND TURN IT INTO A INT
        let weeks = parseInt(databaseResponse.slice(6, 10));
        let seconds = parseInt(databaseResponse.slice(11, 16));
        let lat = parseInt(databaseResponse.slice(16, 24));
        let long = parseInt(databaseResponse.slice(24, 32));
        // TRANSFORM THE GPS TIME TO UTC TIME
        let dateUtc = gpstime.wnTowToUtcTimestamp(weeks, seconds);
        // CREATE A DATA OBJECT WITH THE ATTRIBUTES DATA, LAT AND LONG
        var data = {
          date:
            dateUtc.getUTCFullYear() +
            "-" +
            (dateUtc.getUTCMonth() + 1) +
            "-" +
            (dateUtc.getUTCDate() + 2) +
            ", Hour: " +
            (dateUtc.getUTCHours() - 5) +
            ":" +
            dateUtc.getMinutes() +
            " ",
          lat: lat,
          long: long
        };
        // SEND THE OBJECT
        console.log(data);
        res.send(data);
      }
    });
  });
  // PORT
  app.listen(50000);
};
