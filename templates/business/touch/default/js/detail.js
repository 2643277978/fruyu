$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('#swiper-container1').css('top', 'calc(.92rem + 20px)');
		$('#swiper-container2').css('margin-top', 'calc(1.64rem + 20px)');
	}

	$('.appMapBtn').attr('href', OpenMap_URL);

	// 更多团购
	$('.shop-tuan .list-more').click(function(){
		var t = $(this), ul = $('.tuan-list'), more = $('.list-more'), back = $('.list-back');
		ul.addClass('auto');back.show();more.hide();
		mySwiper2.onResize();
	})

	$('.shop-tuan .list-back').click(function(){
		var t = $(this), ul = $('.tuan-list'), more = $('.list-more'), back = $('.list-back');
		ul.removeClass('auto');back.hide();more.show();
		mySwiper2.onResize();
	})

	var topHeight = $('.header').height(),
			tabHeight = $('#swiper-container1').height(),
			windowHeight = $(window).height(),
			iframeHeight = windowHeight - tabHeight - topHeight;
	$('#swiper-container2 .swiper-slide').css("min-height",iframeHeight);


	var mySwiper1 = new Swiper('#swiper-container1', {
		watchSlidesProgress: true,
		watchSlidesVisibility: true,
		slidesPerView: 5,
		onTap: function() {
			mySwiper2.slideTo(mySwiper1.clickedIndex)
		}
	})

	var isLoadVideoArr = [];
	var mySwiper2 = new Swiper('#swiper-container2', {
		speed:500,
		autoHeight: true,
		freeModeMomentumBounce: false,
		onSlideChangeStart: function() {
			updateNavPosition();
      $(window).scrollTop(0);
		},
		onSlideNextEnd: function(swiper){
      getUrl();
    },
		onSlidePrevEnd: function(swiper){
      getUrl();
    }

	})

	function updateNavPosition() {
		$('#swiper-container1 .active-nav').removeClass('active-nav')
		var activeNav = $('#swiper-container1 .swiper-slide').eq(mySwiper2.activeIndex).addClass('active-nav');

		if (!activeNav.hasClass('swiper-slide-visible')) {
			if (activeNav.index() > mySwiper1.activeIndex) {
				var thumbsPerNav = Math.floor(mySwiper1.width / activeNav.width()) - 1
				mySwiper1.slideTo(activeNav.index() - thumbsPerNav)
			} else {
				mySwiper1.slideTo(activeNav.index())
			}
		}
	}

	var tabIndex = $('#swiper-container1 .active-nav').index();
	mySwiper1.slideTo(tabIndex, 0, false);
	mySwiper2.slideTo(tabIndex, 0, false);

	function getUrl(){
		var getUrl = $('#swiper-container1 .active-nav a').attr('data-url');
		window.history.pushState({}, 0, getUrl);
	}

})
