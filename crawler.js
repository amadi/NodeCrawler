var libxml = require("libxmljs"),
    sys = require("sys"),
    http = require("http");

var getPage = function(URL, callback) {
  var options = {
                  host:"frik.loc", 
                  port:80,
                  path:"/",
                  method:"GET"
                };
  sys.puts("getPage");
  var request = http.request(options, function(response){
    sys.puts('STATUS: ' + response.statusCode);
    sys.puts('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      callback(chunk);
    });
  });
  request.end();
};

var parsePage = function(string) {
    var parsed = libxml.parseHtmlString(string);
    sys.puts("start!...");
    sys.puts(parsed.encoding());
    var links = parsed.find('//a');

    for (link in links) {
        var attr = links[link].attr('href');
        if (attr && attr.value) {
          sys.puts(attr.value());
        }
    }

    
}

var page = getPage('/', function(text){
  parsePage(text);
});

