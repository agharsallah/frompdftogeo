var fs = require('fs');
var obj={}
var tab=[]
var XcordReg = /=(.*)\//g // matches from beg till the /
var YcordReg=/\/.*?=(.*?)\)/g //matches from / till )
var log_file = fs.createWriteStream(__dirname + '/_Final_ezouhour-coord.log', {flags : 'w'});

var proj4 = require('proj4');
/*2015  22332 Carthage /UTM zone 32N*/
//var FromProjXY = '+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs';
/*2008 EPSG:22391 Carthage / Nord Tunisie*/
var FromProjXY = '+proj=lcc +lat_1=36 +lat_0=36 +lon_0=9.9 +k_0=0.999625544 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=-263,6,431,0,0,0,0 +units=m +no_defs';

var ToProjLatLong = '+proj=longlat +datum=WGS84 +no_defs ';


//eval(fs.readFileSync('./convert-functions.js')+'');

fs.readFile("ezouhour-coord.txt", 'utf8', function(err, data) {
  if (err) throw err;
  
    //retreive all the matches
    do {
      xres = XcordReg.exec(data);
      yres = YcordReg.exec(data);
      if (xres && yres) {
           /*remove all spaces*/
          var x = xres[1].replace(/\s/g, '');
          //console.log(x)
          var y = yres[1].replace(/\s/g, '');
          //console.log(y)
        var finalCoord  = proj4(FromProjXY,ToProjLatLong,[x,y])

     log_file.write('['+finalCoord+'], \n')

      }
    } while (xres);  
  
  //console.log(res2)

});


//console.log(xy2utm(-92336.468, 99043.202))

//console.log(a)