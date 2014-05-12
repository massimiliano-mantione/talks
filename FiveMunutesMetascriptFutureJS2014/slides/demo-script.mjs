;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
IntroVector: 20s

Describe this object
Evaluate it
Evaluate modulus
Evaluate scale 2
Evaluate modulus
'''

; Simple vector object, with scale and modulus method

var v = {
  x: 3
  y: 4
  scale: factor -> do!
    this.x *= factor
    this.y *= factor
  modulus: #->
    Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5)
}



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
AtOperator: 5s

Change this.x into @
'''

; I want the Coffeescript @ operator!


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
AtMacro: 5s

Insert @ macro
'''

#defmacro @
  arity: unary
  precedence: HIGH
  expand: (arg) ->
    `this. ~`arg


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
Simpler: 5s

Say "I want simpler code"

'''

; I want simpler code

#defmacro @
  arity: unary
  precedence: HIGH
  expand: (arg) ->
    `this. ~`arg

var v = {
  x: 3
  y: 4
  scale: #-> do! (@x *= #1 , @y *= #1)
  modulus: #->
    Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5)
}

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
MathPow: 10s

Evaluate again:
v
v.x
v.modulus()
v.scale 3
v.modulus()

'''

; I also want ** to mean Math.pow ...

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

var v = {
  x: 3
  y: 4
  scale: #-> do! (this.x *= #1 , this.y *= #1)
  modulus: #-> (@x ** 2 + @y ** 2) ** 0.5
}

v.x
v.modulus()
v.scale 3



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
IntroObject: 10s

Describe this object
Evaluate it
Evaluate life.answer
Evaluate life.nothing
Evaluate life.question


Evaluate it
Evaluate modulus
Evaluate scale
Evaluate modulus
'''

; An object with properties



var life = {
  answer: 42
  ; question: 'none'
  nothing: null
}

life.answer
life.question.toString()
life.nothing


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
IntroMacros: 5s

Read comments
'''

; What about a ? operator for "is defined"?
; And ?? for "is defined and not null"?
; And also .? for ". operator returning null if anything is wrong"?


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
'''
UseMacros: 15s

Read comments
'''

; What about a ? operator for "is defined"?
; And ?? for "is defined and not null"?
; And also .? for ". operator returning null if anything is wrong"?

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

var life = {
  answer: 42
  ; question: 'none'
  nothing: null
}

life.answer
life.question
life.question.toString()
life.nothing





