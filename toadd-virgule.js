var fs = require('fs');
var regex = /\([Xx][\s\S]*?\)/g; // get all string starts with "(x or X" ..... and ends with ")"
var regexX = new RegExp(/=([\s\S]*?)\//g); // get the X value
var regexY = new RegExp(/Y=([\s\S]*?)\)/g); // get the Y value
var res,xval,yval ;
var log_file = fs.createWriteStream(__dirname + '/ezouhour-coord.txt', {flags : 'w'});
fs.readFile("hassi-el-ferid.txt", 'utf8', function(err, data) {
  if (err) throw err;

do {
	var i = 0;
    res = regex.exec(data);
    if (res) {
    	//eliminate spaces 
    	res[i].replace(/\s/g, '')
        //res[i] = res[i].replace("،", "/");
   		res[i] = res[i].replace("-", "/");
   		res[i] = res[i].replace(/\s/g, '')
   		var xval=regexX.exec(res[i]);//get the X value
   		var yval=regexY.exec(res[i]);//get the y value
   		while (xval != null && yval != null) {
     		//console.log(yval[1])

	 		//if there is no points in a string means index will be -1 
	 		//then take the number and add dot to it
	 		if(xval[1].indexOf('.')==-1){
	 			xval = xval[1].slice(0, -2)+'.'+xval[1].slice(-2)
	 			yval = yval[1].slice(0, -2)+'.'+yval[1].slice(-2)
	 			res[i]='(X='+xval+'/'+'Y='+yval+')'
	 		}


	   		var xval=regexX.exec(res[i]);
	   		var yval=regexY.exec(res[i]);//stop the loop

		}
		log_file.write(res[i].replace(/\s/g, '') +"\n");

        i++
    }
} while (res);

});