var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');


var filename = "nokeys"
var regexlang = /\bnl\b/ig
var i = 0;


var keywords = [
  [/VVD|Rutte|mensen|liberalisme|liberalen/ig,'vvd'],
  [/PvdA|Asscher|ombudswerk|social|progressive|verbeteren|socialisten/ig,'pvda'],
  [/PVV|Wilders|geertwilders|agema|islam|nikaab|sharia/ig,'pvv'],
  [/\bsp(?!é)\b|Roemer|goubet|jeugdhulp|toekomst|(paulus.jansen)|optimisme|rood/ig,'sp'],
  [/CDA|Buma|nistelrooij|schreijer|ruijten|lenaers/ig,'cda'],
  [/D66|Pechtold|vertrouw|harmonieuze|mensen|streef|beloon|gerichtheid|mededogen/ig,'d66'],
  [/ChristenUnie|(Christen.Unie)|Segers|stieneke|gooijer|(eppo.bruins)|bruins/ig,'cu'],
  [/GroenLinks|(Groen.Links)|Klaver|pennarts|roijackers|kotkamp|groenlicht|eickhout/ig,'gl'],
  [/SGP|kindzorg|zorgwetten|dementiezorg|zorgaanbieder|Staaij/ig,'sgp'],
  [/50plus|(50.plus)|ouderen|theun|pensioen|anbi|struijlaard|Krol/ig,'50p'],
];


var s = fs.createReadStream(filename + "-all.csv")
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
