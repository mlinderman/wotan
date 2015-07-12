'use strict';

module.exports = function (app) {
    app.get('/ping', function (req, res) {
        res.send({
            response: 'pong'
        });
    });


    app.get('/test', function(req, res) {

        res.send({
            port: req.config.port
        });
    });

}

