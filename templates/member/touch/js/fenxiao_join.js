if(tj_state == 1){
  setTimeout(function(){
    location.href = fenxiaoUrl;
  }, 1000)
}
var dataGeetest = "";
  var ftype = "phone";
    
    //发送验证码
  function sendPhoneVerCode(){
    var btn = $('.test_btn button');
    if(btn.filter(":visible").hasClass("disabled")) return;

    var vericode = "";
    // var vericode = $("#vdimgck").val();  //图形验证码
    // if(vericode == '' && !geetest){
    //   alert(langData['siteConfig'][20][170]);
    //   return false;
    // }

    var number = $('#contact').val();
    if (number == '') {
      alert(langData['siteConfig'][20][27]);
      return false;
    }

   if(isNaN(number)){
      alert(langData['siteConfig'][20][179]);
      return false;
    }else{
      ftype = "phone";
    }

    btn.addClass("disabled");

    if(ftype == "phone"){
      var action = "getPhoneVerify";
      var dataName = "phone";
      $.ajax({
        url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=verify",
        data: "vericode="+vericode+"&areaCode=86&phone="+number+dataGeetest,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          //获取成功
          if(data && data.state == 100){
          //获取失败
           alert('验证码已发送');
            countDown(60, $('.getCodes'));
          }else{
            btn.removeClass("disabled");
            alert(data.info);
          }
        },
        error: function(){
          btn.removeClass("disabled");
          alert(langData['siteConfig'][20][173]);
        }
      });
    }
  }

//倒计时
function countDown(time, obj){
    obj.html(time+'秒后重发').addClass('disabled');
    mtimer = setInterval(function(){
        obj.html((--time)+'秒后重发').addClass('disabled');
        if(time <= 0) {
            clearInterval(mtimer);
            obj.html('重新发送').removeClass('disabled');
        }
    }, 1000);
}

  if(!geetest){
    $('.test_btn button').click(function(){
      if(!$(this).hasClass("disabled")){
        sendPhoneVerCode();
      }
    });
  }else{
    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd) {
      // captchaObjFpwd.appendTo("#popupFpwd-captcha-mobile");

      // 成功的回调
      captchaObjFpwd.onSuccess(function () {

        var validate = captchaObjFpwd.getValidate();
        dataGeetest = "&terminal=mobile&geetest_challenge="+validate.geetest_challenge+"&geetest_validate="+validate.geetest_validate+"&geetest_seccode="+validate.geetest_seccode;

        //邮箱找回
        if(ftype == "phone"){
			//获取短信验证码
          var number   = $('#contact').val();
          if (number == '') {
            alert(langData['siteConfig'][20][27]);
            return false;
          } else {
            sendPhoneVerCode();
          }

        }
      });

      window.captchaObjFpwd = captchaObjFpwd;
    };

   
    //获取验证码
    $('.test_btn button').click(function(){
      if($(this).hasClass("disabled")) return;
      var number   = $('#contact').val();
      if (number == '') {
        alert(langData['siteConfig'][20][27]);
        return false;
      } else {
        if(isNaN(number)){
          alert(langData['siteConfig'][20][179]);
          return false;
        }else{
          ftype = "phone";
        }
		
        if (captchaObjFpwd) {
            captchaObjFpwd.verify();
        }
      
      }
    });


   

    $.ajax({
        url: "/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function (data) {
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success,
                new_captcha: true,
                product: "bind",
                width: '312px'
            }, handlerPopupFpwd);
        }
    });
  }

$('.sub_btn').click(function(){
  var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url"), tj = true;
  var t = $(this)
      ,phone = $('#contact').val()  //手机号
      ,vercode = $('#vercode').val()  //验证码
      ;
  if(t.hasClass('disabled')) return;
  if(phone == ''){
    showMsg(langData['siteConfig'][20][239]);
    return false;
  }
  if(vercode == ''){
    showMsg(langData['siteConfig'][20][176]);
    return false;
  }
  t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

  $.ajax({
    url: action,
    type: 'post',
    data: form.serialize(),
    dataType: 'json',
    success: function(res){
      if(res && res.state == 100){
        alert(res.info);
        location.reload();
      }else{
        showMsg(res.info);
        t.removeClass("disabled").html(langData['siteConfig'][11][19]);
      }
    },
    error: function(){
      showMsg(langData['siteConfig'][20][183]);
      t.removeClass("disabled").html(langData['siteConfig'][11][19]);
    }
  })
})

// 错误提示
  function showMsg(str){
    var o = $(".error");
    o.html('<p>'+str+'</p>').show();
    setTimeout(function(){o.hide()},1000);
  } 

