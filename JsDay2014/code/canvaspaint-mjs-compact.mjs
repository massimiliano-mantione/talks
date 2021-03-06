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

    |>
      ; Merge together both mouse up and mouse down
      Rx.Observable.fromEvent(canvas, 'mousedown').select(#-> true)
      .merge <- Rx.Observable.fromEvent(canvas, 'mouseup').select(#-> false)
      ; Let the mouseDiff pass only if the mouse is down
      .select
        down -> if down (:# mouseDiffs) else (:# mouseDiffs).take(0)
      .switchLatest()
      .subscribe
        ; Update the canvas (stroke from diff.first to diff.second)
        diff ->
          ctx.moveTo(diff.first.offsetX, diff.first.offsetY)
          ctx.lineTo(diff.second.offsetX, diff.second.offsetY)
          ctx.stroke()
      mouseDiffs: |>
        ; Get mouse moves
        Rx.Observable.fromEvent(canvas, 'mousemove')
        ; Calculate difference between two mouse moves
        .bufferWithCount(2, 1)
        .select
          x -> { first: getOffset(x[0]), second: getOffset(x[1]) }

prepare()
main()
