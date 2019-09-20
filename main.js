server = require(__dirname + "/diseno.js")
// EXECUTE SNIFFER
server.sniffer();
// EXECUTE THE WEB SERVER
server.webserver();