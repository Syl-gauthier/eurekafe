import "bootstrap";
import "./index/index.scss";


$(document).ready(function() {
  $("a[href^='#']").on("click",function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);

    $("html, body").stop().animate({
      "scrollTop": $target.offset().top - 60
    }, 900, "swing", function () {
      window.location.hash = target;
    });
  });

  $(".deep").each(function() {
    var deep = $(this);
    var containerWidth = deep.width();
    var containerLeft = deep.offset().left;
    var imageWidth = deep.find("img").width();
    var leftOffset = (imageWidth - containerWidth) / 2;
    deep.find("img").offset({left: containerLeft - leftOffset});
    $(document).scroll(function() {
      var scrollTop = $("html").scrollTop();
      var windowHeight = screen.height;
      var containerTop = deep.offset().top;
      var containerHeight = deep.height();
      var imageHeight = deep.find("img").height();
      //var initialOffset = containerHeight / 2;
      var maxOffset = imageHeight - containerHeight;
      var factor = maxOffset / ( containerHeight + windowHeight );
      var constant = windowHeight - containerTop;
      var imageOffset = factor * (scrollTop + constant);

      deep.children("a").offset({top: containerTop - maxOffset + 30 +  imageOffset});
    });
  });
});