var fs = require('fs');
var obj={}
var tab=[]
var XcordReg = /=(.*)\//g // matches from beg till the /
var YcordReg=/\/.*?=(.*?)\)/g //matches from / till )
var log_file = fs.createWriteStream(__dirname + '/_Final_ezouhour-coord.log', {flags : 'w'});



eval(fs.readFileSync('./convert-functions.js')+'');

fs.readFile("ezouhour-coord.txt", 'utf8', function(err, data) {
  if (err) throw err;
  
    //retreive all the matches
    do {
      xres = XcordReg.exec(data);
      yres = YcordReg.exec(data);
      if (xres) {
           /*remove all spaces*/
          var x = xres[1].replace(/\s/g, '');
          //console.log(x)
          var y = yres[1].replace(/\s/g, '');
          //console.log(y)
          xy2utm(x,y);
      }
    } while (xres);  
  
  //console.log(res2)

});


//console.log(xy2utm(-92336.468, 99043.202))

//console.log(a)