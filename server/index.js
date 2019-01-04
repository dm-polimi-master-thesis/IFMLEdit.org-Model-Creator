// Copyright (c) 2016, the IFMLEdit.org project authors. Please see the
// AUTHORS file for details. All rights reserved. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
/*jslint node: true */
"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    lambdaLocal = require('lambda-local'),
    path = require('path');

function createRouter(io) {

    var router = express.Router();

    router.use(bodyParser.json());

    router.post('/alexa-skill', function(req,res){
        var jsonPayload = req.body;

        lambdaLocal.execute({
            event: jsonPayload,
            lambdaPath: path.join(__dirname, '../client/patterns/voice-assistant/alexa-skill.js'),
            lambdaHandler: "handler",
            timeoutMs: 5000
        }).then(response => {
            var model = response.sessionAttributes.model;
            io.emit(model.state, model);
            res.send(done);
        }).catch(error => {
            res.send(error);
        });
    });

    router.get('/example', function(req,res){
        io.emit('notify', {message: 'Welcome'});
        res.sendStatus(200);
    });

    router.post('/prova', function(req,res){
        io.emit('notify', {message: 'Welcome'});
        res.sendStatus(200);
    });

    return router;
}

exports.createRouter = createRouter;
