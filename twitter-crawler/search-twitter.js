const Twitter = require('twitter');
const credentials = require("./credentials");
const client = new Twitter(credentials);
const fs = require("fs");
const csvWriter = require('csv-write-stream')
const writer = csvWriter({headers: ["id","text","geo1","geo2","source","user.id","lang","timestamp_ms"]})

var keywords = ["VVD",
"PvdA",
"PVV",
"SP",
"CDA",
"D66",
"ChristenUnie",
"GroenLinks",
"SGP",
"Partij voor de Dieren",
"pvdd",
"50PLUS",
"Rutte",
"Asscher",
"Wilders",
"Roemer",
"Buma",
"Pechtold",
"Segers",
"Klaver",
"Staaij",
"Thieme",
"Krol"]

const params = {
  geocode: '52.3702 4.8952 5km',
  q: keywords.join(","),
  lang: "nl",
}
writer.pipe(fs.createWriteStream('tweets.csv'));

const stream = client.get('search/tweets', params, function(error, tweets, response) {
  console.log(error);
  console.log(tweets.statuses.length);
  // if(!event.id || !event.user || (!event.coordinates && !event.geo)){
  //   console.log('unelidgable');
  //   return;
  // }
  // console.log(event.id);
  //
  // var today = new Date();
  //
  // var geo = event.geo || event.coordinates;
  //
  // var result = [];
  // result.push(event.id);
  // result.push(event.text.replace(","," ").replace("\n",""));
  // result.push(geo.coordinates[0]);
  // result.push(geo.coordinates[1]);
  // result.push(event.source);
  // result.push(event.user.id);
  // result.push(event.lang);
  // result.push(event.timestamp_ms);
  // result.push(event.in_reply_to_status_id);
  // result.push(event.in_reply_to_user_id);
  // result.push(event.in_reply_to_screen_name);
  // fs.appendFile('tweets-' + today.getDate() + "-"+(today.getMonth()+1) +'.csv', result.join(", ") + "\n", function (err) { });
});
