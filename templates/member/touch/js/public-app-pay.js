$(function(){

	var djs = $('.second');

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('body').addClass('huoniao_iOS');
	}


	//倒计时（开始时间、结束时间、显示容器）
	var countDown = function(time, obj, func){
		obj.text(time+'秒');
		mtimer = setInterval(function(){
			obj.text((--time+'秒'));
			if(time <= 0) {
				clearInterval(mtimer);
				obj.text('');
				$('.cp-cnt,.wait-p').hide();
				$('.tip p').addClass('active')
			}
		}, 1000);
	}

	countDown(5,djs);


	//调起客户端支付
	function appPay(){
		setupWebViewJavascriptBridge(function(bridge) {
			bridge.callHandler(appCall, {
				"orderInfo": orderInfo
			}, function(responseData){
				// alert(responseData);
			});
		});
	}

	$(".repay").click(function(){
		appPay();
	});

	setTimeout(function(){
		appPay();
	}, 2000);



	//验证是否支付成功，如果成功跳转到指定页面
	setTimeout(function(){
		var timer = setInterval(function(){
			$.ajax({
				type: 'POST',
				async: false,
				url: '/include/ajax.php?service=member&action=tradePayResult&order='+ordernum,
				dataType: 'json',
				success: function(str){
					if(str.state == 100 && str.info != ""){
                        clearInterval(timer);
						if(device.indexOf('huoniao_Android') > -1) {
	                        setupWebViewJavascriptBridge(function (bridge) {
	                            bridge.callHandler('pageClose', {}, function (responseData) {
	                            });
	                        });
	                        location.href = str.info;
	                    }else{
	                        location.href = str.info + (str.info.indexOf('?') > -1 ? '&' : '?') + 'currentPageOpen=1';
	                    }
					}
				}
			});
		}, 2000);
	}, 3000)

})
