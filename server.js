var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    qs = require("querystring"),
    port = 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filepath = path.join(process.cwd(), uri);

  if (uri == "/submit") {
    handleSubmitName(request, response);
    return;
  }
  fs.exists(filepath, function(exists) {
    if(!exists) {
      handle404(response, filepath);
      return;
    }

    if (fs.statSync(filepath).isDirectory()) {
    	filename += '/index.html';
    }

    fs.readFile(filepath, "binary", function(err, file) {
      if(err) {
        handleUnreadableFile(request, response);       
        return;
      }
      console.log(file);
      respondWithUserInput(request, response, file);
      response.end();    
      return;
    });
  });
}).listen(parseInt(port, 10));

function handleSubmitName(request, response) {
  var body = '';
  request.on('data', function(data) {
    body = body+ data;
    if (body.length > 1e6) {
      request.connection.destroy();
    }
    request.on('end', function() {
      var post = qs.parse(body);
      response.writeHead(302, {
       'Location': '/name.html?inputName='+post.inputName,
      })
      response.end();
    })
  }) 
}

function handleUnreadableFile(request, response) {
  response.writeHead(500, {"Content-Type": "text/plain"});
  response.write(err + "\n");
  response.end();
}

function respondWithUserInput(request, response, file) {
  var name = request.url.split("inputName=")[1];
  console.log(name);
  file = file.replace("{{inputName}}", name);
  console.log(file);
  console.log('came here')
  response.writeHead(200);
  response.write(file, "binary");
  response.end();
}

function handle404(response, filepath) {
  response.writeHead(404, {"Content-Type": "text/plain"});
  response.write("404 Not Found\n");
  response.write(filepath + "does not exist\n ");
  response.write("But I can still say, Hello Vivek bhownani\n");
  response.write("I don't necessarily have to serve you "+filepath);
  response.end();
}

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");