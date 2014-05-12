

var v = {
  x: 3
  y: 4
  scale: factor -> do!
    this.x *= factor
    this.y *= factor
  modulus: #->
    Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 0.5)
}



'''

#defmacro @
  arity: unary
  precedence: HIGH
  expand: (arg) ->
    `this . ~`arg

#defmacro **
  arity: binary
  precedence: MUL
  expand: (v1, v2) ->
    `Math.pow(~`v1, ~`v2)


#defmacro -->
  arity: binary
  precedence: FUNCTION
  expand: (args, body) ->
    args = args.as-tuple()
    var valued-args = []
    args.for-each
      (arg) -> do!
        if (arg.id == '=')
          var arg-name = arg.at 0
          var arg-value = arg.at 1
          if (arg-name.tag?())
            valued-args.push <- arg
            arg.replace-with <- arg-name.copy()
          else
            arg.error 'Invalid (error) argument name'
            arg.remove()
    if (valued-args.length > 0)
      var value-assigner = arg -> `
        if (typeof (~` (arg.at 0).copy()) == 'undefined') (~` arg)
      body = ` do
        ~` valued-args.map value-assigner
        ~` body
    (` (~`args) -> (~`body))





var life = {
  answer: 42
  ; question: 'none'
  nothing: null
}

life.answer
life.question.toString()
life.nothing

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


#external process
process.stdin.on('data', #-> process.exit 0)
'''

