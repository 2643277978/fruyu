$(function(){

	var mySwiper = new Swiper('.swiper-container', {
		pagination : '.pagination',
		loop : true,
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

	// 下拉加载

	var h = $('.footer').height() + $('.newList li').height() * 2;
	var allh = $('body').height();
	var w = $(window).height();
	var scroll = allh - h - w;
	$(document).ready(function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > scroll) {
				// alert('111');
			};
		});
	});

	// 点击切换

	$('.tab-info a').click(function(){
		var index = $(this).index();
		$('.tab-info a').removeClass('active');
		$(this).addClass('active');
		$('.newList').hide();
		$('.newList').eq(index).show();
	})

})