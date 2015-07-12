'use strict';

var _ = require('underscore'),
    async = require('async'),
    bunyan = require("bunyan"),
    config = {},
    MongoClient = require("mongodb").MongoClient,
    appName = 'WOTAN';

config.shutdown = function (shutDownCallback) {
    // use async to handle accommodate more than one shutdown activity, even though we only have one now
    async.parallel(
        [
            function (callback) {
                config.mongo[appName].db.close();
                callback(null, true);
            }
        ],
        function (err, results) {
            if (err) {
                config.log.warn('unable to shut down completely: ' + err.message);
            } else {
                config.log.info('shutdown complete');
                isInitialized = false;
                shutDownCallback();
            }
        }
    );
};

var init = function (configCallback) {
    // middleware - logging, etc.
    // TBD: externalize all configurations into environment specific files

    config.mongo = {
        isDBLoggingEnabled: false,
        connectionPoolName: 'mongoPool',
        connectionPoolSizeMax: 5,
        connectionPoolSizeMin: 2,
        connectData: {
            mongoUrl: "mongodb://user:pass@host:port/dbnam"
        },
        db: {}
    };

    config.port = 3000;

    config.log = bunyan.createLogger({
        name: appName,
        stream: process.stdout,
        level: process.env.LOG_LEVEL || 'debug'
    });

    MongoClient.connect(config.mongo.connectData.mongoUrl, function(err, dbConnection) {

        if (! err) {
            config.mongo.db = dbConnection;
        } 

        configCallback(err, config);

    });

};

module.exports = {
    config: init
};
