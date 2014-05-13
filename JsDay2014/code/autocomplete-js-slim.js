
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
    + "        <title>Autocomplete (js)</title>"
    + "    </head>"
    + "    <body>"
    + "        <div>Start Typing</div>"
    + "        <input type='text' id='searchtext'>"
    + "        <ul id='results'></ul>"
    + "    </body>"
    + "</html>";

  document.open();
  document.write(doc);
  document.close();

  loadJs('lib/rx.js');
  loadJs('lib/rx.time.js');
  loadJs('lib/rx.html.js');
}

prepare();

// Search Wikipedia for a given term
function searchWikipedia(term) {
  var cleanTerm = window.encodeURIComponent(term);
  var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
  + cleanTerm + '&callback=JSONPCallback';
  return Rx.Observable.getJSONPRequest(url);
}

function clearChildren (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function main() {
  var input = document.querySelector('#searchtext'),
      results = document.querySelector('#results');

  Rx.Observable.fromEvent(input, 'keyup')
  // Get all distinct key up events from the input and only fire if long enough and distinct
  .select(function (e) { return e.target.value; }) // Project the text from the input
  .where(function (text) { return text.length > 2; })// Only if the text is longer than 2 characters
  .throttle(750) // Pause for 750ms
  .distinctUntilChanged() // Only if the value has changed
  .select(function (text) { return searchWikipedia(text); }) // Search wikipedia
  .switchLatest() // Ensure no out of order results
  .where(function (data) { return data.length === 2; }) // Where we have data
  .subscribe(function (data) {
    // Append the results
    clearChildren(results);
    var res = data[1];
    var i, len, li;
    for(i = 0, len = res.length; i < len; i++) {
      var li = document.createElement('li');
      li.innerHTML = res[i];
      results.appendChild(li);
    }
  }, function (error) {
    // Handle any errors
    clearChildren(results);
    var li = document.createElement('li');
    li.innerHTML = 'Error: ' + error;
    results.appendChild(li);
  });
}

main();


