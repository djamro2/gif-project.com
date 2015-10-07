
//includes a function called reverseGif which will return a reversed gif in the same folder as the file running it

var fs          = require('fs');
var exec        = require('child_process').exec;
var rimraf      = require('rimraf');
var GifEncoder  = require('gif-encoder');
var sizeOf      = require('image-size');

var Canvas      = require('canvas');
var Image = Canvas.Image;
  

var child;

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

  var command = "python reverse.py " + gifName;
  
  if (!global.isRunningReverse) {

    global.isRunningReverse = true;
  
    console.log('Splitting gif into frames...');
    
    child = exec(command, function (error, stdout, stderr) {
    	
      if (stdout) console.log(stdout);
    	if (stderr) console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      
      console.log('Gif split. Encoding new gif now...');

      //now we have all the images, put them together with gif-encoder
      var files = fs.readdirSync(dir);
      var dimensions = sizeOf('output/0.png');

      var gif = new GifEncoder(dimensions.width, dimensions.height);

      var file = fs.createWriteStream('localgif-reverse.gif');
      gif.pipe(file);
      gif.writeHeader();

      var canvas = new Canvas(dimensions.width, dimensions.height);
      var ctx = canvas.getContext('2d');

      for (var i = 0; i < files.length; i++){

        fs.readFile('output/' + (i) + '.png', function(err, squid){
          if (err) throw err;
          img = new Image;
          img.src = squid;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          var pixels = ctx.getImageData(0, 0, dimensions.width, dimensions.height);
          gif.addFrame(pixels);
        });
        
      }

      global.isRunningReverse = false;

      callback();
    });

  } 

};