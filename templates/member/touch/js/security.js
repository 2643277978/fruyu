$(function(){

  //导航
  $('.header-r .screen').click(function(){
    var nav = $('.nav'), t = $('.nav').css('display') == "none";
    if (t) {nav.show();}else{nav.hide();}
  })

	//退出
	$('.logout').bind("click", function(){
        $(this).html('退出中...');
		$.cookie(cookiePre+'login_user', null, {expires: -10, domain: channelDomain, path: '/'});
	});

  var device = navigator.userAgent;
  if(device.indexOf('huoniao') > -1){
  	$('.logout').attr('href', 'javascript:;');
  }

})
