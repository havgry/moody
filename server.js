'use strict';

var dotenv = require('dotenv').load();
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

// Serve static files
app.use(express.static(__dirname + '/dist'));

app.use('/', require('./app/getTones'));

app.listen(process.env.PORT || 1337);