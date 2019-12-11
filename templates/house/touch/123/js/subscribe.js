$(function(){

	//验证提示弹出层
	function showTipMsg(msg){
   /* 给出一个浮层弹出框,显示出errorMsg,2秒消失!*/
    /* 弹出层 */
	  $('.protips').html(msg);
		  var scrollTop=$(document).scrollTop();
		  var windowTop=$(window).height();
		  var xtop=windowTop/2+scrollTop;
		  $('.protips').css('display','block');
		  setTimeout(function(){      
			$('.protips').css('display','none');
		  },2000);
	}


    var queryStringState = GetUrlParam('state');
    if(queryStringState){
        $('.main_type li').each(function(){
            var val = Number($(this).data('val'));
            if(val == Number(queryStringState)){
                $(this).addClass('active');
            }
        });
    }else{
        $('.main_type li:eq(0)').addClass('actived-item');
    }

    var aid = GetUrlParam('id');

	$('.main .main_type ul li span').click(function(){
		var t = $(this);
		var b = t.parent('li');
		b.toggleClass('active');
	});

    //更新验证码
    var verifycode = $("#verifycode").attr("src");
    $("body").delegate("#verifycode", "click", function(){
        $(this).attr("src", verifycode+"?v="+Math.random());
    });


	// 提交验证
	$('.btn').click(function(){
	    var t = $(this);
	    if(t.hasClass('disabled')) return false;
		var contact_name = $('.contact_name').val();
		var contact_phone = $('.contact_phone').val();
		var contact_yzm = $('.contact_yzm').val();
        var active = $('.active');

        if(active.length == 0){
            showTipMsg('请选择订阅项目');
            return false;
        }else if(!contact_name){
			errorMsg="请输入您的姓名";
	        showTipMsg(errorMsg);
	        return false;
		}else if(!contact_phone){
			errorMsg="请输入您的手机号码";
	        showTipMsg(errorMsg);
            return false;
		}else if(contact_phone.length !== 11){
			errorMsg="请输入正确的手机号";
	        showTipMsg(errorMsg);
            return false;
		}else if(!contact_yzm){
			errorMsg="请输入验证码";
	        showTipMsg(errorMsg);
            return false;
		}

        var type = [];
        active.each(function(){
            type.push($(this).data('val'));
        })

        var data = [];

        data.push("name="+contact_name);
        data.push("phone="+contact_phone);
        data.push("act=loupan");
        data.push("aid="+aid);
        data.push("vercode="+contact_yzm);
        data.push("type="+type.join(","));
        data = data.join("&");

        t.addClass("disabled").find('button').val("提交中...");

        $.ajax({
            url: "/include/ajax.php?service=house&action=subscribe",
            data: data,
            dataType: "jsonp",
            success: function(data){
                if(data && data.state == 100){
                    showTipMsg('订阅成功！');
                    setTimeout(function(){
                        if(device.indexOf('huoniao') > -1) {
                            setupWebViewJavascriptBridge(function (bridge) {
                                bridge.callHandler("pageRefresh", {}, function (responseData) {
                                });
                            });
                        }else {
                            location.reload();
                        }
                    }, 2000);
                }else{
                    t.removeClass("disabled").find('button').val("重新提交");
                    showTipMsg(data.info);
                    $("#verifycode").click();
                }
            },
            error: function(){
                t.removeClass("disabled").find('button').val("重新提交");
                showTipMsg('网络错误，请稍候重试！');
                $("#verifycode").click();
            }
        })

	});


})

//获取url参数
function GetUrlParam(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
