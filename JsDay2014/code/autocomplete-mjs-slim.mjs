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
            <title>Autocomplete (mjs)</title>
        </head>
        <body>
          <div>Start Typing</div>
          <input type='text' id='searchtext'>
          <ul id='results'></ul>
        </body>
    </html>
'''

  document.open()
  document.write(doc)
  document.close()

  loadJs 'lib/rx.js'
  loadJs 'lib/rx.time.js'
  loadJs 'lib/rx.html.js'


; Search Wikipedia for a given term
var searchWikipedia = term ->
  var cleanTerm = window.encodeURIComponent term
  var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' +
    cleanTerm + '&callback=JSONPCallback'
  return Rx.Observable.getJSONPRequest url


var clearChildren = element -> do!
  while (element.firstChild)
    element.removeChild(element.firstChild)

var main = #-> do!
  var
    input = document.querySelector '#searchtext'
    results = document.querySelector '#results'

  Rx.Observable.fromEvent(input, 'keyup') |>
    ; Get all distinct key up events from the input and only fire if long enough and distinct
    select #-> #arg.target.value ; Project the text from the input
    where #-> #arg.length > 2 ; Only if the text is longer than 2 characters
    throttle 750 ; Pause for 750ms
    distinctUntilChanged ; Only if the value has changed
    select #-> searchWikipedia #arg ; Search wikipedia
    switchLatest ; Ensure no out of order results
    where #-> #arg.length == 2 ; Where we have data
    subscribe
      data ->
        ; Append the results
        clearChildren(results)
        var res = data[1];
        loop (var i = 0)
          if (i < res.length)
            var li = document.createElement 'li'
            li.innerHTML = res[i]
            results.appendChild li
            next! i + 1
          else end!
      error ->
        ; Handle any errors
        clearChildren results
        var li = document.createElement 'li'
        li.innerHTML = 'Error: ' + error
        results.appendChild li

prepare()
main()
