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
  fs.readdir(source, :>
  (err, files) ->
    console.log <- 'Got files: ' + inspect(files)
    if (err)
      throw new Error('Error finding files: ' + err)
    else
      files.forEach :>
  (filename, fileIndex) ->
    console.log filename
    var image = gm(source + filename);
    image.size :>
  (err, values) ->
    if (err)
      throw new Error('Error identifying file size: ' + err)
    else
      console.log(filename + ' : ' + inspect(values));
      aspect = (values.width / values.height);
      widths.forEach :>
  (width, widthIndex) ->
    height = Math.round(width / aspect);
    console.log('Resizing ' + filename + ' to ' + height + 'x' + height);
    var destinationFile = destination + 'w' + width + '_' + filename;
    console.log('Writing to ' + destinationFile);
    image.resize(width, height).write(destinationFile, :>)
    err ->
      if (err) throw new Error('Error writing file: ' + err)
