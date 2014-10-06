var _$0;
_$0: {
    module.exports = function (ast) {
        var _$1, _$2, _$3, _$4, _$5, _$6;
        _$2: {
            _$3: {
                _$4: {
                    ast.defineSymbol(ast.createMacro('.:', 'binary', 'MEMBER', {
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
                                            if (memberExpression.id === '.:') {
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
                                            codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":36,"column":31},"end":{"line":36,"column":52}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":36,"column":27},"end":{"line":36,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":36,"column":10},"end":{"line":36,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"get","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":36,"column":28},"end":{"line":36,"column":28}},"args":[]}]},{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":36,"column":31},"end":{"line":36,"column":52}},"args":[]}]}');
                                            codeTag0.replaceTag('unquote1', data.value);
                                            codeTag0.replaceTag('unquote2', data.members[0]);
                                            _$9 = codeTag0;
                                            break _$10;
                                        }
                                    } else {
                                        _$11: {
                                            codeTag1 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":34},"end":{"line":38,"column":56}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":27},"end":{"line":38,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":10},"end":{"line":38,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"getIn","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":28},"end":{"line":38,"column":28}},"args":[]}]},{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":34},"end":{"line":38,"column":56}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":38,"column":35},"end":{"line":38,"column":55}},"args":[]}]}]}');
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
                    ast.defineSymbol(ast.createMacro('<--', 'binary', 'ASSIGNMENT', {
                        'preExpand': function (ast) {
                            var mutator, value, processMember, processMemberExpression, data, _$6, _$7, _$8, _$9, codeTag0, _$10, codeTag1;
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
                                        if (memberExpression.id === '.:') {
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
                                data = {
                                    'value': null,
                                    'members': []
                                };
                                processMemberExpression(value, data);
                                if (data.members.length === 1) {
                                    _$9: {
                                        codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":31},"end":{"line":70,"column":63}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":27},"end":{"line":70,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":10},"end":{"line":70,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"set","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":28},"end":{"line":70,"column":28}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":31},"end":{"line":70,"column":63}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":32},"end":{"line":70,"column":32}},"args":[]},{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":70,"column":54},"end":{"line":70,"column":54}},"args":[]}]}]}');
                                        codeTag0.replaceTag('unquote1', data.value);
                                        codeTag0.replaceTag('unquote2', data.members[0]);
                                        codeTag0.replaceTag('unquote3', mutator);
                                        _$8 = codeTag0;
                                        break _$9;
                                    }
                                } else {
                                    _$10: {
                                        codeTag1 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":37},"end":{"line":72,"column":74}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":27},"end":{"line":72,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":10},"end":{"line":72,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"updateIn","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":28},"end":{"line":72,"column":28}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":37},"end":{"line":72,"column":74}},"args":[{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":37},"end":{"line":72,"column":59}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":38},"end":{"line":72,"column":58}},"args":[]}]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":61},"end":{"line":72,"column":61}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":72,"column":65},"end":{"line":72,"column":65}},"args":[]}]}]}]}');
                                        codeTag1.replaceTag('unquote1', data.value);
                                        codeTag1.replaceTag('unquote2', data.members);
                                        codeTag1.replaceTag('unquote3', mutator);
                                        _$8 = codeTag1;
                                        break _$10;
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
                    ast.defineSymbol(ast.createMacro('<==', 'binary', 'ASSIGNMENT', {
                        'preExpand': function (ast) {
                            var mutator, value, processMember, processMemberExpression, data, _$7, _$8, _$9, _$10, codeTag0, _$11, codeTag1;
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
                                        if (memberExpression.id === '.:') {
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
                                if (data.members.length === 1) {
                                    _$10: {
                                        codeTag0 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":34},"end":{"line":105,"column":70}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":27},"end":{"line":105,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":10},"end":{"line":105,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"update","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":28},"end":{"line":105,"column":28}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":34},"end":{"line":105,"column":70}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":35},"end":{"line":105,"column":35}},"args":[]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":57},"end":{"line":105,"column":57}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":105,"column":61},"end":{"line":105,"column":61}},"args":[]}]}]}]}');
                                        codeTag0.replaceTag('unquote1', data.value);
                                        codeTag0.replaceTag('unquote2', data.members[0]);
                                        codeTag0.replaceTag('unquote3', mutator);
                                        _$9 = codeTag0;
                                        break _$10;
                                    }
                                } else {
                                    _$11: {
                                        codeTag1 = ast.fromJsonString('{"id":"<call>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":37},"end":{"line":107,"column":74}},"args":[{"id":".","kind":"builtin","val":".","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":27},"end":{"line":107,"column":27}},"args":[{"id":"<tag>","kind":"tag","val":"unquote1","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":10},"end":{"line":107,"column":26}},"args":[]},{"id":"<name>","kind":"tag","val":"updateIn","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":28},"end":{"line":107,"column":28}},"args":[]}]},{"id":"<tuple>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":37},"end":{"line":107,"column":74}},"args":[{"id":"<array>","kind":"builtin","val":null,"loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":37},"end":{"line":107,"column":59}},"args":[{"id":"<tag>","kind":"tag","val":"unquote2","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":38},"end":{"line":107,"column":58}},"args":[]}]},{"id":"#->","kind":"macro","val":"#->","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":61},"end":{"line":107,"column":61}},"args":[{"id":"<tag>","kind":"tag","val":"unquote3","loc":{"source":"/ssd/massi/talks/MilanoJs2014/lib/immutable-mjs.mjs","start":{"line":107,"column":65},"end":{"line":107,"column":65}},"args":[]}]}]}]}');
                                        codeTag1.replaceTag('unquote1', data.value);
                                        codeTag1.replaceTag('unquote2', data.members);
                                        codeTag1.replaceTag('unquote3', mutator);
                                        _$9 = codeTag1;
                                        break _$11;
                                    }
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