const fs = require("fs");
const csv = require("fast-csv");

var filename = "tweets-1-3"

var stream = fs.createReadStream(filename + ".csv");

var regexdigits = /\d{18}/g
var regexdate = /148840\d{7}/g

var csvStream = csv()
  .on("data", function(data){
    console.log(data);
    var line = data.join(",");
    if(line.match(regexdigits)){
      console.log(line);
      line = "\n"+line;
    }

    fs.appendFile(filename+"newlined.csv", line , function (err) { });
  })
  .on("end", function(){
    console.log("done");
  });

stream.pipe(csvStream);
