var load = function(name) {
  var root = '/SSD/massi/talks/FutureJs2015Transducers/code/node_modules/';
  return require(root + name);
};

var R = load('ramda');

var input = [
  '127.0.0.1 - - [26/Feb/2015 19:25:25] "GET /static/r.js HTTP/1.1"',
  '127.0.0.5 - - [26/Feb/2015 19:27:35] "GET /blog/ HTTP/1.1" 200 -',
  '127.0.0.1 - - [28/Feb/2015 16:44:03] "GET / HTTP/1.1" 200 -',
  '127.0.0.1 - - [28/Feb/2015 16:44:03] "POST / HTTP/1.1" 200 -'];
var out;

var expected =
  '127.0.0.5 visited http://simplectic.com/blog/\n' +
  '127.0.0.1 visited http://simplectic.com/\n';

// Is line a GET request for something other than static?
var isGet = R.test(/ "GET \//);
var notStatic = R.complement(R.test(/ "GET \/static/));
var isPage = R.allPass([isGet, notStatic]);

out = R.filter(isPage, input)
;

// => [ '127.0.0.5 - - [26/Feb/2015 19:27:35] "GET /blog/ HTTP/1.1" 200 -',
//      '127.0.0.1 - - [28/Feb/2015 16:44:03] "GET / HTTP/1.1" 200 -' ]


// 'log line' -> ['IP', 'GET /url/path']
var toIpAndRequest = R.pipe(
      R.match(/^(\S+).+"([^"]+)"/),
      R.tail);
out = R.map(toIpAndRequest, [
  '127.0.0.5 - - [26/Feb/2015 19:27:35] "GET /blog/ HTTP/1.1" 200 -',
  '127.0.0.1 - - [28/Feb/2015 16:44:03] "GET / HTTP/1.1" 200 -'])
;

// => [ [ '127.0.0.5', 'GET /blog/ HTTP/1.1' ],
//      [ '127.0.0.1', 'GET / HTTP/1.1' ] ]


// 'GET /url/path' -> 'http://simplectic.com/url/path'
var requestToUrl = R.pipe(
      R.split(' '),
      R.slice(1, 2),
      R.prepend('http://simplectic.com'),
      R.join(''));
out = R.map(requestToUrl, [
  'GET /blog/ HTTP/1.1',
  'GET / HTTP/1.1'])
;

// => ['http://simplectic.com/blog/',
//     'http://simplectic.com/' ]


// ['IP', 'GET /url/path'] -> ['IP', 'http://simplectic.com/url/path']
var requestToUrlInPair = R.over(R.lensIndex(1), requestToUrl);
out = R.map(requestToUrlInPair, [
  [ '127.0.0.5', 'GET /blog/ HTTP/1.1' ],
  [ '127.0.0.1', 'GET / HTTP/1.1' ] ])
;
// => [ [ '127.0.0.5', 'http://simplectic.com/blog/' ],
//      [ '127.0.0.1', 'http://simplectic.com/' ] ]


// Build the whole log parser as a transducer
// (it is mostly a composition of steppers)
var parseLog = R.compose(
      // filter non-static GET requests
      R.filter(isPage),
      // -> ['IP', 'GET /url/path']
      R.map(toIpAndRequest),
      // -> ['IP', 'http://simplectic.com/url/path']
      R.map(requestToUrlInPair),
      // -> 'IP visited http://simplectic.com/url/path'
      R.map(R.join(' visited ')),
      R.map(R.add(R.__, '\n')));


// Apply the transducer
out = R.transduce(parseLog, R.add, '', input);
out == expected;

// Do it using the utility 'into' function
out = R.into('', parseLog, input);
out == expected;



// Use the original transducer module
// (instead of the Ramda one)
var tr = load('transduce');
out = tr.into('', parseLog, input);
out == expected;


// Back to slides...

















// Let's use our parser in push context!


// The king of push context is the reactive Framework

var Rx = load('rx');

Rx.Observable.fromArray(input)
  .transduce(parseLog)
  .reduce(function (s, t) { return s + t; })
  .subscribe(function (text) { out = text; });

out == expected;



// Hey, also Kefir works...

var Kefir = load('kefir');

Kefir.sequentially(0, input)
  .transduce(parseLog)
  .reduce(function (s, t) { return s + t; })
  .onValue(function (text) { out = text; });

out == expected;



// For added fun, let's use nodejs streams

var stringStream = load('string-streamer');
var split = load('split');
var transduceStream = load('transduce-stream');
var StreamDump = load('dump-stream');

var outputStream = new StreamDump();

stringStream(input.join('\n'))
  .pipe(split())
  .pipe(transduceStream(parseLog))
  .pipe(outputStream)
  .on('finish', function() { out = outputStream.dump(); });

out == expected;

