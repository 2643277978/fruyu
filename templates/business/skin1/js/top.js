$(function(){
	$("a[utag='encode']").live("click",function(){
		this.href = this.href.replace(/(fromurl=)(.*)$/ig,function(m,m1,m2){
			return m1 + encodeURIComponent(m2);
		});
	});
	//点击头部登录
	$("#t_login").click(function(){
		$(".login_q").hide();
		$(".login_h").show();
	});
	//head滑过出现下拉框
		$(".topMuneList").hover(function(){
			$(this).addClass("snMenuHover")
			$(this).children(".show1").show()
		},function(){
			$(this).removeClass("snMenuHover")
			$(this).children(".show1").hide()
		})		
	//我的采购清单加减
	$(".btn_jian").click(function() {
        var i = parseInt($(this).next(".text_input").val());
        var min = parseInt($(this).next(".text_input").attr("min"));
        if (i > min) {
            i--;
            var _jian=$(this);
            var _success=function(status){
            	_jian.next(".text_input").val(i);
            }
            var _pId=_jian.parents("div").attr("id");
            var _data={id:_pId,increment:-1,updateCount:0}
            carChangeNumber(_data,_success);
        }
    })
    $(".btn_jia").click(function() {
        var i = parseInt($(this).prev(".text_input").val());
        var max = parseInt($(this).prev(".text_input").attr("max"));
        if (i < max) {
            i++;
            var _jia=$(this);
            var _success=function(status){
            	
            	_jia.prev(".text_input").val(i);
            }
            var _pId=_jia.parents("div").attr("id");
            var _data={id:_pId,increment:1,updateCount:0}
            carChangeNumber(_data,_success);
        }
    })
    /* 返回状态处理
     **/
    var process=function(status,success){
		var msg=""
		switch (status){
			case "1":
				success();
				break;
			case "0":
				msg="修改失败";
				break;
			case "-1":
				msg="库存不足";
				break;
			case "-2":
				msg="商品小于最小订货量";
				break;
			default : msg="系统异常";
		}
		if(msg!="")
			alert(msg);
	}
	//我的采购清单加减里的删除
	$(".end").click(function(){
		var _end=$(this);
		 var _success=function(){
			_end.parent(".shoppingListCon").remove();
		 }
		var _pId=_end.parent().attr("id");
		carDelCurProduct(_pId,_success);
		/* if(_end.parent().parent().find("shoppingListCon").size()<=0){
			console.log("no product");
		} */
	});
	
	/*
	 * 验证数字
	 * **/
	function isDigit(s) {
		var patrn = /^\d+$/;
		if (!patrn.exec(s))
			return false;
		return true;
	}
	//修改购物车数量
	$(".text_input").blur(function(){
		var _val=$(this).val();
		if(!isDigit(_val)){
			alert("请输入正确的数字");
		}
	}).change(function(){
		var _obj=$(this);
		var _val=parseInt(_obj.val());
		if(!isDigit(_val)){
			return;
		}
		var _min=parseInt(_obj.attr("min"));
		var _max=parseInt(_obj.attr("max"));
		if(_obj>_max){
			alert("大于最大起定量");
			return;
		}
		if(_obj<_min){
			alert("小于最小起定量");
			return;
		}
		var _pId=_obj.parents("div").attr("id");
		var _data={id:_pId,increment:0,updateCount:_val}
        carChangeNumber(_data);
	});
	/* 添加数量修改
	 * num 修改数量+1 —1
	 * pId 产品Id
	 * mId 会员Id
	 **/
	function carChangeNumber(data,success){
		var url="member/car/update";
		$.post(url,data,function(status){
			process(status,success);
		});
	}
	/* 删除进货单中当前商品
	 * pid 产品Id
	 **/
	function  carDelCurProduct(pId,success){
		var url="member/car/delete";
		$.post(url,{id:pId},function(status){
			process(status,success);
		});
	}
	$("#top_logout").click(function(){
		//#20161216改为从公共的 wk.myshop.domain.js里面取
		//var memberMenuDomain=$("#memberMenuDomain").val();
		var url=$("#url").val();
		var _url=memberMenuDomain+"/view/logout.jsp?backUrl="+encodeURIComponent(url);
		window.top.location.href=_url;
	});
});



