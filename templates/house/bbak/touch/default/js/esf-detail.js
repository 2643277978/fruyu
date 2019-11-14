$(function(){

	var mySwiper = new Swiper('.swiper-container', {
		loop : true,
		pagination: '.swiper-pagination',
		paginationType: 'fraction',
	})

	$('.appMapBtn').attr('href', OpenMap_URL);
	$('.appMapImg').attr('src', MapImg_URL);

// function check(){
// 	$('#page-index').text(mySwiper.activeIndex + 1);
// 	$('#page-num').text($('.swiper-slide').length)
// }

// setInterval(check, 100);


	$('.h-menu').on('click', function() {
		if ($('.nav,.mask').css("display") == "none") {
			$('.nav,.mask').show();
			$('.header').css('z-index', '101');

		} else {
			$('.nav,.mask').hide();
			$('.header').css('z-index', '99');

		}
	})
	$('.mask').on('touchmove', function() {
		$(this).hide();
		$('.nav').hide();

	})
	$('.mask').on('click', function() {
		$(this).hide();
		$('.nav').hide();
		$('.header').css('z-index', '99');

	})

	$('.more_xq').click(function() {
		$('.esf-info-con').toggleClass('close');
	})

	// 收藏
  $('.collect').click(function(){
    var t = $(this), type = t.hasClass("has") ? "del" : "add", temp = t.attr('data-temp');
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html';
      return false;
    }
    if(type == 'add'){
    	t.html('<i></i>已收藏').addClass('has');
    }else{
    	t.html('<i></i>收藏').removeClass('has');
    }
    $.post("/include/ajax.php?service=member&action=collect&module=house&temp="+temp+"&type="+type+"&id="+JubaoConfig.id);
  });

})
