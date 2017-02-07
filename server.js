'use strict';

var dotenv = require('dotenv').load();
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var texts = require('./app/text');
var getTones = require('./app/getTones');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

// Serve static files
app.use(express.static(__dirname + '/dist'));

io.once('connection', function(socket) {

	texts.getList(function(error, texts){
		socket.emit('allTexts', texts);
	});

	socket.on('text', function(text) {
		getTones(text, function(error, tones) {
			socket.emit('text', tones);
			socket.broadcast.emit('allTexts', []);
			texts.save(text, tones);
		});
	});
});

server.listen(process.env.PORT || 1337);