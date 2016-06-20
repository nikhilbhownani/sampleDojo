var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {
	response.writeHead(200);
    response.write("serving something");
    response.end();
  })
.listen(parseInt(port, 10));

console.log(" http://localhost:" + port + "/\nCTRL + C to shutdown");