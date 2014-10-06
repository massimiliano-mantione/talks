#metamodule

  #keepmacro .:
    arity: binary
    precedence: MEMBER
    expand: (value, member) -> do
      var inspect = (require 'util').inspect
      var process-member = (member, members) -> do!
        members.unshift
          if (member.tag?())
            member.new-value member.get-simple-value()
          else if (member.array?)
            if (member.count == 1)
              member.at 0
            else do
              member.error ('Expected 1 selector instead of ' + member.count)
              ''
          else do
            member.error 'Invalid member'
            ''
      var process-member-expression = (member-expression, data) -> do!
        if (member-expression.id == '.:')
          var (v, m) = (member-expression.at 0, member-expression.at 1)
          process-member (m, data.members)
          process-member-expression (v, data)
        else
          data.value = member-expression
      var data = {
        value: null
        members: []
      }
      process-member (member, data.members)
      process-member-expression (value, data)
      ;console.log('expand .: data is ' + inspect data)
      if (data.members.length == 1)
        ` (~` (data.value)).get(~` (data.members[0]))
      else
        ` (~` (data.value)).get-in([(~` (data.members))])

  #keepmacro <--
    arity: binary
    precedence: ASSIGNMENT
    pre-expand: (value, mutator) ->
      var process-member = (member, members) -> do!
        members.unshift
          if (member.tag?())
            member.new-value member.get-simple-value()
          else if (member.array?)
            if (member.count == 1)
              member.at 0
            else do
              member.error ('Expected 1 selector instead of ' + member.count)
              ''
          else do
            member.error 'Invalid member'
            ''
      var process-member-expression = (member-expression, data) -> do!
        if (member-expression.id == '.:')
          var (v, m) = (member-expression.at 0, member-expression.at 1)
          process-member (m, data.members)
          process-member-expression (v, data)
        else
          data.value = member-expression
      var data = {
        value: null
        members: []
      }
      process-member-expression (value, data)
      if (data.members.length == 1)
        ` (~` (data.value)).set(~` (data.members[0]), ~`mutator)
      else
        ` (~` (data.value)).update-in([(~` (data.members))], #-> ~`mutator)


  #keepmacro <==
    arity: binary
    precedence: ASSIGNMENT
    pre-expand: (value, mutator) ->
      var process-member = (member, members) -> do!
        members.unshift
          if (member.tag?())
            member.new-value member.get-simple-value()
          else if (member.array?)
            if (member.count == 1)
              member.at 0
            else do
              member.error ('Expected 1 selector instead of ' + member.count)
              ''
          else do
            member.error 'Invalid member'
            ''
      var process-member-expression = (member-expression, data) -> do!
        if (member-expression.id == '.:')
          var (v, m) = (member-expression.at 0, member-expression.at 1)
          process-member (m, data.members)
          process-member-expression (v, data)
        else
          data.value = member-expression
      var data = {
        value: null
        members: []
      }
      process-member-expression (value, data)
      if (data.members.length == 1)
        ` (~` (data.value)).update(~` (data.members[0]), #-> ~`mutator)
      else
        ` (~` (data.value)).update-in([(~` (data.members))], #-> ~`mutator)
