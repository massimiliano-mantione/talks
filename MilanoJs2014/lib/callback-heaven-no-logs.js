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
                var $$__error$$, _$6, _$7;
                try {
                    _$7: {
                        if (err) {
                            throw err;
                        }
                        _$6 = files.forEach(function (filename, fileIndex) {
                            var image, _$8, _$9, _$10, _$11, errorComputingSize0;
                            _$9: {
                                image = gm(source + filename);
                                _$11: {
                                    errorComputingSize0 = function (__$arg$1) {
                                        var _$12;
                                        throw new Error('Error identifying file size: ' + __$arg$1);
                                        return _$12;
                                    };
                                    _$10 = function (err, values) {
                                        var aspect, $$__error$$, _$12, _$13, _$14, _$15;
                                        try {
                                            _$13: {
                                                if (err) {
                                                    throw err;
                                                }
                                                _$15: {
                                                    aspect = values.width / values.height;
                                                    widths.forEach(function (width, widthIndex) {
                                                        var height, destinationFile, _$16, _$17, _$18, _$19, errorWritingFile0;
                                                        _$17: {
                                                            height = Math.round(width / aspect);
                                                            destinationFile = destination + 'w' + width + '_' + filename;
                                                            _$19: {
                                                                errorWritingFile0 = function (__$arg$1) {
                                                                    var _$20;
                                                                    throw new Error('Error writing file: ' + __$arg$1);
                                                                    return _$20;
                                                                };
                                                                _$18 = function (err) {
                                                                    var $$__error$$, _$20, _$21;
                                                                    try {
                                                                        _$21: {
                                                                            if (err) {
                                                                                throw err;
                                                                            }
                                                                            _$20 = undefined;
                                                                            break _$21;
                                                                        }
                                                                    } catch ($$__error$$) {
                                                                        _$20 = errorWritingFile0($$__error$$);
                                                                    }
                                                                    return _$20;
                                                                };
                                                                break _$19;
                                                            }
                                                            _$16 = image.resize(width, height).write(destinationFile, _$18);
                                                            break _$17;
                                                        }
                                                        return _$16;
                                                    });
                                                    _$14 = undefined;
                                                    break _$15;
                                                }
                                                _$12 = _$14;
                                                break _$13;
                                            }
                                        } catch ($$__error$$) {
                                            _$12 = errorComputingSize0($$__error$$);
                                        }
                                        return _$12;
                                    };
                                    break _$11;
                                }
                                _$8 = image.size(_$10);
                                break _$9;
                            }
                            return _$8;
                        });
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
//# sourceMappingURL=callback-heaven-no-logs.js.map