/*jslint node: true */
"use strict";

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('a user is connected')
});

app.use('/api/', require('./server').createRouter(io));
app.use(express["static"]('public', {index: 'index.html'}));

server.listen(3000, function () {
    console.log("Server listening on port 3000");
});
