$(function(){

	//每日情缘
	$(document).on('mouseover','#qingYuanRecommend li .user-item',function(){
		$(this).addClass('hover')
		var btnl = $(this).children('.btn-love')
		if(btnl.hasClass('hadLove')) return
		btnl.addClass('over').animate({'width':'74px'},300).css('overflow','hidden')
	})
	$(document).on('mouseleave','#qingYuanRecommend li .user-item',function(){
		$(this).removeClass('hover')
		var btnl = $(this).children('.btn-love')
		$(this).children('.btn-love').removeClass('over').animate({'width':'34px'},300)
	})

	//打招呼
	$('a.btn-love').click(function(){
		var a = $(this), uid = a.closest("li").data("uid");
		if(a.hasClass('hadLove')) return;

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		a.addClass('hadLove');
		a.stop().animate({'width':'34px'},300);

		var $i = $("<b>").text('已打招呼');
		var x = a.offset().left, y = a.offset().top;
		$i.css({top: y - 10, left: x + 10, position: "absolute", "z-index": "10000", color: "#666", background: "#fff", border: "2px solid #ccc", padding: "3px 8px"});
		$("body").append($i);
		$i.animate({top: y - 30, opacity: 0}, 600, function(){
			$i.remove();
		});

		$.post("/include/ajax.php?service=dating&action=visitOper&type=3&id="+uid);
	})


	scrollLoadUser();
	$(window).scroll(function(){
		scrollLoadUser();
	})


	function scrollLoadUser(){
		var scrollTop = $(window).scrollTop();
		var li = $('#qingYuanRecommend li')
		li.each(function(i){
			if($(this).hasClass('showFlag')) return
			var top = $(this).offset().top

			if(scrollTop >= top - $(window).height()) {
				if(i%2==0){
					$(this).addClass('showFlag fadeFromLeft')
				}else{
					$(this).addClass('showFlag fadeFromRight')
				}
			}else{
				return false;
			}
		})
	}













	//填充年龄
	var bage = [];
	for(var i = 18; i < 99; i++){
		bage.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
	}
	$(".bage ul").html(bage.join(""));

	var eage = [];
	eage.push('<li><a href="javascript:;" data-id="">不限</a>');
	for(var i = 19; i < 100; i++){
		eage.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
	}
	$(".eage ul").html(eage.join(""));

	//填充身高
	var bhei = [];
	for(var i = 140; i < 261; i++){
		bhei.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
	}
	$(".bhei ul").html(bhei.join(""));

	var ehei = [];
	ehei.push('<li><a href="javascript:;" data-id="">不限</a>');
	for(var i = 140; i < 261; i++){
		ehei.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
	}
	$(".ehei ul").html(ehei.join(""));

	//搜索下拉
	$(".dsear .popup-sel").delegate("a", "click", function(){
		if($(this).closest(".popup-sel").find(".areaList").html() == undefined){
			var id = $(this).attr("data-id"), txt = $(this).text();
			$(this).closest(".sel").find("span")
				.attr("data-val", id)
				.html(txt);
			$(this).closest(".popup-sel").hide();

			var pcla = $(this).closest(".sel");

			//年龄判断
			if(pcla.hasClass("bage")){
				var eage = [];
				eage.push('<li><a href="javascript:;" data-id="">不限</a>');
				for(var i = id; i < 100; i++){
					eage.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
				}
				$(".eage ul").html(eage.join(""));

				var eage = $(".eage span").attr("data-val");
				if(id >= eage){
					$(".eage span")
						.attr("data-val", "")
						.html("不限");
				}

			//身高判断
			}else if(pcla.hasClass("bhei")){
				var ehei = [];
				ehei.push('<li><a href="javascript:;" data-id="">不限</a>');
				for(var i = id; i < 261; i++){
					ehei.push('<li><a href="javascript:;" data-id="'+i+'">'+i+'</a>');
				}
				$(".ehei ul").html(ehei.join(""));

				var ehei = $(".ehei span").attr("data-val");
				if(id >= ehei){
					$(".ehei span")
						.attr("data-val", "")
						.html("不限");
				}
			}

			return false;
		}
	});

	$(".dsear .sel").bind("click", function(){
		$(this).closest(".sel").siblings(".sel").find(".popup-sel").hide();
		$(this).find(".popup-sel").toggle();
		$("dd.bir").find(".popup-sel").hide();
		return false;
	});


	var areaArr = [];

	//选择工作区域 s
	$("#addr, .saddr").bind("click", function(){
		var content = [], par = $(this).closest("dd");
		$(".addr, .saddr").find(".areaList").hide();

		if($(this).hasClass("saddr")){
			par = $(this).find(".popup-sel");
		}

		if(areaArr.length > 0 && par.find(".areaList").html() != undefined){
			content.push(createArea(par));

		}else{
			content.push('<p align="center">加载中...</p>');
		}

		if(par.find(".areaList").html() == undefined){
			createAreaObj(par, content.join(""));
		}

		par.find(".areaList").show();

		return false;

	});

	function createAreaObj(obj, content){
		obj.append('<div class="areaList fn-clear">'+content+'</div>');

		var areaList = obj.find(".areaList");

		if(obj.find(".areaList").html().indexOf("加载中") > -1){
			areaList.html(content);
		}

		areaList.show();

		if(areaArr.length <= 0){
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=dating&action=addr&son=1",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						areaArr = data.info;
						areaList.html(createArea(obj));

					}else{
						areaList.html('<p align="center"><font size="3" color="#ff0000">'+data.info+'</font></p>');
					}
				},
				error: function(){
					areaList.html('<p align="center"><font size="3" color="#ff0000">加载失败，请稍后访问！</font></p>');
				}
			});
		}else{
			areaList.html(createArea(obj));
		}
	}

	function createArea(obj){
		if(obj.find(".areaList").html().indexOf("加载中") > -1 && areaArr){
			var content = [];
			var data = areaArr;
			var subdata = [], f = 0, i = true;

			for(var a = 0; a < data.length; a++){

				content.push('<div class="sub-data" data-id="'+a+'" title="'+data[a].typename+'"><a href="javascript:;">'+data[a].typename+'</a><i></i></div>');
				lower2 = data[a].lower;

				subdata.push('<ul class="fn-clear area'+a+'">');
				for(var c = 0; c < lower2.length; c++){
					subdata.push('<li><a href="javascript:;" data-id="'+lower2[c].id+'" data-name="'+lower2[c].typename+'" title="'+lower2[c].typename+'">'+lower2[c].typename+'</a></li>');
				}
				subdata.push('</ul>');

				f++;

				if(f == 4 || a == data.length-1){

					if((a == data.length-1 && f < 4) && !obj.hasClass("addr")){
						i = false;
						content.push('<div class="sub-data no"><a href="javascript:;">不限</a></div>');
					}

					content.push(subdata.join(""));
					subdata = [];
					f = 0;
				}

			}

			if(i && !obj.hasClass("addr")){
				content.push('<div class="sub-data no"><a href="javascript:;">不限</a></div>');
			}

			return content.join("");
		}
	}

	//选择区域
	$(".addr, .saddr").delegate('.sub-data', 'click', function () {
		var t = $(this), id = t.attr("data-id"), par = t.closest(".areaList");
		if(t.hasClass("no")){

			if(t.closest(".areaList").parent().hasClass("addr")){
				$("#addr")
					.attr("data-id", 0)
					.attr("title", "不限")
					.val("不限");
			}else{
				$(".saddr span")
					.attr("data-id", 0)
					.attr("title", "不限")
					.html("不限");
			}

			t.find(".areaList").hide();

		}else{
			if(t.hasClass("curr")){
				t.removeClass("curr");
				par.find(".sub-data").removeClass("curr");
				par.find("ul").stop().slideUp("fast");
			}else{
				par.find(".sub-data").removeClass("curr");
				par.find("ul").stop().slideUp("fast");

				t.addClass("curr");
				t.parent().find(".area"+id).stop().slideDown("fast");
			}
			return false;
		}
	});

	//确定区域
	$(".addr, .saddr").delegate('li a', 'click', function () {
		var t = $(this), id = t.attr("data-id"), name = t.attr('data-name'), pname = t.closest(".areaList").find(".curr a").text();
		if(id && name){
			if(t.closest(".areaList").parent().hasClass("addr")){
				name = pname + " " + name;
				$("#addr")
					.attr("data-val", id)
					.attr("title", name)
					.val(name);
			}else{
				$(".saddr span")
					.attr("data-val", id)
					.attr("title", name)
					.html(name);
			}

		}
	});

	//选择工作区域 e

	$(document).click(function (e) {
		$("dl.bir, .dsear .sel").find(".popup-sel").hide();
		$(".addr, .saddr").find(".areaList").hide();
	});


	//搜索
	$("#jcSearchBar .sbtn").bind("click", function(){
		var data = [];

		//地区
		var addr = $(".saddr>span").attr("data-val");
		if(addr != "" && addr != undefined){
			data.push('addr='+addr);
		}

		//年龄
		var bage = $(".bage>span").attr("data-val");
		var eage = $(".eage>span").attr("data-val");
		var age = "";
		if(bage != "" && bage != undefined){
			age = bage+",";
			if(eage != "" && eage != undefined){
				age += eage;
			}
			data.push('age='+age);
		}

		//身高
		var bhei = $(".bhei>span").attr("data-val");
		var ehei = $(".ehei>span").attr("data-val");
		var hei = "";
		if(bhei != "" && bhei != undefined){
			hei = bhei+",";
			if(ehei != "" && ehei != undefined){
				hei += ehei;
			}
			data.push('height='+hei);
		}

		var url = $("#jcSearchBar").data("url");
		location.href = url+"&"+data.join("&");
	});


})
