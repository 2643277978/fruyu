$(function(){

	var mySwiper = new Swiper('.swiper-container', {
		loop : true,
		pagination: '.swiper-pagination',
		paginationType: 'fraction',
	})

	$('.appMapBtn').attr('href', OpenMap_URL);

	$('.house-quanjin-module').each(function(){
		if($(this).find('li').length == 0){
			$(this).closest('.house-quanjin').hide();
		}
	});


	// 户型

	$('.huxing-module-tab a').click(function(index){
		var index = $(this).index();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.huxing-module-box').eq(index).show();
		$('.huxing-module-box').eq(index).siblings('.huxing-module-box').hide();

	})

	// 推荐楼盘
	$('.house-resale-tab .tab-item').click(function(index){
		var index = $(this).index();
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$('.resale-box').eq(index).show();
		$('.resale-box').eq(index).siblings('.resale-box').hide();

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


	// 收藏
  $('.collect').click(function(){
    var t = $('.collect'), type = t.hasClass("has") ? "del" : "add";
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
    $.post("/include/ajax.php?service=member&action=collect&module=house&temp=loupan_detail&type="+type+"&id="+JubaoConfig.id);
  });

  //沙盘图拖动
  if($("#shapan-box").length){
    var drag = new Drag({
      dom : "#shapan-box",
      ondrag: function(){
      }
    });
  }

  $(".map-mark").click(function(){
    var t = $(this), index = t.index() - 1;
    t.addClass("map-mark-active").siblings().removeClass("map-mark-active");
    $(".dist-items").eq(index).show().siblings().hide();
  }).eq(0).click();
})
