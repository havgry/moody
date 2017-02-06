'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var textSchema = new Schema(
	{
		content: String,
		primary_tone: String,
		created_at: Date
	},
	{
		collection: 'texts'
	}
);

textSchema.pre('save', function (next) {
	this.created_at = new Date();
	next();
});

var Text = mongoose.model('Text', textSchema);

module.exports = Text;