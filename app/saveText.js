'use strict';

var _ = require('lodash');
var Text = require('./models/text');

module.exports = function(text, tones) {

	var text = new Text({
		content: text,
		primary_tone: _.maxBy(tones, 'score').tone_name,
		created_at: new Date()
	});

	text.save(function(error) {
		if (error) {
			throw error;
		}
		console.log('Text saved');
	})

};