const Twitter = require('twitter');
const credentials = require("./credentials");
const client = new Twitter(credentials);
const fs = require("fs");


const params = {
  locations: '4.73,52.29,4.98,52.42'
}

const stream = client.stream('statuses/filter', params);

stream.on('data', function(event) {
  // Dont include tweets without coordinates
  if(!event.id || (!event.coordinates && !event.geo)){
    return;
  }

  var today = new Date(); //Date for file name

  var geo = event.geo || event.coordinates;

  // Extract important info
  var result = [];
  result.push(event.id);
  result.push(event.text.replace(",","").replace("\n","")); // Escape twitter text for CSV file
  result.push(geo.coordinates[0]);
  result.push(geo.coordinates[1]);
  result.push(event.source);
  result.push(event.user.id);
  result.push(event.lang);
  result.push(event.timestamp_ms);
  result.push(event.in_reply_to_status_id);
  result.push(event.in_reply_to_user_id);
  result.push(event.in_reply_to_screen_name);

  // Write line to csv file
  fs.appendFile('tweets-' + today.getDate() + "-"+(today.getMonth()+1) +'.csv', result.join(", ") + "\n", function (err) { });
});

stream.on('error', function(error) {
  throw error;
});
