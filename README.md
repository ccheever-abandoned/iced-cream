iced-cream
==========

A Node module to help write cleaner code, especially around error checking, when using Iced Coffee Script

**iced-cream** contains these functions:

### _checkError(err, message, data, callback)_

Example:
   
```coffee
    ic = require 'iced-cream'

        ...

    await
        db.run "CREATE TABLE IF NOT EXISTS my_table (some_columb INTEGER, last_updated_time INTEGER)", {}, defer err
    ic.checkError err, "Failed setting up my_table table. Bailing.", { db: db }, callback
```

`err` gets checked for an error from the deferred callback. If there is an error, then the `message` is logged and the error is thrown, so that you stop proceeding down your current code path. `data` is just extra data to be logged. `callback` is the callback passed into your async function. If it is a function, it will be called with `err` in either the success or failure case


### _error(message, data, callback)_

Example:
```coffee
    ic = require 'iced-cream'

        ...

    # err from previous await block is null because everything
    # went fine, but we have a runtime problem we've detected based
    # on data we've received
    if someValue > maxValueItShouldBe
        ic.error "Your value is too big; we have a problem", { someValue: someValue, maxValueItShouldBe: maxValueItShouldBe }, callback
```

`message` is the error messsge you want to log; `data` is additional data for hte log; and `callback` is the callback passed into your async function. A new `Error` object will be created and pass as `err` to the callback in this case. And from there, we will throw that Error so that things don't continue down this code path since there is a problem. If you do want to continue down this code path, but want to log the error, you should be able to just use your logging module

### _assert(shouldBeTrue, message, data, callback)_

Asserts that something is true; if not, it calls the callback with an appropriate value of `err` and throws that AssertionError to stop executing the current code path.

Example:

```coffee
    ic = require 'iced-cream'
    await
        db_.run_ "DELETE FROM users WHERE userId = $userId", { $userId: userId }, defer(err, result)
    ic.assert (result.changes == 1), "When deleting user from database, changed #{ result.changes } rows (should have been exactly 1)", { userId: userId, result: result }, callback
```

### *saveTo(name, this_)*

A common pattern when using the iced REPL is to want to call a function, 
capture its return value and then inspect and manipulate that value, or maybe
call another function with it. This is tricky in the world of async programming
since the value isn't actually returned but is instead passed on to the 
callback, which then passes that on to another callback, etc.

To be able to work more easily with things in the shell, you can 

```coffee
    ic = require 'iced-cream'
    model = require './model'
    ic.saveTo('feross') model.User.newUser, { name: "Feross Aboukhadijeh" }
```

And then once that code is finished running, the global variable `feross` will be set to the value of the new user object that was passed to the callback.

The `this_` parameter is optional and can be used if you want to store the 
value not as a global, but as a property of some other object (which you
would pass in as `this_`)


### *deferThis(fn, this_)*

This is useful for times when a function transmits some information to 
a callback by binding it to `this` instead of passing it as a parameter.
`deferThis` will add the value of `this` as an extra parameter to the 
callback when it gets called.

`fn` is the function you want to transform; `this_` is optional;
if you need the function to be a bound method, you can specify the 
object it should be bound to with `this_`.

Example:

One time when this is useful is when working with the node-sqlite3 
library

The reason for this  here is that .run only calls a callback with
one paramter -- err -- and to pass values, it binds the `this` of
the callback to an object with lastID and/or changes if applicable
but `defer` doesn't give us access to `this` in any easy way, so
we use a helper function -- `ic.deferThis` -- to wrap the
original function call so it will call the callback with `this`
not only bound to it but passed as a last parameter, which lets
us capture its value using `defer`.

Also, we add this method *inside* the await block so that it is·
available even before the database has finished opening, since
that will sometimes happen and the database API supports that

```coffee
    db_.run_ = ic.deferThis db_.run, db_
```

   
### _setLogger(logger)_

You won't normally need to call this, but if you have some custom logger
that implements a similar interface to `winston` then you can call `setLogger` on it, and it will be used instead of vanilla winston.

Example:
    
```coffee
    ic = require 'iced-cream'
    log = require './log'
    ic.setLogger log
```


