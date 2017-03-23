var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');


var filename = "keys"
var regexlang = /\bnl\b/ig
var i = 0;

var keywords = [
  [/VVD|Rutte/ig,'vvd'],
  [/PvdA|Asscher/ig,'pvda'],
  [/PVV|Wilders/ig,'pvv'],
  [/\bsp(?!é)\b|Roemer/ig,'sp'],
  [/CDA|Buma/ig,'cda'],
  [/D66|Pechtold/ig,'d66'],
  [/ChristenUnie|(Christen.Unie)|Segers/ig,'cu'],
  [/GroenLinks|(Groen.Links)|Klaver/ig,'gl'],
  [/SGP|Staaij/ig,'sgp'],
  [/50plus|(50.plus)|Krol/ig,'50p'],
];

var s = fs.createReadStream(filename + "-final.csv")
  .pipe(es.split())
  .pipe(es.mapSync(function(line){

    // pause the readstream
    s.pause();

    var data = line.split(',');


    for (var i = 0; i < keywords.length; i++) {
      if(data[1] && data[1].match(keywords[i][0]) && parseInt(data[2]) > 0 && parseInt(data[3]) > 0) {

        var result = [];
        result.push(data[0]);
        result.push(keywords[i][1]);
        result.push(data[2]);
        result.push(data[3]);
        result.push(data[1]);
        fs.appendFile(filename+"-filtered.csv", result.join(',') + '\n', function (err) {
          if(err) console.log(err);
        });
      }
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
