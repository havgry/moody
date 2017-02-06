'use strict';

var dotenv = require('dotenv').load();
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

module.exports = function(text, callback) {
	if (text && text.length > 0) {
		toneAnalyzer.tone(
			{ text: text },
			function(error, data) {
				if (error) {
					throw error;
				} else {
					var textObject = saveText(text, data.document_tone.tone_categories[0].tones);
					callback(textObject);
				}
			}
		);
	}
};