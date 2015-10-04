
//includes a function called reverseGif which will return a reversed gif in the same folder as the file running it

var fs = require('fs');
var exec = require('child_process').exec;
var child;

module.exports.reverseGif = function(gifName, callback) {

  //file has to exist to run
  if ((gifName.indexOf('http') < 0) && !fs.existsSync(gifName)){
  	
    console.log('Could not find ' + gifName + ' Will stop current node process' );
  	process.exit();
  
  }

  var command = "convert " + gifName + " -coalesce -reverse -loop 0 localgif-reverse.gif";
  
  if (!global.isRunningReverse) {

    global.isRunningReverse = true;
  
    console.log('Starting gif conversion...');
    
    child = exec(command, function (error, stdout, stderr) {
    	if (stdout) console.log(stdout);
    	if (stderr) console.log(stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      console.log('Gif reversal completed');
      global.isRunningReverse = false;
      callback();
    });

  } 

}