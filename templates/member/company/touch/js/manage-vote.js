/**
 * 会员中心活动管理列表
 * by guozi at: 20161228
 */

var objId = $("#list");
$(function(){

  //项目
	$(".tab .type").bind("click", function(){
		var t = $(this), id = t.attr("data-id"), index = t.index();
		if(!t.hasClass("curr") && !t.hasClass("sel")){
			state = id;
			atpage = 1;
      $('.count li').eq(index).show().siblings("li").hide();
			t.addClass("curr").siblings("li").removeClass("curr");
      $('#list').html('');
			getList(1);
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

	//删除
	objId.delegate(".del", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			if(confirm('你确定要删除这条信息吗？')){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=vote&action=del&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//删除成功后移除信息层并异步获取最新列表
							par.slideUp(300, function(){
								par.remove();
								setTimeout(function(){$('#list').html("");getList(1);}, 200);
							});

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

	//结束
	objId.delegate(".stop", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
		if(id){
			if(confirm('你确定要结束投票吗？')){
				t.siblings("a").hide();
				t.addClass("load");

				$.ajax({
					url: masterDomain+"/include/ajax.php?service=vote&action=stop&id="+id,
					type: "GET",
					dataType: "jsonp",
					success: function (data) {
						if(data && data.state == 100){

							//成功后移除信息层并异步获取最新列表
							$('#list').html("");
							getList(1);

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
	// 	$('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
	}

	objId.append('<p class="loading">加载中，请稍候...</p>');

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=vote&action=vlist&u=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
          objId.html("<p class='loading'>暂无相关信息！</p>");
          $('.count span').text(0);
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

					//拼接列表
					if(list.length > 0){

						var editUrl = $(".tab ul").data("url"), regUrl = $(".tab ul").data("reg");

						for(var i = 0; i < list.length; i++){
							var item      = [],
								id          = list[i].id,
								title       = list[i].title,
								description = list[i].description,
								url         = list[i].url,
								vstate      = list[i].state,
								arcrank     = list[i].arcrank,
								join        = list[i].join,
								// waitpay  = list[i].waitpay,
								pubdatef    = list[i].pubdatef;

							// url = waitpay == "1" || list[i].state != "1" ? 'javascript:;' : url;

              html.push('<div class="item" data-id="'+id+'">');

              var stateTxt = '', styleState = vstate;
              if(arcrank == 0){
                stateTxt = '待审核';
                styleState = 2;
              }else if(arcrank == 2){
                stateTxt = '审核拒绝';
                vstate = 3;
              }else if(vstate == 0){
                stateTxt = '未开始';
              }else if(vstate == 1){
                stateTxt = '投票进行中...';
              }else if(vstate == 2){
                stateTxt = '已结束';
              }

							html.push('<div class="info-item fn-clear">');
							html.push('<a href="'+url+'">');
							html.push('<dl>');
							html.push('<dt class="fn-clear">'+title+'<em class="fn-right state state'+styleState+'">'+stateTxt+'</em></dt>');
							html.push('<dd class="item-area"><em>'+join+'人投票</em></dd>');
							html.push('<dd class="item-type-1"><em> 发布时间：'+pubdatef+'</em></dd>');
							html.push('</dl>');
							html.push('</a>');
							html.push('</div>');
							html.push('<div class="o fn-clear">');
							html.push('<a href="javascript:;" class="del">删除</a>');
							if(vstate == 1){
								html.push('<a href="javascript:;" class="stop">结束</a>');
							}
							html.push('</div>');
							html.push('</div>');
							html.push('</div>');

						}

            objId.append(html.join(""));
            $('.loading').remove();
            isload = false;

					}else{
            $('.loading').remove();
            objId.append("<p class='loading'>已加载完全部信息！</p>");
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
					// showPageInfo();
				}
			}else{
        objId.html("<p class='loading'>暂无相关信息！</p>");
        $('.count span').text(0);
			}
		}
	});
}
