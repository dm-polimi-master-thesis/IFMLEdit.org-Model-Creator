// Copyright (c) 2016, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true */
"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    lambdaLocal = require('lambda-local'),
    path = require('path'),
    socket;

function createRouter(io) {
    socket = io;

    var router = express.Router();

    router.use(bodyParser.json());

    router.post('/alexa-skill', function(req,res){
        var jsonPayload = req.body;

        lambdaLocal.execute({
            event: jsonPayload,
            lambdaPath: path.join(__dirname, '../client/patterns/voice-assistant/alexa-skill.js'),
            lambdaHandler: "handler",
            timeoutMs: 5000
        }).then(done => {
            var options = done.sessionAttributes;

            if (options.welcome) {
                socket.emit('welcome');
            }
            if (options.goodbye) {
                socket.emit('goodbye');
            }
            if (options.notify) {
                socket.emit('notify', options.notify);
            }
            if (options.demo) {
                socket.emit('demo', options.demo);
                done.sessionAttributes = {};
            }
            if (options.state && options.state === 'COMPLETED') {
                setTimeout(function () {
                  socket.emit(options.model.type, options.model);
                }, 1000);
                done.sessionAttributes = {};
            }
            if (options.advanced) {
                socket.emit(options.advanced.operation, options.advanced.options);
                done.sessionAttributes = {};
            }
            res.send(done);
        }).catch(err => {
            socket.emit('notify', err);
            res.send(err);
        });
    });

    router.get('/example', function(req,res){
        socket.emit('notify', {message: 'Welcome'});
        res.sendStatus(200);
    });

    router.post('/prova', function(req,res){
        socket.emit('notify', {message: 'Welcome'});
        res.sendStatus(200);
    });

    return router;
}

function socketIo () {
  return socket;
}

exports.createRouter = createRouter;
exports.socketIo = socketIo;
