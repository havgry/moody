'use strict';

var dotenv = require('dotenv').load();
var express = require('express');
var app = express();

var watson = require('watson-developer-cloud');
var saveText = require('./saveText');

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

module.exports = app;