
var express  = require('express');
var mongoose = require('mongoose');
var fs       = require('fs');

//var local_codes = require('./local_codes');
var app         = express();

global.isProduction = false;

if (global.isProduction) {

	mongoose.connect('mongodb://' + local_codes.internal_ip + ':' + local_codes.data_port + '/gifProject');
	
	var server = app.listen(local_codes.port, local_codes.internal_ip, function(){
		var host = server.address().address;
		var port = server.address().port;
		console.log('gif-project listening at http://%s:%s', host, port);
	});

} else {

	mongoose.connect('mongodb://localhost/gifProject'); //connect to mongodb

	var server = app.listen(8888, function () {
	  var host = server.address().address;
	  var port = server.address().port;
	  console.log('gif-project listening at http://%s:%s', host, port);
	});

}

app.use(express.static('client')); //static files

require('./server/routes')(app); //routes, need to be after middleware

//don't stop the server
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

//todo

//if gif does not exist, create it (and delete files plus model)
//have reversed gifs on the home page
//put gif reversing in a queue (no two gifs reversing at the same time)
	//or just stop the request
//prevent the out of memory error