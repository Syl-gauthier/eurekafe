import "./index/index.scss";
import "bootstrap";

$(document).ready(function() {  

  $("[data-toggle='popover']").popover({trigger: "hover", placement: "bottom"});
  
  $("a[href^='#']").not("a[href='#manger'], a[href='#boire'], a[href='#elec'], a[href='#wifi'], a[href='#science']").on("click",function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);
    var offset = $target.offset().top - 50;

    $("html, body").stop().animate({
      "scrollTop": (offset)
    }, 900, "swing");
  });


  $(".parallax-container").each(function() {
    var pContainer = $(this);
    $(document).scroll(function() {
      var dim = {};

      //variable
      dim.scrollTop = $("html").scrollTop();

      //variable when resize
      dim.windowHeight = screen.height;
      dim.containerTop = pContainer.offset().top;
      dim.imageHeight = pContainer.find("img").height();

      //constant
      dim.containerHeight = pContainer.height();

      //calculated
      dim.maxOffset = dim.imageHeight - dim.containerHeight;
      dim.a = dim.maxOffset / (dim.containerHeight + dim.windowHeight);
      dim.b = dim.windowHeight - dim.containerTop;
      //f(scrollTop) = a(scrollTop + b);
      dim.imageOffset = dim.a * (dim.scrollTop + dim.b);

      pContainer.children("img").offset({top: dim.containerTop + dim.imageOffset - dim.maxOffset});
    });
  });


});