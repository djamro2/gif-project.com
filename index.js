
//this is the main file for the gif project, test it with tester.js

var express  = require('express');
var mongoose = require('mongoose');
var fs       = require('fs');

var tester   = require('./tester');
var app      = express();

mongoose.connect('mongodb://localhost/gifProject'); //connect to mongodb

app.use(express.static('client')); //static files

var server = app.listen(8888, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

require('./server/routes')(app); //routes, need to be after middleware

//todo - 10/02
//
//make directive to add image to page
//update some css
//add in a spinner when waiting for reversing
//handle errors
//try to get live reload to work