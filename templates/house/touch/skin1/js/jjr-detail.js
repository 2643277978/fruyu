$(function(){
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

	// 下拉加载
	var h = $('.footer').height() + $('.house-box').height() * 2;
	var allh = $('body').height();
	var w = $(window).height();
	var scroll = allh - h - w;
	$(document).ready(function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > scroll) {
				// alert('111')
			};
		});
	});
})