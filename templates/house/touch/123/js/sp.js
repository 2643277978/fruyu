$(function() {
	//获取url的参数（区域）
	var currUrl=window.location.href;
	currUrl = currUrl.substring(currUrl.indexOf("?"),currUrl.length);
	var canshu=currUrl=currUrl.replace('?', ' ');
	var addEare=currUrl%100000;//二级区域
	var add=parseInt(currUrl)-parseInt(addEare);
	add=add/100000;//一级区域 end

	//url是否有值
	function checkCs() {
		$.ajax({
			url: "/include/ajax.php?service=house&action=addr&type="+add,
			type: "GET",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					var list = [], info = data.info,name;
					for(var i = 0; i < info.length; i++){
						if(info[i].id==addEare){
							name=info[i].typename
						}
					}
					$('.tab-addrid span').html(name);
					$('.choose-local').hide();
					$('.mask').hide();
					$('.choose li').removeClass('active');
					$('.white').hide();
					$('.tab-addrid').attr('data-id',addEare);
				}
			}
		});
		getList();
	}
	if(addEare){
		checkCs();
	}

	var device = navigator.userAgent, isClick = true;
	$('#sp-list').css('min-height', $(window).height() - $('.footer').height());
	$('#sp_list').css('min-height', $(window).height() - $('.footer').height());

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

	$('#sp-list').delegate('.house-box', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url');

		var addrid = $(".tab-addrid").attr("data-id");
		addrid = addrid == undefined ? "" : addrid;

		var price = $(".tab-price").attr("data-id");
		price = price == undefined ? "" : price;

		var area = $(".tab-area").attr("data-id");
		area = area == undefined ? "" : area;

		var protype = $(".tab-protype").attr("data-id");
		protype = protype == undefined ? "" : protype;

		var industry = $(".tab-industry").attr("data-id");
		industry = industry == undefined ? "" : industry;

		//更新筛选条件
		dataInfo.type = $('#sptype').val();
		dataInfo.parid = $('#area-box .active').attr('data-area');
		dataInfo.addrid = addrid;
		dataInfo.price = price;
		dataInfo.area = area;
		dataInfo.protype = protype;
		dataInfo.industry = industry;
		dataInfo.addridName = $('.tab-addrid span').text();
		dataInfo.priceName = $('.tab-price span').text();
		dataInfo.areaName = $('.tab-area span').text();
		dataInfo.protypeName = $('.tab-protype span').text();
		dataInfo.industryName = $('.tab-industry span').text();

		detailList.insertHtmlStr(dataInfo, $("#sp-list").html(), {lastIndex: atpage});

        if(!wx_miniprogram) {
            setTimeout(function () {
                location.href = url;
            }, 500);
        }

	})
	$('#sp_list').delegate('.house-box', 'click', function(){
		var t = $(this), a = t.find('a'), url = a.attr('data-url');

		var addrid = $(".tab-addrid").attr("data-id");
		addrid = addrid == undefined ? "" : addrid;

		var price = $(".tab-price").attr("data-id");
		price = price == undefined ? "" : price;

		var area = $(".tab-area").attr("data-id");
		area = area == undefined ? "" : area;

		var protype = $(".tab-protype").attr("data-id");
		protype = protype == undefined ? "" : protype;

		var industry = $(".tab-industry").attr("data-id");
		industry = industry == undefined ? "" : industry;

		//更新筛选条件
		dataInfo.type = $('#sptype').val();
		dataInfo.parid = $('#area-box .active').attr('data-area');
		dataInfo.addrid = addrid;
		dataInfo.price = price;
		dataInfo.area = area;
		dataInfo.protype = protype;
		dataInfo.industry = industry;
		dataInfo.addridName = $('.tab-addrid span').text();
		dataInfo.priceName = $('.tab-price span').text();
		dataInfo.areaName = $('.tab-area span').text();
		dataInfo.protypeName = $('.tab-protype span').text();
		dataInfo.industryName = $('.tab-industry span').text();

		detailList.insertHtmlStr(dataInfo, $("#sp_list").html(), {lastIndex: atpage});

		if(!wx_miniprogram) {
			setTimeout(function () {
				location.href = url;
			}, 500);
		}

	})

	$('.mask').on('click', function() {
		$(this).hide();
		$('.nav, .choose-local, .white').hide();
		$('.choose li').removeClass('active');
		$('.header').css('z-index', '99');
		$('.choose-box').css('z-index', '1002');
		$('.choose-box').removeClass('choose-top');
		isClick = true;

	})

	$('.mask').on('touchmove', function() {
		$(this).hide();
		$('.nav, .choose-local, .white').hide();
		$('.choose li').removeClass('active');
		$('.header').css('z-index', '99');
		$('.choose-box').css('z-index', '1002');
		$('.choose-box').removeClass('choose-top');
		isClick = true;

	})

	var xiding = $(".choose-box");
	var chtop = parseInt(xiding.offset().top);
	var myscroll_price = new iScroll("scroll-price", {vScrollbar: false});
	//var myscroll_trade = new iScroll("scroll-trade", {vScrollbar: false,});
	var myscroll_mj = new iScroll("scroll-area", {vScrollbar: false,});
	var myscroll_ty = new iScroll("scroll-type", {vScrollbar: false,});
	// var myscroll_area = new iScroll("area-box", {vScrollbar: false});
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
					// $('.choose-local').css('top', 'calc(.81rem + 20px)');
					// $('.white').css('margin-top', 'calc(.8rem + 20px)');
				}
				$('.choose-local').eq(index).show().siblings('.choose-local').hide();
				myscroll_price.refresh();
				//myscroll_trade.refresh();
				myscroll_mj.refresh();
				myscroll_ty.refresh();
				//myscroll_area.refresh();
				myscroll_more.refresh();
				$(this).parents('.choose-box').addClass('choose-top');

				$('.mask').show();
				$('body').scrollTop(chtop);
				$('.white').show()
			} else {
				$('.choose-local').eq(index).hide();
				$('.choose li').removeClass('active');
				$('.mask').hide();
				$('.white').hide()
				$(this).parents('.choose-box').removeClass('choose-top');
			}

		})
	})

	$('.choose-local li').click(function() {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
	})

	// 点击一级区域
	$('#area-box li').click(function(){
		var a = $(this),id = a.data('area'),name = a.children('a').text();
		if(id && id != 0){
			$.ajax({
				url: "/include/ajax.php?service=house&action=addr&type="+id,
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data){
						if(data.state == 100){
							var info = data.info,len = info.length,html = ['<li data-area="'+id+'" data-pname="'+name+'"><a href="javascript:;">全部</a></li>'];
							for(var i = 0; i < len; i++){
								var obj = info[i];
								html.push('<li data-area="'+obj.id+'"><a href="javascript:;">'+obj.typename+'</a></li>');
							}
							$("#scroll-third .scroll").html(html.join(""));
							$('.sp .choose-local-second').css('width', '60.5%');
							$('.area-third .choose-local-third').show();
							myscroll = new iScroll("scroll-third", {
								vScrollbar: false
							});
						}else{

						}
					}
				},
				error : function(){

				}
			})

		}else{
			$('.sp .choose-local-second').css('width', '100%');
			$('.area-third .choose-local-third').hide();
			$('.choose-local').hide();
			$('.mask').hide();
			$('.choose li').removeClass('active');
			$('.tab-area span').html('不限');
			$('.white').hide();
			isClick = true;

			$('.tab-addrid').attr('data-id','').find('span').text('不限');
			addEare="";
			getList(1);
		}
	})

	// 选择二级区域
	$('.area-third .choose-local-third').on('click', 'li', function() {
		var a = $(this),id = a.data('area'),name = a.children('a').text();
		if(a.hasClass('active')) return;
		a.addClass('active').siblings().removeClass('active');
		if(name == '全部'){
			name = a.data('pname');
		}
		$('.tab-addrid span').html(name);
		$('.choose-local').hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		$('.tab-addrid').attr('data-id',id);
		isClick = true;
		addEare="";
		getList(1);
	})

	// 点击筛选条件 筛选地区不在内
	$('.choose-local').not('.choose-area').find('li').click(function(){
		var obj = $(this),id = obj.data('id') || '',name = obj.children('a').text(),p = obj.parents('.choose-local');

		var type = p.data('type');
		$('.tab-'+type).attr('data-id',id).find('span').html(name);
		if(type == "type"){
			$(".tab-price").attr("data-id",'');
			if(id == 1){
				$(".tab-price span").text('总价');
				$(".typeprice ul").hide();
				$(".typeprice ul").eq(1).show();
			}else{
				$(".tab-price span").text('租金');
				$(".typeprice ul").hide();
				$(".typeprice ul").eq(0).show();
			}
		}
		p.hide();
		$('.mask').hide();
		$('.choose li').removeClass('active');
		$('.white').hide();
		isClick = true;
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


	// 头部切换类别
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
		// data.push("type="+$('#scroll-sptype').val());

		$('.choose li').each(function(){
			var obj = $(this),cls = obj.attr('class'),field = cls.split('-')[1];
			var val = obj.attr('data-id');
			// console.log(val);
			if(val){
				data.push(field+"="+val);
			}
		})
		if(addEare){
			var field="addrid";
			data.push(field +'=' +addEare);
		}


		//更新筛选条件
		$(".choose-more-condition").each(function(){
			var t = $(this), type = t.attr("data-type"), val = t.find(".active").attr('data-id');
			if(val != undefined && val != ""){
				data.push(type+"="+val);
			}
		});

		data.push("page="+atpage);

		var keywords = $('#search_keyword').val();
		data.push("keywords="+keywords);

		$.ajax({
			url: "/include/ajax.php?service=house&action="+action,
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				$('.choose-box').removeClass('choose-top');
				if(data){
					if(data.state == 100){
						$(".house-list .loading").remove();
						var list = data.info.list, html = [];
						if(list.length > 0){
							for(var i = 0; i < list.length; i++){
                                var addrlength = list[i].addr.length;
								var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "small");

								html.push('<div class="house-box">');
								html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
								html.push('<div class="house-item">');
								// html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"><i class="play_img"></i><i class="VR_img"></i></div>');
								var video = list[i].video==1 ? '<i class="play_img"></i>' : '';
								var vr    = list[i].qj==1 ? '<i class="VR_img"></i>' : '';
								var typestate = list[i].usertype==1 ? '' : '<em class="geren">个人</em>';
								html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"onerror="javascript:this.src=\'/static/images/404.jpg\';">'+video+vr+typestate+'</div>');
								html.push('<dl class="l">');
								var top = list[i].isbid==1 ? '<i class="set_top"></i>' : '';
								html.push('<dt>'+top+'<em class="sp_title">'+list[i].title+'</em></dt>');

								html.push('<dd class="item-area sp_item-area">');

								html.push('<em>'+list[i].area+'㎡|'+list[i].loupan+'|'+list[i].zhuangxiu+'</em>');

								//价格
								html.push('<span class="price r">');
								if(list[i].price != 0){
									var ptype = echoCurrency('short')+"/月";
									if(list[i].type == 1){
										ptype = "万";
									}
									html.push('<strong>'+list[i].price+'</strong><span class="price_unit">'+ptype+'</span>');
								}else{
									html.push('<span>待定</span>');
								}
								html.push('</span>');

								html.push('</dd>');

								var elevatortxt = '';
	                            if(list[i].type==1){
									if(list[i].price>0){
										elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';
									 }
	                           	}else if(list[i].type==2){
	                           		if(list[i].transfer>0){
	                           			elevatortxt = '转让费： ' + parseInt(list[i].transfer).toFixed(0) + '万';
	                           		}
	                           	}else if(list[i].type==0){
	                           		if(list[i].price>0){
	                           			elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
	                           		}
	                           	}

								html.push('<dd class="item-type-1 sp-item-type-1 fn-clear"><em>'+list[i].address+'</em><em class="r">'+elevatortxt+'</em></dd>');
								if(list[i].subway != "" && list[i].subway ){
									html.push('<dd class="zu_subway">');
									html.push('<select>');
									for (var j=0;j<list[i].subway.length;j++){
										if(list[i].subway[j].distance>3000){
											html.push('<option>'+list[i].subway[j].line+''+ list[i].subway[j].station+''+ list[i].subway[j].distance+'米</option>');
										}else {
											html.push('<option>'+list[i].subway[j].line+''+ list[i].subway[j].station+'</option>');
										}

									}
									html.push('</select>');
									html.push('</dd>');
								}
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
				$('.choose-box').removeClass('choose-top');
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
		addridName = filter.addridName;
		price = filter.price;
		priceName = filter.priceName;
		area = filter.area;
		areaName = filter.areaName;
		protype = filter.protype;
		protypeName = filter.protypeName;
		industry = filter.industry;
		industryName = filter.industryName;
		atpage = detailList.getLocalStorage()['extraData'].lastIndex;

		$("#sptype").find("option[val='"+type+"']").attr("selected", true);

		if (parid != '') {
			$('#area-box li[data-area="'+parid+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (addrid != '') {
			$('.tab-addrid').attr('data-id', addrid);
		}
		if (addridName != '') {
			$('.tab-addrid span').text(addridName);
		}
		if (price != '') {
			$('.tab-price').attr('data-id', price);
			$('#scroll-price li[data-id="'+price+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (priceName != '') {
			$('.tab-price span').text(priceName);
		}
		if (area != '') {
			$('.tab-area').attr('data-id', area);
			$('#scroll-area li[data-id="'+area+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (areaName != '') {
			$('.tab-area span').text(areaName);
		}
		if (protype != '') {
			$('.tab-protype').attr('data-id', protype);
			$('#more-box li[data-id="'+protype+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (protypeName != '') {
			$('.tab-protype span').text(protypeName);
		}
		if (industry != '') {
			$('.tab-industry').attr('data-id', industry);
			$('#scroll-trade li[data-id="'+industry+'"]').addClass('active').siblings('li').removeClass('active');
		}
		if (industryName != '') {
			$('.tab-industry span').text(industryName);
		}


	}


})
