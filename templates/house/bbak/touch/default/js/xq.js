$(function() {

	var mySwiper = new Swiper('.swiper-container', {
		loop: true,
		pagination: '.swiper-pagination',
		paginationType: 'fraction',
	})

	$('.header-l').click(function() {
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

	$('#more_xq').click(function() {
		if ($('.con-short').css("display") == "none") {
			$('.con-short').show();
			$('.con-long').hide();
			$('.more_xq').removeClass('up')

		} else {
			$('.con-short').hide();
			$('.con-long').show();
			$('.more_xq').addClass('up')

		}
	})

	$('.more_info').click(function() {
		var dn = $(this).siblings().hasClass('dn');
		if (dn) {
			$(this).siblings('.info').removeClass('dn');
			$('.more_xq').addClass('up')
		} else {
			$(this).siblings('.info').addClass('dn');
			$('.more_xq').removeClass('up')
		}
	})

	
})