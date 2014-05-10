#metamodule
  #keepmacro ?
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

  #keepmacro !->
    arity: binary
    precedence: FUNCTION
    expand: (args, body) ->
      args = args.as-tuple()
      var error-args = []
      var catch-arg = null
      args.for-each
        (arg) -> do!
          if (arg.id == '!') do!
            var actual-arg = arg.at 0
            if (actual-arg.tag?())
              error-args.push <- actual-arg.get-tag()
              arg.replace-with <- actual-arg
            else
              arg.error 'Invalid (error) argument name'
              arg.remove()
          else if (arg.id == '~') do!
            var actual-arg = arg.at 0
            if (actual-arg.tag?())
              if (catch-arg == null)
                catch-arg = actual-arg.get-tag()
              else
                arg.error 'Cannot handle more than one catch argument'
            else
              arg.error 'Invalid (catch) argument name'
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
          catch (var \e)
            (~` ast.new-tag catch-arg) \e
        body.resolve-virtual()
      ` (~`args) -> (~`body)

  #keepmacro |:
    arity: unary
    precedence: HIGH
    expand: #->

  #keepmacro |>
    arity: binary
    precedence: LOW
    expand: (start, exprs) ->

      var inspect = (require 'util').inspect

      var named-exprs = Object.create(null)
      var exprs-data = []

      var new-data = (expr, name) -> {
          expr: expr
          name: name
          first-occurrences: []
          occurrences: []
          previous: null
          next: null
        }

      var replace-placeholder = (expr, ph-name, replacement) -> do!
        expr.for-each-recursive
          ph -> do!
            if (ph.placeholder?() && ph.get-simple-value() == ph-name)
              ph.replace-with replacement

      var analyze-expr = (expr) -> do!
        var data =
          if (expr.property?())
            if ((expr.at 0).tag?()) do
              var property-name = (expr.at 0).getTag()
              if (named-exprs[property-name]?) do
                var property-data = named-exprs[property-name]
                if (property-data.expr != null)
                  expr.error 'Redefined named expression'
                else
                  property-data.expr = expr.at 1
                property-data
              else do
                expr.error 'Named expression defined before use'
                new-data(expr.at 1, null)
            else do
              (expr.at 0).error 'Invalid expression name'
              new-data(expr.at 1, null)
          else
            new-data(expr, null)
        data.expr.for-each-recursive
          ph -> do!
            if (ph.placeholder?())
              var ph-value = ph.get-simple-value()
              if (ph-value == null || ph-value == '<:')
                if (data.previous == null)
                  data.previous = ph
                else
                  ph.error 'More than one <: reference specified'
              else if (ph-value == ':>')
                if (data.next == null)
                  data.next = ph
                else
                  ph.error 'More than one :> reference specified'
            else if (ph.id == '|:')
              var name = (ph.at 0).get-tag()
              if (name != null)
                var named-data =
                  if (named-exprs[name]?)
                    named-exprs[name]
                  else do
                    var d = new-data(null, name)
                    data.first-occurrences.push name
                    named-exprs[name] = d
                named-data.occurrences.push ph
              else
                ph.error 'Invalid expression name'
        if (data.name == null)
          exprs-data.push data

      if (!start.placeholder?())
        analyze-expr start
      if (exprs.tuple?())
        exprs.for-each analyze-expr
      else
        analyze-expr exprs

      exprs-data.for-each
        data -> do!
          var declaration =
            (name, expr) -> ` (var (~` (expr.newTag name).handle-as-tag-declaration()) = ~` expr)

          if (data.first-occurrences.length > 0)
            var expr = data.expr
            data.expr = ` do
              ~` data.first-occurrences.map
                name ->
                  if (named-exprs[name]? && named-exprs[name].expr != null) do
                    var named-expr = named-exprs[name]
                    named-expr.occurrences.for-each
                      occurrence -> occurrence.replace-with <- occurrence.newTag name
                    declaration(name, named-expr.expr)
                  else do
                    data.expr.error <- 'Undefined named expression ' + name
                    data.expr.newTag undefined
              ~` expr.newTag '$$dataExpr$$'
            data.expr.replace-tag('$$dataExpr$$', expr)

      var results = []
      var previous = null
      var next-reference = null
      var last = null
      while (exprs-data.length > 0)
        var current = exprs-data.shift()
        if (previous != null && previous.next != null)
          if (current.previous != null)
            current.previous.error 'Cannot have a # reference if the previous expression has a :> reference'
          ;previous.next.replace-with(current.expr)
          replace-placeholder(previous.expr, ':>', current.expr)
          last = previous
        else
          if (current.previous != null)
            if (last != null)
              ;current.previous.replace-with(last.expr)
              replace-placeholder(current.expr, '<:', last.expr)
            else
              current.previous.error 'Cannot have a <: reference with no previous expression'
          else
            if (previous != null)
              results.push <- previous.expr
          last = current
        previous = current
      if (last != null)
        results.push <- last.expr

      if (results.length == 1)
        results[0]
      else
        ` do! ~` results
