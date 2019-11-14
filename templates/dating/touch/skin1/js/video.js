$(function() {

  var video = document.getElementById("video");
  var player = $('.player');
  $(".swiper-container").click(function(){
    if(player.hasClass('play')){
      video.pause();
      player.removeClass('play').show();
    }else{
      video.play();
      player.addClass('play').hide();
      setTimeout(function(){
        $('.video-info').addClass('close');
      }, 1000)
    }
  }).click();
  video.addEventListener("ended", function(){
    video.pause();
    player.removeClass('play').show();
  })
})
