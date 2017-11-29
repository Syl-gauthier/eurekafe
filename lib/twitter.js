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

  twit.postMedia = function postMedia(pathToMovie, mediaType, cb) {
    const mediaData   = require("fs").readFileSync(pathToMovie);
    const mediaSize    = require("fs").statSync(pathToMovie).size;

    initUpload() // Declare that you wish to upload some media
      .then(appendUpload) // Send the data for the media
      .then(finalizeUpload) // Declare that you are done uploading chunks
      .then(mediaId => {
        console.log(mediaId);
        cb(mediaId);
        // You now have an uploaded movie/animated gif
        // that you can reference in Tweets, e.g. `update/statuses`
        // will take a `mediaIds` param.
      });

    /**
     * Step 1 of 3: Initialize a media upload
     * @return Promise resolving to String mediaId
     */
    function initUpload () {
      return makePost("media/upload", {
        command    : "INIT",
        total_bytes: mediaSize,
        media_type : mediaType,
      }).then(data => data.media_id_string);
    }

    /**
     * Step 2 of 3: Append file chunk
     * @param String mediaId    Reference to media object being uploaded
     * @return Promise resolving to String mediaId (for chaining)
     */
    function appendUpload (mediaId) {
      return makePost("media/upload", {
        command      : "APPEND",
        media_id     : mediaId,
        media        : mediaData,
        segment_index: 0
      }).then(data => mediaId);
    }

    /**
     * Step 3 of 3: Finalize upload
     * @param String mediaId   Reference to media
     * @return Promise resolving to mediaId (for chaining)
     */
    function finalizeUpload (mediaId) {
      return makePost("media/upload", {
        command : "FINALIZE",
        media_id: mediaId
      }).then(data => mediaId);
    }

    /**
     * (Utility function) Send a POST request to the Twitter API
     * @param String endpoint  e.g. "statuses/upload"
     * @param Object params    Params object to send
     * @return Promise         Rejects if response is error
     */
    function makePost (endpoint, params) {
      return new Promise((resolve, reject) => {
        client.post(endpoint, params, (error, data, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  };
  

  twit.post = function twitPost(data, cb) {
    if(data.img) {
      twit.postMedia(data.img.path, data.img.mimetype, function(mediaId) {
        client.post("statuses/update", {status: data.status, media_ids: mediaId}, cb);
      });
    } else {
      client.post("status/update", {status: data.status}, cb);
    }
  };
 
  return twit;
};
