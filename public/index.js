var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

http.createServer(function(request, response) {
var name = url.parse(request.url).pathname;
var filename = path.join(process.cwd(), name);
fs.readFile(filename, "binary", function(err, file) {
if(err) {
response.writeHead(500, {"Content-Type": "text/plain"});
response.write(err + "\n");
response.end();
return;
}
response.writeHead(200, {"Content-Type": "image/png"} );
response.end();
});
}).listen(3000);
console.log("Server is listening on port 3000.")