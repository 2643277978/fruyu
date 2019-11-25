$(function(){

  $('.appMapBtn').attr('href', OpenMap_URL);
  // 电话咨询
  $('.call_phone').click(function(){
      var id = $(this).attr('data-id');
      var itemid = $(this).attr('data-item');
      var type = $(this).attr('data-type');
      // var url ="http://test.fangruyu.net/include/ajax.php?service=member&action=getTempVisualPhone&itemid="+itemid+"&type="+type;
      // console.log(url);
      $.ajax({
          url : "/include/ajax.php?service=member&action=getTempVisualPhone&itemid="+itemid+"&type="+type,
          type: "get",
          datatype: "jsonp",
          success: function(data){
              data = JSON.parse(data);
              console.log(data);
              if(data && data.state == 100){
                  $(".phone_frame a").attr('href','tel:'+data.info.phone);
                  $(".call_phone").attr('href','tel:'+data.info.phone);
                  $(".phoneNum_show").text(data.info.phone);
                  $('.phone_frame').show();
                  $('.desk').show();
              }else{
                  // alert(data.info);
                  alert("请稍后再试！");
              }
          }
      });
      if($(this).hasClass('call_phone')){
          return false;
      }
      // $('.phone_frame').show();
      // $('.desk').show();
  });
  $('.phone_cuo').click(function(){
      $('.phone_frame').hide();
      $('.desk').hide();
  });

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
    $(".topSwiper").delegate('.swiper-container', 'click', function() {
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


var swiper = new Swiper('.shapanSwiper .swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 17,
      pagination: {
        el: '.shapanSwiper .swiper-pagination',
        clickable: true,
      },
    });

        // 电话弹出框
    $('.tel').click(function(){
        $("#tel").html('');
        $("#phone").html('');
        if($(this).attr('data-tel')!=''){
            $("#tel").html('<a href="tel:'+$(this).attr('data-tel')+'">'+$(this).attr('data-tel')+'</a>').show();
        }else{
            $("#tel").hide();
        }
        if($(this).attr('data-phone')!=''){
            $("#phone").html('<a href="tel:'+$(this).attr('data-phone')+'">'+$(this).attr('data-phone')+'</a>').show();
        }else{
            $("#phone").hide();
        }
      $('.desk').show();
      $('.phone').show();
    });
    $('.phone .signout').click(function(){
      $('.desk').hide();
      $('.phone').hide();
    });


    //倒计时s
    var timeCompute = function (a, b) {
        if (this.time = a, !(0 >= a)) {
            for (var c = [86400 / b, 3600 / b, 60 / b, 1 / b], d = .1 === b ? 1 : .01 === b ? 2 : .001 === b ? 3 : 0, e = 0; d > e; e++) c.push(b * Math.pow(10, d - e));
            for (var f, g = [], e = 0; e < c.length; e++) f = Math.floor(a / c[e]),
                g.push(f),
                a -= f * c[e];
            return g
        }
    }
        ,CountDown =	function(a, b) {
        this.precise = parseFloat(b) || 1,
            this.time = a / this.precise,
            this.countTimer = null,
            this.run = function(a) {
                var b, c = this,
                    e = this.precise;
                this.countTimer = setInterval(function() {
                        b = timeCompute.call(c, c.time - 1, e),
                        b || (clearInterval(c.countTimer), c.countTimer = null),
                        "function" == typeof a && a(b || [0, 0, 0, 0, 0], !c.countTimer)
                    },
                    1e3 * e)
            }
    }
        ,timeLmtCountdown = function() {
        var content = $(".infbox");
        var $this = content.find(".time");
        var etime = $this.attr('data-etime'); //结束时间
        var ntime = $this.attr('data-ntime'); //当前时间
        var end = etime - ntime;
        var time = end > 0 ? end : 0;

        var timeTypeText = '倒计时';
        var countDown = new CountDown(time);
        countDownRun();

        function countDownRun(time) {
            time && (countDown.time = time);
            countDown.run(function(times, complete) {
                var html = timeTypeText+'<span>' + (times[0] < 10 ? "0" + times[0] : times[0]) +
                    '</span>天<span>' + (times[1] < 10 ? "0" + times[1] : times[1]) +
                    '</span>小时<span>' + (times[2] < 10 ? "0" + times[2] : times[2]) +
                    '</span>分<span>' + (times[3] < 10 ? "0" + times[3] : times[3]) + '</span>秒';
                $this.html(html);
            });
        }
    }
    timeLmtCountdown();


})
