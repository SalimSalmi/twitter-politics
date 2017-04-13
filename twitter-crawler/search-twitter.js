const Twitter = require('twitter');
const credentials = require("./credentials");
const client = new Twitter(credentials);
const fs = require("fs");

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

//Get tweets in amsterdam based on search query
const searchRequest = client.get('search/tweets', params, function(error, tweets, response) {
  console.log(error);
  console.log(tweets.statuses.length);
});
