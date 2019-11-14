/**
 * 会员中心商城订单列表
 * by guozi at: 20151130
 */

var objId = $("#list");
var iscomment = '';
$(function(){

	var device = navigator.userAgent;
	  if (device.indexOf('huoniao_iOS') > -1) {
	    $('body').addClass('huoniao_iOS');
	  }

	  // 选择模块
	  $('.orderbtn').click(function(){
	    var t = $(this);
	    if (!t.hasClass('on')) {
	      if (device.indexOf('huoniao_iOS') > -1) {
	    		$('.orderbox').css("top", "calc(.9rem + 20px)");
	    	}else {
	        $('.orderbox').animate({"top":".9rem"},200);
	    	}
	      $('.mask').show().animate({"opacity":"1"},200);
	      $('body').addClass('fixed');
	      t.addClass('on');
	    }else {
	      hideMask();
	    }
	  })

	  $('.mask').click(function(){
	    hideMask();
	  })


	//状态切换
	$(".tab ul li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr") && !t.hasClass("sel")){
			state = id;
			if(id == 1){
				iscomment = 0;
			}else{
				iscomment = '';
			}
			atpage = 1;
			t.addClass("curr").siblings("li").removeClass("curr");
      		objId.html('');
			getList();
		}
	});

	// 隐藏下拉框跟遮罩层
	function hideMask(){
	    $('body').removeClass('fixed');
	    $('.orderbtn').removeClass('on');
	    $('.orderbox').animate({"top":"-100%"},200);
	    $('.mask').hide().animate({"opacity":"0"},200);
	}

  // 下拉加载
  $(window).scroll(function() {
    var h = $('.myitem').height();
    var allh = $('body').height();
    var w = $(window).height();
    var scroll = allh - w - h;
    if ($(window).scrollTop() > scroll && !isload) {
      atpage++;
      getList();
    };
  });

	getList();

	// 删除
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".myitem"), id = par.attr("data-id");
		if(id){
			if(confirm(langData['siteConfig'][20][182])){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=waimai&action=delOrder&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							location.reload();
						}else{
							alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			};
		}
	});

	// 取消
	objId.delegate(".cancel", "click", function(){
		var t = $(this), par = t.closest(".myitem"), id = par.attr("data-id");
		if(id){
			if(confirm(langData['siteConfig'][20][186])){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=waimai&action=cancelOrder&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//取消成功后移除信息层并异步获取最新列表
							location.reload();
						}else{
							alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			};
		}
	});


});

