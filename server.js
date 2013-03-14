var Fs = require("fs");
var Connect = require("connect");
var Server = Connect.createServer();

Server.use(Connect.static("./public"));

var book = Fs.readFileSync("./book.txt").toString().replace(/\n+/g, " ");
var sentences = book.split(/(\.)/g).filter(function(elem) { return elem.length > 1; });
var sentences = sentences.map(function(elem) { return elem.replace(/^[^\w']+/g, ""); });
const MAX_LINES = sentences.length;

Server.use("/text", function(req, res) {
  var lineMatch = req.url.match(/line=(\d+)/);
  var line = lineMatch ? Math.max(1, parseInt(lineMatch[1])) : 1;

  var offsetMatch = req.url.match(/offset=(\d+)/);
  var offset = offsetMatch ? parseInt(offsetMatch[1]) : 10;

  if((line + offset) > MAX_LINES) {
    offset = Math.max(0, MAX_LINES - line);
  }

  var lineArray = [], idx = line, bound = (offset+line);
  for(; idx < bound; ++idx) {
    lineArray.push({num: idx, text: sentences[idx-1]+"."});
  }

  res.end(JSON.stringify(lineArray));
});

Server.listen(8421);

