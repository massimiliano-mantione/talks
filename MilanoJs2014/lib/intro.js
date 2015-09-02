var v;
v = {
    'x': 3,
    'y': 4,
    'scale': function (factor) {
        var _$0, _$1;
        _$1: {
            this.x *= factor;
            this.y *= factor;
            _$0 = undefined;
            break _$1;
        }
        return _$0;
    },
    'modulus': function () {
        return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5);
    }
};
//# sourceMappingURL=intro.js.map