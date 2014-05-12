#metaimport macros

var
  fs = require 'fs'
  gm = require 'gm'
  inspect = (require 'util').inspect

var
  source = './img/src/'
  destination = './img/dst/'
  widths = [200, 200]

|>
  fs.readdir(source, :>)
  (!err, files, ~error-finding-files) !->
    files.forEach :>
  (filename, fileIndex) ->
    var image = gm(source + filename);
    image.size :>
  (!err, values, ~error-computing-size) !-> do!
    var aspect = values.width / values.height
    widths.forEach :>
  (width, widthIndex) ->
    var height = Math.round <- width / aspect
    var destinationFile = destination + 'w' + width + '_' + filename
    image.resize(width, height).write(destinationFile, :>)
  (!err, ~error-writing-file) !-> ()
  error-finding-files: (err) -> throw new Error('Error finding files: ' + err)
  error-computing-size: (err) -> throw new Error('Error identifying file size: ' + err)
  error-writing-file: (err) -> throw new Error('Error writing file: ' + err)
