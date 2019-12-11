$(function(){
	// 判断浏览器是否是ie8
    if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.tab_content ul li:last-child').css('margin-right','0');
        $('.adviBox .bd .slitem:nth-child(3n)').css('margin-right','0');
        $('.lpAround .midbox ul li:nth-child(4n)').css('margin-right','0');
    }

	$("img").scrollLoading();

	//二维码
	$(".mobile_kf #qrcode").qrcode({
		render: window.applicationCache ? "canvas" : "table",
		width: 74,
		height: 74,
		text: huoniao.toUtf8(window.location.href)
	});

	//收藏
	$(".btnSc").bind("click", function(){
		var t = $(this), type = "add", oper = "+1", txt = "已收藏";

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		if(!t.hasClass("btnYsc")){
			t.addClass("btnYsc");
		}else{
			type = "del";
			t.removeClass("btnYsc");
			oper = "-1";
			txt = "收藏";
		}

		var $i = $("<b>").text(oper);
		var x = t.offset().left, y = t.offset().top;
		$i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#f1370b"});
		$("body").append($i);
		$i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
			$i.remove();
		});

		t.html("<i></i>"+txt);

		$.post("/include/ajax.php?service=member&action=collect&module=house&temp=loupan_detail&type="+type+"&id="+pageData.id);

	});

	//通知
	var noticeCla = "";
	$(".bm, .kp").bind("click", function(){
		var cla = $(this).attr("class");
		noticeCla = cla;
		$(".modal-dy").addClass("popup").fadeIn();

		$(".popup_bg").show();

		//根据按钮选中不同的选项
		$(".modal-dy.popup dl .checkbox").removeClass("checked");
		$(".modal-dy.popup .c"+cla).addClass("checked");
		return false;
	});
	
	$("body").delegate(".close", "click", function(){
		if(noticeCla == "bm"){
			$(this).parent().hide();
		}else{
			$(this).parent().hide();
			$("#verifycode").click();
		}
		$(".popup_bg").hide();
	});

	//修复订阅浮动层IE下不兼容placeholder
	$("body").delegate(".popup input", "click", function(){
		var t = $(this), val = t.val(), placeholder = t.attr("placeholder");
		if(val == placeholder){
			t.val("").removeClass("placeholder");
		}
	});
	$("body").delegate(".popup input", "blur", function(){
		var t = $(this), val = t.val(), placeholder = t.attr("placeholder");
		if(val == ""){
			t.val(placeholder).addClass("placeholder");
		}
	});

	//复选框
	$("body").delegate(".dc dl", "click", function(){
		var t = $(this).find(".checkbox");
		t.hasClass("checked") ? t.removeClass("checked") : t.addClass("checked");
	});

	$("body").delegate(".checkbox", "click", function(){
		var t = $(this);
		t.hasClass("checked") ? t.removeClass("checked") : t.addClass("checked");
	});

	// 单选框
	var sexval='';
	$("body").delegate(".sexbox input[type='radio']", "click", function(){
		var t = $(this);
		if(this.checked){
	        sexval= t.val();
	    }
	});

	//更新验证码
	var verifycode = $("#verifycode").attr("src");
	$("body").delegate("#verifycode", "click", function(){
		$(this).attr("src", verifycode+"?v="+Math.random());
	});

	//验证提示弹出层
	function showMsg(msg){
	  $('.dy .dc').append('<p class="ptip">'+msg+'</p>')     
	  setTimeout(function(){   
		$('.ptip').remove();
	  },2000);
	}


	//提交订阅信息
	$("body").delegate("#tj", "click", function(){
		var type =[],t = $(this), obj = t.closest(".dy"), btnhtml = t.html();

		if(t.hasClass("disabled")) return false;

		obj.find("dl").each(function(){
			var checkbox = $(this).find(".checkbox");
			if(checkbox.hasClass("checked")){
				type.push(checkbox.attr('data-val'));
			}
		});

		if(type.length == 0){
			errMsg = "请选择要订阅的信息类型";
			showMsg(errMsg);
			return false;
		}

		var name = obj.find("#name");
		var phone = obj.find("#phone");
		var vercode = obj.find("#vercode");
		var xy = obj.find(".xy");


		if(name.val() == "" || name.val() == name.attr("placeholder")){
			errMsg = "请输入您的姓名";
			showMsg(errMsg);
			return false;
		}else if(phone.val() == "" || phone.val() == phone.attr("placeholder")){
			errMsg = "请输入您的手机号码";
			showMsg(errMsg);
			return false;
		}else if(!/(13|14|15|17|18)[0-9]{9}/.test($.trim(phone.val()))){
			errMsg = "手机号码格式错误，请重新输入！";
			showMsg(errMsg);
			return false;
		}else if(vercode.val() == "" || vercode.val() == vercode.attr("placeholder")){
			errMsg = "请输入验证码";
			showMsg(errMsg);
			return false;
		}

		if(!xy.hasClass("checked")){
			errMsg = "请先同意[免责协议]";
			showMsg(errMsg);
			return false;
		}
		t.addClass("disabled").html("提交中...");

		var sex = $('[name="sex"]:checked').val();

		var data = [];
		data.push("act=loupan");
		data.push("aid="+pageData.id);
		data.push("type="+type.join(","));
		data.push("name="+name.val());
		data.push("phone="+phone.val());
		data.push("sex="+sex);
		data.push("vercode="+vercode.val());
		data = data.join("&");

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=house&action=subscribe",
			data: data,
			dataType: "JSONP",
			success: function(data){
				if(data && data.state == 100){
					t.removeClass("disabled").html("订阅成功");
					setTimeout(function(){
						t.closest(".dy").find(".close").click();
					}, 1000);
				}else{
					t.removeClass("disabled").html(btnhtml);
					alert(data.info);
				}
			},
			error: function(){
				t.removeClass("disabled").html(btnhtml);
				alert("网络错误，请稍候重试！");
			}
		})

	});


	$("html").delegate(".bdshare_popup_box", "mouseover", function(){
		$(".share").addClass("curr");
	});
	$("html").delegate(".bdshare_popup_box", "mouseout", function(){
		$(".share").removeClass("curr");
	});


	//增加浏览历史
  var house_loupan_history = $.cookie(cookiePre+'house_loupan_history');
  if (house_loupan_history == null) house_loupan_history = "";
  if (house_loupan_history.indexOf(pageData.id) == -1) {
  	if (house_loupan_history.length > 0) {
  		house_loupan_history += ':'+pageData.id;
  	} else {
  		house_loupan_history += pageData.id;
  	}
  	if (house_loupan_history.length > 128) {
  		var pos = house_loupan_history.indexOf(':');
  		house_loupan_history = house_loupan_history.substr(pos + 1);
  	}
  	$.cookie(cookiePre+'house_loupan_history', house_loupan_history, {expires: 365, domain: masterDomain.replace("http://", "").replace("https://", ""), path: '/'});
  }

});

//百度分享代码
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":["tsina","tqq","qzone","weixin","sqq","renren"],"bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
