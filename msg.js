var http = require('http');
var url = require('url');

Object.prototype.contains = function(keys) {
  for (var x = 0; x < keys.length; x ++) {
    if (! this.hasOwnProperty(keys[x])) return false;
  }

  return true;
};

function log() {
  console.log("\n", arguments, "\n");
}

var messages = require('./messages.js');
var members = require('./members.js');
var routes = require('./routes.js');
var r = require('./responses.js');

var server = http.createServer(function(request, response){
	var _url = url.parse(request.url, true),
    result = r.failure();
  response.writeHead(200, {"Content-Type": "application/json"});

  console.log("\n" +  _url.pathname, _url, "\n");

  if(routes.hasOwnProperty(_url.pathname)){
    result = routes[_url.pathname](_url.query);
  }

  log("Result", result);
  response.end(JSON.stringify(result));
});


server.listen(12345);

console.log("Server running at sandbox01:12345");
