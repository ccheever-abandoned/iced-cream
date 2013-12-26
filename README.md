iced-cream
==========

A Node module to help write cleaner code, especially around error checking, when using Iced Coffee Script

**iced-cream** contains these functions:
    checkError

### _checkError(err, message, data, callback)_

Example:
   
    ic = require 'iced-cream'

        ...

    await
        db.run "CREATE TABLE IF NOT EXISTS my_table (some_columb INTEGER, last_updated_time INTEGER)", {}, defer err
    ic.checkError err, "Failed setting up my_table table. Bailing.", { db: db }, callback

`err` gets checked for an error from the deferred callback. If there is an error, then the `message` is logged and the error is thrown, so that you stop proceeding down your current code path. `data` is just extra data to be logged. `callback` is the callback passed into your async function. If it is a function, it will be called with `err` in either the success or failure case


### _error(message, data, callback)_

Example:
    ic = require 'iced-cream'

        ...

    # err from previous await block is null because everything
    # went fine, but we have a runtime problem we've detected based
    # on data we've received
    if someValue > maxValueItShouldBe
        ic.error "Your value is too big; we have a problem", { someValue: someValue, maxValueItShouldBe: maxValueItShouldBe }, callback

`message is the error messsge you want to log; `data` is additional data for hte log; and `callback` is the callback passed into your async function. A new `Error` object will be created and pass as `err` to the callback in this case. And from there, we will throw that Error so that things don't continue down this code path since there is a problem. If you do want to continue down this code path, but want to log the error, you should be able to just use your logging module

### _assert(shouldBeTrue, message, data, callback)

    saveTo
    deferThis
    setLogger
