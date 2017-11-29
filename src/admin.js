//admin.js

import "./admin/admin.scss";
import "bootstrap";
import "./misc/admin.ico";
import "./admin/tweeter-profile.jpg";


$(document).ready(function() {
  $("#twitterStatus").change(function() {
    $("#char-count").html("Lettre utilisées: " + $(this).val().length);
    $("#char-left").html("Lettre restantes:" + (280 - $(this).val().length));
    var tweetArray = $(this).val().split(" ");
    var tweet = tweetArray.reduce(function(acc, word) {
      if(/^[@#]/.test(word)||/.(fr|com|eu|org|io|ly)$/.test(word)) {
        return (acc + "<span>" + word + "</span> ");
      } 
      else {
        return (acc + word + " ");
      }
    }, "");
    $(".tweetStatusPreview").html(tweet);
  });

  $("#twitterImage").change(function() {
    if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $(".twitterImg").attr("src", e.target.result);
      };

      reader.readAsDataURL(this.files[0]);
    }
  });


});