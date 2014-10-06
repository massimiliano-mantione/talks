var fs = require('fs');
var gm = require('gm');
var inspect = require('util').inspect;

var source = './img/';
var destination = './dst/';
var widths = [200, 200];

fs.readdir(source, function(err, files) {
  console.log('Got files: ' + inspect(files));
  if (err) {
    throw new Error('Error finding files: ' + err);
  } else {
    files.forEach(function(filename, fileIndex) {
      console.log(filename);
      var image = gm(source + filename);
      image.size(function(err, values) {
        if (err) {
          throw new Error('Error identifying file size: ' + err);
        } else {
          console.log(filename + ' : ' + inspect(values));
          aspect = (values.width / values.height);
          widths.forEach(function(width, widthIndex) {
            height = Math.round(width / aspect);
            console.log('Resizing ' + filename + ' to ' + height + 'x' + height);
            var destinationFile = destination + 'w' + width + '_' + filename;
            console.log('Writing to ' + destinationFile);
            image.resize(width, height).write(destinationFile, function(err) {
              if (err) {
                throw new Error('Error writing file: ' + err);
              }
            });
          });
        }
      });
    });
  }
});
