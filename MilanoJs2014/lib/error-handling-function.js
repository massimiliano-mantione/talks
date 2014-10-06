var _$0;
_$0: {
    module.exports = function (ast) {
        var _$1, _$2, _$3, _$4;
        _$2: {
            _$3: {
                _$4: {
                    ast.defineSymbol(ast.createMacro('!->', 'binary', 'FUNCTION', {
                        'expand': function (ast) {
                            var body, args, errorArgs, catchArg, thrower, _$5, _$6, _$7, _$8, _$9, codeTag0, _$10, _$11, codeTag1, _$12, _$13, codeTag2;
                            _$6: {
                                body = ast.at(1);
                                args = ast.at(0);
                                args = args.asTuple();
                                errorArgs = [];
                                catchArg = null;
                                args.forEach(function (arg) {
                                    var actualArg, _$7, _$8, _$9, _$10, _$11, _$12;
                                    _$8: {
                                        if (arg.id === '!') {
                                            _$9: {
                                                actualArg = arg.at(0);
                                                if (actualArg.isTag()) {
                                                    _$10: {
                                                        errorArgs.push(actualArg.getTag());
                                                        arg.replaceWith(actualArg);
                                                    }
                                                } else {
                                                    _$11: {
                                                        arg.error('Invalid (error) argument name');
                                                        arg.remove();
                                                    }
                                                }
                                            }
                                        } else {
                                            if (arg.id === '~') {
                                                _$12: {
                                                    if (catchArg === null) {
                                                        catchArg = arg.at(0);
                                                    } else {
                                                        arg.error('Cannot handle more than one catch argument');
                                                    }
                                                    arg.remove();
                                                }
                                            }
                                        }
                                        _$7 = undefined;
                                        break _$8;
                                    }
                                    return _$7;
                                });
                                if (errorArgs.length > 0) {
                                    _$7: {
                                        thrower = function (name) {
                                            var _$8, _$9, codeTag0;
                                            _$9: {
                                                codeTag0 = ast.fromJsonString('{"id":"if","kind":"builtin","val":"if","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":26,"column":32},"end":{"line":26,"column":85}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":26,"column":36},"end":{"line":26,"column":56}},"args":[]},{"id":"throw","kind":"builtin","val":"throw","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":26,"column":58},"end":{"line":26,"column":58}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":26,"column":64},"end":{"line":26,"column":84}},"args":[]}]}]}');
                                                codeTag0.replaceTag('unquote1', ast.newTag(name));
                                                codeTag0.replaceTag('unquote2', ast.newTag(name));
                                                _$8 = codeTag0;
                                                break _$9;
                                            }
                                            return _$8;
                                        };
                                        _$9: {
                                            codeTag0 = ast.fromJsonString('{"id":"<do>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":27,"column":17},"end":{"line":30,"column":6}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":28,"column":10},"end":{"line":28,"column":10}},"args":[]},{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":29,"column":10},"end":{"line":29,"column":10}},"args":[]}]}');
                                            codeTag0.replaceTag('unquote1', errorArgs.map(thrower));
                                            codeTag0.replaceTag('unquote2', body);
                                            _$8 = codeTag0;
                                            break _$9;
                                        }
                                        body = _$8;
                                    }
                                }
                                if (catchArg !== null) {
                                    _$11: {
                                        codeTag1 = ast.fromJsonString('{"id":"try","kind":"builtin","val":"try","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":32,"column":10},"end":{"line":36,"column":6}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":33,"column":12},"end":{"line":34,"column":10}},"args":[]},{"id":"catch","kind":"builtin","val":"catch","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":34,"column":10},"end":{"line":34,"column":10}},"args":[{"id":"<tagDeclaration>","kind":"tag","val":"$$__error$$","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":34,"column":16},"end":{"line":34,"column":32}},"args":[]},{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":35,"column":12},"end":{"line":36,"column":6}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":35,"column":12},"end":{"line":35,"column":25}},"args":[]},{"id":"<tag>","kind":"tag","val":"$$__error$$","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":35,"column":27},"end":{"line":35,"column":27}},"args":[]}]}]}]}');
                                        codeTag1.replaceTag('unquote1', body);
                                        codeTag1.replaceTag('unquote2', catchArg);
                                        _$10 = codeTag1;
                                        break _$11;
                                    }
                                    body = _$10;
                                }
                                _$13: {
                                    codeTag2 = ast.fromJsonString('{"id":"->","kind":"builtin","val":"->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":36,"column":18},"end":{"line":36,"column":18}},"args":[{"id":"<argument>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":36,"column":9},"end":{"line":36,"column":16}},"args":[]},{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/error-handling-function.mjs","start":{"line":36,"column":21},"end":{"line":36,"column":28}},"args":[]}]}');
                                    codeTag2.replaceTag('unquote1', args);
                                    codeTag2.replaceTag('unquote2', body);
                                    _$12 = codeTag2;
                                    break _$13;
                                }
                                _$5 = _$12;
                                break _$6;
                            }
                            return _$5;
                        }
                    }));
                }
            }
            _$1 = null;
            break _$2;
        }
        return _$1;
    };
}
//# sourceMappingURL=error-handling-function.js.map