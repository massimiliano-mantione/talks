#external
  describe
  it
  before-each

var
  Immutable = require 'immutable'
  Chai = require 'chai'
  expect = Chai.expect

#metaimport '../lib/immutable-mjs'

describe
  'The talk'
  #->
    it
      'is all right'
      #->

describe
  'immutable-mjs'
  #-> do!
    var (m1, m2, m3, v)

    before-each #->
      m1 = Immutable.Map {a:1, b:2, c:3, d:4}
      m2 = Immutable.fromJS {a:{b:42}}
      m3 = Immutable.fromJS {a:{b:{c:[3,4,5]}}}
      v = Immutable.Vector (1, 2, 3)

    it
      'Can get a map property'
      #-> expect(m1..a).to.equal 1

    it
      'Can get into a map property'
      #-> expect(m2..a..b).to.equal 42

    it
      'Can get a vector element'
      #-> expect(v..[0]).to.equal 1

    it
      'Can set a map property'
      #->
        var m = (m1..a ..= 42)
        expect(m..a).to.equal 42

    it
      'Can set into a map property'
      #->
        var m = (m2..a..b ..= 0)
        expect(m..a..b).to.equal 0

    it
      'Can update a map property'
      #->
        var m = (m1..a ..= #it + 41)
        expect(m..a).to.equal 42

    it
      'Can update into a map property'
      #->
        var m = (m2..a..b ..= #it / 2)
        expect(m..a..b).to.equal 21

    it
      'Can get a cursor'
      #->
        var m = null
        var c = (m1..a ..?= (m = #it))
        c ..= 42
        expect(m..a).to.equal 42

    it
      'Can get a deep cursor'
      #->
        var m = null
        var c = (m3..a..b..c..[1] ..?= (m = #it))
        c ..= 42
        expect(m..a..b..c..[1]).to.equal 42
