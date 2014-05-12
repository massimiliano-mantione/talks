#metaimport macros

var log! = data -> console.log data

var f = null

f = (err, data) ->
  if (err ?)
    throw err
  log! data


f(null, "OK")

f('KO')


var on-error = err -> console.log err
log! = data -> throw data

f = (!err, data, ~on-error) !-> log! data


