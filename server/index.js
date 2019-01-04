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
            socket.emit('notify', done);
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
