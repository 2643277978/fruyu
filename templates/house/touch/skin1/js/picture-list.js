$(function() {
	$(document).ready(function() {
		$(window).scroll(function() {
			if ($("#xiaoguo").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.xg').addClass('active');
			}
			if ($("#yangban").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.yb').addClass('active');
			}
			if ($("#shijing").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.sj').addClass('active');
			}
			if ($("#huxing").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.hx').addClass('active');
			}
			if ($("#peitao").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.pt').addClass('active');
			}
			if ($("#jiaotong").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.jt').addClass('active');
			}
			if ($("#huodong").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.hd').addClass('active');
			}
			if ($("#quanjing").offset().top - $(window).scrollTop() < 90) {
				$('.btn-box a').removeClass('active');
				$('.qj').addClass('active');
			}

		});
	});

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

})