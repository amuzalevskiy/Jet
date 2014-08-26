/*
 server.js
 amid

 Created by Tom de Grunt on 2010-10-03 in mongodb-rest
 New version Copyright (c) 2013 Mariano Fiorentino, Andrea Negro
 This file is part of amid.
 */
var fs = require("fs");
var cluster = require('cluster');
var http = require('http');
var enableCluster = false;
var numCPUs = require('os').cpus().length;

var config = {
    'server': {
        'port': 3000,
        'timeout': 120,
        'address': "0.0.0.0"
    },
    'debug': true
};

try {
    config = JSON.parse(fs.readFileSync(process.cwd()+"/config.json"));
} catch(e) {
    // ignore
}

module.exports.config = config;

if (enableCluster && cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
    });
} else {
    // Worker processes have a http server.


    var express = require('express');

    var app = module.exports.app = express();

    app.use(express["static"](__dirname + "/../public"));

    app.use(express.errorHandler({

        dumpExceptions: true,

        showStack: true

    }));

    app.use(express.bodyParser());

    // Start Amid
    // require('./lib/main');
    // require('./lib/command');
    // require('./lib/rest');

    app.use(app.router);
    app.listen(config.server.port, config.server.address);

    app.on('connection', function(socket) {
        socket.setTimeout(config.server.timeout * 1000);
    });
}

console.log('\n\nServer started at http://' + config.server.address + ':' + config.server.port + '');