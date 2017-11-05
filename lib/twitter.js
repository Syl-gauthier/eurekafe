module.exports = function() {
  var twitter = require("twitter");

  var client = new twitter({
    consumer_key: process.env.TWITTER_CONS_KEY,
    consumer_secret: process.env.TWITTER_CONS_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var twit = {};

  twit.getFeed = function getFeed(screen_name, cb) {
    client.get("statuses/user_timeline", {screen_name: "AOswld"}, function(err, tweets) {
      tweets = tweets.map(function(tweet) {
        return {
          date: tweet.created_at,
          rt: !(!tweet.retweeted_status),
          text: tweet.text
        };
      });

      cb(err, tweets);
    });
  };
 
  return twit;
};