//选项卡切换
function tabs(tabtit,tabcnt,more){
  tabtit.each(function(index){
      $(this).on('click',function(){
          var tindex=index;
          $(this).addClass('on').siblings('li').removeClass('on');
          tabcnt.eq(tindex).show().siblings('.tab').hide();
          if(more){more.eq(tindex).show().siblings('.more').hide();}
          
      })
  }); 
}

//返回顶部
(function($){
	$(window).scroll(function(){
		var s_w = window.screen.width;
		var s_h = window.screen.height;
		var s_top = parseInt($(window).scrollTop()+8);
		if(s_w >=1280 && s_h >= 450 && s_top>500){
			$("#qrcode").fadeIn("normal");
			$("#gotop").fadeIn("normal");	
		}else{
			$("#qrcode").fadeOut("normal");
			$("#gotop").fadeOut("normal");	
		}
		})
$("#iback").bind("click",function(){$("html, body").animate({scrollTop:0},100);})})(jQuery)


$(function(){
//-----------------------------input点击效果----------------------------
function myVal(inputClassName){
	var inputName="."+inputClassName; 
	$(inputName).css("color","#aaa"); //灰色
	$(inputName).each(function(){
		$a1val = $(this).val();
		if ($a1val == this.defaultValue) {
			$(this).css("color","#aaa");
		} else {
			$(this).val($a1val);
			$(this).css("color","#3c3c3c");//黑色
		}
  });
	$(inputName).focus(function(event) {
		$a1val = $(this).val();
		if ($a1val == this.defaultValue) {
			$(this).val("");
			$(this).css("color","#3c3c3c");
		} else {
			$(this).val($a1val);
			$(this).css("color","#3c3c3c");//黑色
		}
	});
	$(inputName).blur(function() {
		$a1val = $(this).val();
		if ($a1val != "") {
			$(this).val($a1val);
		} else {
			$(this).val(this.defaultValue);
			$(this).css("color","#aaa");
		}
	})
};
myVal("inpTxt");

/*$(window).resize(function(){
	myVal("inpTxt");
})*/


//下拉框解决bug--js
$(".diy_select_txt").click(function(){
	//alert(111)
	$(".diy_select").css("z-index",0);
	$(this).parents(".diy_select").css("z-index",101);
})


//---------------------------------------top----------------------------------------
	//top滑过出现下拉框
	$(".topMuneList").hover(function(){
		$(this).addClass("snMenuHover")
		$(this).children(".show2").show()
	},function(){
		$(this).removeClass("snMenuHover")
		$(this).children(".show2").hide()
	})
	//点击top用户名显示下拉框
	$('.top-1-L .user').hover(function(){
		$(this).toggleClass('z-hov');
	});
	$('.top-1-L .user').mouseleave(function(){
		$(this).removeClass('z-hov');
	})
	$(".rs_close").click(function(){
		$(".rs_r").hide();
	})
	//登陆后完善信息引导 关闭　4.17
	$(".m_guide_gb").click(function(){
		$(this).parent().hide();
	})
	/*header中关键字搜索*/
	$(".searchTab ul li").each(function(){
		$(this).click(function(){
			$(this).addClass("on").siblings().removeClass("on");	
			var tabTxt=$(this).text();
			var inptTxt="请输入"+tabTxt+"名称";
			$(".searchTxt").attr("value",inptTxt);
		});
	})
	/*header中搜索下拉*/
	$('.searchTxt').focus(function(){  
		$(".search_toplist").show();	
		}).blur(function(){  
		$(".search_toplist").hide(); 
	});	

	//首页在线留言
	$(".l-message").click(function(){
		$(".adcDtl").animate({right: '0'}, "slow");
		$(".l-message").addClass("on");
	});
	$(".tckCls").click(function(){
		$(this).parents(".adcDtl").animate({right: '-360px'}, "slow");
		$(".l-message").removeClass("on");
	});
	//首页在线客服
	$(".l-service").hover(function(){
		if(!$(".l-S-pop").is(":animated")){
		  $(".l-S-pop").animate({right: '0'}, 300);
		  $(".l-service").addClass("on");
		}
	   },function(){
		  $(".l-S-pop").animate({right: '-360px'}, 300);
		  $(".l-service").removeClass("on");
	});	
	
	//钱数滚动效果
	//下方分别是刚进入页面后执行的效果，以及当鼠标移入的时候执行的效果
	//现在只是模拟一下这个逐步上滚的效果。如果想更新触发再次执行，需要动态的添加span元素，然后重新触发此JS;
	$(function() {
		var $j_li = $(".j-li");
		setTimeout(function() {
			$j_li.each(function(i) {
				var isNow = $(this);
				setTimeout(function() {
					isNow.find("span:first").animate({
						"height":"hide"
					}, 100);
				}, 50*i);
			});
		}, 100);
	});
	
	$(".slideTxtBox .j-toggle").mouseover(function() {
		var $j_li = $(".j-li");
		setTimeout(function() {
			$j_li.each(function(i) {
				var isNow = $(this);
				setTimeout(function() {
					isNow.find("span:first").animate({
						"height":"hide"
					}, 100);
				}, 50*i);
			});
		}, 100);
	});
	
	//我的网库-二维码
	var $aBtn = $(".J-phoneLibrary"),
		$code = $(".J-show-code");
		
		$aBtn.hover(function() {
			$code.removeClass("wk_hide").addClass("wk_show");
			$aBtn.find(".i-san").addClass("i-san1");
		},function() {
			$code.removeClass("wk_show").addClass("wk_hide");
			$aBtn.find(".i-san").removeClass("i-san1");
		});
		$code.hover(function() {
			$aBtn.addClass("now");
			$(this).removeClass("wk_hide").addClass("wk_show");
			$aBtn.find(".i-san").addClass("i-san1");
		},function() {
			$aBtn.removeClass("now");
			$(this).removeClass("wk_show").addClass("wk_hide");
			$aBtn.find(".i-san").removeClass("i-san1");
		});
		
	//没有做判断，所以必须大于4张专题图片，不然一来布局不好看，二来加这个功能也就没有必要了；
	var allWidth = 0;
	var firstLiWidth = $(".J-special li").eq(0).outerWidth();
	var length = $(".J-special li").length - 4;
	
	$(".J-special li").each(function(index, value) {
		allWidth += $(this).outerWidth();
	});
	$(".J-special .bd").width(allWidth);
	
	//左箭头
	$(".J-special .prev").click(function() {
		//alert("hello world!");
		if(!$(".J-special .bd").is(":animated")){
			if(parseInt($(".J-special .bd").css("left")) == 0) {
				$(".J-special .bd").animate({
					"left": -(firstLiWidth*length)
				}, 300);
			} else {
				$(".J-special .bd").animate({
					"left": '+=' + firstLiWidth
				}, 300);
			}	
		}
		
	});
	//右箭头
	$(".J-special .next").click(function() {
		//alert("hello world!");
		if(!$(".J-special .bd").is(":animated")){
			if(parseInt($(".J-special .bd").css("left")) == -firstLiWidth*length) {
				$(".J-special .bd").animate({
					"left": 0
				}, 300);
			} else {
				$(".J-special .bd").animate({
					"left": '-=' + firstLiWidth
				}, 300);
			}	
		}
		
	});
});




