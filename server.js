'use strict';

var dotenv = require('dotenv').load();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var getTones = require('./app/getTones');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

// Serve static files
app.use(express.static(__dirname + '/dist'));

io.on('connection', function(socket) {
	console.log(socket.id);
	socket.on('text', function(text) {
		getTones(text, function(textObject) {
			socket.emit('text', textObject);
		});
	});
});

server.listen(process.env.PORT || 1337);