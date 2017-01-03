var data = require('./_json_data_sum.json')
//read line by line from the geojson
     var fs = require('fs'),
     	_ =require('lodash'),
      util = require('util'),
    	lineReader = require('readline').createInterface({
      		input: require('fs').createReadStream('./delegations.geojson')
    	});
    	var log_file = fs.createWriteStream(__dirname + '/_final.json', {flags : 'w'});
  
  var i  = 0 ;
  //append data to final geojson properties

    //rl.on('line', function(line, lineCount, byteCount) {
    lineReader.on('line', function (line) {

   	//get the city name from the delegation geojson,  first we put the get the city block
	   var delegation1 = line.match(/"NAME_EN":(.*?),/g)

      //we match the delegation name from the upper city block
      var reg = /"NAME_EN":\s"(.*?)",/;
      var delegation = delegation1[0].replace(reg, "$1");
      //log_file.write(delegation+'\n')
      
      //I will get the value of spoiled-canceled-blank (stored in xls) associated to the delegation 
      //so we take the delegation name from the geojson and compare it to the one in the xls
      var result = _.find(data, function(o) { return o.delegation == delegation; });
      //console.log(typeof(result))
      if (result !== undefined) {
      var canceled = result.canceled;
      var blank = result.blank;
      var spoiled = result.spoiled;
      
      var canceledPercentage =result.canceledPercentage ; 
      var blankPercentage =result.blankPercentage ;
      var spoiledPercentege =result.spoiledPercentege ;
      var SigningVoters = result.SigningVoters ;
      i++;
      
      var modif=line.replace(/"NAME_AR"/g,
        '"canceled":'+canceled+
        ',"blank":'+blank+
        ',"spoiled":'+spoiled+
        ',"canceledPercentage":'+canceledPercentage+
        ',"blankPercentage":'+blankPercentage+
        ',"spoiledPercentege":'+spoiledPercentege+
        ',"SigningVoters":'+SigningVoters+
        ',"NAME_AR"');
      log_file.write(util.format(modif) + '\n');
      }else{
          var modif=line.replace(/"NAME_AR"/g,
        '"canceled":'+'"inexistant"'+
        ',"blank":'+'"inexistant"'+
        ',"spoiled":'+'"inexistant"'+
        ',"canceledPercentage":'+'"inexistant"'+
        ',"blankPercentage":'+'"inexistant"'+
        ',"spoiledPercentege":'+'"inexistant"'+
        ',"SigningVoters":'+'"inexistant"'+
        ',"NAME_AR"');
      log_file.write(util.format(modif) + '\n');
      console.log(delegation)
      }
  })
  .on('error', function(e) {
    console.log(e)
  });