#metaimport './error-handling-function'

var
  fs = require 'fs'
  gm = require 'gm'
  inspect = (require 'util').inspect

var
  source = './img/src/'
  destination = './img/dst/'
  widths = [200, 200]

|:
  fs.readdir(source, #next)
  (!err, files, ~ #error-finding-files) !->
    files.forEach #next
  (filename, fileIndex) ->
    var image = gm(source + filename);
    image.size #next
  (!err, values, ~ #error-computing-size) !-> do!
    var aspect = values.width / values.height
    widths.forEach #next
  (width, widthIndex) ->
    var height = Math.round <- width / aspect
    var destinationFile = destination + 'w' + width + '_' + filename
    image.resize(width, height).write(destinationFile, #next)
  (!err, ~ #error-writing-file) !-> ()
  #where
    #error-finding-files = #-> throw new Error('Error finding files: ' + #it)
    #error-computing-size = #-> throw new Error('Error identifying file size: ' + #it)
    #error-writing-file = #-> throw new Error('Error writing file: ' + #it)
