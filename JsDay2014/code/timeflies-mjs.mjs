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
            <title>Time Flies (mjs)</title>
        </head>
        <body>
            <div id='container'></div>
        </body>
    </html>
'''

  document.open()
  document.write(doc)
  document.close()

  loadJs 'lib/rx.js'
  loadJs 'lib/rx.time.js'
  loadJs 'lib/rx.html.js'


var getOffset = element ->
  var
    doc = element.ownerDocument
    docElem = doc.documentElement
    body = doc.body
    clientTop  = docElem.clientTop  || body.clientTop  || 0
    clientLeft = docElem.clientLeft || body.clientLeft || 0
    scrollTop  = window.pageYOffset
    scrollLeft = window.pageXOffset
  return { top : scrollTop  - clientTop, left: scrollLeft - clientLeft }


var main = #-> do!
  var
    text = 'TIME FLIES LIKE AN ARROW'
    container = document.querySelector('#container')
    mousemove = Rx.Observable.fromEvent(document, 'mousemove')

  ; Get the offset on mousemove from the container
  var mouseMoveOffset = mousemove.select
    e ->
      var offset = getOffset(container)
      return {
        offsetX : e.clientX - offset.left + document.documentElement.scrollLeft
        offsetY : e.clientY - offset.top + document.documentElement.scrollTop
      }

  loop (var i = 0)
    if (i < text.length)
      var charAdder = i ->
        ; Add an element for each letter
        var s = document.createElement 'span'
        s.innerHTML = text[i]
        s.style.position = 'absolute'
        container.appendChild s
        ; move each letter with a delay based upon overall position
        mouseMoveOffset.delay(i * 100).subscribe
          e -> do!
            s.style.top = e.offsetY + 'px'
            s.style.left = e.offsetX + i * 10 + 15 + 'px'
      charAdder i
      next! i + 1

prepare()
main()
