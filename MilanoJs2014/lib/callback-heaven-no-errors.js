var fs, gm, inspect, source, destination, widths, _$0, _$1, _$2;
_$0: {
    _$1: {
        fs = require('fs');
        gm = require('gm');
        inspect = require('util').inspect;
    }
    _$2: {
        source = './img/src/';
        destination = './img/dst/';
        widths = [
            200,
            200
        ];
    }
    fs.readdir(source, function (err, files) {
        var _$3, _$4, _$5;
        _$4: {
            console.log('Got files: ' + inspect(files));
            if (err) {
                throw new Error('Error finding files: ' + err);
            } else {
                _$5 = files.forEach(function (filename, fileIndex) {
                    var image, _$6, _$7;
                    _$7: {
                        console.log(filename);
                        image = gm(source + filename);
                        _$6 = image.size(function (err, values) {
                            var aspect, _$8, _$9;
                            if (err) {
                                throw new Error('Error identifying file size: ' + err);
                            } else {
                                _$9: {
                                    console.log(filename + ' : ' + inspect(values));
                                    aspect = values.width / values.height;
                                    widths.forEach(function (width, widthIndex) {
                                        var height, destinationFile, _$10, _$11;
                                        _$11: {
                                            height = Math.round(width / aspect);
                                            console.log('Resizing ' + filename + ' to ' + height + 'x' + height);
                                            destinationFile = destination + 'w' + width + '_' + filename;
                                            console.log('Writing to ' + destinationFile);
                                            _$10 = image.resize(width, height).write(destinationFile, function (err) {
                                                var _$12, _$13;
                                                _$13: {
                                                    if (err) {
                                                        throw new Error('Error writing file: ' + err);
                                                    }
                                                    _$12 = undefined;
                                                    break _$13;
                                                }
                                                return _$12;
                                            });
                                            break _$11;
                                        }
                                        return _$10;
                                    });
                                    _$8 = undefined;
                                    break _$9;
                                }
                            }
                            return _$8;
                        });
                        break _$7;
                    }
                    return _$6;
                });
            }
            _$3 = _$5;
            break _$4;
        }
        return _$3;
    });
}
//# sourceMappingURL=callback-heaven-no-errors.js.map