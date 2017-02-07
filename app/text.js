'use strict';

var _ = require('lodash');
var Text = require('./models/text');

module.exports = {
	save: function(text, tones, callback) {

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
				callback(error);
			} else {
				console.log('Text saved');
				callback(null, textObject);
			}
		});

	},
	getList: function(callback) {
		Text.find(function(error, texts){
			if (error) {
				callback(error);
			} else {
				callback(null, texts);
			}
		});
	}
};