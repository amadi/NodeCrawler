var unique = function(arr) {
  var a = [];
  var l = arr.length;
  for (var i = 0; i < l; i++) {
    for(var j=i+1; j<l; j++) {
      // if this[i] is found later in the array
      if (arr[i] === arr[j]) 
        j = ++i;
      }
      a.push(arr[i]);
  }
  return a;
};

function indexInArray(arr, val) {
  for (var i = 0; i<arr.length; i++) if(arr[i]==val) return true;
  return false; 
}

var libxml = require("libxmljs"),
    sys = require("sys"),
    url = require("url"),
    http = require("http");


var parsePage = function(string) {
    var parsed = libxml.parseHtmlString(string);
    sys.puts(parsed.encoding());
    var links = parsed.find('//a');
    var destinations = [];
    for (link in links) {
        var attr = links[link].attr('href');
        if (attr && attr.value) {
          var url_parts = url.parse(attr.value());
          destinations.push(url_parts.pathname);
        }
    }

    return destinations;
}
var getPage = function(URL, callback) {
  var options = {
                  host:"frik.loc", 
                  port:80,
                  path:URL,
                  method:"GET"
                };
  var request = http.request(options, function(response){
    sys.puts('STATUS: ' + response.statusCode);
    //sys.puts('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    var text = '';
    response.on('data', function (chunk) {
      text += chunk;
    });
    response.on('end', function(){
      callback(text);
    });
  });
  request.end();
};



var known_pages = [];

var visited_pages = [];

var get_next_page = function() {
  for (page in known_pages) {
    if (known_pages[page] && !indexInArray(visited_pages,known_pages[page])) {
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
    known_pages = unique(known_pages.concat(links));
    sys.puts('Known pages: ' + known_pages.length);
    crawl_page(get_next_page());
  });
}




crawl_page('/');
