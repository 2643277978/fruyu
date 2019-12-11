$(function(){

	// 记住密码
	var remember = $('.rememberpsd');
	remember.click(function(){
		remember.toggleClass('checked');
	})
	// 更换验证码
	$('#vdimgck,.change').click(function(){
		var img = $('#vdimgck'),src = img.attr('src') + '?v=' + new Date().getTime();
		img.attr('src',src);
	})
	// 二维码登陆
	$('.ewmlogin').click(function(){
		$('.ewmlogin ,.saoma').toggleClass('open');
	})

	//切换短信登录
	$('.login-container li').bind('click', function(){
		var t = $(this), index = t.index();
		t.addClass('curr').siblings('li').removeClass('curr');
		$('.login-container .main .item:eq('+index+')').show().siblings('.item').hide();
	});


	var lgform = $('.loginform');

	lgform.find('.inp').focus(function(){
		$(this).closest('.inpbdr').addClass('focus');
	}).blur(function(){
		$(this).closest('.inpbdr').removeClass('focus');
	})

	// 提交
	var err = lgform.find('.error p');
	lgform.submit(function(e){
		e.preventDefault();
		err.text('').hide();

		var ltype = $('.login-container .tab .curr').index();
		var submit = $(".submit");

		//普通登录
		if(ltype == 0){

			var nameinp = $('.username'),
				name = nameinp.val(),
				psdinp = $('.password'),
				psd = psdinp.val(),
				vdimgckinp = $('.vdimgck'),
				vdimgck = vdimgckinp.val(),
				r = true;
			if(name == ''){
				err.text(langData['siteConfig'][20][541]).show();   //请填写登录帐号
				nameinp.focus();
				r = false;
			}
			if(r && psd == ''){
				err.text(langData['siteConfig'][20][542]).show();   //请填写登陆密码
				psdinp.focus();
				r = false;
			}
			if(r && vdimgckinp && vdimgck == "" && vdimgck != undefined){
				err.text(langData['siteConfig'][20][540]).show();   //请填写验证码
				vdimgckinp.focus();
				r = false;
			}

			if(r){

				submit.attr("disabled", true).val(langData['siteConfig'][2][5]+"...");  //登录中
				var data = [];
				data.push("username="+name);
				data.push("password="+psd);
				if(vdimgck != undefined){
					data.push("vericode="+vdimgck);
				}

				//异步提交
				$.ajax({
					url: "/loginCheck.html",
					data: data.join("&"),
					type: "POST",
					dataType: "html",
					success: function (data) {
						if(data){

							if(data.indexOf("100") > -1){
								$("body").append('<div style="display:none;">'+data+'</div>');
								setTimeout(function(){
									top.location.href = redirectUrl;
								},200)
							}else if(data.indexOf("201") > -1){
								var data = data.split("|");
								err.text(data[1]).show();
								nameinp.focus();
								submit.attr("disabled", false).val(langData['siteConfig'][16][158]);   //重新登录

							}else if(data.indexOf("202") > -1){
								var data = data.split("|");
								err.text(data[1]).show();
								$('#vdimgck').click();
								vdimgckinp.focus();
								submit.attr("disabled", false).val(langData['siteConfig'][16][158]);   //重新登录

							}else{
								alert(langData['siteConfig'][21][3]);   //登录失败，请重试！
								$('#vdimgck').click();
								submit.attr("disabled", false).val(langData['siteConfig'][16][158]);   //重新登录
							}
						}else{
							alert(langData['siteConfig'][21][3]);  //登录失败，请重试！
							$('#vdimgck').click();
							submit.attr("disabled", false).val(langData['siteConfig'][16][158]);   //重新登录
						}
					},
					error: function(){
						alert(langData['siteConfig'][20][168]);   //网络错误，登录失败！
						$('#vdimgck').click();
						submit.attr("disabled", false).val(langData['siteConfig'][16][158]);   //重新登录
					}
				});
				return false;


			}

		//短信验证码登录
		}else{
			var areaCode = $(".areaCode i").text().replace('+', '');
			var phone = $("#phone").val();
			var code = $("#vercode").val();
			var loginUrl = "/include/ajax.php?service=member&action=smsLogin&phone=" + phone + "&code=" + code + "&areaCode=" + areaCode;

			if(phone == ''){
				err.text(langData['siteConfig'][20][463]).show();   //请输入手机号码
				$("#phone").focus();
				return false;
			}

			if(areaCode == "86"){
	    		var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
		        if(!phoneReg.test(phone)){
					err.text(langData['siteConfig'][20][465]).show();   //手机号码格式不正确
    				$("#phone").focus();
    				return false;
		        }
	    	}

			if(code == ''){
				err.text(langData['siteConfig'][20][28]).show();   //请输入短信验证码
				$("#vercode").focus();
				return false;
			}

			submit.attr("disabled", true).val(langData['siteConfig'][2][5]+"...");   //登录中

      $.ajax({
        url: loginUrl,
        dataType: 'json',
        success: function (res) {
          if (res.state != 100) {
						err.text(res.info).show();
						submit.attr("disabled", false).val(langData['siteConfig'][16][158]);    //重新登录
          }else{
            top.location.href = redirectUrl;
          }
        },
        error: function (res) {
					alert(langData['siteConfig'][20][168]);  //网络错误，登录失败！
					submit.attr("disabled", false).val(langData['siteConfig'][16][158]); //重新登录
        }
      })
		}

	})


	//国家区号
	var areaCodeData = [{"en":"China","cn":"中国大陆","code":"86"},{"en":"Argentina","cn":"阿根廷","code":"54"},{"en":"Australia","cn":"澳大利亚","code":"61"},{"en":"Austria","cn":"奥地利","code":"43"},{"en":"Bahamas","cn":"巴哈马","code":"1242"},{"en":"Belarus","cn":"白俄罗斯","code":"375"},{"en":"Belgium","cn":"比利时","code":"32"},{"en":"Belize","cn":"伯利兹","code":"501"},{"en":"Brazil","cn":"巴西","code":"55"},{"en":"Bulgaria","cn":"保加利亚","code":"359"},{"en":"Cambodia","cn":"柬埔寨","code":"855"},{"en":"Canada","cn":"加拿大","code":"1"},{"en":"Chile","cn":"智利","code":"56"},{"en":"Colombia","cn":"哥伦比亚","code":"57"},{"en":"Denmark","cn":"丹麦","code":"45"},{"en":"Egypt","cn":"埃及","code":"20"},{"en":"Estonia","cn":"爱沙尼亚","code":"372"},{"en":"Finland","cn":"芬兰","code":"358"},{"en":"France","cn":"法国","code":"33"},{"en":"Germany","cn":"德国","code":"49"},{"en":"Greece","cn":"希腊","code":"30"},{"en":"Hong Kong","cn":"香港","code":"852"},{"en":"Hungary","cn":"匈牙利","code":"36"},{"en":"India","cn":"印度","code":"91"},{"en":"Indonesia","cn":"印度尼西亚","code":"62"},{"en":"Ireland","cn":"爱尔兰","code":"353"},{"en":"Israel","cn":"以色列","code":"972"},{"en":"Italy","cn":"意大利","code":"39"},{"en":"Japan","cn":"日本","code":"81"},{"en":"Jordan","cn":"约旦","code":"962"},{"en":"Kyrgyzstan","cn":"吉尔吉斯斯坦","code":"996"},{"en":"Lithuania","cn":"立陶宛","code":"370"},{"en":"Luxembourg","cn":"卢森堡","code":"352"},{"en":"Macau","cn":"澳门","code":"853"},{"en":"Malaysia","cn":"马来西亚","code":"60"},{"en":"Maldives","cn":"马尔代夫","code":"960"},{"en":"Mexico","cn":"墨西哥","code":"52"},{"en":"Mongolia","cn":"蒙古","code":"976"},{"en":"Morocco","cn":"摩洛哥","code":"212"},{"en":"Netherlands","cn":"荷兰","code":"31"},{"en":"New Zealand","cn":"新西兰","code":"64"},{"en":"Nigeria","cn":"尼日利亚","code":"234"},{"en":"Norway","cn":"挪威","code":"47"},{"en":"Panama","cn":"巴拿马","code":"507"},{"en":"Peru","cn":"秘鲁","code":"51"},{"en":"Philippines","cn":"菲律宾","code":"63"},{"en":"Poland","cn":"波兰","code":"48"},{"en":"Portugal","cn":"葡萄牙","code":"351"},{"en":"Qatar","cn":"卡塔尔","code":"974"},{"en":"Romania","cn":"罗马尼亚","code":"40"},{"en":"Russia","cn":"俄罗斯","code":"7"},{"en":"Saudi Arabia","cn":"沙特阿拉伯","code":"966"},{"en":"Serbia","cn":"塞尔维亚","code":"381"},{"en":"Seychelles","cn":"塞舌尔","code":"248"},{"en":"Singapore","cn":"新加坡","code":"65"},{"en":"South Africa","cn":"南非","code":"27"},{"en":"South Korea","cn":"韩国","code":"82"},{"en":"Spain","cn":"西班牙","code":"34"},{"en":"Sri Lanka","cn":"斯里兰卡","code":"94"},{"en":"Sweden","cn":"瑞典","code":"46"},{"en":"Switzerland","cn":"瑞士","code":"41"},{"en":"Taiwan","cn":"台湾","code":"886"},{"en":"Thailand","cn":"泰国","code":"66"},{"en":"Tunisia","cn":"突尼斯","code":"216"},{"en":"Turkey","cn":"土耳其","code":"90"},{"en":"Ukraine","cn":"乌克兰","code":"380"},{"en":"United Arab Emirates","cn":"阿联酋","code":"971"},{"en":"United Kingdom","cn":"英国","code":"44"},{"en":"United States","cn":"美国","code":"1"},{"en":"Venezuela","cn":"委内瑞拉","code":"58"},{"en":"Vietnam","cn":"越南","code":"84"},{"en":"Virgin Islands, British","cn":"英属维尔京群岛","code":"1284"}];
	var areaCodeArr = [];
	for (var i = 0; i < areaCodeData.length; i++) {
		var d = areaCodeData[i];
		areaCodeArr.push('<li data-en="'+d.en+'" data-cn="'+d.cn+'" data-code="'+d.code+'">'+d.cn+' +'+d.code+'</li>');
	}
	$('.areaCode_wrap').html('<ul>'+areaCodeArr.join('')+'</ul>');

	//显示区号
	var w = $('.areaCode_wrap');
	$('.areaCode').bind('click', function(){
		if(w.is(':visible')){
			w.fadeOut(300)
		}else{
			w.fadeIn(300);
			return false;
		}
	});

	//选择区号
	$('.areaCode_wrap').delegate('li', 'click', function(){
		var t = $(this), code = t.attr('data-code');
		$('.areaCode i').html('+' + code);
	});

	$('body').bind('click', function(){
		w.fadeOut(300);
	});



	var sendSmsData = [];

  if(geetest){
    //极验验证
    var handlerPopupFpwd = function (captchaObjFpwd){
      captchaObjFpwd.onSuccess(function (){
				var validate = captchaObjFpwd.getValidate();
				sendSmsData.push('geetest_challenge='+validate.geetest_challenge);
				sendSmsData.push('geetest_validate='+validate.geetest_validate);
				sendSmsData.push('geetest_seccode='+validate.geetest_seccode);
				$("#vercode").focus();
				sendSmsFunc();
      });

      $('.getCodes').bind("click", function (){
		if($(this).hasClass('disabled')) return false;

		var tel = $("#phone").val();
		var areaCode = $(".areaCode i").text().replace('+', '');

		if(tel == ''){
			err.text(langData['siteConfig'][20][463]).show();  //'请输入手机号码'
			$("#phone").focus();
			return false;
		}

		if(areaCode == "86"){
			var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
			if(!phoneReg.test(tel)){
				err.text(langData['siteConfig'][20][465]).show();   //手机号码格式不正确
				$("#phone").focus();
				return false;
			}
		}

        //弹出验证码
        captchaObjFpwd.verify();
      })
    };

    $.ajax({
      url: masterDomain+"/include/ajax.php?service=siteConfig&action=geetest&terminal=mobile&t=" + (new Date()).getTime(), // 加随机数防止缓存
      type: "get",
      dataType: "json",
      success: function(data) {
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
  }else{
    $(".getCodes").bind("click", function (){
			if($(this).hasClass('disabled')) return false;

			var tel = $("#phone").val();
			var areaCode = $(".areaCode i").text().replace('+', '');

			if(tel == ''){
				err.text(langData['siteConfig'][20][463]).show();  //'请输入手机号码'
				$("#phone").focus();
				return false;
			}

			if(areaCode == "86"){
	    		var phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
		        if(!phoneReg.test(tel)){
					err.text(langData['siteConfig'][20][465]).show();   //手机号码格式不正确
    				$("#phone").focus();
    				return false;
		        }
	    	}

			$("#vercode").focus();
			sendSmsFunc();
    })
  }

	//发送验证码
	function sendSmsFunc(){
		var tel = $("#phone").val();
		var areaCode = $(".areaCode i").text().replace('+', '');
		var sendSmsUrl = "/include/ajax.php?service=siteConfig&action=getPhoneVerify";

		sendSmsData.push('type=sms_login');
		sendSmsData.push('areaCode=' + areaCode);
		sendSmsData.push('phone=' + tel);
		sendSmsData.push('terminal=mobile');

		$.ajax({
			url: sendSmsUrl,
			data: sendSmsData.join('&'),
			type: 'POST',
			dataType: 'json',
			success: function (res) {
				if (res.state == 101) {
					err.text(res.info).show();
				}else{
					countDown(60, $('.getCodes'));
				}
			}
		})
	}



	//倒计时
	function countDown(time, obj){
		obj.html(time+langData['siteConfig'][30][46]).addClass('disabled');   //秒后重发
		mtimer = setInterval(function(){
			obj.html((--time)+langData['siteConfig'][30][46]).addClass('disabled');   //秒后重发
			if(time <= 0) {
				clearInterval(mtimer);
				obj.html(langData['siteConfig'][6][55]).removeClass('disabled');   //重新发送
			}
		}, 1000);
	}

})
