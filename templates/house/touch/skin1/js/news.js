$(function(){

	var isload = false;
	var detailList, getParid;
	detailList = new h5DetailList();
	setTimeout(function(){detailList.removeLocalStorage();}, 800);

	var dataInfo = {
		isBack: true
	};

	$('#house-list').delegate('li', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url');
		detailList.insertHtmlStr(dataInfo, $("#house-list").html(), {lastIndex: atpage});
		setTimeout(function(){location.href = url;}, 500);
	})

	var mySwiper = new Swiper('.swiper-container', {pagination : '.pagination',loop : true})

	$('.h-menu').on('click', function() {
		if ($('.nav,.mask').css("display") == "none") {
			$('.nav,.mask').show();
			$('.header').css('z-index', '101');
		} else {
			$('.nav,.mask').hide();
			$('.header').css('z-index', '99');
		}
	})
	$('.mask').on('touchmove', function() {
		$(this).hide();
		$('.nav').hide();
	})
	$('.mask').on('click', function() {
		$(this).hide();
		$('.nav').hide();
		$('.header').css('z-index', '99');
	})

	// 下拉加载
	$(window).scroll(function() {
		var h = $('.footer').height() + $('.newList li').height() * 2;
		var allh = $('body').height();
		var w = $(window).height();
		var scroll = allh - h - w;
		if ($(window).scrollTop() > scroll && !isload) {
			atpage++;
			getList();
		};
	});

	function getList(tr){

		isload = true;
		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
			$(".house-list").html("");
		}

		$(".newList .loading").remove();
		$(".newList").append('<div class="loading">加载中...</div>');

		var id = $('.tab-info .active').attr('data-id');
		if (id == undefined) {
			id = 0;
		}

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("page="+atpage);

		$.ajax({
			url: "/include/ajax.php?service=house&action=news&typeid="+id,
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".newList .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								html.push('<li>');
								html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
								if (list[i].litpic != "") {
									html.push('<div class="news-txt mr">');
									html.push('<h3>'+list[i].title+'</h3>');
									html.push('<p class="news-time"><span>'+list[i].pubdate+'</span></p>');
									html.push('</div>');
									html.push('<div class="news-img">');
									html.push('<img src="'+list[i].litpic+'" alt="'+list[i].title+'" title="'+list[i].title+'" >');
									html.push('</div>');
								}else {
									html.push('<div class="news-txt">');
									html.push('<h3>'+list[i].title+'</h3>');
									html.push('<p class="news-time"><span>'+list[i].pubdate+'</span></p>');
									html.push('</div>');
								}

								html.push('</a>')
								html.push('</li>')


							}

							$(".newList ul").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".newList").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".newList").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".newList .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".newList .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".newList .loading").html('网络错误，加载失败！');
			}
		});
	}

	// 返回时更正页码
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
	}else {
		atpage = detailList.getLocalStorage()['extraData'].lastIndex;
	}

})
