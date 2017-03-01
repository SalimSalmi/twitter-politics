const Twitter = require('twitter');
const credentials = require("./credentials");
const client = new Twitter(credentials);
const fs = require("fs");
const csvWriter = require('csv-write-stream')
const writer = csvWriter({headers: ["id","text","geo1","geo2","source","user.id","lang","timestamp_ms"]})

const params = {
  locations: '4.73,52.29,4.98,52.42'
}

const stream = client.stream('statuses/filter', params);
writer.pipe(fs.createWriteStream('tweets.csv'));

stream.on('data', function(event) {
  if(!event.id || !event.user || (!event.coordinates && !event.geo)){
    console.log('unelidgable');
    return;
  }
  console.log(event.id);
  console.log(event.coordinates);
  console.log(event.geo);
  var today = new Date();

  var geo = event.geo || event.coordinates;

  var result = [];
  result.push(event.id);
  result.push(event.text);
  result.push(geo.coordinates[0]);
  result.push(geo.coordinates[1]);
  result.push(event.source);
  result.push(event.user.id);
  result.push(event.lang);
  result.push(event.timestamp_ms);
  result.push(event.in_reply_to_status_id);
  result.push(event.in_reply_to_user_id);
  result.push(event.in_reply_to_screen_name);
  fs.appendFile('tweets-' + today.getDate() + "-"+(today.getMonth()+1) +'.csv', result.join(", ") + "\n", function (err) { });
});

stream.on('error', function(error) {
  throw error;
});
