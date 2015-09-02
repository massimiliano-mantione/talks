var Immutable, Chai, expect, _$0, _$1, _$2;
_$0: {
    _$1: {
    }
    _$2: {
        Immutable = require('immutable');
        Chai = require('chai');
        expect = Chai.expect;
    }
    describe('The talk', function () {
        return it('is all right', function () {
            return undefined;
        });
    });
    describe('immutable-mjs', function () {
        var m1, m2, m3, v, _$3, _$4, _$5;
        _$4: {
            _$5: {
            }
            beforeEach(function () {
                var _$6, _$7;
                _$7: {
                    m1 = Immutable.Map({
                        'a': 1,
                        'b': 2,
                        'c': 3,
                        'd': 4
                    });
                    m2 = Immutable.fromJS({ 'a': { 'b': 42 } });
                    m3 = Immutable.fromJS({
                        'a': {
                            'b': {
                                'c': [
                                    3,
                                    4,
                                    5
                                ]
                            }
                        }
                    });
                    _$6 = v = Immutable.Vector(1, 2, 3);
                    break _$7;
                }
                return _$6;
            });
            it('Can get a map property', function () {
                return expect(m1.get('a')).to.equal(1);
            });
            it('Can get into a map property', function () {
                return expect(m2.get('a').get('b')).to.equal(42);
            });
            it('Can get a vector element', function () {
                return expect(v.get(0)).to.equal(1);
            });
            it('Can set a map property', function () {
                var m, _$6, _$7;
                _$7: {
                    m = m1.set('a', 42);
                    _$6 = expect(m.get('a')).to.equal(42);
                    break _$7;
                }
                return _$6;
            });
            it('Can set into a map property', function () {
                var m, _$6, _$7;
                _$7: {
                    m = m2.updateIn([
                        'a',
                        'b'
                    ], function () {
                        return 0;
                    });
                    _$6 = expect(m.get('a').get('b')).to.equal(0);
                    break _$7;
                }
                return _$6;
            });
            it('Can update a map property', function () {
                var m, _$6, _$7;
                _$7: {
                    m = m1.update('a', function (__$arg$1) {
                        return __$arg$1 + 41;
                    });
                    _$6 = expect(m.get('a')).to.equal(42);
                    break _$7;
                }
                return _$6;
            });
            it('Can update into a map property', function () {
                var m, _$6, _$7;
                _$7: {
                    m = m2.updateIn([
                        'a',
                        'b'
                    ], function (__$arg$1) {
                        return __$arg$1 / 2;
                    });
                    _$6 = expect(m.get('a').get('b')).to.equal(21);
                    break _$7;
                }
                return _$6;
            });
            it('Can get a cursor', function () {
                var m, c, c1, _$6, _$7;
                _$7: {
                    m = null;
                    c = m1.cursor(['a'], function (__$arg$1) {
                        return m = __$arg$1;
                    });
                    expect(c.deref()).to.equal(1);
                    c1 = c.update(function () {
                        return 42;
                    });
                    expect(m.get('a')).to.equal(42);
                    expect(c.deref()).to.equal(1);
                    _$6 = expect(c1.deref()).to.equal(42);
                    break _$7;
                }
                return _$6;
            });
            it('Can get a deep cursor', function () {
                var m, c, _$6, _$7;
                _$7: {
                    m = null;
                    c = m3.cursor([
                        'a',
                        'b',
                        'c',
                        1
                    ], function (__$arg$1) {
                        return m = __$arg$1;
                    });
                    c.update(function () {
                        return 42;
                    });
                    _$6 = expect(m.get('a').get('b').get('c').get(1)).to.equal(42);
                    break _$7;
                }
                return _$6;
            });
            _$3 = undefined;
            break _$4;
        }
        return _$3;
    });
}
//# sourceMappingURL=test.js.map