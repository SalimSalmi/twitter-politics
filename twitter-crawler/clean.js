const fs = require("fs");
const csv = require("fast-csv");

var filename = "tweets-1-3newlined"

var stream = fs.createReadStream(filename + ".csv");

var regexcoord = /52\.\d/g

var csvStream = csv()
  .on("data", function(data){

    var id = 2

    for (var i = 0; i < data.length; i++) {
      if(data[i].match(regexcoord)) {
        id = i;
      }
    }

    var result = [];

    result.push(data[0]);
    result.push(data.slice(1,id).join(" "));
    result.push(data[id]);
    result.push(data[id+1]);
    result.push(data[id+2]);
    result.push(data[id+3]);
    result.push(data[id+4]);
    result.push(data[id+5]);
    result.push(data[id+6] || " ");
    result.push(data[id+7] || " ");
    result.push(data[id+8] || " ");
    console.log(result);

    fs.appendFile(filename+"commd.csv", result.join(",") + "\n", function (err) { });
  })
  .on("end", function(){
    console.log("done");
  });

stream.pipe(csvStream);
