$(function(){

	//文本框placeholder
	$("html input").placeholder();

	var map, filterData, list = $(".list"), ids = 0, init = {

		//替换模板关键字
		replaceTpl: function(template, data, allowEmpty, chats){
			var regExp;
			chats = chats || ['\\$\\{', '\\}'];
			regExp = [chats[0], '([_\\w]+[\\w\\d_]?)', chats[1]].join('');
			regExp = new RegExp(regExp, 'g');
			return template.replace(regExp,	function (s, s1) {
				if (data[s1] != null && data[s1] != undefined) {
					return data[s1];
				} else {
					return allowEmpty ? '' : s;
				}
			});
		},

		//创建地图
		createMap: function(){
			map = new BMap.Map(g_conf.mapWrapper, {enableMapClick: false, minZoom: g_conf.minZoom});
			map.centerAndZoom(g_conf.cityName, g_conf.minZoom);
			map.enableScrollWheelZoom(); //启用滚轮放大缩小
			map.disableInertialDragging(); //禁用惯性拖拽
			map.addEventListener("tilesloaded", init.tilesloaded); //地图加载完毕执行
		}

		//地图加载完毕添加地图比例尺控件/自定义缩放/收起/展开侧栏
		,tilesloaded: function(){
			map.addControl(new BMap.ScaleControl({
				anchor: BMAP_ANCHOR_BOTTOM_LEFT,
				offset: new BMap.Size(380, 4)
			}));
			map.removeEventListener("tilesloaded", init.tilesloaded);

			//自定义缩放
			$(".zoom-ctrl span").on("click", function(){
				$(this).hasClass("zoom-plus") ? map.zoomIn() : map.zoomOut();
			});

			//收起/展开侧栏
			$(".map-os").bind("click", function(){
				var t = $(this), sidebar = $(".sidebar");
				t.hasClass("open") ? (sidebar.stop().animate({"left": 0}, 150), t.attr("title", "收起左栏"), t.removeClass("open"), $("#"+g_conf.mapWrapper).animate({"left": "352px"}, 150)) : (sidebar.stop().animate({"left": "-351px"}, 150), t.attr("title", "展开左栏"), t.addClass("open"), $("#"+g_conf.mapWrapper).animate({"left": "0"}, 150));
			});

			//加载搜索&筛选&排序
			init.search();
			init.filter();
			init.sortby();


			//初始加载
			init.getSaleData("tilesloaded");


			map.addEventListener("zoomend", function() {
				init.updateOverlays("zoom");
			});
			map.addEventListener("dragend", function() {
				init.updateOverlays("drag");
			});


			//气泡点击  区域
			$("#"+g_conf.mapWrapper).on("click", ".bubble-1", function() {

				var t = $(this), zoom = map.getZoom(),
				newView = {
					lng: parseFloat(t.attr("data-longitude")),
					lat: parseFloat(t.attr("data-latitude")),
					typ: zoom + 1
				};
				newView.lng && newView.lat ? map.centerAndZoom(new BMap.Point(newView.lng, newView.lat), newView.typ) : map.setZoom(newView.typ);


			//楼盘
			}).on("click", ".bubble-2", function(e) {

				var t = $(this),
					newView = {
						lng: parseFloat(t.attr("data-longitude")),
						lat: parseFloat(t.attr("data-latitude")),
						typ: 15
					};
				newView.lng && newView.lat ? (map.setCenter(new BMap.Point(newView.lng, newView.lat)), t.addClass("clicked")) : map.setZoom(newView.typ);

			});
			// 	.on("click", ".bubble-2", function(){
			//
			// 	var t = $(this),
			// 	newView = {
			// 		lng: parseFloat(t.attr("data-longitude")),
			// 		lat: parseFloat(t.attr("data-latitude")),
			// 		typ: g_conf.minZoom + 5
			// 	};
			// 	newView.lng && newView.lat ? map.centerAndZoom(new BMap.Point(newView.lng, newView.lat), newView.typ) : map.setZoom(newView.typ);
			//
			// 	init.getSaleData("community");
			//
			//
			// //气泡点击 小区
			// }).on("click", ".bubble-3", function(e) {
			//
			// 	var t = $(this), id = t.attr("data-id");
			// 	ids = id;
			//
			// 	$(".clicked").parent().removeClass("label-clicked");
			// 	$(".clicked").removeClass("clicked");
			// 	t.addClass("clicked");
			// 	t.parent().addClass("label-clicked");
			//
			// 	init.mosaicSaleList();
			//
			// });


			//自定义滚动条
			$(".filter").mCustomScrollbar({
				theme: "minimal-dark",
				scrollInertia: 400,
				advanced: {
					updateOnContentResize: true,
					autoExpandHorizontalScroll: true
				}
			});


			//自定义滚动条
			list.mCustomScrollbar({
				theme: "minimal-dark",
				scrollInertia: 400,
				advanced: {
					updateOnContentResize: true,
					autoExpandHorizontalScroll: true
				},
				callbacks: {
					//到达底部加载下一页
					onTotalScroll: function(){
						zuPage++;
						isNewList = false;
						init.getzuPageList(zuPageData);
					}
				}
			});
			init.updateLoupanListDiv();
			$(window).resize(function(){
				init.updateLoupanListDiv();
			});

		}


		//更新列表容器高度
		,updateLoupanListDiv: function(){

			var sidebarHeight = $(".sidebar").height(),
				foHeight = $(".f-o").height(),
				lcountHeight = $(".lcount").height();

			list.css({"height": sidebarHeight - foHeight - lcountHeight + "px"});
			list.mCustomScrollbar("update");
		}


		//获取区域及楼盘信息
		,getSaleData: function(type){

			// var visBounds = init.getBounds();
			// var boundsArr = [];
			// boundsArr.push('min_latitude='+visBounds['min_latitude']);
			// boundsArr.push('max_latitude='+visBounds['max_latitude']);
			// boundsArr.push('min_longitude='+visBounds['min_longitude']);
			// boundsArr.push('max_longitude='+visBounds['max_longitude']);

			// var data = boundsArr.join("&")+"&keywords="+encodeURIComponent(g_conf.keywords)+(g_conf.filter.length > 0 ? "&"+g_conf.filter.join("&") : "")+"&orderby="+g_conf.orderby;
			var data ="&keywords="+encodeURIComponent(g_conf.keywords)+(g_conf.filter.length > 0 ? "&"+g_conf.filter.join("&") : "")+"&orderby="+g_conf.orderby;

			//页面打开就请求获取区域数据
			if(!type || type == "tilesloaded" || type == ""){

				$.ajax({
					"url": g_conf.urlPath[1],
					"data": data,
					"dataType": "JSONP",
					"async": false,
					"success": function(data){

						var districtData = [];
						if(data && data.state == 100){

							var list = data.info;
							for(var i = 0; i < list.length; i++){
								districtData[i] = [];
								districtData[i]['id'] = list[i].id;
								districtData[i]['name'] = list[i].addrname;
								districtData[i]['longitude'] = list[i].longitude;
								districtData[i]['latitude'] = list[i].latitude;
								districtData[i]['house_count'] = list[i].count;
								districtData[i]['avg_unit_price'] = list[i].price;
							}

						}

						g_conf.districtData = districtData;
						init.doNext(type);

					}
				});

				$.ajax({
					"url": g_conf.urlPath[5],
					"data": data,
					"dataType": "JSONP",
					"async": false,
					"success": function(data){
						var zuData = [];
						if(data && data.state == 100){
							total_count = data.info.pageInfo.totalCount;
							var _list = data.info.list;
							for(var i = 0; i < _list.length; i++){
								zuData[i] = [];
								zuData[i]['zu_id'] = _list[i].id;
								zuData[i]['longitude'] = _list[i].longitude;
								zuData[i]['latitude'] = _list[i].latitude;
								zuData[i]['title'] = _list[i].title;
								zuData[i]['frame_room'] = _list[i].room;
								zuData[i]['frame_orientation'] = _list[i].direction;
								zuData[i]['house_area'] = _list[i].area;
								zuData[i]['price_total'] = _list[i].price;
								zuData[i]['tags'] = _list[i].flags;
								zuData[i]['list_picture_url'] = _list[i].litpic;
								zuData[i]['community_id'] = _list[i].communityid;
								zuData[i]['community_name'] = _list[i].community;
								zuData[i]['href'] = _list[i].url;
								zuData[i]['house_type'] = _list[i].protype;
								zuData[i]['house_picture_count'] = _list[i].imgCount;
								zuData[i]['update'] = _list[i].timeUpdate+"更新";
							}
						}
						g_conf.zuData = zuData;
						init.doNext(type);
					}
				});
							//type为bizcircle(商圈)时，请求商圈信息
			}else if(type == "bizcircle"){

				if(g_conf.bizcircle.length == 0){
					$.ajax({
						"url": g_conf.urlPath[2],
						"data": data,
						"dataType": "JSONP",
						"async": false,
						"success": function(data){

							var bizcircleData = [];
							if(data && data.state == 100){

								var list = data.info;
								for(var i = 0; i < list.length; i++){
									bizcircleData[i] = [];
									bizcircleData[i]['id'] = list[i].id;
									bizcircleData[i]['name'] = list[i].addrname;
									bizcircleData[i]['longitude'] = list[i].longitude;
									bizcircleData[i]['latitude'] = list[i].latitude;
									bizcircleData[i]['house_count'] = list[i].count;
									bizcircleData[i]['avg_unit_price'] = list[i].price;
								}

							}

							g_conf.bizcircle = bizcircleData;
							data = init.getVisarea(g_conf.bizcircle);
							init.createBubble(data, bubbleTemplate[2], 2);

						}
					});
				}else{
					data = init.getVisarea(g_conf.bizcircle);
					init.createBubble(data, bubbleTemplate[2], 2);
				}

			//type为community(小区)时间，请求小区信息，根据地图当前可视范围进行筛选
			}else if(type == "community"){

				$.ajax({
					"url": g_conf.urlPath[3],
					"data": data,
					"dataType": "JSONP",
					"async": false,
					"success": function(data){

						var saleData = [];
						if(data && data.state == 100){

							var list = data.info;
							for(var i = 0; i < list.length; i++){
								saleData[i] = [];
								saleData[i]['id'] = list[i].id;
								saleData[i]['name'] = list[i].title;
								saleData[i]['longitude'] = list[i].longitude;
								saleData[i]['latitude'] = list[i].latitude;
								saleData[i]['house_count'] = list[i].count;
								saleData[i]['avg_unit_price'] = list[i].price;
								saleData[i]['href'] = list[i].url;
							}

						}

						g_conf.saleData = saleData;
						data = init.getVisarea(g_conf.saleData);
						init.createBubble(data, bubbleTemplate[3], 2);

					}
				});

			}

		}

		//加载完成执行下一步
		,doNext: function(type){
			if(g_conf.districtData && g_conf.zuData){
				init.updateOverlays(type);
			}
		}


		//更新地图状态
		,updateOverlays: function(type){

			if(type == "tilesloaded"){
				map.centerAndZoom(g_conf.cityName, g_conf.minZoom);
			}

			var zoom = map.getZoom(), data = [];

			//区域集合
			if(zoom - g_conf.minZoom <= 1){

				data = init.getVisarea(g_conf.districtData);
				init.createBubble(data, bubbleTemplate[1], 1);

			}else{

				// //商圈集合
				// if(zoom - g_conf.minZoom == 2){
				//
				// 	init.getSaleData("bizcircle");
                //     init.createBubble(data, bubbleTemplate[2], 1);
				//
				// //小区集合
				// }else if(zoom - g_conf.minZoom > 3){
				//
				// 	init.getSaleData("community");
				// 	init.createBubble(data, bubbleTemplate[3], 1, bubbleTemplate.moreTpl);
				// 	//显示楼盘名称、类型、价格
				// 	zoom >= 14 ? $(".bubble-2").addClass("clicked") : $(".bubble-2").removeClass("clicked");
				//
				// }
				//楼盘集合
				if(zoom - g_conf.minZoom ==1){

					data = init.getVisarea(g_conf.zuData);
					console.log(data);
					init.createBubble(data, bubbleTemplate[2], 2, bubbleTemplate.moreTpl);

					//只显示楼盘名称
				}else if(zoom - g_conf.minZoom >=3){

					data = init.getVisarea(g_conf.zuData);
					init.createBubble(data, bubbleTemplate[3], 2, bubbleTemplate.moreTpl);

					//显示楼盘名称、类型、价格
					zoom >= 6 ? $(".bubble-2").addClass("clicked") : $(".bubble-2").removeClass("clicked");
				}

			}

		}


		//获取地图可视区域范围
		,getBounds: function(){
			var e = map.getBounds(),
			t = e.getSouthWest(),
			a = e.getNorthEast();
			return {
				min_longitude: t.lng,
				max_longitude: a.lng,
				min_latitude: t.lat,
				max_latitude: a.lat
			}
		}


		//提取可视区域内的数据
		,getVisarea: function(data){
			data = data || [];
			var areaData = [],
					visBounds = init.getBounds(),
					n = {
						min_longitude: parseFloat(visBounds.min_longitude),
						max_longitude: parseFloat(visBounds.max_longitude),
						min_latitude: parseFloat(visBounds.min_latitude),
						max_latitude: parseFloat(visBounds.max_latitude)
					};

			$.each(data, function(e, a) {
				var i = a.length ? a[0] : a,
				l = parseFloat(i.longitude),
				r = parseFloat(i.latitude);
				l <= n.max_longitude && l >= n.min_longitude && r <= n.max_latitude && r >= n.min_latitude && areaData.push(a)
			});

			return areaData;
		}


		//创建地图气泡
		,createBubble: function(data, temp, resize,more){

			init.cleanBubble();

			// ids = 0;
			$.each(data,	function(e, o) {
				var bubbleLabel, r = [];
				o.avg_price = (o.avg_unit_price/1).toFixed(0);
				if(more){
					o.priceTpl = '<span class="price">' + o.price_total ? (o.price_total + '</span><i>' +  echoCurrency('short')+"/月" + '</i>') : "价格待定</span>";
					o.moreTpl = init.replaceTpl(more, o);
				}
				bubbleLabel = new BMap.Label(init.replaceTpl(temp, o), {
					position: new BMap.Point(o.longitude, o.latitude),
					offset: bubbleMapSize[resize]()
				});

				bubbleLabel.addEventListener("mouseover", function() {
					this.setStyle({zIndex: "4"});
				});

				bubbleLabel.addEventListener("mouseout", function() {
					this.setStyle({zIndex: "2"});
				});

				bubbleLabel.setStyle(bubbleStyle);
				map.addOverlay(bubbleLabel);

				//ids.push(o.id);

			});
		//区域集合时统计数据为楼盘的数量
			data = resize == 1 ? init.getVisarea(g_conf.zuData) : data;
			init.mosaicSaleList(data);

		}

		//删除地图气泡
		,cleanBubble: function(){
			map.clearOverlays();
		}


		//获取并拼接侧栏列表
		,mosaicSaleList: function(data){

			//可视区域内楼盘数量
			$(".lcount strong").html(data.length);

			if(data.length == 0){
				$(".sale-list").html('<p class="empty">很抱歉，没有找到合适的房源，请重新查找</p>');
				return;
			}

			isNewList = true;
			zuPage = 1;

			init.getzuPageList(data);
			//鼠标经过
			list.delegate(".list-item", "mouseover", function(){

				var t = $(this).find("a"), id = t.attr("data-community");
				if(id){
					var bubble = $(".bubble[data-id='" + id + "']");
					bubble.parent().css({zIndex: 4});
					bubble.addClass("hovered");
				}

			});
			list.delegate(".list-item", "mouseout", function(){

				var t = $(this).find("a"), id = t.attr("data-community");
				if(id){
					var bubble = $(".bubble[data-id='" + id + "']");
					bubble.parent().css({zIndex: 2});
					bubble.removeClass("hovered");
				}

			});

		}


		//获取指定分页的房源列表
		,getzuPageList: function(data){
			
			zuPageData=data;

			var index = zuPage * 10;
			var allPage = Math.ceil(zuPageData.length/10);
			var prevIndex = (zuPage - 1) * 10;

			//到达最后一页中止
			if(zuPage > allPage){
				zuPage--;
				return;
			}

			var zuList=[];
			var newData = zuPageData.slice(prevIndex, prevIndex + 10);
			$.each(newData, function(i, d){
				d.priceTpl = d.price_total ? '<strong>'+d.price_total+'</strong>'+ '元/月' : '<strong>价格待定</strong>';
				zuList.push(init.replaceTpl(listTemplate.roomlist, d));
			});

			if(isNewList){
				list.mCustomScrollbar("scrollTo","top");
				$(".sale-list").html(zuList.join(""));
			}else{
				$(".sale-list").append(zuList.join(""));
			}

			list.mCustomScrollbar("update");
			// if(isNewList){
			// 	$(".sale-list").html('<p class="loading">加载中...</p>');
			// }else{
			// 	$(".sale-list").append('<p class="loading-min">加载中...</p>');
			// }
			// list.mCustomScrollbar("update");

			// var visBounds = init.getBounds();
			// var boundsArr = [];
			// boundsArr.push('min_latitude='+visBounds['min_latitude']);
			// boundsArr.push('max_latitude='+visBounds['max_latitude']);
			// boundsArr.push('min_longitude='+visBounds['min_longitude']);
			// boundsArr.push('max_longitude='+visBounds['max_longitude']);
			//
			// var data = boundsArr.join("&")+"&keywords="+encodeURIComponent(g_conf.keywords)+(g_conf.filter.length > 0 ? "&"+g_conf.filter.join("&") : "")+"&orderby="+g_conf.orderby+"&community="+ids+"&page="+zuPage+"&pageSize=10";
			// var total_count = 0, datalist = [];
			//
			// $.ajax({
			// 	"url": g_conf.urlPath[5],
			// 	"data": data,
			// 	"dataType": "JSONP",
			// 	"async": false,
			// 	"success": function(data){
			// 		var saleData = [];
			// 		if(data && data.state == 100){
			// 			total_count = data.info.pageInfo.totalCount;
			// 			var _list = data.info.list;
			// 			for(var i = 0; i < _list.length; i++){
			// 				datalist[i] = [];
			// 				datalist[i]['id'] = _list[i].id;
			// 				datalist[i]['title'] = _list[i].title;
			// 				datalist[i]['frame_room'] = _list[i].room;
			// 				datalist[i]['frame_orientation'] = _list[i].direction;
			// 				datalist[i]['house_area'] = _list[i].area;
			// 				datalist[i]['price_total'] = _list[i].price;
			// 				datalist[i]['tags'] = _list[i].flags;
			// 				datalist[i]['list_picture_url'] = _list[i].litpic;
			// 				datalist[i]['community_id'] = _list[i].communityid;
			// 				datalist[i]['community_name'] = _list[i].community;
			// 				datalist[i]['href'] = _list[i].url;
			// 				datalist[i]['house_type'] = _list[i].protype;
			// 				datalist[i]['house_picture_count'] = _list[i].imgCount;
			// 				datalist[i]['update'] = _list[i].timeUpdate+"更新";
			// 			}
			//
			// 			var index = zuPage * 10;
			// 			var allPage = Math.ceil(total_count/10);
			// 			var prevIndex = (zuPage - 1) * 10;
			//
			// 			$(".sale-list .loading, .sale-list .loading-min").remove();
			// 			list.mCustomScrollbar("update");
			//
			// 			//可视区域内房源数量
			// 			$(".lcount strong").html(total_count);
			//
			// 			if(total_count == 0){
			// 				$(".sale-list").html('<p class="empty">很抱歉，没有找到合适的房源，请重新查找</p>');
			// 				list.mCustomScrollbar("update");
			// 				return;
			// 			}
			//
			// 			//到达最后一页中止
			// 			if(zuPage > allPage){
			// 				zuPage--;
			// 				return;
			// 			}
			//
			// 			var saleList = [];
			// 			$.each(datalist, function(i, d){
			// 				saleList.push(init.replaceTpl(listTemplate.roomlist, d));
			// 			});
			//
			// 			if(isNewList){
			// 				list.mCustomScrollbar("scrollTo","top");
			// 				$(".sale-list").html(saleList.join(""));
			// 			}else{
			// 				$(".sale-list").append(saleList.join(""));
			// 			}
			//
			// 			list.mCustomScrollbar("update");
			//
			// 		//没有数据
			// 		}else{
			// 			// $(".lcount strong").html(0);
			// 			$(".sale-list").html('<p class="empty">很抱歉，没有找到合适的房源，请重新查找</p>');
			// 			list.mCustomScrollbar("update");
			// 		}
			// 	}
			// });


		}


		//加载搜索
		,search: function(){

			$("#skey").autocomplete({
				source: function(request, response) {
					$.ajax({
						url: g_conf.urlPath[4],
						dataType: "jsonp",
						data:{
							keywords: request.term
						},
						success: function(data) {
							if(data && data.state == 100){
								response($.map(data.info.list, function(item, index) {
									return {
										id: item.id,
										value: item.title,
										label: item.title
									}
								}));
							}else{
								response([])
							}
						}
					});
				},
				minLength: 1,
				select: function(event, ui) {
					g_conf.keywords = ui.item.value;
					g_conf.bizcircle = [];
					init.getSaleData();
				}
			}).autocomplete("instance")._renderItem = function(ul, item) {
				return $("<li>")
					.append(item.label)
					.appendTo(ul);
			};


			//点击搜索
			$("#sbtn").bind("click", function(){
				var val = $.trim($("#skey").val());
				g_conf.keywords = val;
				g_conf.bizcircle = [];
				init.getSaleData();
			});

		}


		//加载筛选
		,filter: function(){

			//筛选条件
			var filterArr = g_conf.filterConf, filterHtml = "", i = 0;
			if(filterArr != undefined){
				for(i; i < filterArr.length; i++){
					filterHtml += '<dl class="fn-clear" data-type="'+filterArr[i].type+'">';
					filterHtml += '<dt>'+filterArr[i].name+'：</dt>';
					filterHtml += '<dd class="fn-clear">';

					var b = 0, options = filterArr[i].options;
					for(b; b < options.length; b++){
						var cla = b == 0 ? ' class="on"' : '';
						filterHtml += '<a href="javascript:;" title="'+options[b][0]+'" data-val="'+options[b][1]+'" '+cla+'>'+options[b][0]+'</a>';
					}

					filterHtml += '</dd></dl>';
				}
			}
			$(".filter-clean").before(filterHtml);

			//售价滑块
			$("#sjObj").slider({
				range: true,
				step: 100,
				min: g_conf.sjMin,
				max: g_conf.sjMax,
				values: [g_conf.sjMin, g_conf.sjMax],
				slide: function(event, ui) {
					init.setSjRange(ui.values);
				}
			});
			init.setSjRange([g_conf.sjMin, g_conf.sjMax]);

			//显示筛选条件
			$(".f-o li:eq(0)").bind("click", function(){
				var t = $(this), filter = $(".filter");
				filter.is(":hidden") ? (filter.show(), t.addClass("on")) : (filter.hide(), t.removeClass("on"));
			});

			//切换选项
			$(".filter").delegate("dd a", "click", function(){
				if(!$(this).hasClass("on")){
					$(this).addClass("on").siblings("a").removeClass("on");
				}
			});


			init.cleanFilter();
			init.confirmFilter();
			init.cancelFilter();

		}

		//设置售价范围
		,setSjRange: function(val){
			var minTxt = maxTxt = echoCurrency('short'), min = val[0], max = val[1];

			$("#sjObj").slider({values: [min, max]});

			minTxt = min == g_conf.sjMin ? "" : minTxt;
			maxTxt = max == 0 ? "" : (max == g_conf.sjMax ? maxTxt + "以上" : maxTxt);
			$("#sjTxt").text(min + minTxt + " - " + max + maxTxt);
		}

		//清空所选
		,cleanFilter: function(){

			$(".filter-clean a").bind("click", function(){
				$(".filter dl").each(function(){
					var t = $(this);
					if(!t.hasClass("sj")){
						t.find("dd a").removeClass("on");
						t.find("dd a:eq(0)").addClass("on");
					}
				});

				init.setSjRange([g_conf.sjMin, g_conf.sjMax]);
			});

		}

		//确定筛选条件
		,confirmFilter: function(){

			$(".filter-confirm").bind("click", function(){

				var filter = [];

				//填充条件
				filterTitle = [];
				filterData = [];
				filterData['filter'] = [];

				var sjMin = $("#sjObj").slider("values", 0), sjMax = $("#sjObj").slider("values", 1);
				if(sjMin != 0 || sjMax != g_conf.sjMax){
					filterTitle.push(sjMin + "-" + sjMax + echoCurrency('short'));
				}
				filterData['price'] = [sjMin, sjMax];
				if(sjMin != 0 || sjMax != g_conf.sjMax){
					filter.push('price'+"="+(sjMin == 0 ? 0 : sjMin/100)+","+(sjMax == g_conf.sjMax ? "": sjMax/100));
				}

				$(".filter dl").each(function(i){
					var t = $(this);
					if(!t.hasClass("sj") && !t.hasClass("mj")){
						var type = t.attr("data-type"), val = t.find(".on").attr("data-val"), txt = t.find(".on").text();
						filterData['filter'][i-2] = [type, val];

						filter.push(type+"="+val);

						if(txt != "不限" && val != 0){
							filterTitle.push(txt);
						}
					}
				});

				//筛选条件title
				var obj = $(".f-o li:eq(0)");
				if(filterTitle.length > 0){
					obj.addClass("curr").find("span").html(filterTitle.join("/")).attr("title", filterTitle.join("/"));
				}else{
					obj.removeClass("curr").find("span").html("筛选条件").attr("title", "筛选条件");
				}

				g_conf.filter = filter;
				obj.click();

				init.getSaleData();

			});

		}

		//取消筛选
		,cancelFilter: function(){

			$(".filter-cancel").bind("click", function(){

				//填充最后一次的筛选条件
				if(filterData != undefined){

					var i = 0, filter = filterData['filter'], price = filterData['price'], area = filterData['area'];
					for(i; i < filter.length; i++){
						var type = filter[i][0], val = filter[i][1];
						$(".filter dl").each(function(){
							var t = $(this), ty = t.attr('data-type');
							if(type == ty){
								t.find("a").removeClass("on");
								t.find("a[data-val="+val+"]").addClass("on");
							}
						});
					}

					init.setSjRange([price[0], price[1]]);

				}

				$(".f-o li:eq(0)").click();

			});

		}

		//加载排序
		,sortby: function(){

			//筛选条件
			var orderby = $(".orderby"), sortArr = g_conf.sortConf, sortHtml = '', i = 0;
			if(sortArr != undefined){
				for(i; i < sortArr.length; i++){
					var cla = i == 0 ? ' class="on"' : '';
					sortHtml += '<li><a href="javascript:;" title="'+sortArr[i][0]+'" data-val="'+sortArr[i][1]+'" '+cla+'>'+sortArr[i][0]+'</a>';
				}
			}
			orderby.html(sortHtml);

			//显示排序
			$(".f-o li:eq(1)").hover(function(){
				var t = $(this);
				t.addClass("on");
				t.find(".orderby").show();
			}, function(){
				var t = $(this);
				t.removeClass("on");
				t.find(".orderby").hide();
			});

			//排序选中
			orderby.delegate("a", "click", function(){
				var parent = orderby.parent(), t = $(this);
				t.addClass("on").parent().siblings("li").find("a").removeClass("on");
				parent.removeClass("on");
				orderby.hide();
				var text = t.text(), val = t.attr('data-val');
				if(text == '默认排序'){
					parent.removeClass("curr");
					parent.find("span").html('默认排序');
				}else{
					parent.addClass("curr");
					parent.find("span").html(text);
				}

				g_conf.orderby = val;

				init.getSaleData();

			});

		}

	}


	//气泡偏移
	var bubbleMapSize = {
			1 : function() {
				return new BMap.Size(-46, -46)
			},
			2 : function() {
				return new BMap.Size(-1, 10)
			},
			3 : function() {
				return new BMap.Size(-1, 10)
			},
			4 : function() {
				return new BMap.Size(-9, -9)
			}
		}

		//气泡模板
		,bubbleTemplate = {

			//区域
			1 : '<div class="bubble bubble-1" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${zu_id}"><p class="name" title="${name}区">${name}区</p><p class="num">${avg_price}'+echoCurrency('short')+'/月</p><p><span class="count">${house_count}</span>套</p></div>',

			//只显示楼盘
			2 : '<div class="bubble bubble-2" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${zu_id}"><div class="bubble-wrap"><div class="bubble-inner"><p class="name" title="${community_name}">${community_name}</p>${moreTpl}</div><i class="arrow"><i class="arrow-i"></i></i></div><p class="cycle"></p></div>',

			//楼盘、价格及类型
			3 : '<div class="bubble bubble-2 bubble-3" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${zu_id}"><div class="bubble-wrap"><div class="bubble-inner"><p class="name" title="${community_name}">${community_name}</p>${moreTpl}</div><i class="arrow"><i class="arrow-i"></i></i></div><p class="cycle"></p></div>',

			//区域
			4 : '<div class="bubble " data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><p class="name" title="${name}区">${name}区</p><p class="num">${avg_price}'+echoCurrency('short')+'/月</p><p><span class="count">${house_count}</span>套</p></div>',

			//小区
			5 : '<p class=" bubble-2 bubble-3 bubble" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><i class="num">${house_count}套</i><span class="name"><i class="name-des"><a href="${href}" target="_blank">${name}</a></i></span><i class="arrow-up"><i class="arrow"></i><i></p>',

			//周边信息
			6 : '<div class="bubble bubble-4" data-disabled="1" data-longitude="${longitude}" data-latitude="${latitude}" data-id="${id}"><span class="close">&times;</span><a href="${url}" target="_blank"><div class="bubble-inner clear"><p class="tle">周边信息</p><div class="around-container"><p class="around-li li-first"  data-type="超市" style="background-position: 0 -2px;">超市：<span>0</span>家</p><p class="around-li" data-type="公交" style="background-position: 0 -56px;">公交：<span>0</span>站</p><p class="around-li"  data-type="学校" style="background-position: 0 -20px;">学校：<span>0</span>所</p><p class="around-li"  data-type="银行" style="background-position: 0 -74px;">银行：<span>0</span>家</p><p class="around-li"  data-type="医院" style="background-position: 0 -38px;">医院：<span>0</span>所</p><p class="around-li li-last"  data-type="休闲" style="background-position: 0 -92px;">休闲：<span>0</span>家</p></div><i class="arrow"><i class="arrow-i"></i></i></div></a><p class="cycle"></p></div>',

			//楼盘价格
			moreTpl: '<p class="num">${community_name}<span class="house-type"></span>均价${priceTpl}<span class="gt">&gt;</span></p>',

		}

		//列表模板
		,listTemplate = {

			//楼盘列表
			roomlist: '<div class="list-item"><a href="${href}" target="_blank" title="${title}" data-community="${community_id}"><div class="item-aside"><img src="${list_picture_url}"onerror="javascript:this.src=\'/static/images/404.jpg\';"><div class="item-btm"><span class="item-img-icon"><i class="i-icon-arrow"></i><i class="i-icon-dot"></i></span><span>${house_picture_count}</span></div></div><div class="item-main"><p class="item-tle">${title}</p><p class="item-des"><span>${frame_room}</span><span data-origin="${house_area}">${house_area}㎡</span><span>朝${frame_orientation}</span><span class="item-side">${price_total}<span>'+echoCurrency('short')+'/月</span></span></p><p class="item-community"><span class="item-exact-com">${community_name}</span><em>${update}</em></p></div></a></div>'

		}

		//气泡样式
		,bubbleStyle = {
			color: "#fff",
			borderWidth: "0",
			padding: "0",
			zIndex: "2",
			backgroundColor: "transparent",
			textAlign: "center",
			fontFamily: '"Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "微软雅黑", "Segoe UI", Tahoma, "宋体b8bf53", SimSun, sans-serif'
		}

		,isNewList = false   //是否为新列表
		,zuPage = 1        //楼盘数据当前页
		,saleChooseData    //查看户型的楼盘数据
	    ,zuPageData;      //当前可视范围内的楼盘

	g_conf.districtData = [];
	g_conf.bizcircle = [];
	g_conf.zuData = [];
	g_conf.saleData = [];

	init.createMap();


});
