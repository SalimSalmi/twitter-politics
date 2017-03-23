var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');

var filename = "nokeys"
var regexdigits = /^(8\d{17})/g
var regexnewline = /\r?\n|\r/g


var s = fs.createReadStream(filename + ".csv")
  .pipe(es.split())
  .pipe(es.mapSync(function(line){

    // pause the readstream
    s.pause();

    line = line.replace(regexnewline,'');

    if(line.match(regexdigits)) {
      line = '\n' + line
    }

    fs.appendFile(filename+"-newlined.csv", line , function (err) {
      if(err) console.log(err);
      s.resume();
    });
  })
  .on('error', function(err){
    console.log(err);
    console.log('Error while reading file.');
  })
  .on('end', function(){
    console.log('Read entire file.')
  })
);
