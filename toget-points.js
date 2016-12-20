var fs = require('fs');
var regex = /\([Xx][\s\S]*?\)/g; // get all string starts with "(x" ..... and ends with ")"
var res ;
var log_file = fs.createWriteStream(__dirname + '/ezouhour-coord.txt', {flags : 'w'});
fs.readFile("tibar-Beja.txt", 'utf8', function(err, data) {
  if (err) throw err;

do {
	var i = 0;
    res = regex.exec(data);
    if (res) {
    	//eliminate spaces 
    	//replace(/\s/g, '')
        
        log_file.write(res[i].replace(/\s/g, '') +"\n");
        i++
    }
} while (res);

});