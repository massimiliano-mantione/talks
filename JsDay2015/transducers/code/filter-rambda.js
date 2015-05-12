var R = require('ramda');
var fs = require('fs');
var inspect = require('util').inspect;

var log = R.curry (
  function(m, v) {
    console.log('LOG ' + m + ':' + inspect(v));
    return v;
  }
);

var filename = require('process').argv[2] || 'data-small.log';

console.time('All');
var input = fs.readFileSync(filename, {encoding: 'utf8'});

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

var processor = R.pipe(
    R.split('\n'),
    R.filter(isGet),
    R.map(splitLine),
    R.map(secondItemToUrl),
    R.map(R.join(' visited ')),
    R.map(R.add(R.__, '\n'))
  );

console.time('Processing');
var result = R.join('', processor(input));
//var result = R.into('', R.identity, processor(input));
console.timeEnd('Processing');
console.timeEnd('All');

console.log (result);
