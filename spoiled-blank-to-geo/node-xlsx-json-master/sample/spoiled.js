var xlsx_json = require('../')

xlsx_json({
  input: __dirname + '/spoiled-blank-par.xlsx',
  output: __dirname + '/spoiled.json'
}, function(err, result) {
  if(err) {
    console.error(err);
  }else {
    console.log(result);
  }

});

