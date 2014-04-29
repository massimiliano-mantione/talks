#defmacro @
  arity: unary
  precedence: HIGH
  expand: (arg) ->
    `this. ~`arg

#defmacro **
  arity: binary
  precedence: MUL
  expand: (v1, v2) ->
    `Math.pow(~`v1, ~`v2)


; Simple vector definition, with scale and modulus method
var v = {
  x: 3
  y: 4
  scale: factor -> do
    this.x *= factor
    this.y *= factor
  modulus: #->
    Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5)
}

var v2 = {
  x: 3
  y: 4
  modulus: #->
    Math.pow(Math.pow(@x, 2) + Math.pow(@y, 2), 0.5)
}

var v3 = {
  x: 3
  y: 4
  modulus: #->
    (@x ** 2 + @y ** 2) ** 0.5
}

v3.modulus() == 5

; An object with properties
var o = {
  p: 42
  pn: null
}


typeof o.p
typeof o.p1

; What about ? for "is defined", ?? for "is defined and not null"?

#defmacro ?
  arity: post
  precedence: MEMBER
  expand: (val) ->
    var result = `do
      var \val = ~`val
      if (typeof \val != 'undefined')
        true
      else
        false
    result.resolveVirtual()
    result

#defmacro ??
  arity: post
  precedence: MEMBER
  expand: (val) ->
    var result = `do
      var \val = ~`val
      if (typeof \val != 'undefined' && \val != null)
        true
      else
        false
    result.resolveVirtual()
    result

; And .? for ". operator returning null if anything is wrong"?
#defmacro .?
  arity: binary
  precedence: HIGH
  expand: (obj, prop) ->
    var result = `do
      var \objVal = ~`obj
      if ((\objVal) ?? && (((\objVal).(~`prop))??))
        \objVal . ~` prop
      else
        null
    result.resolveVirtual()
    result

o.p ?
o.p ??
o.pn ?
o.pn ??
o.p1 ?
o.p1 ??
o.?p1

o.?p1 == null
o.?p1 == null

