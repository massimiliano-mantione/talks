#metamodule
  #keepmacro !->
    arity: binary
    precedence: FUNCTION
    expand: (args, body) ->
      args = args.as-tuple()
      var error-args = []
      var catch-arg = null
      args.for-each
        (arg) -> do!
          if (arg.id == '!')
            var actual-arg = arg.at 0
            if (actual-arg.tag?())
              error-args.push <- actual-arg.get-tag()
              arg.replace-with <- actual-arg
            else
              arg.error 'Invalid (error) argument name'
              arg.remove()
          else if (arg.id == '~')
            if (catch-arg == null)
              catch-arg = arg.at 0
            else
              arg.error 'Cannot handle more than one catch argument'
            arg.remove()
      if (error-args.length > 0)
        var thrower = name -> ` (if (~` ast.new-tag name) throw (~` ast.new-tag name))
        body = ` do
          ~` error-args.map thrower
          ~` body
      if (catch-arg != null)
        body = `
          try
            ~` body
          catch (var $$__error$$)
            (~` catch-arg) $$__error$$
      (` (~`args) -> (~`body))
