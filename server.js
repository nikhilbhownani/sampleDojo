var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filepath = path.join(process.cwd(), uri);

  var filename = filepath+".html";
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.write(filename + "does not exist\n ");
      response.write("But I can still say, Hello Vivek bhownani\n");
      response.write("I don't necessarily have to serve you "+filename);
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
    	filename += '/index.html';
    }

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");