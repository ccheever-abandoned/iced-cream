iced-cream
==========

A Node module to help write cleaner code, especially around error checking, when using Iced Coffee Script

**iced-cream** contains these functions:
    checkError

_`checkError(err, message, data, callback)`_

Example:
   
    ic = require 'iced-cream'

        ...

    await
        db.run "CREATE TABLE IF NOT EXISTS my_table (some_columb INTEGER, last_updated_time INTEGER)", {}, defer err
    ic.checkError err, "Failed setting up my_table table. Bailing.", { db: db }, callback

`err` gets checked for an error from the deferred callback. If there is an error, then the `message` is logged and the error is thrown, so that you stop proceeding down your current code path. `data` is just extra data to be logged. `callback` is the callback passed into your async function. If it is a function, it will be called with `err` in either the success or failure case


    error
    assert
    saveTo
    deferThis
    setLogger
