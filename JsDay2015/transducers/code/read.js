var fs = require('fs');
var filename = require('process').argv[2] || 'data-small.log';
var stream = require('transduce-stream');
var lines = require('transduce/string/lines');
var U = require('underarm');
var inspect = require('util').inspect;

var input = fs.createReadStream(filename, {encoding: 'utf8'});

var transform = U().
  tap(function(v) { console.log(inspect(v)); });

//var data = input.pipe(stream(lines()));
var data = input;

data.on('data', transform.asCallback());

var inputEvent = function(name) {
  data.on(name, function() {
    console.log(name + ": " + inspect(arguments));
  });
};
//inputEvent('data');
//inputEvent('readable');
//inputEvent('end');
//inputEvent('error');
