$(function(){
	//开始直播
    /*$('.btn_start').click(function(){
        $('.down_modal').css("display","block");
    });*/
    $('.m-close').click(function(){
        $('.down_modal').css("display","none");
    });
    //刷新页面
    $(".vrefresh").click(function(){
        window.location.reload();
    });
    var device = navigator.userAgent;
	//开始直播
    $(".live_button").delegate(".btn_start", "click", function() {
    	//如果是系统生成推流地址需要判断是否客户端 如果不是在客户端，显示下载链接
		if (!pulltype && device.indexOf('huoniao') <= -1) {
			$('.down_modal').css("display","block");
            return;
		}
    	$.ajax({
			url: masterDomain+"/include/ajax.php?service=live&action=updateState&state=1&id="+id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
                    location.reload();
				}else{
					alert(data.info);
				}
			}
		});
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler("createLive", {
				"title": title,
				"pushurl": pushurl,
				"flowname": flowname,
				"wayname": wayname,
				"pullUrl":pullUrl,
				"litpic":litpic,
				"webUrl":webUrl,
				"id":id,
				"starttime":starttime,
				"liveLimitTime":liveLimitTime,
				"livetime":livetime,
				"streamname":streamname
            }, function callback(DataInfo){
                if(DataInfo){
                    if(DataInfo.indexOf('http') > -1){
                        location.href = DataInfo;
                    }else{
                        alert(DataInfo);
                    }
                }
            });
        });
    });

	//结束直播
    $(".live_button").delegate(".btn_end", "click", function() {
        var con=confirm("是否确定关闭直播？"); //在页面上弹出对话框
        if(con==true) {
            update();
            window.location.reload();
        } else {
        }

    });

    setInterval(function(){
	    $.ajax({
	        url: masterDomain + "/include/ajax.php?service=live&action=selectLiveTime&id="+id,
	        type: 'post',
	        dataType: 'json',
	        async : false,   //注意：此处是同步，不是异步
	        data:"id="+id,
	        success: function (data) {
	            if(data && data.state == 100){
	                livetime = data.info.livetime;
	            }else{
	                alert(data.info)
	            }
	        }

	    });
	},1000);

});

function update(){
    $.ajax({
        url: masterDomain + "/include/ajax.php?service=live&action=updateState&state=2&id="+id,
        type: 'post',
        dataType: 'json',
        async : false,   //注意：此处是同步，不是异步
        data:"id="+id,
        success: function (data) {
            if(data && data.state == 100){
                data.info="结束直播";
                // alert(data.info);
            }else{
                alert(data.info)
            }
        }

    });
}
