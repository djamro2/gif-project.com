/* global process */
/* global __dirname */

var path = require('path');

var GifController = require('./controllers/GifController');

module.exports = function(app){
	
	//return the home page
	app.get('/', function(req, res){
		res.sendFile(path.resolve(__dirname + '/../client/views/home.html'));
	});

	//reverse a gif and return the url where it is saved
	app.get('/api/reverse/:url', GifController.reverseGif);

	app.get('/gif/:gifId', GifController.returnGif);

	app.get('reverse/:url', GifController.reversePage);
	
}