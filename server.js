'use strict';

var dotenv = require('dotenv');
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');
var _ = require('lodash');
var Text = require('./app/models/text');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

dotenv.load();

// Serve static files
app.use(express.static(__dirname + '/dist'));

var toneAnalyzer = watson.tone_analyzer({
	username: process.env.WATSON_TONE_ANALYZER_USERNAME,
	password: process.env.WATSON_TONE_ANALYZER_PASSWORD,
	version: 'v3',
	version_date: '2016-05-19',
	sentences: false,
	headers: {
		'X-Watson-Learning-Opt-Out': '1'
	}
});

app.get('/tones', function(request, response) {

	var text = request.query.text;

	if (text && text.length > 0) {
		toneAnalyzer.tone(
			{ text: text },
			function(error, data) {
				if (error) {
					response.status(error.code).send({ error: error.error });
				} else {
					var tones = data.document_tone.tone_categories[0].tones;
					response.send(tones);
					saveText(text, tones);
				}
			}
		);	
	} else {
		response.status(500).send({ error: 'A \'text\' query parameter is required' })
	}
});

var saveText = function (text, tones) {

	var text = new Text({
		content: text,
		primary_tone: _.maxBy(tones, 'score').tone_name,
		created_at: new Date()
	});

	text.save(function (error) {
		if (error) {
			throw error;
		}
		console.log('Text saved');
	})

};

app.listen(process.env.PORT || 1337);