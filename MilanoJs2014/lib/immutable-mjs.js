var _$0;
_$0: {
    module.exports = function (ast) {
        var _$1, _$2, _$3, _$4, _$5, _$6;
        _$2: {
            _$3: {
                _$4: {
                    ast.defineSymbol(ast.createMacro('..', 'binary', 'MEMBER', {
                        'expand': function (ast) {
                            var member, value, inspect, processMember, processMemberExpression, data, _$5, _$6, _$7, _$8, _$9, _$10, codeTag0, _$11, codeTag1;
                            _$6: {
                                member = ast.at(1);
                                value = ast.at(0);
                                _$8: {
                                    inspect = require('util').inspect;
                                    processMember = function (member, members) {
                                        var _$9, _$10, _$11, _$12, _$13;
                                        _$10: {
                                            if (member.isTag()) {
                                                _$11 = member.newValue(member.getSimpleValue());
                                            } else {
                                                if (member.isArray) {
                                                    if (member.count === 1) {
                                                        _$11 = member.at(0);
                                                    } else {
                                                        _$12: {
                                                            member.error('Expected 1 selector instead of ' + member.count);
                                                            _$11 = '';
                                                            break _$12;
                                                        }
                                                    }
                                                } else {
                                                    _$13: {
                                                        member.error('Invalid member');
                                                        _$11 = '';
                                                        break _$13;
                                                    }
                                                }
                                            }
                                            members.unshift(_$11);
                                            _$9 = undefined;
                                            break _$10;
                                        }
                                        return _$9;
                                    };
                                    processMemberExpression = function (memberExpression, data) {
                                        var v, m, _$9, _$10, _$11, _$12, _$13;
                                        _$10: {
                                            if (memberExpression.id === '..') {
                                                _$11: {
                                                    _$12 = memberExpression.at(0);
                                                    _$13 = memberExpression.at(1);
                                                    v = _$12;
                                                    m = _$13;
                                                    processMember(m, data.members);
                                                    processMemberExpression(v, data);
                                                }
                                            } else {
                                                data.value = memberExpression;
                                            }
                                            _$9 = undefined;
                                            break _$10;
                                        }
                                        return _$9;
                                    };
                                    data = {
                                        'value': null,
                                        'members': []
                                    };
                                    processMember(member, data.members);
                                    processMemberExpression(value, data);
                                    if (data.members.length === 1) {
                                        _$10: {
                                            codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":35,"column":31},"end":{"line":35,"column":52}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":35,"column":27},"end":{"line":35,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":35,"column":10},"end":{"line":35,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"get","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":35,"column":28},"end":{"line":35,"column":28}},"args":[]}]},{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":35,"column":31},"end":{"line":35,"column":52}},"args":[]}]}');
                                            codeTag0.replaceTag('unquote1', data.value);
                                            codeTag0.replaceTag('unquote2', data.members[0]);
                                            _$9 = codeTag0;
                                            break _$10;
                                        }
                                    } else {
                                        _$11: {
                                            codeTag1 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":34},"end":{"line":37,"column":56}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":27},"end":{"line":37,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":10},"end":{"line":37,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"getIn","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":28},"end":{"line":37,"column":28}},"args":[]}]},{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":34},"end":{"line":37,"column":56}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":37,"column":35},"end":{"line":37,"column":55}},"args":[]}]}]}');
                                            codeTag1.replaceTag('unquote1', data.value);
                                            codeTag1.replaceTag('unquote2', data.members);
                                            _$9 = codeTag1;
                                            break _$11;
                                        }
                                    }
                                    _$7 = _$9;
                                    break _$8;
                                }
                                _$5 = _$7;
                                break _$6;
                            }
                            return _$5;
                        }
                    }));
                }
                _$5: {
                    ast.defineSymbol(ast.createMacro('..=', 'binary', 'ASSIGNMENT', {
                        'preExpand': function (ast) {
                            var mutator, value, processMember, processMemberExpression, expressionContainsIt, data, _$6, _$7, _$8, _$9, codeTag0, _$10, codeTag1, _$11, codeTag2, _$12, codeTag3;
                            _$7: {
                                mutator = ast.at(1);
                                value = ast.at(0);
                                processMember = function (member, members) {
                                    var _$8, _$9, _$10, _$11, _$12;
                                    _$9: {
                                        if (member.isTag()) {
                                            _$10 = member.newValue(member.getSimpleValue());
                                        } else {
                                            if (member.isArray) {
                                                if (member.count === 1) {
                                                    _$10 = member.at(0);
                                                } else {
                                                    _$11: {
                                                        member.error('Expected 1 selector instead of ' + member.count);
                                                        _$10 = '';
                                                        break _$11;
                                                    }
                                                }
                                            } else {
                                                _$12: {
                                                    member.error('Invalid member');
                                                    _$10 = '';
                                                    break _$12;
                                                }
                                            }
                                        }
                                        members.unshift(_$10);
                                        _$8 = undefined;
                                        break _$9;
                                    }
                                    return _$8;
                                };
                                processMemberExpression = function (memberExpression, data) {
                                    var v, m, _$8, _$9, _$10, _$11, _$12;
                                    _$9: {
                                        if (memberExpression.id === '..') {
                                            _$10: {
                                                _$11 = memberExpression.at(0);
                                                _$12 = memberExpression.at(1);
                                                v = _$11;
                                                m = _$12;
                                                processMember(m, data.members);
                                                processMemberExpression(v, data);
                                            }
                                        } else {
                                            data.value = memberExpression;
                                        }
                                        _$8 = undefined;
                                        break _$9;
                                    }
                                    return _$8;
                                };
                                expressionContainsIt = function (__$arg$1) {
                                    var i, _$8, _$9, _$10, _$11, _$12;
                                    if (__$arg$1.isPlaceholder() && __$arg$1.getSimpleValue() === '#it') {
                                        _$8 = true;
                                    } else {
                                        _$9: {
                                            i = 0;
                                            _$10:
                                                while (true) {
                                                    if (i < __$arg$1.count) {
                                                        _$11: {
                                                            _$12: {
                                                                if (expressionContainsIt(__$arg$1.at(i))) {
                                                                    return true;
                                                                }
                                                                ++i;
                                                            }
                                                            continue;
                                                        }
                                                    }
                                                    break _$10;
                                                }
                                            _$8 = false;
                                            break _$9;
                                        }
                                    }
                                    return _$8;
                                };
                                data = {
                                    'value': null,
                                    'members': []
                                };
                                processMemberExpression(value, data);
                                if (data.members.length === 0) {
                                    _$9: {
                                        codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":34},"end":{"line":80,"column":48}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":27},"end":{"line":80,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":10},"end":{"line":80,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"update","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":28},"end":{"line":80,"column":28}},"args":[]}]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":34},"end":{"line":80,"column":48}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":80,"column":39},"end":{"line":80,"column":39}},"args":[]}]}]}');
                                        codeTag0.replaceTag('unquote1', data.value);
                                        codeTag0.replaceTag('unquote2', mutator);
                                        _$8 = codeTag0;
                                        break _$9;
                                    }
                                } else {
                                    if (data.members.length === 1) {
                                        if (expressionContainsIt(mutator)) {
                                            _$10: {
                                                codeTag1 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":36},"end":{"line":83,"column":72}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":29},"end":{"line":83,"column":29}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":12},"end":{"line":83,"column":28}},"args":[]},{"id":"<name>","kind":"tag","val":"update","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":30},"end":{"line":83,"column":30}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":36},"end":{"line":83,"column":72}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":37},"end":{"line":83,"column":37}},"args":[]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":59},"end":{"line":83,"column":59}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":83,"column":63},"end":{"line":83,"column":63}},"args":[]}]}]}]}');
                                                codeTag1.replaceTag('unquote1', data.value);
                                                codeTag1.replaceTag('unquote2', data.members[0]);
                                                codeTag1.replaceTag('unquote3', mutator);
                                                _$8 = codeTag1;
                                                break _$10;
                                            }
                                        } else {
                                            _$11: {
                                                codeTag2 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":33},"end":{"line":85,"column":65}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":29},"end":{"line":85,"column":29}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":12},"end":{"line":85,"column":28}},"args":[]},{"id":"<name>","kind":"tag","val":"set","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":30},"end":{"line":85,"column":30}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":33},"end":{"line":85,"column":65}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":34},"end":{"line":85,"column":34}},"args":[]},{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":85,"column":56},"end":{"line":85,"column":56}},"args":[]}]}]}');
                                                codeTag2.replaceTag('unquote1', data.value);
                                                codeTag2.replaceTag('unquote2', data.members[0]);
                                                codeTag2.replaceTag('unquote3', mutator);
                                                _$8 = codeTag2;
                                                break _$11;
                                            }
                                        }
                                    } else {
                                        _$12: {
                                            codeTag3 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":37},"end":{"line":87,"column":74}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":27},"end":{"line":87,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":10},"end":{"line":87,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"updateIn","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":28},"end":{"line":87,"column":28}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":37},"end":{"line":87,"column":74}},"args":[{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":37},"end":{"line":87,"column":59}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":38},"end":{"line":87,"column":58}},"args":[]}]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":61},"end":{"line":87,"column":61}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":87,"column":65},"end":{"line":87,"column":65}},"args":[]}]}]}]}');
                                            codeTag3.replaceTag('unquote1', data.value);
                                            codeTag3.replaceTag('unquote2', data.members);
                                            codeTag3.replaceTag('unquote3', mutator);
                                            _$8 = codeTag3;
                                            break _$12;
                                        }
                                    }
                                }
                                _$6 = _$8;
                                break _$7;
                            }
                            return _$6;
                        }
                    }));
                }
                _$6: {
                    ast.defineSymbol(ast.createMacro('..?=', 'binary', 'ASSIGNMENT', {
                        'preExpand': function (ast) {
                            var mutator, value, processMember, processMemberExpression, data, _$7, _$8, _$9, _$10, codeTag0;
                            _$8: {
                                mutator = ast.at(1);
                                value = ast.at(0);
                                processMember = function (member, members) {
                                    var _$9, _$10, _$11, _$12, _$13;
                                    _$10: {
                                        if (member.isTag()) {
                                            _$11 = member.newValue(member.getSimpleValue());
                                        } else {
                                            if (member.isArray) {
                                                if (member.count === 1) {
                                                    _$11 = member.at(0);
                                                } else {
                                                    _$12: {
                                                        member.error('Expected 1 selector instead of ' + member.count);
                                                        _$11 = '';
                                                        break _$12;
                                                    }
                                                }
                                            } else {
                                                _$13: {
                                                    member.error('Invalid member');
                                                    _$11 = '';
                                                    break _$13;
                                                }
                                            }
                                        }
                                        members.unshift(_$11);
                                        _$9 = undefined;
                                        break _$10;
                                    }
                                    return _$9;
                                };
                                processMemberExpression = function (memberExpression, data) {
                                    var v, m, _$9, _$10, _$11, _$12, _$13;
                                    _$10: {
                                        if (memberExpression.id === '..') {
                                            _$11: {
                                                _$12 = memberExpression.at(0);
                                                _$13 = memberExpression.at(1);
                                                v = _$12;
                                                m = _$13;
                                                processMember(m, data.members);
                                                processMemberExpression(v, data);
                                            }
                                        } else {
                                            data.value = memberExpression;
                                        }
                                        _$9 = undefined;
                                        break _$10;
                                    }
                                    return _$9;
                                };
                                data = {
                                    'value': null,
                                    'members': []
                                };
                                processMemberExpression(value, data);
                                _$10: {
                                    codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":32},"end":{"line":119,"column":69}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":25},"end":{"line":119,"column":25}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":8},"end":{"line":119,"column":24}},"args":[]},{"id":"<name>","kind":"tag","val":"cursor","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":26},"end":{"line":119,"column":26}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":32},"end":{"line":119,"column":69}},"args":[{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":32},"end":{"line":119,"column":54}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":33},"end":{"line":119,"column":53}},"args":[]}]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":56},"end":{"line":119,"column":56}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":119,"column":60},"end":{"line":119,"column":60}},"args":[]}]}]}]}');
                                    codeTag0.replaceTag('unquote1', data.value);
                                    codeTag0.replaceTag('unquote2', data.members);
                                    codeTag0.replaceTag('unquote3', mutator);
                                    _$9 = codeTag0;
                                    break _$10;
                                }
                                _$7 = _$9;
                                break _$8;
                            }
                            return _$7;
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
//# sourceMappingURL=immutable-mjs.js.map