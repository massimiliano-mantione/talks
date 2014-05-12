#metaimport macros
#external (document, window, Rx)

var prepare = #->
  var root = '/home/massi/DATA/talks/JsDay2014/code/'

  var loadJs = filename ->
    var fileref = document.createElement('script')
    fileref.setAttribute("type", "text/javascript")
    fileref.setAttribute("src", root + filename)
    document.getElementsByTagName("head")[0].appendChild(fileref)

  var doc = '''
    <html>
        <head>
            <title>Canvas Paint (mjs)</title>
        </head>
        <body>
            <canvas id='canvas' height='768' width='1024'></canvas>
        </body>
    </html>
'''

  document.open()
  document.write(doc)
  document.close()

  loadJs 'lib/rx.js'
  loadJs 'lib/rx.html.js'


var getOffset = event ->
  {
    offsetX:
      if (event.offsetX == undefined) event.layerX
      else event.offsetX
    offsetY:
      if (event.offsetY == undefined) event.layerY
      else event.offsetY
  }

var main = #-> do!
  var canvas = document.querySelector '#canvas'

  if (canvas.getContext)
    var ctx = canvas.getContext '2d'
    ctx.beginPath()

    ; Get mouse moves
    var mouseMoves = Rx.Observable.fromEvent(canvas, 'mousemove')

    ; Calculate difference between two mouse moves
    var mouseDiffs = mouseMoves.bufferWithCount(2, 1).select
      x -> { first: getOffset(x[0]), second: getOffset(x[1]) }

    ; Get merge together both mouse up and mouse down
    var mouseButton = Rx.Observable.fromEvent(canvas, 'mousedown').select(#-> true).merge
      Rx.Observable.fromEvent(canvas, 'mouseup').select(#-> false)

    ; Paint if the mouse is down
    var paint = mouseButton.select(down -> if down mouseDiffs else mouseDiffs.take(0)).switchLatest()

    ; Update the canvas
    paint.subscribe #->
      ctx.moveTo(#1.first.offsetX, #1.first.offsetY)
      ctx.lineTo(#1.second.offsetX, #1.second.offsetY)
      ctx.stroke()

prepare()
main()
