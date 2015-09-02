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
  (!err, files, ~ #error-finding-files) !-> do!
    console.log ('Got files: ' + inspect files)
    files.forEach #next
  (filename, fileIndex) ->
    console.log filename
    var image = gm(source + filename);
    image.size #next
  (!err, values, ~ #error-computing-size) !-> do!
    console.log (filename + ' : ' + inspect values)
    var aspect = values.width / values.height
    widths.forEach #next
  (width, widthIndex) ->
    var height = Math.round <- width / aspect
    console.log ('Resizing ' + filename + ' to ' + height + 'x' + height)
    var destinationFile = destination + 'w' + width + '_' + filename
    console.log ('Writing to ' + destinationFile)
    image.resize(width, height).write(destinationFile, #next)
  (!err, ~ #error-writing-file) !-> ()
  #where
    #error-finding-files = #-> throw new Error('Error finding files: ' + #it)
    #error-computing-size = #-> throw new Error('Error identifying file size: ' + #it)
    #error-writing-file = #-> throw new Error('Error writing file: ' + #it)
