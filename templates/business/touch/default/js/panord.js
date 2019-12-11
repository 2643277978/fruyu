$(function(){
  var topHeight = $('.header').height(),
      headHeight = $('.main h3').height(),
      windowHeight = $(window).height(),
      iframeHeight = windowHeight - headHeight - topHeight;
  $('.main iframe').height(iframeHeight);

})
