##
# Cream - Makes Iced Coffee a little more palatable
#
# Mostly, these are things that save you typing when you're working
# with async functions that can be throwing errors at any minute
#
##

winston = require 'winston'
logger_ = winston

setLogger = (logger) ->
  """Sets the logger you want to use if it isn't vanilla winston"""

  logger_ = logger

checkError = (err, message, data, callback) ->
  """If err, then logs an error and throws that error as well
  
    The corresponding stack trace may be slightly harder to read
    since you'll have to look up one level, but this should save
    some typing when error checking

    """
  
  return unless err?

  # Log the error
  logger_.error message, data

  # Call the callback if one has been passed in
  callback err if callback?

  # Throw since we don't want to continue on in the execution
  # of the calling function 
  throw err

# Called `assert_` here since we want to use the built-in assert inside
# this function; we export this function as `assert`
assert_ = (shouldBeTrue, message, data, callback) ->
  """A convenience function for asserting in async programming"""


  # We want to actually call the callback here before throwing
  # One downside of doing things this way is that we lose the 
  # actual arguments of what's being asserted, but that may be 
  # outweighed by the convenience of doing things this way

  try
    assert shouldBeTrue, message
  catch err
    logger_.error "#{ err }", data
    callback err if callback?
    throw err

error = (message, data, callback) ->
  """Explcitly creates an error and then does the same thing as checkError

    This is useful in async programming if you write code that discovers an
    error, so you don't have an err coming back from another function, and
    so you need to create your own Error object, but you want everything
    to otherwise function the same as checkError

  """

  err = new Error message
  checkError err, message, data, callback

saveTo = (name, this_) ->
  """Returns a function that takes an async function and saves what
    it passes along into global[name]"""

  (fn, args...) ->
    args.push (err, val) ->
      if err?
        logger_.error "Error executing function, not saving in #{ name }"
      else
        global[name] = val
    fn.apply this_, args


deferThis = (fn, this_) ->
  """Exposes the `this` of a callback as the last argument to a new callback
    
      This is useful if you want to use defer where that callback goes and
      you need access to the `this` of that function; now it just adds it
      as an extra parameter to the callback which you can defer

      See the run_ method added to the database module for an example

      """

  ((args..., callback) ->
    args.push (err) ->
      callback err, this
    fn.apply this, args).bind this_


module.exports =
  checkError: checkError
  error: error
  assert: assert_
  deferThis: deferThis
  saveTo: saveTo
  setLogger: setLogger
