var fs = require('fs');
var regex = /\([Xx][\s\S]*?\)/g; // get all string starts with "(x or X" ..... and ends with ")"
var regexX = new RegExp(/=([\s\S]*?)\//g); // get the X value
var regexY = new RegExp(/Y=([\s\S]*?)\)/g); // get the Y value
var res,xval,yval ;
var log_file = fs.createWriteStream(__dirname + '/test.txt', {flags : 'w'});
fs.readFile("hassi-el-ferid.txt", 'utf8', function(err, data) {
  if (err) throw err;
    console.log(data)


});