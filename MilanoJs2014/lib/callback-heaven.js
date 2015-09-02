var fs, gm, inspect, source, destination, widths, _$0, _$1, _$2, _$3, _$4, _$5, errorFindingFiles0;
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
    _$3: {
        _$5: {
            errorFindingFiles0 = function (__$arg$1) {
                var _$6;
                throw new Error('Error finding files: ' + __$arg$1);
                return _$6;
            };
            _$4 = function (err, files) {
                var $$__error$$, _$6, _$7, _$8, _$9;
                try {
                    _$7: {
                        if (err) {
                            throw err;
                        }
                        _$9: {
                            console.log('Got files: ' + inspect(files));
                            files.forEach(function (filename, fileIndex) {
                                var image, _$10, _$11, _$12, _$13, errorComputingSize0;
                                _$11: {
                                    console.log(filename);
                                    image = gm(source + filename);
                                    _$13: {
                                        errorComputingSize0 = function (__$arg$1) {
                                            var _$14;
                                            throw new Error('Error identifying file size: ' + __$arg$1);
                                            return _$14;
                                        };
                                        _$12 = function (err, values) {
                                            var aspect, $$__error$$, _$14, _$15, _$16, _$17;
                                            try {
                                                _$15: {
                                                    if (err) {
                                                        throw err;
                                                    }
                                                    _$17: {
                                                        console.log(filename + ' : ' + inspect(values));
                                                        aspect = values.width / values.height;
                                                        widths.forEach(function (width, widthIndex) {
                                                            var height, destinationFile, _$18, _$19, _$20, _$21, errorWritingFile0;
                                                            _$19: {
                                                                height = Math.round(width / aspect);
                                                                console.log('Resizing ' + filename + ' to ' + height + 'x' + height);
                                                                destinationFile = destination + 'w' + width + '_' + filename;
                                                                console.log('Writing to ' + destinationFile);
                                                                _$21: {
                                                                    errorWritingFile0 = function (__$arg$1) {
                                                                        var _$22;
                                                                        throw new Error('Error writing file: ' + __$arg$1);
                                                                        return _$22;
                                                                    };
                                                                    _$20 = function (err) {
                                                                        var $$__error$$, _$22, _$23;
                                                                        try {
                                                                            _$23: {
                                                                                if (err) {
                                                                                    throw err;
                                                                                }
                                                                                _$22 = undefined;
                                                                                break _$23;
                                                                            }
                                                                        } catch ($$__error$$) {
                                                                            _$22 = errorWritingFile0($$__error$$);
                                                                        }
                                                                        return _$22;
                                                                    };
                                                                    break _$21;
                                                                }
                                                                _$18 = image.resize(width, height).write(destinationFile, _$20);
                                                                break _$19;
                                                            }
                                                            return _$18;
                                                        });
                                                        _$16 = undefined;
                                                        break _$17;
                                                    }
                                                    _$14 = _$16;
                                                    break _$15;
                                                }
                                            } catch ($$__error$$) {
                                                _$14 = errorComputingSize0($$__error$$);
                                            }
                                            return _$14;
                                        };
                                        break _$13;
                                    }
                                    _$10 = image.size(_$12);
                                    break _$11;
                                }
                                return _$10;
                            });
                            _$8 = undefined;
                            break _$9;
                        }
                        _$6 = _$8;
                        break _$7;
                    }
                } catch ($$__error$$) {
                    _$6 = errorFindingFiles0($$__error$$);
                }
                return _$6;
            };
            break _$5;
        }
        fs.readdir(source, _$4);
    }
}
//# sourceMappingURL=callback-heaven.js.map