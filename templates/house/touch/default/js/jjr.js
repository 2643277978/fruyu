$(function(){
	$('.tab-s').click(function(){
		var index = $(this).index();
		$('.tab-s').removeClass('active');
		$(this).addClass('active');
		$('.list-info').hide();
		$('.list-info').eq(index).show();
	})

	$('.header-l').click(function(){
		history.go(-1);
	})

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
})