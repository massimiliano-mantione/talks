function prepare() {
  var root = '/home/massi/DATA/talks/JsDay2014/code/';

  function loadJs(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", root + filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
  };

  var doc = ""
    + "<html>"
    + "    <head>"
    + "        <title>Canvas Paint (js)</title>"
    + "    </head>"
    + "    <body>"
    + "        <canvas id='canvas' height='768' width='1024'></canvas>"
    + "    </body>"
    + "</html>";

  document.open();
  document.write(doc);
  document.close();

  loadJs('lib/rx.js');
  loadJs('lib/rx.html.js');
}

prepare();

function getOffset(event) {
  return {
    offsetX: event.offsetX === undefined ? event.layerX : event.offsetX,
    offsetY: event.offsetY === undefined ? event.layerY : event.offsetY
  };
}

function main() {
  var canvas = document.querySelector('#canvas');

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.beginPath();

    // Get mouse moves
    var mouseMoves = Rx.Observable.fromEvent(canvas, 'mousemove');

    // Calculate difference between two mouse moves
    var mouseDiffs = mouseMoves.bufferWithCount(2, 1).select(function (x) {
      return { first: getOffset(x[0]), second: getOffset(x[1]) };
    });

    // Get merge together both mouse up and mouse down
    var mouseButton = Rx.Observable.fromEvent(canvas, 'mousedown').select(function (x) { return true; })
    .merge(Rx.Observable.fromEvent(canvas, 'mouseup').select(function (x) { return false; }));

    // Paint if the mouse is down
    var paint = mouseButton.select(function (down) { return down ? mouseDiffs : mouseDiffs.take(0) }).switchLatest();

    // Update the canvas
    paint.subscribe(function (x) {
      ctx.moveTo(x.first.offsetX, x.first.offsetY);
      ctx.lineTo(x.second.offsetX, x.second.offsetY);
      ctx.stroke();
    });
  }
}

main();