function getList(is){

  isload = true;

	if(is != 1){
		// $('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	var num = $('.tab li.curr span').text();
	var msg = num == '0' ? langData['siteConfig'][20][126] : langData['siteConfig'][20][185];

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=waimai&action=order&userid="+userid+"&state="+state+"&page="+atpage+"&pageSize="+pageSize+"&iscomment="+iscomment,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					$('.loading').remove();
						if(num==0){
							$('.no-data').show();
						}else{
							objId.append("<p class='loading'>"+msg+"</p>");
						}
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					$('.no-data').hide();
					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item     = [],
								amount   = list[i].amount,
								food     = list[i].food,
								id       = list[i].id,
								ordernum = list[i].ordernumstore ? list[i].ordernumstore : list[i].ordernum,
								paytype  = list[i].paytype,
								pubdate  = huoniao.transTimes(list[i].pubdate, 1),
								paydate  = huoniao.transTimes(list[i].paydate, 1),
								shopname = list[i].shopname,
								sid      = list[i].sid,
								state    = list[i].state,
								uid      = list[i].uid,
								username = list[i].username,
								iscomment= list[i].iscomment,
								payurl   = list[i].payurl;

		                  var stateInfo = btn = "";
		                  switch(state){
		                    case "0":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][22]+'</span></p>';
		                      btn = '<a href="javascript:;" class="btn-nobg del">'+langData['siteConfig'][6][111]+'</a><a href="'+payurl+'" class="btn-bg yellow">'+langData['siteConfig'][6][64]+'</a>';
		                      break;
		                    case "1":
													stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][6][3]+'</span></p>';  //完成
													var commenturl = commentUrl.replace("%id%", id);
													if(iscomment==1){
		                      	btn = '<a href="javascript:;" class="btn-nobg del">'+langData['siteConfig'][6][8]+'</a> <a href="'+commenturl+'" class="btn-bg">'+langData['siteConfig'][8][2]+'</a>';   //删除
													}else{
		                      	btn = '<a href="javascript:;" class="btn-nobg del">'+langData['siteConfig'][6][8]+'</a> <a href="'+commenturl+'" class="btn-bg">'+langData['siteConfig'][19][365]+'</a>';   //删除
													}
														break;
		                    case "2":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][11]+'</span></p>';  //待确认
		                      break;
		                    case "3":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][46]+'</span></p>';   //代配送
		                      break;
		                    case "4":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][16][114]+'</span></p>';  //已接单
		                      break;
		                    case "5":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][16][115]+'</span></p>'; //配送中
		                      break;
		                    case "6":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][13]+'</span></p>';  //已取消
		                      btn = '<a href="javascript:;" class="btn-nobg del">'+langData['siteConfig'][6][8]+'</a>';
		                      break;
		                    case "7":
		                      stateInfo = '<p class="order-state"><span>'+langData['siteConfig'][9][47]+'</span></p>';  //交易失败
		                      btn = '<a href="javascript:;" class="btn-nobg del">'+langData['siteConfig'][6][8]+'</a>';  //删除
		                      break;
		                  }


							html.push('<dl class="myitem" data-id="'+id+'">');
							html.push('<dt class="waimai_title"><div class="infobox"><span class="headicon"><img src="'+templets_skin+'images/orderimag/icon.jpg" /></span><div class="order-info"><h3 class="shopname">'+shopname+'</h3><p class="time-info">'+pubdate+'</p></div></div><p class="order-state"><span>'+stateInfo+'</span></p></dt>');
							html.push('<dd class="order-content">');
							html.push('<a href="'+detailUrl.replace("%id%", id)+'">');
							html.push('<ul class="order-detail"><li>'+food.replace(/，/mg, "</li><li>")+'</li></ul>');
							html.push('<div class="wm_price"><p class="wm-num">共'+$('.order-detail li').length+'件商品</p><p class="pprice">合计<span><em>'+echoCurrency('symbol')+'</em>'+Math.floor(amount)+'<em>'+amount.substring(amount.indexOf('.'),amount.length)+'</em></span></p></div>');
							html.push('</a>');
							html.push('<div class="btn-group" data-action="waimai">'+btn+'</div>')
							html.push('</dd>');
							html.push('</dl>');
  							// 距支付时间30秒内打开此页，清除购物车相关内容
							if((state == 2 || state == 3 || state == 4) && nowdate - list[i].paydate < 30){
							  	utils.removeStorage("wm_cart_"+sid);
							}

						}

						objId.append(html.join(""));
			            $('.loading').remove();
			            isload = false;

					}else{
            			$('.loading').remove();
						objId.append("<p class='loading'>"+msg+"</p>");
					}
					$("#total").html(pageInfo.totalCount);
					$("#unpaid").html(pageInfo.state0);
					$("#rates").html(pageInfo.noiscomment);
					
				}
			}else{
				
				$('.loading').remove();
				objId.append("<p class='loading'>"+msg+"</p>");
			}
		}
	});
}



var utils = {
    canStorage: function(){
        if (!!window.localStorage){
            return true;
        }
        return false;
    },
    setStorage: function(a, c){
        try{
            if (utils.canStorage()){
                localStorage.removeItem(a);
                localStorage.setItem(a, c);
            }
        }catch(b){
            if (b.name == "QUOTA_EXCEEDED_ERR"){
                alert(langData['siteConfig'][20][187]);
            }
        }
    },
    getStorage: function(b){
        if (utils.canStorage()){
            var a = localStorage.getItem(b);
            return a ? JSON.parse(localStorage.getItem(b)) : null;
        }
    },
    removeStorage: function(a){
        if (utils.canStorage()){
            localStorage.removeItem(a);
        }
    },
    cleanStorage: function(){
        if (utils.canStorage()){
            localStorage.clear();
        }
    }
};
