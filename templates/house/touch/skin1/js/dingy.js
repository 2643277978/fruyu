$(function() {

	var queryStringState = GetUrlParam('state');
	if(queryStringState){
		$('.service-list li').each(function(){
			var val = Number($(this).data('val'));
			if(val == Number(queryStringState)){
				$(this).addClass('actived-item');
			}
		});
	}else{
		$('.service-list li:eq(0)').addClass('actived-item');
	}

	var aid = GetUrlParam('id');

	if(aid == null){
		alert('未指定楼盘');
	}

	var mask = $(window).height();
	$('.mask').css('height', mask);

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

	// 订阅服务
	$('.service-item').click(function() {
		if ($(this).hasClass('actived-item')) {
			$(this).removeClass('actived-item')
		} else {
			$(this).addClass('actived-item')

		}
	})

	//更新验证码
	var verifycode = $("#verifycode").attr("src");
	$("body").delegate("#verifycode", "click", function(){
		$(this).attr("src", verifycode+"?v="+Math.random());
	});

	$('.signup-form-box').submit(function(e) {
		e.preventDefault();
		if(aid == null){
			alert('未指定楼盘');
			return;
		}
		$('.error-tip').hide();
		var name = $('#item-name input').val();
		var phone = $('#item-phone input').val();
		var code = $('#item-code input').val();
		var active = $('.actived-item');
		if (!/^.{2,50}$/.test(name)) {
			$('.error-tip').eq(0).show();
			return false;
		} else if (!/^1[34578]{1}\d{9}$/.test(phone)) {
			$('.error-tip').eq(1).show();
			return false;
		} else if (code ==""){
			$('.error-tip').eq(2).show();
			return false;
		}
		else if(active.length == 0){
			$('.error-tip').eq(3).show();
			return false;
		}
		var type = [];
		active.each(function(){
			type.push($(this).data('val'));
		})

		var data = [];

		data.push("name="+name);
		data.push("phone="+phone);
		data.push("act=loupan");
		data.push("aid="+aid);
		data.push("vercode="+code);
		data.push("type="+type.join(","));
		data = data.join("&");

		var t = $('#submit');
		t.addClass("disabled").val("提交中...");

		$.ajax({
			url: "/include/ajax.php?service=house&action=subscribe",
			data: data,
			dataType: "jsonp",
			success: function(data){
				if(data && data.state == 100){
					t.removeClass("disabled").val("订阅成功");
					setTimeout(function(){
						t.closest(".dy").find(".close").click();
					}, 5000);
				}else{
					t.removeClass("disabled").val('免费订阅');
					alert(data.info);
					$("#verifycode").click();
				}
			},
			error: function(){
				t.removeClass("disabled").val('免费订阅');
				alert("网络错误，请稍候重试！");
				$("#verifycode").click();
			}
		})
	})


})


//获取url参数
function GetUrlParam(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
