# Twitter Crawler

Uses node to access the Twitter API stream using the [twitter node library](https://www.npmjs.com/package/twitter)

To access the twitter api include a ```credentials.json``` file having the following format:
```
{
  "consumer_key": "<your_consumer_key>",
  "consumer_secret": "<your_consumer_secret>",
  "access_token_key": "<your_access_token_key>",
  "access_token_secret": "<your_access_token_secret>"
}
```

To run, install node and execute the following commands:

```
npm install
node index.js
```

## Filter tweets

To filter the tweets using keywords run
```
node filter-keywords.js
```
