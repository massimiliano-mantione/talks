#metaimport macros

var process-data! = data -> console.log data

var f = null

f = (err, data) ->
  if (err ?)
    throw err
  process-data! data


f(undefined, "OK")

f('KO')


var on-error = err -> console.log err
process-data! = data -> throw 'ERROR: ' + data

f = (!err, data, ~on-error) !-> process-data! data


