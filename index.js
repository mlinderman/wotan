'use strict';

var app,
    bodyParser = require('body-parser'),
    express = require("express"),
    cors = require("cors"),

app = express();

require('./configure').config(function (err, runtimeConfig) {

    if (err) {
        console.log("unable to initialize app: " + err.message);
        process.exit();
    }

    app.use(bodyParser.json());

    // pass the configuration to all routes
    app.use(function (req, res, next) {
        req.config = runtimeConfig;
        next();
    });

    require('./routes')(app);

    process.on('exit', function () {
        runtimeConfig.shutdown(function(err, result) {
            if (err) {
                runtimeConfig.log.error('problem shutting down: ' + err);
            }
        });
        runtimeConfig.log.info('exiting');
    });

    process.on('SIGINT', function () {
        runtimeConfig.log.info("shutting down on request");
        process.exit();
    });

    app.listen(runtimeConfig.port, function () {
        console.log("\nWotan ready and listening on port " + runtimeConfig.port + "\n");
    });

});

// allow app endpoints to be tested
module.exports = app;
