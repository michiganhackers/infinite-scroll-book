$(document).ready(function() {

  // UI Constants
  const LINE = '<div class="line"><p></p></div>';
  const WINDOW_HEIGHT = $(window).outerHeight();
  const REFRESH_RATE = 100;

  // UI helpers
  var scrollTop = function() { return document.body.scrollTop; }
  var linesHeight = function() { return $(".lines").outerHeight(); }

  // Book Line Constants
  const FETCH_DELTA = Math.ceil(4 * (WINDOW_HEIGHT / 40)); // 4x the min lines in view
  
  // Book line helpers
  var lineCache = {}, lineCount = 0, cacheCount = 0;
  var atEnd = false;

  // Check the height, independent of the lines
  var $lines = $(".lines");
  setInterval(function() {
    var linesAdded = 0;

    // Add new lines until we have enough wiggle room
    while(!atEnd && (linesHeight() - scrollTop()) < WINDOW_HEIGHT*2) {
      var $children = $lines.children(), $line = $(LINE);
      var lineId = $children.length + 1;
      $line.attr("data-id", lineId).appendTo($lines);
      if(lineCache[lineId]) { $line.children("p").html(lineCache[lineId]); }
      ++linesAdded;
    }

    lineCount += linesAdded;
    if((linesAdded > 0) && ((cacheCount - lineCount) < FETCH_DELTA)) {
      cacheCount += FETCH_DELTA;
      fetchAndCacheLines(lineCount-linesAdded);
    }
  }, REFRESH_RATE);

  function fetchAndCacheLines(line) {
    $.get("/text", {line: line, offset: FETCH_DELTA}, function(lineData) {
      JSON.parse(lineData).forEach(function(elem) {
        lineCache[elem.num] = elem.text;
        var $line = $lines.find("[data-id="+elem.num+"]");
        if(!$line.children("p").html()) { $line.children("p").html(elem.text); }
      });
    });
  }
});
