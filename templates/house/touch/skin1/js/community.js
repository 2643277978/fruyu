$(function() {

	var mySwiper = new Swiper('.swiper-container', {
		loop: true,
		pagination: '.swiper-pagination',
		paginationType: 'fraction',
		// Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true
	})

	$('.appMapBtn').attr('href', OpenMap_URL);
	$('.appMapImg').attr('src', MapImg_URL);

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

	$('.more_xq').click(function() {
		$(this).parent().toggleClass('close');
	})

	// var mapw = $('.esf-map-con').width(),maph = mapw * .3;
	// $('.esf-map-con a ').html('<img src="http://api.map.baidu.com/staticimage?width='+mapw+'&height='+maph+'&zoom=16&markers='+pageData.lng+','+pageData.lat+'&markerStyles=m,Y">');

})
