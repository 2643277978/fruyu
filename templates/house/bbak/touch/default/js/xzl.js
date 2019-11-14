$(function() {

	var device = navigator.userAgent, isClick = true;
	$('#house-list').css('min-height', $(window).height() - $('.footer').height());

	var detailList, getParid;
  detailList = new h5DetailList();
  setTimeout(function(){detailList.removeLocalStorage();}, 800);

	var dataInfo = {
			type: '',
			parid: '',
			addrid: '',
			addrName: '',
			price: '',
			priceName: '',
			area: '',
			areaName: '',
			protype: '',
			protypeName: '',
			industry: '',
			industryName: '',
			isBack: true
	};

	$('.mask').on('touchmove', function() {
		$(this).hide();
		$('.nav').hide();
		$('.choose-local').hide();
		$('.choose li').removeClass('active');
		$('.header').css('z-index', '99');
		$('.choose-box').css('z-index', '1002');
		$('.choose-box').removeClass('choose-top');
		$('.white').hide();
		isClick = true;
	})

	$('.mask').on('click', function() {
		$(this).hide();
		$('.nav').hide();
		$('.choose-local').hide();
		$('.choose li').removeClass('active');
		$('.header').css('z-index', '99');
		$('.choose-box').css('z-index', '1002');
		$('.choose-box').removeClass('choose-top');
		$('.white').hide();
		isClick = true;
	})

	$('#house-list').delegate('.house-box', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url');

		var addrid = $(".tab-area").attr("data-business");
		addrid = addrid == undefined || addrid == 0 ? $('.tab-area').attr('data-area') : addrid;

		var price = $(".tab-price").attr("data-id");
		price = price == undefined ? "" : price;

		var area = $(".tab-type").attr("data-id");
		area = area == undefined ? "" : area;

		var protype = $(".tab-mold").attr("data-id");
		protype = protype == undefined ? "" : protype;

		//更新筛选条件
		dataInfo.type = $('#sptype').val();
		dataInfo.parid = $('#area-box .active').attr('data-id');
		dataInfo.addrid = addrid;
		dataInfo.price = price;
		dataInfo.area = area;
		dataInfo.protype = protype;
		dataInfo.addrName = $('.tab-area span').text();
		dataInfo.priceName = $('.tab-price span').text();
		dataInfo.areaName = $('.tab-type span').text();
		dataInfo.protypeName = $('.tab-mold span').text();

		detailList.insertHtmlStr(dataInfo, $("#house-list").html(), {lastIndex: atpage});

		setTimeout(function(){location.href = url;}, 500);

	})

	var xiding = $(".choose-box");
	var chtop = parseInt(xiding.offset().top);
	var myscroll_price = new iScroll("scroll-price", {vScrollbar: false});
	var myscroll_type = new iScroll("scroll-type", {vScrollbar: false,});
	var myscroll_area = new iScroll("area-box", {vScrollbar: false});
	var myscroll_more = new iScroll("more-box", {vScrollbar: false});
	// 选择
	$('.choose li').each(function(index) {
		$(this).click(function() {
			if (!$('.choose-box').hasClass('choose-top')) {
				isClick = false;
			}else {
				isClick = true;
			}
			if ($('.choose-local').eq(index).css("display") == "none") {
				$(this).addClass('active').siblings().removeClass('active');
				if (device.indexOf('huoniao_iOS') > -1) {
					$('.choose-local').css('top', 'calc(.81rem + 20px)');
					$('.white').css('margin-top', 'calc(.8rem + 20px)');
				}
				$('.choose-local').eq(index).show().siblings('.choose-local').hide();
				myscroll_price.refresh();
				myscroll_type.refresh();
				myscroll_area.refresh();
				myscroll_more.refresh();
				$(this).parents('.choose-box').addClass('choose-top');

				$('.mask, .white').show();
				$('body').scrollTop(chtop);

			} else {
				$('.choose-local').eq(index).hide();
				$('.choose li').removeClass('active');
				$('.mask, .white').hide();
				$(this).parents('.choose-box').removeClass('choose-top');
			}
		})
	})

	$('.choose-local li').click(function() {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
	})

	var myscroll3 = new iScroll("scroll-third", {vScrollbar: false});
	$('#area-box li').click(function(index) {
		if($(this).index() == 0) {
			chooseNormal();
			return false;
		}
		var id = $(this).attr("data-id");
		$('.cf .choose-local-second').css('width', '60.5%');
		$('.area-third .choose-local-third').show();
		$.ajax({
			url: "/include/ajax.php?service=house&action=addr&type="+id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					var list = [], info = data.info;
					list.push('<ul style="display:block;">');
					list.push('<li data-area="'+id+'" data-business="0"><a href="javascript:;">全部</a></li>');
					for(var i = 0; i < info.length; i++){
						list.push('<li data-area="'+id+'" data-business="'+info[i].id+'"><a href="javascript:;">'+info[i].typename+'</a></li>');
					}
					list.push('</ul>');

					$("#scroll-third .scroll").html(list.join(""));
					myscroll3.refresh();
				}
			}
		});
	})

	function chooseNormal(){
		$('.cf .choose-local-second').css('width', '100%');
		$('.area-third .choose-local-third').hide();
		$('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.tab-area span').html('不限');
		$('.white').hide();
		$('.tab-area').attr('data-area', '').attr('data-business', "");
		isClick = true;

		getList(1);

	}

	$('.area-third .choose-local-third,.subway-third .choose-local-third').on('click', 'li', function() {
		var t = $(this), dom = t.find('a').html();
    $(this).parents('.choose-box').removeClass('choose-top');
		$('.tab-area span').html(dom);
		$('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		isClick = true;

		//区域
		if(t.closest(".choose-local-third").attr("id") == "scroll-third"){
			$(".tab-area").attr("data-type", "area");
			$(".tab-area").attr("data-area", t.attr("data-area"));
			$(".tab-area").attr("data-business", t.attr("data-business"));

		//地铁
		}else{
			$(".tab-area").attr("data-type", "subway");
			$(".tab-area").attr("data-subway", t.attr("data-subway"));
			$(".tab-area").attr("data-station", t.attr("data-station"));
		}

		getList(1);
	})

	$('.choose-price li').click(function() {
		var t = $(this), dom = t.find('a').html();
    $(this).parents('.choose-box').removeClass('choose-top');
		$('.tab-price span').html(dom);
		$(this).parents('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		isClick = true;

		var price = t.attr("data-price");
		price = price == undefined ? "" : price;
		$(".tab-price").attr("data-id", price);
		getList(1);
	})

	$('.choose-type li').click(function() {
		var t = $(this), dom = t.find('a').html();
    $(this).parents('.choose-box').removeClass('choose-top');
		$('.tab-type span').html(dom);
		$(this).parents('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		isClick = true;

		var area = t.attr("data-area");
		area = area == undefined ? "" : area;
		$(".tab-type").attr("data-id", area);
		getList(1);
	})

	$('.choose-mold li').click(function() {
		var t = $(this), dom = t.find('a').html();
    $(this).parents('.choose-box').removeClass('choose-top');
		$('.tab-mold span').html(dom);
		$(this).parents('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		isClick = true;

		var type = t.attr("data-protype");
		type = type == undefined ? "" : type;
		$(".tab-more").attr("data-id", type);
		getList(1);
	})

	$(window).on("scroll", function() {
		var thisa = $(this);
		var st = thisa.scrollTop();
		if (st >= chtop) {
			$(".choose-box").addClass('choose-top');
			if (device.indexOf('huoniao_iOS') > -1) {
				$(".choose-box").addClass('padTop20');
			}
		} else {
			$(".choose-box").removeClass('choose-top padTop20');
		}
	});

	// 下拉加载
	$(document).ready(function() {
		$(window).scroll(function() {
			var h = $('.footer').height() + $('.house-box').height() * 2;
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - h - w;
			if ($(window).scrollTop() > scroll && !isload) {
				atpage++;
				getList();
			};
		});
	});


	// 上滑下滑导航隐藏
	var upflag = 1, downflag = 1, fixFooter = $(".choose-box");
	//scroll滑动,上滑和下滑只执行一次！
	scrollDirect(function (direction) {
		var dom = fixFooter.hasClass('choose-top');
		if (direction == "down" && dom && isClick) {
			if (downflag) {
				fixFooter.hide();
				downflag = 0;
				upflag = 1;
			}
		}
		if (direction == "up" && dom && isClick) {
			if (upflag) {
				fixFooter.show();
				downflag = 1;
				upflag = 0;
			}
		}
	});


  $('#sptype').change(function(){
		getList(1);
	})

	// 搜索
	$('.search-box').submit(function(e){
		e.preventDefault();
		$('#search_button').click();
	})
	$('#search_button').click(function(){
		var keywords = $('#search_keyword').val();
		getList(1);
	})

	//初始加载
	if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
    getList();
	}else {
		getData();
		setTimeout(function(){
			detailList.removeLocalStorage();
		}, 500)
	}

	//数据列表
	function getList(tr){

		isload = true;

		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
			$(".house-list").html("");
		}

		//自定义筛选内容
		var item = [];
		$(".choose-more-condition ul").each(function(){
			var t = $(this), active = t.find(".active");
			if(active.text() != "不限"){
			}
		});


		$(".house-list .loading").remove();
		$(".house-list").append('<div class="loading">加载中...</div>');

		//请求数据
		var data = [];
		data.push("pageSize="+pageSize);
		data.push("type="+$('#sptype').val());

		var tabArea = $(".tab-area"), areaType = tabArea.attr("data-type"),
				addrid = 0, business = 0;

		if(areaType == "area"){
			addrid = Number(tabArea.attr("data-area"));
			business = Number(tabArea.attr("data-business"));
			if(business){
				addrid = business;
			}
		}
		data.push("addrid="+addrid);

		var price = $(".tab-price").attr("data-id");
		price = price == undefined ? "" : price;
		if(price != ""){
			data.push("price="+price);
		}

		var type = $(".tab-type").attr("data-id");
		type = type == undefined ? "" : type;
		if(type != ""){
			data.push("area="+type);
		}

    var protype = $(".tab-more").attr("data-id");
    protype = protype == undefined ? "" : protype;
    if(protype != ""){
      data.push("protype="+protype);
    }

		data.push("page="+atpage);

		var keywords = $('#search_keyword').val();
		data.push("keywords="+keywords);

		$.ajax({
			url: "/include/ajax.php?service=house&action=xzlList",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data){
					if(data.state == 100){
						$(".house-list .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
								html.push('<div class="house-box">');
								html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
								html.push('<div class="house-item">');
								html.push('<div class="house-img l"><img src="'+list[i].litpic+'"></div>');
								html.push('<dl class="l">');

								html.push('<dt>'+list[i].title+'</dt>');

								//区域
								html.push('<dd class="item-area"><em>'+list[i].addr+'</em>');

								// 价格
								if(list[i].type == 0)
								{
									var total = list[i].price * list[i].area;
									html.push('<span class="price r">'+echoCurrency('symbol')+list[i].price+echoCurrency('short')+'/m²•月</span>');
									html.push('</dd>');
									html.push('<dd class="item-type-1">');
									html.push('<em>'+list[i].loupan+'</em><em>'+list[i].area+'㎡</em>');
									html.push('<em>'+total+echoCurrency('short')+'/月</em>');
								}else{
									var total = (list[i].price / list[i].area * 10000).toFixed(2);
									html.push('<span class="price r">'+echoCurrency('symbol')+list[i].price+'万</span>');
									html.push('</dd>');
									html.push('<dd class="item-type-1">');
									html.push('<em>'+list[i].loupan+'</em><em>'+list[i].area+'㎡</em>');
									html.push('<em>'+total+echoCurrency('short')+'/m²</em>');
								}

								html.push('</dd>')

								html.push('<dd class="item-type-2">');
								var config = list[i].config;
								for (var b = 0; b < config.length; b++) {
									html.push('<span>'+config[b]+'</span>');
								}
                html.push('<span>'+list[i].zhuangxiu+'</span>');
								html.push('</dd>')

								html.push('</dl>')
								html.push('</div>')
								html.push('<div class="clear"></div>')
								html.push('</a>')
								html.push('</div>')


							}

							$(".house-list").append(html.join(""));
							isload = false;

							//最后一页
							if(atpage >= data.info.pageInfo.totalPage){
								isload = true;
								$(".house-list").append('<div class="loading">已经到最后一页了</div>');
							}

						//没有数据
						}else{
							isload = true;
							$(".house-list").append('<div class="loading">暂无相关信息</div>');
						}

					//请求失败
					}else{
						$(".house-list .loading").html(data.info);
					}

				//加载失败
				}else{
					$(".house-list .loading").html('加载失败');
				}
			},
			error: function(){
				isload = false;
				$(".house-list .loading").html('网络错误，加载失败！');
			}
		});
	}

	// 本地存储的筛选条件
	function getData() {
		var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
		isload = false;
		type = filter.type;
		parid = filter.parid;
		addrid = filter.addrid;
		addrName = filter.addrName;
		price = filter.price;
		priceName = filter.priceName;
		area = filter.area;
		areaName = filter.areaName;
		protype = filter.protype;
		protypeName = filter.protypeName;
		atpage = detailList.getLocalStorage()['extraData'].lastIndex;

		$("#sptype").find("option[val='"+type+"']").attr("selected", true);

		if (parid != '') {
			$('.tab-area').attr('data-area', addrid).attr('data-type', 'area');
			$('#area-box li[data-id="'+parid+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (addrid != '') {
			$('.tab-area').attr('data-business', addrid);
		}
		if (addrName != '') {
			$('.tab-area span').text(addrName);
		}
		if (price != '') {
			$('.tab-price').attr('data-id', price);
			$('#scroll-price li[data-price="'+price+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (priceName != '') {
			$('.tab-price span').text(priceName);
		}
		if (area != '') {
			$('.tab-type').attr('data-id', area);
			$('#scroll-type li[data-area="'+area+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (areaName != '') {
			$('.tab-type span').text(areaName);
		}
		if (protype != '') {
			$('.tab-mold').attr('data-id', protype);
			$('#more-box li[data-protype="'+protype+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (protypeName != '') {
			$('.tab-mold span').text(protypeName);
		}
	}


})
