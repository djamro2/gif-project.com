
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

	//only run if the gif exists in Mongo
	var options = {filename : gifId + '.gif'}; //can be done via _id as well
	gfs.exist(options, function (err, found) {

	    if (found) { //gif exists in Mongo
		    
			fs.stat(pathTemp, function(err, stat) { //see if pathTemp exists

			    if(!err) { //pathTemp exists
			        fs.unlink(pathTemp, function(error){
			        	var fs_write_stream = fs.createWriteStream(pathTemp); //write content to file system
			        	writeAndRetrieveFile(fs_write_stream);
			        });
			    } else { //pathTemp does not exist, carry on
			    	var fs_write_stream = fs.createWriteStream(pathTemp); //write content to file system
			    	writeAndRetrieveFile(fs_write_stream);
			    }

			});
	    
	    } else { //gif not found in Mongo
	    	res.status(500).send({error:true, info: "Gif doesn't exist"});
	    }

	});

	var writeAndRetrieveFile = function(ws){

		//read from mongodb
		var readstream = gfs.createReadStream({
		     filename: gifId + '.gif'
		});
		readstream.on('error', function (err) { //error handling, e.g. file does not exist
		  console.log('An error occurred!', err);
		  throw err;
		});
		readstream.pipe(ws);
		ws.on('close', function () { //finished writing to savedgif-reverse
		    
		    var data = fs.readFileSync(pathTemp);
			
			res.contentType('image/gif');
			res.send(data);

			fs.unlink(pathTemp, function(error){
				if (error) console.log('Error deleting the temp gif retrieved ' + error);
				data = null;
			});

		});

	};

};

module.exports.reverseGif = function(req, res){

	var fileGif = 'localgif-reverse.gif';
	var url = decodeURIComponent(req.params.url);

	Gif.findOne({url_src: url}, function(err, result){

		//if we have this in the db, just return that url
		if (result){
			res.json({url: result.gifId, info: 'already in db'});
			return;
		}

		//reverse the gif starting here
		try {

			fs.stat(fileGif, function(notExist, stat) {
				if (notExist) { //doesn't exist, no need to delete file
					_reverse(url, function(response, error){
						if (response) res.json(response);
						if (error) res.status(500).send(error);
					});
				} else { //exists, delete file first before doing anything
					fs.unlink(fileGif, function(error){
						_reverse(url, function(response, error){
							if (response) res.json(response);
							if (error) res.status(500).send(error);
						});
					});
				}
			});

		} catch (error) {
			console.log('Caught error ' + error);
			res.status(500).send('Could not reverse/retrieve gif');
		}

	});

};

//check to see that both model and file exists
module.exports.checkGif = function(req, res){

	var url = req.params.url;

	Gif.findOne({gifId: url}, function(error, result){
		if (result) {
			
			var gfs = Grid(mongoose.connection.db);

			//only run if the gif exists in Mongo
			var options = {filename : url + '.gif'}; //can be done via _id as well
			gfs.exist(options, function (err, found) {

			    if (found) { //gif exists in Mongo

					res.json({exists: true});

			    } else { //gif not found in Mongo

			    	res.json({exists: false});

			    }
			});

		} else { //not in db
			res.json({exists:false});
		}
	});

};

var _reverse = function(url, callback){

	var isError = false;
		
	reverse.reverseGif(url, function(){ //new reversed gif now at localgif-reverse

		var fileGif = 'localgif-reverse.gif';

		var gif = new Gif({});
		gif.url_src = url;
		gif.views = 0;
		gif.gifId = randomstring.generate(8);		

		gif.save(function(saveErr, data){ //save model data

		    var gfs = Grid(mongoose.connection.db); //save gif data
		 
		    try {

		    	//if that file exists, delete it
		    	var options = {filename : data.gifId + '.gif'}; //can be done via _id as well
				gfs.exist(options, function (err, found) {
				    if (err) return handleError(err);
				    if (found) { //file exists, delete it
				    	gfs.remove({ filename: options.filename }, function (err) {
						  if (err) return handleError(err);
						  console.log('Removed file');
						});
				    }
				});
				
				//problem could be that it gets here without creating localgif
			    var writestream = gfs.createWriteStream({ // streaming to gridfs, /filename to store in mongodb
			        filename: data.gifId + '.gif'
			    });
			    fs.createReadStream(fileGif).pipe(writestream);

			    writestream.on('close', function (file) { //saved in db now

					fs.unlink(fileGif, function(error){ //delete local gif file 

						if (error) console.log(error);
						else console.log('gif saved successfully');
						console.log('-------------');

						writestream = null;

						callback({url: data.gifId, info: 'reversed in back end'});

					});  

			    });  

		    } catch (error) {
				callback(null, 'GFS error');
				return;
			}			

		});

	});

}