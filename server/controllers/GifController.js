
var randomstring = require("randomstring");
var http         = require('http');
var fs           = require('fs');
var request      = require('request');
var Grid         = require('gridfs-stream');
var mongoose     = require('mongoose');

var Gif     = require('../models/gif');
var reverse = require('../../reverse');
Grid.mongo = mongoose.mongo;

module.exports.returnGif = function(req, res){

	var gifId = req.params.gifId;
	var pathTemp = 'savedgif-reverse.gif';
	var gfs = Grid(mongoose.connection.db);

	var fs_write_stream = fs.createWriteStream(pathTemp); //write content to file system
	 
	//read from mongodb
	var readstream = gfs.createReadStream({
	     filename: gifId + '.gif'
	});
	readstream.on('error', function (err) { //error handling, e.g. file does not exist
	  console.log('An error occurred!', err);
	  throw err;
	});
	readstream.pipe(fs_write_stream);
	fs_write_stream.on('close', function () { //finished writing to savedgif-reverse
	    
	    var data = fs.readFileSync(pathTemp);
		
		res.contentType('image/gif');
		res.send(data);

		fs.unlink(pathTemp, function(error){
			if (error) console.log('Error deleting the temp gif retrieved ' + error);
		});

	});

};

module.exports.reverseGif = function(req, res){

	var url = req.params.url;

	Gif.findOne({url_src: url}, function(err, result){

		//if we have this in the db, just return that url
		if (result){
			res.json({url: result.gifId, info: 'already in db'});
			return;
		}

		//reverse the gif starting here

    	reverse.reverseGif(url, function(){ //new reversed gif now at localgif-reverse

    		var fileGif = 'localgif-reverse.gif';

    		var gif = new Gif({});
    		gif.gifId = randomstring.generate(8);
    		gif.url_src = url;
    		gif.views = 0;

    		gif.save(function(saveErr, data){ //save model data

			    var gfs = Grid(mongoose.connection.db); //save gif data
			 
			    // streaming to gridfs, /filename to store in mongodb
			    var writestream = gfs.createWriteStream({
			        filename: data.gifId + '.gif'
			    });
			    fs.createReadStream(fileGif).pipe(writestream);
			 
			    writestream.on('close', function (file) { //saved in db now

					fs.unlink(fileGif, function(error){ //delete local gif file 

						if (error) console.log(error);
						else console.log('gif saved successfully');
						console.log('-------------');

		    			res.json({url: data.gifId, info: 'reversed in back end'});

					});  

			    });  			

    		});

    	});

	});

};

module.exports.reversePage = function(req, res){

	var url = req.params.url; //url_stored

	Gif.findOne({url_stored: url}, function(err, result){

		if (result)
			res.json({gifId: result.gifId});

		if (error)
			res.status(500).send({message: "Couldn't find that gif!"});

	});

};