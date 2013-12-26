// Generated by IcedCoffeeScript 1.6.3-i
(function() {
  var assert_, checkError, deferThis, error, logger_, saveTo, setLogger, winston,
    __slice = [].slice;

  winston = require('winston');

  logger_ = winston;

  setLogger = function(logger) {
    "Sets the logger you want to use if it isn't vanilla winston";
    return logger_ = logger;
  };

  checkError = function(err, message, data, callback) {
    "If err, then logs an error and throws that error as well\n\n  The corresponding stack trace may be slightly harder to read\n  since you'll have to look up one level, but this should save\n  some typing when error checking\n";
    if (err == null) {
      return;
    }
    logger_.error(message, data);
    if (callback != null) {
      callback(err);
    }
    throw err;
  };

  assert_ = function(shouldBeTrue, message, data, callback) {
    "A convenience function for asserting in async programming";
    var err;
    try {
      return assert(shouldBeTrue, message);
    } catch (_error) {
      err = _error;
      logger_.error("" + err, data);
      if (callback != null) {
        callback(err);
      }
      throw err;
    }
  };

  error = function(message, data, callback) {
    "Explcitly creates an error and then does the same thing as checkError\n\nThis is useful in async programming if you write code that discovers an\nerror, so you don't have an err coming back from another function, and\nso you need to create your own Error object, but you want everything\nto otherwise function the same as checkError\n";
    var err;
    err = new Error(message);
    return checkError(err, message, data, callback);
  };

  saveTo = function(name, this_) {
    "Returns a function that takes an async function and saves what\nit passes along into global[name]";
    return function() {
      var args, fn;
      fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      args.push(function(err, val) {
        if (err != null) {
          return logger_.error("Error executing function, not saving in " + name);
        } else {
          return global[name] = val;
        }
      });
      return fn.apply(this_, args);
    };
  };

  deferThis = function(fn, this_) {
    "Exposes the `this` of a callback as the last argument to a new callback\n\n  This is useful if you want to use defer where that callback goes and\n  you need access to the `this` of that function; now it just adds it\n  as an extra parameter to the callback which you can defer\n\n  See the run_ method added to the database module for an example\n";
    return (function() {
      var args, callback, _i;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), callback = arguments[_i++];
      args.push(function(err) {
        return callback(err, this);
      });
      return fn.apply(this, args);
    }).bind(this_);
  };

  module.exports = {
    checkError: checkError,
    error: error,
    assert: assert_,
    deferThis: deferThis,
    saveTo: saveTo,
    setLogger: setLogger
  };

}).call(this);