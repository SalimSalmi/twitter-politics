var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');


var filename = "nokeys"
var regexcoord = /52\.\d/g

var i = 0;

var s = fs.createReadStream(filename + "-newlined.csv")
  .pipe(es.split())
  .pipe(es.mapSync(function(line){

    // pause the readstream
    s.pause();

    var data = line.split(',');
    var result = [];
    var l = data.length;

    result.push(data[0]);
    result.push(data.slice(1,l-9).join(' '));
    result.push(data[l-9]);
    result.push(data[l-8]);
    result.push(data[l-7]);
    result.push(data[l-6]);
    result.push(data[l-5]);
    result.push(data[l-4]);
    result.push(data[l-3] || " ");
    result.push(data[l-2] || " ");
    result.push(data[l-1] || " ");

    fs.appendFile(filename+"-final.csv", result.join(',') + '\n', function (err) {
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
