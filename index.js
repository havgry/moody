'use strict';

var dotenv = require('dotenv');
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');

dotenv.load();

// Serve static files
app.use(express.static(__dirname + '/public'));
app.use('/css/normalize.css', express.static(__dirname + '/node_modules/normalize.css/normalize.css'));

var toneAnalyzer = watson.tone_analyzer({
	username: process.env.WATSON_TONE_ANALYZER_USERNAME,
	password: process.env.WATSON_TONE_ANALYZER_PASSWORD,
	version: 'v3',
	version_date: '2016-05-19',
	sentences: false
});

app.get('/tones', function(request, response){

	var text = request.query.text;

	if (text && text.length > 0) {
		toneAnalyzer.tone(
			{ text: text },
			function(error, data) {
				if (error) {
					response.status(error.code).send({ error: error.error });
				} else {
					response.send(data);
				}
			}
		);	
	} else {
		response.status(500).send({ error: 'A \'text\' query parameter is required' })
	}
});

app.listen(1337);