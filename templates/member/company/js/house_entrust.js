/**
 * 会员中心-经纪人收到的房源委托
 * by guozi at: 20150627
 */

var objId = $("#list");
$(function(){

	$(".nav-tabs li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("active") && !t.hasClass("add")){
			type = id;
			atpage = 1;
			t.addClass("active").siblings("li").removeClass("active");
			getList(1);
		}
	});

	getList(1);

	objId.delegate(".bj", "click", function(){
		var t = $(this), par = t.closest("table"), id = par.attr("data-id"), title, newstate;
		if(id){
			if(t.hasClass('state0')){
				title = '确定要该条信息标记为已处理吗？';
				newstate = 1;
			}else{
				title = '确定要该条信息标记为未处理吗？';
				newstate = 0;
			}
			$.dialog.confirm(title, function(){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=house&action=operaEntrust&iszjcom=1&state="+newstate+"&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							par.slideUp(300, function(){
								par.remove();
								setTimeout(function(){getList(1);}, 200);
							});

						}else{
							$.dialog.alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						$.dialog.alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			});
		}
	});
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest("table"), id = par.attr("data-id");
		if(id){
			$.dialog.confirm(langData['siteConfig'][20][543], function(){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=house&action=operaEntrust&iszjcom=1&state=-1&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							par.slideUp(300, function(){
								par.remove();
								setTimeout(function(){getList(1);}, 200);
							});

						}else{
							$.dialog.alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						$.dialog.alert(langData['siteConfig'][20][183]);
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			});
		}
	});


});

function getList(is){

	if(is != 1){
		$('html, body').animate({scrollTop: $(".nav-tabs").offset().top}, 300);
	}else{
		atpage = 1;
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=house&action=myEntrust&iszjcom=1&state="+state+"&type="+type+"&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					$(".nav-tabs li span").html(0);
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					$('#total').text(pageInfo.totalCount);
					$('#zu_total').text(pageInfo.zu_total);
					$('#shou_total').text(pageInfo.shou_total);
					$('#zhuan_total').text(pageInfo.zhuan_total);
					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item       = [],
									id         = list[i].id,
									aid        = list[i].aid,
									title      = list[i].title,
									date       = list[i].date,
									username   = list[i].username,
									contact    = list[i].contact,
									sex        = list[i].sex,
									address    = list[i].address,
									doornumber = list[i].doornumber,
									area       = list[i].area,
									price      = list[i].price,
									transfer   = list[i].transfer,
									istate     = list[i].state,
									type       = list[i].type,
									note       = list[i].note,
									detail     = list[i].detail,
									pubdate    = list[i].pubdate;

							var typename = '';
							if(type == 0) typename = '出租';
							if(type == 1) typename = '出售';
							if(type == 2) typename = '转让';

							html.push('<table data-id="'+id+'"> <colgroup> <col style="width:10%;"> <col style="width:15%;"> <col style="width:25%;"> <col style="width:10%;"> <col style="width:10%;"> <col style="width:15%;"> <col style="width:30%;"> </colgroup> <thead> <th>姓名</th> <th>联系电话</th> <th>房源地址</th> <th>面积</th> <th>委托类型</th> <th>报价</th> <th>状态</th> </thead>');

							html.push('<tbody>');
							html.push('<tr>');
					  	html.push('	<td>'+username+(sex == 1 ? '先生' : (sex == 2 ? '女士' : ''))+'</td>');
					  	html.push('	<td>'+contact+'</td>');
					  	html.push('	<td>'+address+doornumber+'</td>');
					  	html.push('	<td>'+area+'㎡</td>');
					  	html.push('	<td>'+typename+'</td>');
					  	if(type == 2){
					  		html.push('	<td><p class="title">月租金：'+(price == 0 ? '未填写' : price)+'元/月</p><p class="title">转让费：'+(transfer == 0 ? '未填写' : transfer + '元')+'</p></td>');
						  }else{
						  	html.push('	<td><p class="title">'+(price == 0 ? '未填写' : price + (type == 0 ? '元/月' : '万元') )+'</p></td>');
						  }
						  html.push('	<td class="o">');
					  	if(istate == "0"){
						  	html.push('		<span class="bj state0" title="标记为已处理"><em></em>标记</span>');
						  }else{
						  	html.push('		<span class="bj state1" title="点击标记为未处理">已处理</span>');
						  }
					  	html.push('		<a href="javascript:;" class="del"></a>');
					  	html.push('	</td>');
					  	html.push('</tr>');
					  	html.push('</tobdy>');
					  	html.push('</table>');
							
						}
						objId.html(html.join(""));
					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
					}

					if(type == ''){
						totalCount = pageInfo.totalCount;
					}else if(type == '0'){
						totalCount = pageInfo.zu_total;
					}else if(type == '1'){
						totalCount = pageInfo.shou_total;
					}else if(type == '2'){
						totalCount = pageInfo.zhuan_total;
					}
					

					$("#total").html(pageInfo.totalCount);

					showPageInfo();
				}
			}else{
				$("#total").html(0);
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
		}
	});
}
