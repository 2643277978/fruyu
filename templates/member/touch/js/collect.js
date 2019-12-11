$(function(){
  
  $('.collect_temp').each(function(index){
		if($(this).attr('data-collected') == 1){
			//$(this).css({"background":"url('/templates/member/touch/images/ic_follow_yes.png') no-repeat center","background-size":"95%"});
			$(this).hide();
		}
  });

  var swiper1 = $('#swiper-container1');
  var navHeight = swiper1.offset().top;

  $("#swiper-container2").height($(window).height() - $('.header').height() - $('#swiper-container1').height() - $('.search').height() - $('.fabuBtn').height());

  var mySwiper1 = new Swiper('#swiper-container1', {
     watchSlidesProgress: true,
     watchSlidesVisibility: true,
     slidesPerView: 7,
     onTap: function() {
       mySwiper2.slideTo(mySwiper1.clickedIndex)
     }
   })

   var isLoadVideoArr = [];
   var mySwiper2 = new Swiper('#swiper-container2', {
     speed:300,
     autoHeight: true,
     freeModeMomentumBounce: false,
     spaceBetween: 30,
     onSlideChangeStart: function() {
        updateNavPosition();
        $("#swiper-container2").css('height', '100%');
        $("#swiper-container2 .swiper-slide").eq(mySwiper2.activeIndex).css('height', 'auto').siblings('.swiper-slide').height($(window).height() - $('.header').height() - $('#swiper-container1').height() - $('.search').height());
        $('#swiper-container2 .swiper-wrapper').addClass('auto');
        finishDel();
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

  // 点击编辑
  $('.editBtn').click(function(){
    $('#swiper-container2 .swiper-slide-active .radio').show();
    $('#swiper-container2').addClass('pad');
    $('.editBox').show();
  })

  // 编辑选择删除
  $('.item .radio').click(function(){
    var t = $(this), slide = t.closest('.swiper-slide'), length = slide.find('.item').length;
    if (t.hasClass('selected')) {
      t.removeClass('selected');
    }else {
      t.addClass('selected');
    }
    // 判断是不是全选
    if ($('.item .selected').length == length) {
      $('.selectAll').addClass('selected');
    }else {
      $('.selectAll').removeClass('selected');
    }
    selectAccount();
  })

  // 全选
  $('.selectAll').click(function(){
    var t = $(this);
    if (t.hasClass('selected')) {
      $('#swiper-container2 .swiper-slide-active .radio').removeClass('selected');
      t.removeClass('selected');
    }else {
      $('#swiper-container2 .swiper-slide-active .radio').addClass('selected');
      t.addClass('selected');
    }
    selectAccount();
  })


  $(".content-tab li").click(function(){
	if($(this).hasClass('push_timer') || $(this).hasClass('push_timer_temp')){
		$("#delid").attr('data-type',$(this).attr('class'));
	}else{
		$("#delid").attr('data-type','');
	}
  });

  // 点击删除
  $('.delAll').click(function(){
    var id = $('#delid').val();
	var isCustomer = $("#delid").attr('data-type');

    if(id){
      if(confirm(langData['siteConfig'][20][211])){
        $.ajax({
          url: masterDomain+"/include/ajax.php?service=member&action=delCollect&id="+id+"&type="+isCustomer,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data && data.state == 100){
              $('.swiper-slide-active .item').each(function(){
                var t = $(this), selected = $(this).find('.selected'), id = selected.closest('.item').attr('data-id');
                if (id) {
                  t.remove();
                }
              })
              if ($('.swiper-slide-active .item').length == 0) {
                finishDel();
              }
            }else{
              alert(data.info);
            }
          },
          error: function(){
            alert(langData['siteConfig'][20][183]);
          }
        });
      }
    }

  })

  // 删除完成
  $('.already').click(function(){
    finishDel();
  })

  // 二级筛选
  $('.content-tab li').click(function(){
    var t = $(this), index = t.index(), list = t.closest('.content').find('.content-list');
    t.addClass('curr').siblings('li').removeClass('curr');
    list.find('.content-ul').hide().eq(index).show();
  })



  // 完成删除
  function finishDel() {
    $('#swiper-container2 .radio.selected').removeClass('selected');
    $('#swiper-container2 .radio').hide();
    $('#swiper-container2').removeClass('pad');
    $('.selectAll').removeClass('selected');
    $('.editBox').hide();
  }

  function selectAccount(){
    var selectedId = [];
    $('.swiper-slide-active .item').each(function(){
      var selected = $(this).find('.selected'), id = selected.closest('.item').attr('data-id');
      if (id) {
        selectedId.push(id);
      }
    })
    $('#delid').val(selectedId.join(','));
  }

  $(".collect_temp").click(function(){
	  var id = $(this).attr('data-id');
	  var obj = $(this);
	  $.ajax({
		  url:masterDomain + "/include/ajax.php?service=member&action=collectTempCustomer&id="+id,
		  type:"GET",
		  dataType:"jsonp",
		  success:function(data){
			//data = data.parseJSON();
			//if(data && data.state == 100){
				obj.css("display",'none');
				alert("已收藏！");	
			//}else{
			//	alert(data.info);
			//}
		  }
	  })
	  return false;
  });


})
