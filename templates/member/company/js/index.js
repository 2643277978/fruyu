$(function(){

	//获取天气预报
	$.ajax({
		url: "/include/ajax.php?service=siteConfig&action=getWeatherApi&day=1&skin=6",
		dataType: "json",
		success: function (data) {
			if(data && data.state == 100){
				$(".date-weather ul").append(data.info);
			}
		}
	});

	//获取外卖订单信息
	if($('#waimaiOrderObj').size() > 0){

		//未处理
		$.ajax({
			url: masterDomain+"/wmsj/order/waimaiOrder.php?action=getList&state=2&p=1",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					$('#wmo2').find('.m-state').remove();
					var totalCount = data.info.pageInfo.totalCount;
					$('#wmo2 span').html(totalCount);
					if(totalCount){
						$('#wmo2').append('<i class="m-state"></i>');
					}
				}
			}
		});


		//已确认
		$.ajax({
			url: masterDomain+"/wmsj/order/waimaiOrder.php?action=getList&state=3&p=1",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					$('#wmo3').find('.m-state').remove();
					var totalCount = data.info.pageInfo.totalCount;
					$('#wmo3 span').html(totalCount);
					if(totalCount){
						$('#wmo3').append('<i class="m-state"></i>');
					}
				}
			}
		});

		//已接单
		$.ajax({
			url: masterDomain+"/wmsj/order/waimaiOrder.php?action=getList&state=4&p=1",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					$('#wmo4').find('.m-state').remove();
					var totalCount = data.info.pageInfo.totalCount;
					$('#wmo4 span').html(totalCount);
					if(totalCount){
						$('#wmo4').append('<i class="m-state"></i>');
					}
				}
			}
		});

		//配送中
		$.ajax({
			url: masterDomain+"/wmsj/order/waimaiOrder.php?action=getList&state=5&p=1",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					$('#wmo5').find('.m-state').remove();
					var totalCount = data.info.pageInfo.totalCount;
					$('#wmo5 span').html(totalCount);
					if(totalCount){
						$('#wmo5').append('<i class="m-state"></i>');
					}
				}
			}
		});

	}

});
