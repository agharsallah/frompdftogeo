var fs = require('fs');
var regex = /"name_en": "(.*?)"/g; // get all municipality names
var res ;
var log_file = fs.createWriteStream(__dirname + '/_result.txt', {flags : 'w'});
fs.readFile("kairouan.geojson", 'utf8', function(err, data) {
  if (err) throw err;

do {
	var i = 0;
    res = regex.exec(data);
    if (res) {
        log_file.write(res[1].replace(/\s/g, '') +"\n");
        i++
    }
} while (res);

});