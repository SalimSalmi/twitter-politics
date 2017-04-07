var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');


var filename = "keys"
4.73,52.29,4.98,52.42

var s = fs.createReadStream(filename + "-filtered.csv")
  .pipe(es.split())
  .pipe(es.mapSync(function(line){
    var data = line.split(',');

    var lat = +data[2];
    var lng = +data[3];

    if(lat >= 52.29 && lat <= 52.42 && lng >= 4.73 && lng <= 4.98) {
      fs.appendFile(filename+"-amsterdam.csv", line + '\n', function (err) {
        if(err) console.log(err);
      });
    }
    s.resume();
  })
  .on('error', function(err){
    console.log(err);
    console.log('Error while reading file.');
  })
  .on('end', function(){
    console.log('Read entire file.')
  })
);
