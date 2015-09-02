var
  R = require('ramda')
  fs = require('fs')
  inspect = require('util').inspect

var log = R.curry
  (m, v) ->
    console.log('LOG ' + m + ':' + inspect(v))
    v

var filename = require('process').argv[2] || 'data-small.log'

console.time('All')
var input = fs.readFileSync(filename, {encoding: 'utf8'})

var isGet = R.test(new RegExp 'GET \\/')
var notStatic = #-> ! (R.test(new RegExp 'GET \\/static', #it))
var isPage = #-> (isGet #it) && (notStatic #it)

var splitLine = #->
  var pattern = '^([0-9\\.]+)[^"]+"([^"]+)/'
  var m = #it.match (new RegExp pattern)
  if (m != null) do
    m.shift()
    m
  else null

var toURL = #-> |:
    #it.split(' ')
    #.slice(1, 2)
    R.prepend('http://my-domain.com', #)
    #.join ''

var transformSecondItem = R.curry
  (f, pair) -> [pair[0], f(pair[1])]
var secondItemToUrl = transformSecondItem(toURL);

var secondItemToUrlUsingZip = R.pipe
  R.zip([R.identity, toURL])
  R.map( (pair) -> pair[0] (pair[1]))


var processor = #-> |:
    #it.split('\n')
    R.filter(isGet, #)
    #.map splitLine
    #.map secondItemToUrl
    #.map(R.join(' visited '))
    #.map(#-> #it + '\n')


console.time('Processing');
var result = R.join('', processor(input))
; var result = R.into('', R.identity, processor(input));
console.timeEnd('Processing')
console.timeEnd('All')

; console.log (result)
