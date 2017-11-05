

module.exports = function(clientToken) {
  var graph = require("fbgraph");

  var fb = {clientToken};

  graph.setAccessToken(fb.clientToken);

  var init = new Promise(function(resolve, reject) {
    graph.get("me/accounts", function(err, res) {
      if(err) reject(err);
      fb.page = res.data.filter(function(page) {
        return page.name === process.env.PAGE_NAME;
      })[0];
      resolve();
    });
  });
  


  fb.postPage = function postPage(data, sender, cb) {
    init.then(function() {
      if (sender && sender === "client") {
        graph.setAccessToken(fb.clientToken);
      } else {
        graph.setAccessToken(fb.page.access_token);
      }

      graph.post(fb.page.id + "/feed", data, cb);
    });
  };

  fb.getFeed = function getFeed(cb) {
    init.then(function() {
      graph.setAccessToken(fb.page.access_token);
      graph.get(fb.page.id + "/feed", cb);
    });
  };

  return fb;
};


