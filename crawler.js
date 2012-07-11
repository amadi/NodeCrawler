var libxml = require("libxmljs"),
    sys = require("sys"),
    url = require("url"),
    http = require("http"),
    functions = require("./functions");

var parsePage = function(string) {
    var parsed = libxml.parseHtmlString(string);
    sys.puts(parsed.encoding());
    var links = parsed.find('//a');
    var destinations = [];
    for (link in links) {
        var attr = links[link].attr('href');
        if (attr && attr.value) {
          var url_parts = url.parse(attr.value());
          if (url_parts.pathname){
            destinations.push(url_parts.pathname);
          }
        }
    }

    return destinations;
}
var clientSetup = function(URL, HOST) {
  var options = {
                  host:HOST, 
                  port:80,
                  path:URL,
                  method:"GET",
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:13.0) Gecko/20100101 Firefox/13.0.1'
                  }
                };
  return options;
}
var getPage = function(URL, callback) {
  var request = http.request(clientSetup(URL,'frik.loc'), function(response){
    sys.puts('STATUS: ' + response.statusCode);
    //sys.puts('HEADERS: ' + JSON.stringify(response.headers));
    if (response.statusCode == '200'){
      response.setEncoding('utf8');
      var text = '';
      response.on('data', function (chunk) {
        text += chunk;
      });
      response.on('end', function(){
        callback(text);
      });
    } else {
      sys.puts('Bad response...');
      crawl_page('/');
    }
  });
  request.end();
};



var known_pages = [];

var visited_pages = [];

var get_next_page = function() {
  for (page in known_pages) {
    if (known_pages[page] && !functions.findInArray(visited_pages, known_pages[page])) {
      visited_pages.push(known_pages[page]);
      sys.puts('Visited pages: ' + visited_pages.length);
      return known_pages[page];
    }
  }
};

var crawl_page = function(URL){
  sys.puts('Visiting ' + URL);
  getPage(URL, function(text) {
    var links = parsePage(text);
    known_pages = functions.unique(known_pages.concat(links));
    sys.puts('Known pages: ' + known_pages.length);
    if (visited_pages.length < known_pages.length){
      crawl_page(get_next_page());  
    }
  });
}

//crawl_page('/');
getPage('/client.php', function(text){
  sys.puts(text);
});