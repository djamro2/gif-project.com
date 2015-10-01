
var mongoose = require('mongoose');

module.exports = mongoose.model('Gif', {
	url_src: String,
	gifId: String, //figure out how to come up with this
	views: {type: Number, default: 0},
	date: {type: Date, default: Date.now }
});