function reg(url){
	var casDomain=$("#casDomain").val();
	var registerDomain=$("#registerDomain").val();
	var siteId=1;//$("#siteId").val();20160906产品新需求注册不区分交易网
//	var loginUrl = casDomain+"/login?source=1&service="+encodeURIComponent(url);
	var regUrl = registerDomain+"/register/gotoRegisterStart?siteId="+siteId+"&source=1&backUrl="+window.location.href;
	window.open(regUrl,"_blank");
}

function login(url){
	var casDomain=$("#casDomain").val();
	var loginUrl=casDomain+"/login?source=1&service="+encodeURIComponent(url);
	window.top.location.href=loginUrl;
}

function getLastLoginInfo(){
	var key="lastLoginInfo";
	var startKeyValue=0;
	var endKeyValue=0;
	if (document.cookie.length>0){
		startKeyValue=document.cookie.indexOf(key + "=");
		if(!(startKeyValue==-1)){
			startKeyValue=startKeyValue+key.length+1;
			endKeyValue=document.cookie.indexOf(";",startKeyValue);
			if(endKeyValue==-1){
				endKeyValue=document.cookie.length;
			}
			return unescape(document.cookie.substring(startKeyValue,endKeyValue))
		}else{
			 return null;		
		}
	}
}

function setLoginInfo(loginName){
	var key="lastLoginInfo";
	var value=loginName;
	var date=new Date();
	date.setTime(date.getTime()+14*24*60*60*1000);
	var casDomain = $("#casDomain").val();
	casDomain = casDomain.substring(casDomain.indexOf("99114"));
	document.cookie = key + "="+ escape (value) + ";domain=."+casDomain+";expires=" + date.toGMTString()+";path=/"; 
}
