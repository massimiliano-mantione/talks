var R = require('ramda');
var fs = require('fs');
var lines = require('transduce/string/lines');
var callback = require('transduce/async/callback');
var U = require('underarm');
var inspect = require('util').inspect;

var log = R.curry (
  function(m, v) {
    console.log('LOG ' + m + ':' + inspect(v));
    return v;
  }
);

var filename = require('process').argv[2] || 'data-small.log';

console.time('All');
var input = fs.createReadStream(filename, {encoding: 'utf8'});

var isGet = R.test(/GET \//);
var notStatic = R.complement(R.test(/GET \/static/));
var isPage = R.allPass([isGet, notStatic]);

var splitLine = R.pipe(
    R.match(/^(\S+)[^"]+"([^"]+)"/),
    R.tail
  );

var toURL = R.pipe(
    R.split(' '),
    R.slice(1, 2),
    R.prepend('http://my-domain.com'),
    R.join('')
  );

var transformSecondItem = R.curry(function (f, pair) {
  return [pair[0], f(pair[1])];
});
var secondItemToUrl = transformSecondItem(toURL);

secondItemToUrlUsingZip = R.pipe (
  R.zip([R.identity, toURL]),
  R.map( function(pair) { return pair[0] (pair[1]); } )
);

var processor = R.compose(
    lines(),
    R.filter(isGet),
    R.map(splitLine),
    R.map(secondItemToUrl),
    R.map(R.join(' visited ')),
    R.map(R.add(R.__, '\n'))
  );

console.time('Processing');
//var result = R.into('', processor, input.split('\n'));

var inputEvent = function(name) {
  input.on(name, function() {
    console.log(name + ": " + inspect(arguments));
  });
};
inputEvent('data');
inputEvent('readable');
inputEvent('end');
inputEvent('error');


console.timeEnd('All');
console.timeEnd('Processing');

//console.log (result);
