$(function(){

  var ua = navigator.userAgent;

  // 安卓下载地址
  $('.app_box a').click(function(e){
    var t = $(this), li = t.closest('li');
    if (li.hasClass('app_android')) {
      if (ua.match(/(iPhone|iPod|iPad);?/i)) {
        alert('只支持 Android 设备');
      }else {
        if (ua.match(/MicroMessenger/i) == 'MicroMessenger') {
            if(t.attr('data-yyb')){
                location.href = t.attr('data-yyb');
            }else{
              $('.tipWarp').show();
            }
        }else {
          location.href = t.attr('data-href');
        }
      }
    }else if (li.hasClass('app_ios')){
      if (!ua.match(/(iPhone|iPod|iPad);?/i)) {
        alert('只支持 IOS 设备');
      }else {
        if (ua.match(/MicroMessenger/i) == 'MicroMessenger') {
          $('.tipWarp').show();
        }else {
          location.href = t.attr('data-href');
        }
      }
    }

  })



})
