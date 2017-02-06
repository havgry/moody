'use strict';

var _ = require('lodash');
var Text = require('./models/text');

module.exports = function(text, tones) {

	var textObject = new Text({
		content: text,
		tones: _.map(tones, function(tone) {
			return {
				score: tone.score,
				name: tone.tone_name
			};
		}),
		created_at: new Date()
	});

	textObject.save(function(error) {
		if (error) {
			throw error;
		}
		console.log('Text saved');
	});

	return textObject;

};