$(function(){

  //第三方登录
  $(".loginconnect").click(function(e){
    e.preventDefault();
    var href = $(this).attr("href"), type = href.split("=")[1];
    loginWindow = window.open(href, 'oauthLogin', 'height=565, width=720, left=100, top=100, toolbar=no, menubar=no, scrollbars=no, status=no, location=yes, resizable=yes');

    //判断窗口是否关闭
    mtimer = setInterval(function(){
      if(loginWindow.closed){
        clearInterval(mtimer);
        huoniao.checkLogin(function(){
          location.reload();
        });
      }else{
        if($.cookie(cookiePre+"connect_uid")){
          loginWindow.close();
          var modal = '<div id="loginconnectInfo"><div class="mask"></div> <div class="layer"> <p class="layer-tit"><span>'+langData['siteConfig'][21][5]+'</span></p> <p class="layer-con">'+langData['siteConfig'][20][510]+'<br /><em class="layer_time">3</em>s'+langData['siteConfig'][23][97]+'</p> <p class="layer-btn"><a href="'+masterDomain+'/bindMobile.html?type='+type+'">'+langData['siteConfig'][23][98]+'</a></p> </div></div>';
				//温馨提示-为了您的账户安全，请绑定您的手机号-后自动跳转-前往绑定
          $("#loginconnectInfo").remove();
          $('body').append(modal);

          var t = 3;
          var timer = setInterval(function(){
            if(t == 1){
              clearTimeout(timer);
              location.href = masterDomain+'/bindMobile.html?type='+type;
            }else{
              $(".layer_time").text(--t);
            }
          },1000)
        }
      }
    }, 1000);
  });


  var regform = $('.fpwdwrap');

  function showTip(obj, state, txt){
    var error = obj.closest('.inpbox').siblings('.error');
    error.show().find('span').text(txt);
  }

  //重新发送公共函数
  function sendAgain(t){
    if(!t.hasClass("disabled")){

      //异步提交
      $.ajax({
        url: masterDomain+"/include/ajax.php?service=member&action=backpassword",
        data: $(".form-horizontal-email").serialize()+"&isend=1&type=1&email="+emailMemData,
        type: "POST",
        dataType: "jsonp",
        success: function (data) {
          if(data){
            if(data.state == 100){
              countDown(60, t);
            }else{
              alert(data.info);
              t.removeClass("disabled");
              t.html(langData['siteConfig'][6][55]);  //重新发送
            }
          }else{
            alert(langData['siteConfig'][20][526]);  //发送失败，请重试！
            t.removeClass("disabled");
            t.html(langData['siteConfig'][6][55]);//重新发送
          }
        }
      });

    }
  }


  //重新发送邮件
  if(!geetest){
    $("html").delegate("#sendAgain", "click", function(){
      if(emailMemData != ""){
        sendAgain($(this));
      }else{
        location.href = masterDomain+"/fpwd.html";
      }
    });
  }


  // 类型切换
  $('.tab-nav li').click(function(){
    var t = $(this), index = t.index();
    typeval = index == 0 ? 2 : 1;
    t.addClass('active').siblings('li').removeClass('active');
    $('.tab-pane .ftype').hide().eq(index).show();
  })

  //更新验证码
  var verifycode = $(".verifycodebox img").attr("src");
  $(".verifycodebox img").bind("click", function(){
    $(this).attr("src", verifycode+"?v="+Math.random());
  });


  //没有使用极验获取短信验证码
  if(!geetest){
    $("html").delegate(".getPhoneVerify", "click", function(){
      var t = $(this), areaCode = $('#J-countryMobileCode label'), phone = $("#phone");

      if(t.hasClass("disabled")) return false;
      if(!verifyInput($("#phone"))) return false;

      var vericode = $("#vericode2");
      if(!verifyInput(vericode)) return false;

      t.addClass("disabled");

      $.ajax({
        url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify&type=fpwd",
        data: $(".form-horizontal").serialize()+"&type=fpwd",
        type: "POST",
        dataType: "jsonp",
        success: function (data) {
          //获取成功
          if(data && data.state == 100){

            if(t.hasClass("submit")){
              $('.step0 li:eq(1)').addClass("active");
              $(".phone-step .form-step:eq(0)").hide().next().show();
              $('.regphone').text('+'+areaCode.text()+phone.val());
            }

            countDown(60, $('.sendvdimgck0'));

          //获取失败
          }else{
            t.removeClass("disabled");
            alert(data.info);
          }
        }
      });
    });
  }

  //是否使用极验验证码
  if(geetest){

    //极验验证
    var handlerPopup = function (captchaObj) {
      // captchaObj.appendTo(".popup-captcha"+typeval);

      // 成功的回调
      captchaObj.onSuccess(function () {

        var result = captchaObj.getValidate();
        var geetest_challenge = result.geetest_challenge,
            geetest_validate = result.geetest_validate,
            geetest_seccode = result.geetest_seccode;

        //发送邮箱验证码
        if(typeval == 1 || (typeval == undefined && emailMemData)){

          //重新发送
          if(emailMemData){
            sendAgain($("#sendAgain"));

          //第一次发送
          }else{

            var t = $("#submitFpwdemai");
            t.addClass("disabled").html(langData['siteConfig'][7][1]+"...");

            //异步提交
            $.ajax({
              url: masterDomain+"/include/ajax.php?service=member&action=backpassword",
              data: $(".form-horizontal-email").serialize()+"&geetest_challenge="+geetest_challenge+'&geetest_validate='+geetest_validate+'&geetest_seccode='+geetest_seccode,
              type: "POST",
              dataType: "jsonp",
              success: function (data) {
                if(data){

                  if(data.state == 100){

                    emailMemData = $("#email").val();

                    $('.step1 li:eq(1)').addClass("active").siblings();

                    $("#formEmail .form-step:eq(0)").hide().next().show().find('.input-tips').html(langData['siteConfig'][20][71].replace('1', '<span class="blue">'+emailMemData+'</span>')+'<p class="btns">'+langData['siteConfig'][20][20]+'<a href="javascript:;" id="sendAgain">'+langData['siteConfig'][6][55]+'</a> <em>'+langData['siteConfig'][13][0]+'</em> <a href="'+masterDomain+'/fpwd.html?type=email" class="reset">'+langData['siteConfig'][6][56]+'</a></p>');
                    //找回密码邮件已经发送至 1 请注意查收！--没有收到邮件？--重新发送--或--返回重填


                  }else{
                    alert(data.info);
                    t.removeClass("disabled").html(langData['siteConfig'][6][0]);//或
                  }

                }else{
                  alert(langData['siteConfig'][20][180]);  //提交失败，请重试！
                  t.removeClass("disabled").html(langData['siteConfig'][6][0]);  //或
                }
              }
            });
          }


        //获取短信验证码
        }else{
          var t = $(".getPhoneVerify"), phone = $("#phone");
          t.addClass("disabled");

          $.ajax({
            url: masterDomain+"/include/ajax.php?service=siteConfig&action=getPhoneVerify",
            data: $(".form-horizontal").serialize()+"&type=fpwd&geetest_challenge="+geetest_challenge+'&geetest_validate='+geetest_validate+'&geetest_seccode='+geetest_seccode,
            type: "POST",
            dataType: "jsonp",
            success: function (data) {
              //获取成功
              if(data && data.state == 100){

                if(t.hasClass("submit")){
                  $('.step0 li:eq(1)').addClass("active").siblings();
                  $(".phone-step .form-step:eq(0)").hide().next().show();
                  $('.regphone').text('+'+$('#J-countryMobileCode label').text()+phone.val());
                }
                countDown(60, $('.sendvdimgck0'));

              //获取失败
              }else{
                t.removeClass("disabled").html(langData['siteConfig'][4][4]);   //获取短信验证码
                alert(data.info);
              }
            }
          });
        }


      });


      //获取短信验证码
      $("html").delegate(".getPhoneVerify", "click", function(){
        var t = $(this), phone = $("#phone");
        if(t.hasClass("disabled")) return false;
        if(!verifyInput($("#phone"))) return false;
        captchaObj.verify();
      });

      //邮箱确认找回
      $("#submitFpwdemai").bind("click", function(){
        if(typeval == 1){
          var t = $(this);
          if(t.hasClass("disabled")) return false;
          if(!verifyInput($("#email"))){
            tj = false;
            return false;
          }
          captchaObj.verify();
        }
      });

      //重新发送邮件
      $("html").delegate("#sendAgain", "click", function(){
        var t = $(this);
        if(t.hasClass("disabled")) return false;
        if(emailMemData){
          captchaObj.verify();
        }

      });


    };


      $.ajax({
          url: masterDomain+"/include/ajax.php?service=siteConfig&action=geetest&t=" + (new Date()).getTime(), // 加随机数防止缓存
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
              }, handlerPopup);
          }
      });
  }

  //提交
  //没有开启极验，或者开启了但是必须是手机找回时才可用
  $("#submitFpwd, #submitFpwdemai").bind("click", function(){
    if(!geetest || (geetest && typeval == 2)){
      var t = $(this), tj = true;

      if(t.hasClass("disabled")) return false;

      if(typeval == 1){
        if(!verifyInput($("#email"))){
          tj = false;
          return false;
        }
        if(!verifyInput($("#vericode1")) && !geetest){
          tj = false;
          return false;
        }
      }
      if(typeval == 2){
        if(!verifyInput($("#phone"))){
          tj = false;
          return false;
        }
        if(!verifyInput($("#vericode2")) && !geetest){
          tj = false;
          return false;
        }
        if(!verifyInput($("#vdimgck"))){
          tj = false;
          return false;
        }
      }

      if(!tj) return false;

      t.addClass("disabled").html(langData['siteConfig'][7][1]+"...");


      //异步提交
      $.ajax({
        url: masterDomain+"/include/ajax.php?service=member&action=backpassword",
        data: typeval == 2 ? $(".form-horizontal").serialize() : $(".form-horizontal-email").serialize(),
        type: "POST",
        dataType: "jsonp",
        success: function (data) {
          if(data){

            if(data.state == 100){

              if(typeval == 1){

                emailMemData = $("#email").val();

                $('.step1 li:eq(1)').addClass("active").siblings();

                $("#formEmail .form-step:eq(0)").hide().next().show().find('.input-tips').html(langData['siteConfig'][20][71].replace('1', '<span class="blue">'+emailMemData+'</span>')+'<p class="btns">'+langData['siteConfig'][20][20]+'<a href="javascript:;" id="sendAgain">'+langData['siteConfig'][6][55]+'</a> <em>'+langData['siteConfig'][13][0]+'</em> <a href="'+masterDomain+'/fpwd.html?type=email" class="reset">'+langData['siteConfig'][6][56]+'</a></p>')
							//找回密码邮件已经发送至 1 请注意查收！--没有收到邮件？--重新发送--或--返回重填
              }else{

                $("#data").val(data.info.split("data=")[1]);
                $(".phone-step .form-step:eq(1)").hide().next().show();
                // location.href = data.info;

              }

            }else{
              alert(data.info);
              t.removeClass("disabled").html(langData['siteConfig'][6][32]);   //下一步
              $("#verifycode").click();
            }

          }else{
            alert(langData['siteConfig'][20][180]);   //提交失败，请重试！
            t.removeClass("disabled").html(langData['siteConfig'][6][32]); //下一步
          }
        }
      });
      return false;

    }
  });

  // 提交新密码
  $(".setpsw").click(function(){
    var t = $(this), tj = true;

    if(t.hasClass("disabled")) return false;

    $(".form-row .error").hide();

    var password = $('#password'), repassword = $("#repassword");
    if (password.val() == "") {
      password.parent().next().show();
      return false;
    }
    if (repassword.val() == "") {
      repassword.parent().next().show();
      return false;
    }

    t.addClass("disabled").html(langData['siteConfig'][7][1]+"...");//请稍候

    //异步提交
    $.ajax({
      url: masterDomain+"/include/ajax.php?service=member&action=resetpwd&data="+$("#data").val()+"&npwd="+password.val(),
      type: "post",
      dataType: "jsonp",
      success: function (data) {
        if(data){

          if(data.state == 100){

            $('.success-pop').show();
            $('.mask').addClass('show');

            setTimeout(function(){
              location.href = userDomain;
            }, 1000);

          }else{
            alert(data.info);
            t.removeClass("disabled").html(langData['siteConfig'][6][0]);  //确认
          }

        }else{
          alert(langData['siteConfig'][20][180]); //提交失败，请重试！
          t.removeClass("disabled").html(langData['siteConfig'][6][0]);  //确认
        }
      }
    });
  })


  // 密码可见
  $('.psw-show').click(function(){
    var t = $(this);
    if (t.hasClass('psw-hide')) {
      t.removeClass('psw-hide');
      t.siblings('input').attr('type', 'password');
    }else {
      t.addClass('psw-hide');
      t.siblings('input').attr('type', 'text');
    }
  })


	regform.find('.inpbox input').focus(function(){
		$(this).closest('.inpbox').siblings('.error').hide();
	})


  var verifyInput = function(t){
		var id = t.attr("id");
		t.removeClass("focus");
		if($.trim(t.val()) == ""){
			t.next("span").show();

			if(id == "email"){
				showTip(t, "error", langData['siteConfig'][21][36]);  //请输入邮箱地址！
			}else if(id == "phone"){
				showTip(t, "error", langData['siteConfig'][20][463]);  //请输入手机号码
			}else if(id == "vericode1" || id == "vericode2"){
				showTip(t, "error", langData['siteConfig'][20][176]);  //请输入验证码
			}else if(id == "vdimgck"){
				showTip(t, "error", langData['siteConfig'][20][28]);  //请输入短信验证码
			}
			return false;

		}else{
			if(id == "email" && !/^[a-z0-9]+([\+_\-\.]?[a-z0-9]+)*@([a-z0-9]+\.)+[a-z]{2,6}$/i.test($.trim(t.val()))){
				showTip(t, "error", langData['siteConfig'][20][511]);   //邮箱格式错误！
				return false;
			}else if(id == "phone"){

			}else if(id == "vericode"){
				t.removeClass("err");
				$.ajax({
					url: "/include/ajax.php?service=siteConfig&action=checkVdimgck&code="+t.val(),
					type: "GET",
					dataType: "jsonp",
					async: false,
					success: function (data) {
						if(data && data.state == 100){
							if(data.info == "error"){
								t.addClass("err");
								showTip(t, "error", langData['siteConfig'][21][99]);  //此手机号码已被注册！
								$("#verifycode").click();
							}
						}
					}
				});
			}else{
				t.removeClass("err");
			}
		}
		return true;
	}, emailMemData = "";


  //倒计时（开始时间、结束时间、显示容器）
	function countDown(time, obj, type){
		$('.sendvdimgck'+type).hide();
		obj.addClass('disabled').text(langData['siteConfig'][20][5].replace('1', time));  //1s后重新发送
		mtimer = setInterval(function(){
			obj.text(langData['siteConfig'][20][5].replace('1', (--time))); //1s后重新发送
			if(time <= 0) {
				clearInterval(mtimer);
				obj.removeClass('disabled').text(langData['siteConfig'][6][55]);//重新发送
			}
		}, 1000);
	}


})
