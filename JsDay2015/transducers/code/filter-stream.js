var R = require('ramda');
var stream = require('transduce-stream');
var lines = require('transduce/string/lines');
var toArray = require('stream-to-array');
var fs = require('fs');
var inspect = require('util').inspect;

var log = R.curry (
  function(m, v) {
    console.log('LOG ' + m + ':' + inspect(v));
    return v;
  }
);

var filename = require('process').argv[2] || 'data-small.log';

//console.time('All');
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
    //R.reduce(R.append, [])
    //R.map(log('DONE'))
  );

//console.time('Processing');
//var result = R.into('', processor, input.split('\n'));
//var result = toArray (input.pipe(stream(lines())));
input.pipe(stream(processor)).pipe(process.stdout);

//var result = toArray(input.pipe(stream(processor)), function(err, res){
//  console.log ('err: ' + inspect(err));
//  console.log ('res: ' + inspect(res));
//  console.log ('argsss: ' + inspect(arguments));
//});
//var result = toArray(input.pipe(stream(processor)));



//console.log (result);
//console.log ('RES: ' + inspect(result));
//result.then(function(){
//  console.timeEnd('All');
//  console.timeEnd('Processing');
//  console.log ('args: ' + inspect(arguments));
//});
