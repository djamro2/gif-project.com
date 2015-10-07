
//includes a function called reverseGif which will return a reversed gif in the same folder as the file running it

var fs          = require('fs');
var exec        = require('child_process').exec;
var rimraf      = require('rimraf');
var http        = require('http');
//var GifEncoder  = require('gif-encoder');
//var sizeOf      = require('image-size');

//var Canvas      = require('canvas');
//var Image = Canvas.Image;

var childPython, childImageMagick;

module.exports.reverseGif = function(gifName, callback) {

  //file has to exist to run
  if ((gifName.indexOf('http') < 0) && !fs.existsSync(gifName)){
  	
    console.log('Could not find ' + gifName + ' Will stop current node process' );
  	process.exit();
  
  }

  //end up with an empty folder called 'output'
  var dir = 'output';
  fs.stat(dir, function(error, stat){
    if (error) { //'/output' doesn't exist
      fs.mkdirSync(dir);
    } else { // '/output' does exist
      rimraf(dir, function(error){
        fs.mkdirSync(dir);
      });
    }
  });

  var command = "python reverse.py";
  
  if (!global.isRunningReverse) {

    var file = fs.createWriteStream("localgif-reverse.gif");
    var request = http.get(gifName, function(response) {
      response.pipe(file);
    });

    file.on('finish', function(){

      global.isRunningReverse = true;
    
      console.log('Splitting gif into frames...');
      
      childPython = exec(command, function (error, stdout, stderr) {
      	
          if (stdout) console.log(stdout);
          if (stderr) console.log(stderr);
          if (error !== null) console.log('exec error: ' + error);
        
          console.log('Gif split. Encoding new gif now...');

          var commandIM = "convert -limit memory 64 -limit map 128 $(ls -v output/*.png) -delay 10 -loop 0 localgif-reverse.gif";

          childImageMagick = exec(commandIM, function(error, stdout, stderr) {

            if (stdout) console.log(stdout);
            if (stderr) console.log(stderr);
            if (error !== null) console.log('exec error: ' + error);

            global.isRunningReverse = false; //finished, let another process run

            callback();

          });

      });

    });

  } 

};

        //todo: quicker way to encode new gif with javascript, for now use imagemagick

        /*var files = fs.readdirSync(dir);
        var dimensions = sizeOf('output/0.png');

        var gif = new GifEncoder(dimensions.width, dimensions.height);

        var file = fs.createWriteStream('localgif-reverse.gif');
        gif.pipe(file);
        gif.writeHeader();

        var canvas = new Canvas(dimensions.width, dimensions.height);
        var ctx = canvas.getContext('2d');

        var addPixels = function(err, result){
            if (err) throw err;
            var img = new Image();
            img.src = result;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var pixels = ctx.getImageData(0, 0, dimensions.width, dimensions.height);
            gif.addFrame(pixels);
        };

        //go down the frame numbers to get a reversed result
        for (var i = (files.length - 1); i >= 0; i--){
          fs.readFile('output/' + i + '.png', addPixels); //pass data into addPixels
        }*/