$(function(){


  //导航
  $('.header-r .screen').click(function(){
    var nav = $('.nav'), t = $('.nav').css('display') == "none";
    if (t) {nav.show();}else{nav.hide();}
  });

  // 查看评论
  $(".refresh.detail").click(function(){
  	$(".ci_lead li:eq(1)").click();
  	$(window).scrollTop(999);
  })


})
