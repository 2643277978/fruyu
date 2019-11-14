$(function(){
   $('.markBox').find('a:first-child').addClass('curr');
    new Swiper('.topSwiper .swiper-container', {pagination: {el: '.topSwiper .swiper-pagination',type: 'fraction',} ,loop: false,grabCursor: true,paginationClickable: true,
        on: {
            slideChangeTransitionStart: function(){
              var len = $('.markBox').find('a').length;
              var sindex = this.activeIndex;
              if(len==1){
                $('.markBox').find('a:first-child').addClass('curr');
              }else{
                if(sindex>1){
                    $('.pmark').removeClass('curr');
                    $('.picture').addClass('curr');
                }else{
                    $('.pmark').removeClass('curr');
                    $('.markBox').find('a').eq(sindex).addClass('curr');
                }
              }

            },
        }
    });


  // 图片放大
  var videoSwiper = new Swiper('.videoModal .swiper-container', {pagination: {el:'.videoModal .swiper-pagination',type: 'fraction',},loop: false})
    $(".topSwiper").delegate('.swiper-slide', 'click', function() {
        var imgBox = $('.topSwiper .swiper-slide');
        var i = $(this).index();
        $(".videoModal").addClass('vshow');
        $('.markBox').toggleClass('show');
        videoSwiper.slideTo(i, 0, false);
        return false;
    });

    $(".videoModal").delegate('.vClose', 'click', function() {
        var video = $('.videoModal').find('video').attr('id');
        $(video).trigger('pause');
        $(this).closest('.videoModal').removeClass('vshow');
        $('.videoModal').removeClass('vshow');
        $('.markBox').removeClass('show');
    });


    // 点击微信
    $('.im_icon .im_wx').click(function(){
    	$('.wx_frame').show();
    	$('.desk').show();
    });
    $('.wx_frame .wx_cuo').click(function(){
    	$('.wx_frame').hide();
    	$('.desk').hide();
    });

    // 点击qq
    $('.im_icon .im_qq').click(function(){
        $('.qq_frame').show();
        $('.desk').show();
    });
    $('.qq_frame .qq_cuo').click(function(){
        $('.qq_frame').hide();
        $('.desk').hide();
    });

    //点击电话
    $('.im_icon .im_iphone, .call_phone').click(function () {
        var user_id=window.sessionStorage.getItem('userid');
      if(user_id == true){
          bodaPhone();
      }else {
          $(".phone_frame").show();
          $('.desk').show();
      }
    });

    $('.immediate_phone').click(function () {
        var userPhone = $('.user_phone').val();
        var regMobilePhone = new RegExp(/^1[34578]\d{9}$/);
        var regTelephone = new RegExp(/^((0\d{2,3})-?)(\d{7,8})(-(\d{3,}))?$/);
        if (userPhone == "") {
            console.log(userPhone);
            alert("请输入您的电话号码");
            return false;
        } else if (!(regMobilePhone.test(userPhone) || regTelephone.test(userPhone))) {
            // $('.user_phone').val("");
            console.log(userPhone);
            alert("电话号码格式有误,请重新输入!");
            return false;
        }
        if (userPhone) {
            // if (!(regMobilePhone.test(userPhone) || regTelephone.test(userPhone))){
            var id = $(this).attr('data-id');
            var itemid = $(this).attr('data-item');
            var type = $(this).attr('data-type');
            $.ajax({
                url: "/include/ajax.php?service=member&action=getTempVisualPhone&id=" + id + "&itemid=" + itemid + "&type=" + type,
                type: "post",
                date: {userPhone: userPhone},
                datatype: "jsonp",
                success: function (jsondata) {
                    if (jsondata.success == true) {
                        $(".phone_frame a").attr('href', 'tel:' + data.info.phone);
                        $(".call_phone").attr('href', 'tel:' + data.info.phone);
                        $(".phoneNum_show").text(data.info.phone);
                        $('.phone_frame').show();
                        $('.user_phone').hide();
                        $('.desk').show();
                    } else {
                        alert("failed");
                        return false;
                    }
                },
                error: function (err) {
                    alert("失败");
                    return false;
                }
            })
        }
        return false;
    })


    function  bodaPhone(){
            var id = $(this).attr('data-id');
            var itemid = $(this).attr('data-item');
            var type = $(this).attr('data-type');
            $.ajax({
                url : "/include/ajax.php?service=member&action=getTempVisualPhone&id="+id+"&itemid="+itemid+"&type="+type,
                type: "get",
                datatype: "jsonp",
                success: function(data){
                    data = JSON.parse(data);
                    if(data && data.state == 100){
                        $(".phone_frame a").attr('href','tel:'+data.info.phone);
                        $(".call_phone").attr('href','tel:'+data.info.phone);
                        $(".phoneNum_show").text(data.info.phone);
                        $('.phone_frame').show();
                        // $(".user_phone").hide();
                        $('.desk').show();
                    }else{
                        alert(data.info);
                    }
                }
            });
            if($(this).hasClass('call_phone')){
                return false;
            }
    }
    //关闭
    $('.phone_frame .phone_cuo').click(function(){
        $('.phone_frame').hide();
        $('.desk').hide();
    });

    // 点击收藏
    $('.Collection').click(function(){
        var t = $(this), type = '';
        // console.log(t.find);
        if(t.find('.follow-icon').hasClass('active')){
            t.find('.follow-icon').removeClass('active');
            t.find('.text-follow').text('收藏');
            type = 'del';
        }else{
            t.find('.follow-icon').addClass('active');
            t.find('.text-follow').text('已收藏');
            type = 'add';
        }
        $.post("/include/ajax.php?service=member&action=collect&module=house&temp="+page_type+"_detail&type="+type+"&id="+pageData.id);
    });

    $('.appMapBtn').attr('href', OpenMap_URL);


})
