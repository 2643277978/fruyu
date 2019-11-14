/**
 * 会员中心商城订单列表
 * by guozi at: 20151130
 */

var objId = $("#list");
$(function(){



	//状态切换
	$(".tab ul li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr") && !t.hasClass("sel")){
			state = id;
			atpage = 1;
			t.addClass("curr").siblings("li").removeClass("curr");
      objId.html('');
			getList();
		}
	});


	// 下拉加载
	$(window).scroll(function() {
		var h = $('.item').height();
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - w - h;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});


	getList(1);

	// 删除
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			if(confirm('确定删除订单？删除后本订单将从订单列表消失，且不能恢复。')){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=furniture&action=delOrder&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							objId.html('');
							getList();

						}else{
							alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						alert("网络错误，请稍候重试！");
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			};
		}
	});

	//收货
	objId.delegate(".sh", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			if(confirm('确定要收货吗？确定后费用将直接转至卖家账户，请谨慎操作！')){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=furniture&action=receipt&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							t.removeClass("load").html("确认成功");
							objId.html('');
							setTimeout(function(){getList(1);}, 1000);

						}else{
							alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						alert("网络错误，请稍候重试！");
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

	objId.append('<p class="loading">加载中，请稍候...</p>');
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=furniture&action=orderList&state="+state+"&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>暂无相关信息！</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [], durl = $(".tab ul").data("url"), rUrl = $(".tab ul").data("refund"), cUrl = $(".tab ul").data("comment");

					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.unpaid;
							break;
						case "1":
							totalCount = pageInfo.ongoing;
							break;
						case "3":
							totalCount = pageInfo.success;
							break;
						case "4":
							totalCount = pageInfo.refunded;
							break;
						case "5":
							totalCount = pageInfo.rates;
							break;
						case "6":
							totalCount = pageInfo.recei;
							break;
						case "7":
							totalCount = pageInfo.closed;
							break;
						case "10":
							totalCount = pageInfo.cancel;
							break;
					}

					var msg = totalCount == 0 ? '暂无相关信息！' : '已加载完全部信息！';

					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item       = [],
									id         = list[i].id,
									ordernum   = list[i].ordernum,
									orderstate = list[i].orderstate,
									retState   = list[i].retState,
									orderdate  = huoniao.transTimes(list[i].orderdate, 1),
									expDate    = list[i].expDate,
									payurl     = list[i].payurl,
									common     = list[i].common,
									commonUrl  = list[i].commonUrl,
									paytype    = list[i].paytype,
									totalPayPrice  = list[i].totalPayPrice,
									store      = list[i].store,
									product    = list[i].product;

							var detailUrl = durl.replace("%id%", id);
							var refundlUrl = rUrl.replace("%id%", id);
							var commentUrl = cUrl.replace("%id%", id);
							var stateInfo = btn = "";

							switch(orderstate){
								case "0":
									stateInfo = '<em class="state fn-right">未付款</em>';
									btn = '<a href="javascript:;" class="gray del">取消订单</a><a href="'+payurl+'" class="yellow">立即付款</a>';
									break;
								case "1":
									stateInfo = '<em class="state fn-right">待发货</em>';
									btn = '<a href="'+refundlUrl+'" class="yellow">申请退款</a>';
									break;
								case "3":
									stateInfo = '<em class="state fn-right">交易成功</em>';
									if(common == 1){
										btn = '<a href="'+commentUrl+'" class="yellow">修改评价</a>';
									}else{
										btn = '<a href="'+commentUrl+'" class="yellow">评价</a>';
									}

									break;
								case "4":
									stateInfo = '<em class="state fn-right">退款中</em>';
									break;
								case "6":

									//申请退款
									if(retState == 1){

										//还未发货
										if(expDate == 0){
											stateInfo = '<em class="state fn-right">未发货，申请退款中</em>';

										//已经发货
										}else{
											stateInfo = '<em class="state fn-right">已发货，申请退款中</em>';
										}

									//未申请退款
									}else{
										stateInfo = '<em class="state fn-right">待收货</em>';
										btn = '<a class="yellow sh" href="javascript:;">确认收货</a>';
									}
									break;
								case "7":
									stateInfo = '<em class="state fn-right">退款成功</em>';
									break;
								case "10":
									stateInfo = '<em class="state fn-right">关闭</em>';
									break;
							}

              for(var p = 0; p < product.length; p++){
                cla = p == product.length - 1 ? ' class="lt"' : "";

  							html.push('<div class="item" data-id="'+list[i].id+'">');
                var storeHtml = store.id == 0 ? '<a href="javascript:;" class="name fn-left">官方直营</a>' : '<a href="'+store.domain+'" target="_blank">'+store.title+'</a>';
                html.push('<div class="domain fn-clear">'+storeHtml+stateInfo+'</div>');

  							html.push('<div class="info fn-clear">');
  							html.push('<div class="imgbox fn-left">');
  							html.push('<a href="'+product[p].url+'"><img src="'+product[p].litpic+'" alt=""></a>');
  							html.push('</div>');



  							html.push('<div class="txtbox">');

  							html.push('<div class="title">');
  							html.push('<p>'+product[p].title+'</p>');
  							html.push('<span>'+echoCurrency('symbol')+product[p].price+'</span>');
  							html.push('</div>');

  							html.push('<div class="number fn-clear">');
  							html.push('<p class="fn-left">订单号：'+ordernum+'</p>');
  							html.push('<span class="fn-right">×'+product[p].count+'</span>');
  							html.push('</div>');

  							html.push('<div class="date">'+orderdate+'</div>');

  							html.push('</div>');
  							html.push('</div>');
  							html.push('<div class="opbtn">');
  							html.push('<a href="'+detailUrl+'" class="gray">订单详情</a>'+btn+'');
  							html.push('</div>');
  							html.push('</div>');

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
					$("#unpaid").html(pageInfo.unpaid);
					$("#unused").html(pageInfo.ongoing);
					$("#recei").html(pageInfo.recei);
					$("#used").html(pageInfo.success);
					$("#refund").html(pageInfo.refunded);
					$("#rates").html(pageInfo.rates);
					$("#closed").html(pageInfo.closed);
					$("#cancel").html(pageInfo.cancel);

				}
			}else{
				objId.html("<p class='loading'>暂无相关信息！</p>");
			}
		}
	});
}
