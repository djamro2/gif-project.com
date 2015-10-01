
var mongoose = require('mongoose');
var express  = require('express');
var fs       = require('fs');

var reverse  = require('./reverse');

var app      = express();

//tests to be run
module.exports.run = function(){

	//saveGifByFileName(); 
	//startSingleGifServer(); 
	reverseWithHttp('http://i.imgur.com/y1nWFvm.gif');
};

var reverseWithHttp     = function(url){
	reverse.reverseGif(url);
};

//a test to see how to return a gif in a browser
var startSingleGifServer = function(){

	// example schema
	//ar schema = new mongoose.Schema({
	//    gif: { data: Buffer, contentType: String }
	//});

	//our model
	//var Gif = mongoose.model('Gif', schema);

	var server = app.listen(8888, function () {
	  var host = server.address().address;
	  var port = server.address().port;
	  console.log('Example app listening at http://%s:%s', host, port);
	});

	//return the first gif I can find
	app.get('/gifs', function (req, res) {

	    Gif.findOne({}, function (err, result) {
          if (err) return next(err);
          res.contentType(result.gif.contentType);
          res.send(result.gif.data);
        });

	});

};

//just a simple example on how to save a gif in mongo
var saveGifByFileName = function(){

	var gifPath = 'goalkeeper.gif';

	// example schema
	var schema = new mongoose.Schema({
	    //gif: { data: Buffer, contentType: String }
	});

	//our model
	//var Gif = mongoose.model('Gif', schema);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {

		// empty the collection
		Gif.remove(function (err) {

		    if (err) throw err;

		    console.error('removed old docs');

		    // store an gif in binary in mongo
		    var gif = new Gif;
		    gif.gif.data = fs.readFileSync(gifPath);
		    gif.gif.contentType = 'image/gif';
		    gif.save(function (err, a) {
		      if (err) throw err;

		      console.error('saved gif to mongo');

		    });

		});

	});

}