/**
 * 会员中心新闻投稿列表
 * by guozi at: 20150627
 */

var objId = $("#list"), keywords = "";
$(function(){

	$(".main-tab li[data-id='"+state+"']").addClass("curr");

	$(".main-tab li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr") && !t.hasClass("add")){
			state = id;
			atpage = 1;
			t.addClass("curr").siblings("li").removeClass("curr");
			getList();
		}
	});

	//项目
	$(".main-sub-tab li label").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("curr")){
			atpage = 1;
			t.addClass("curr").siblings("label").removeClass("curr");
			getList();
		}
	});

	getList(1);

	//删除
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			$.dialog.confirm(langData['siteConfig'][20][543], function(){  //你确定要删除这条信息吗？
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=live&action=delComment&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							par.slideUp(300, function(){
								par.remove();
								if(objId.children('.item').length == 0){
									setTimeout(function(){getList(1);}, 200);
								}
							});

						}else{
							$.dialog.alert(data.info);
							t.siblings("a").show();
							t.removeClass("load");
						}
					},
					error: function(){
						$.dialog.alert(langData['siteConfig'][20][183]);  //网络错误，请稍候重试！
						t.siblings("a").show();
						t.removeClass("load");
					}
				});
			});
		}
	});
	// 头部搜索
	$('.searchbox form').submit(function(e){
	  e.preventDefault();
	  keywords = $.trim($('.searchbox .keywords').val());
	  getList(1);
	})
	var selectDate = function(el){
		WdatePicker({
			el: el,
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			qsEnabled: false,
			dateFmt: 'yyyy-MM',
			maxDate: $('#month').val(),
			onpicked: function(){
				getArticleTotal();
			}
		});
	}
	$("#month").click(function(){
		selectDate("month");
	})

	function getArticleTotal(){
		$('#total0, #total1, #total2').text(0);
		var date = $('#month').val();
		if(date == '') return;
		$.ajax({
			url: '/include/ajax.php?service=article&action=alist&u=1&buMonth='+date,
			type: 'get',
			dataType: 'json',
			success: function(res){
				if(res && res.state == 100){
					$('#total0').text(res.info.total0);
					$('#total1').text(res.info.total1);
					$('#total2').text(res.info.total2);
				}else{
					$('#total0, #total1, #total2').text(0);
				}
			},
			error: function(){
				$('#total0, #total1, #total2').text('获取失败');
			}
		})
	}

	$('#getTotal').click(function(){
		getArticleTotal();
		var t = $(this);
		if(t.hasClass('openTotal')){
			t.val('查看统计');
			$('#list, .pagination').show();
			$('.main .table').hide();
		}else{
			t.val('查看列表');
			$('#list, .pagination').hide();
			$('.main .table').show();
		}
		t.toggleClass('openTotal');
	})

});

function getList(is){
	$('#getTotal').hasClass('openTotal') && $('#getTotal').click();
	if(is != 1){
		$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');  //加载中，请稍候
	$(".pagination").hide();

	var mold = $('.main-sub-tab label.curr').data('id');

	$("#total").html(0);
	$("#audit").html(0);
	$("#gray").html(0);
	$("#refuse").html(0);

	$.ajax({
		url: "/include/ajax.php?service=live&action=talkList&chatid=chatroom"+chatid+"&page="+atpage+"&pageSize="+pageSize+"&keywords="+keywords,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");  // //暂无相关信息！
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

					//拼接列表
					if(list.length > 0){

						for(var i = 0; i < list.length; i++){
							var item        = [],
									id        = list[i].id,
									userid    = list[i].userid,
									username  = list[i].username,
									userphoto = list[i].userphoto,
									content   = list[i].content,
									ftime     = list[i].ftime,
									title     = '';

              if(content.indexOf('__H__') == 0 || content.indexOf('__L__') == 0 || $('.item[data-id='+id+']').length){
                continue
              }

              var url = masterDomain + '/user/'+userid+'.html';
							html.push('<div class="item fn-clear" data-id="'+id+'">');
							if(userphoto != ""){
								html.push('<div class="p"><a href="'+url+'" target="_blank"><i></i><img src="'+userphoto+'" /></a></div>');
							}
							
							html.push('<div class="o"><a href="javascript:;" class="del"><s></s>'+langData['siteConfig'][6][8]+'</a></div>');  
							html.push('<div class="i">');

							html.push('<p>'+username+'：'+'&nbsp;&nbsp;&nbsp;&nbsp;'+langData['siteConfig'][11][8]+'：'+ftime+'</p>');   //发布时间
							html.push('<h5><a href="javascript:;">'+title+'</a></h5>');

							html.push('<p>'+content+'</p>');
							html.push('</div>');
							html.push('</div>');

						}

						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>"); //暂无相关信息！
					}

					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.gray;
							break;
						case "1":
							totalCount = pageInfo.audit;
							break;
						case "2":
							totalCount = pageInfo.refuse;
							break;
					}


					$("#total").html(pageInfo.totalCount);
					$("#audit").html(pageInfo.audit);
					$("#gray").html(pageInfo.gray);
					$("#refuse").html(pageInfo.refuse);
					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>"); //暂无相关信息！
			}
		}
	});
}
