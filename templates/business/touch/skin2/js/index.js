$(function () {

    //选择城市
    if(device.indexOf('huoniao') > -1){
        $('.area a').bind('click', function(e){
            e.preventDefault();
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('goToCity', {}, function(){});
            });
        });
    }


 // banner轮播图
 new Swiper('.banner .swiper-container', {pagination:{ el: '.banner .pagination',} ,slideClass:'slideshow-item',loop: false,grabCursor: true,paginationClickable: true,autoplay:{delay: 2000,}});
 
 // 滑动导航
  new Swiper('.tcInfo .swiper-container', {pagination: { el: '.tcInfo .pagination',},loop: false,grabCursor: true,paginationClickable: true});

   // 电话弹框
    $(".tel").on("touchend",function(){
        $.smartScroll($('.modal-public'), '.modal-main');
        $('html').addClass('nos');
        $('.m-telphone').addClass('curr');
        return false;
    });
    // 关闭
    $(".modal-public .modal-main .close").on("touchend",function(){
        $("html, .modal-public").removeClass('curr nos');
        return false;
     })
    $(".bgCover").on("click",function(){
        $("html, .modal-public").removeClass('curr nos');
    })

    var lng = lat = 0;
    var page = 1, isload = false;

    // 获取推荐商家
    function getList(){
      isload = true;
      var pageSize = page == 1 ? 4 : 10;
      $.ajax({
        url: masterDomain+'/include/ajax.php?service=business&action=blist&page='+page+'&pageSize='+pageSize+'&lng='+lng+'&lat='+lat,
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
          if(data && data.state == 100){
            var html = [];

            for(var i = 0; i < data.info.list.length; i++){
              var d = data.info.list[i];

              html.push('<li class="fn-clear">');
              html.push('  <div class="rleft">');
              html.push('    <a href="'+d.url+'"><img src="'+(d.logo ? d.logo : (templets + 'images/fShop.png'))+'" alt=""></a>');
              if(d.face_qj == "1"){
                html.push('    <div class="mark mark1">全景</div>');
              }
              if(d.face_video == "1"){
                html.push('    <div class="mark mark3">视频</div>');
              }
              html.push('  </div>');
              html.push('  <div class="rright">');
              html.push('   <a href="'+d.url+'">');
              html.push('    <div class="rtitle fn-clear">'+(d.top == "1" ? '<i></i>' : '')+'<p>'+d.title+'</p> '+(d.type == "2" ? '<em></em>' : '')+'&nbsp;</div>');
              html.push('    <p class="comment"><span class="starbg"><i class="star" style="width: '+(d.sco1 / 5 * 100)+'%;"></i></span>'+d.comment+'评论</p>');
              html.push('    <p class="addr">'+d.address+'<span>'+d.distance+'</span></p>');
              html.push('   </a>');
              if(d.tel != ""){
                html.push('    <a href="tel:'+d.tel+'" class="tel">');
                html.push('      <img src="'+templets+'images/hPhone.png" alt="">');
                html.push('    </a>');
              }
              html.push('  </div>');
              html.push('</li>');
            }

            $('.recomBus ul').append(html.join(''));

            if(data.info.pageInfo.totalPage <= page){
              $('.btnMore').text('已加载全部数据').addClass('disabled');
            }else{
              isload = false;
            }

            if(page == 1){
              insertLastJoin(data.info.list);
            }

          }else{
            $('.btnMore').text('暂无相关信息');
            $('.tcNews .load').text('暂无相关入驻信息');
          }
        },
        error: function(){
          if(page == 1){
            $('.tcNews .load').text('网络错误，请重试');
          }
          $('.btnMore').text('网络错误，请重试');
          page = page > 1 ? page - 1 : 1;
        }
      })
    }
    function checkLocal(){
      var local = false;
      var localData = utils.getStorage("user_local");
      if(localData){
        var time = Date.parse(new Date());
        time_ = localData.time;
        // 缓存1小时
        if(time - time_ > 3600 * 1000){
          lat = localData.lat;
          lng = localData.lng;
          local = true;
        }

      }

      if(!local){
        HN_Location.init(function(data){
          if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
            lng = lat = -1;
          }else{
            lng = data.lng;
            lat = data.lat;

            var time = Date.parse(new Date());
            utils.setStorage('user_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': data.address}));

            getList();
          }
        })
      }else{
        getList();
      }
      
    }

    $('.btnMore').click(function(){
      var t = $(this);
      if(isload || t.hasClass('disabled')) return;
      page++;
      getList();
    })

    checkLocal();

    // 最新入驻
    function insertLastJoin(list){
      var html = [];
      html.push('<div class="swiper-slide">');
      for(var i = 0; i < list.length; i++){
        var d = list[i];
        html.push('<p><a href="'+d.url+'">['+huoniao.transTimes(d.pubdate, 3).replace('-', '月')+'日] 欢迎<span>'+d.title+'</span>成功入驻</a> </p>');
        if((i + 1) % 2 == 0 && i + 1 < list.length){
          html.push('</div>');
          html.push('<div class="swiper-slide">');
        }
      }
      html.push('</div>');
      $('.tcNews .swiper-wrapper').html(html.join(""));
      new Swiper('.tcNews .swiper-container', {direction: 'vertical', pagination: { el: '.tcNews .pagination',clickable: true,},autoplay:{delay: 2000,},});
    }

})