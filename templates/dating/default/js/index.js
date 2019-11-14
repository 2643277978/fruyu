$(function(){

	//大图幻灯
	$("#slide").cycle({
		pager: '#slidebtn'
	});

	//注册类型切换
	$(".rad label").bind("click", function(){
		$(this).siblings("label").removeClass("checked");
		$(this).addClass("checked");
	});

	$(".type label").bind("click", function(){
		var val = $(this).attr("data-id");
		$("#t1, #t2").hide();
		$("#t"+val).show();
	});

	$("dl.bir input").bind("click", function(){
		$(this).parent().siblings(".sel").find(".popup-sel").hide();
		$(this).next(".popup-sel").toggle();
		$(".dsear .sel").find(".popup-sel").hide();
		return false;
	});

	$(".bir .popup-sel a").bind("click", function(){
		var t = $(this), txt = t.text(), cla = t.closest(".popup-sel");
		txt = txt < 10 ? "0"+txt : txt;
		if(cla.hasClass("y")){
			$("#year").val(txt+" 年");
		}else if(cla.hasClass("m")){
			$("#month").val(txt+" 月");
		}else if(cla.hasClass("d")){
			$("#day").val(txt+" 日");
		}
	});

	$("#ulogin").bind("click", function(){
		$("#login").click();
	});

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

	//选择区域 s
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
				url: masterDomain+"/include/ajax.php?service=dating&action=addr&son=1&template=single",
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

	//选择区域 e

	$(document).click(function (e) {
		$("dl.bir, .dsear .sel").find(".popup-sel").hide();
		$(".addr, .saddr").find(".areaList").hide();
	});


	//数量错误提示
	var errmsgtime;
	function errmsg(div,str){
		$('#errmsg').remove();
		clearTimeout(errmsgtime);
		var top = div.offset().top - 33;
		var left = div.offset().left;

		var msgbox = '<div id="errmsg" style="position:absolute;top:' + top + 'px;left:' + left + 'px;height:30px;line-height:30px;text-align:center;color:#ff0;font-size:14px;display:none;padding:0 10px;z-index:99999;background:#f00;">' + str + '</div>';
		$('body').append(msgbox);
		$('#errmsg').fadeIn(300);
		errmsgtime = setTimeout(function(){
			$('#errmsg').fadeOut(300, function(){
				$('#errmsg').remove();
			});
		},2000);

		var position = [-5,5,-4,4,-3, 3, - 2, 2, - 1, 1, - 1, 0.5, 0];
		var i = 0;
		setContainer = setInterval(function() {
			if (i == position.length - 1) clearInterval(setContainer);
			$(".member-info").css({"right":0+position[i] + "px"});
			i++;
		},100);
	};


	//注册
	var reg = $(".reg");
	reg.find(".tj").bind("click", function(){
		var t = $(this);
		if(t.hasClass("disabled")) return false;

		var type = reg.find(".type .checked").data("id");
		var mobile = $("#mobile");
		var email = $("#email");
		var password = $("#password");
		var sex = reg.find(".sex .checked").data("id");
		var year_ = $("#year");
		var year = year_.val().replace("年", "").replace(/\s/, "");
		var month_ = $("#month");
		var month = month_.val().replace("月", "").replace(/\s/, "");
		var day_ = $("#day");
		var day = day_.val().replace("日", "").replace(/\s/, "");
		var addr = $("#addr").attr("data-val");

		if(type == 1){

			if($.trim(mobile.val()) == ""){
				errmsg(mobile, "请输入手机号码！");
				return false;
			}else if(!/(13|14|15|17|18)[0-9]{9}/.test($.trim(mobile.val()))){
				errmsg(mobile, "手机号码格式错误！");
				return false;
			}

		}else if(type == 2){

			if($.trim(email.val()) == ""){
				errmsg(email, "请输入邮箱地址！");
				return false;
			}else if(!/^[a-z0-9]+([\+_\-\.]?[a-z0-9]+)*@([a-z0-9]+\.)+[a-z]{2,6}$/i.test($.trim(email.val()))){
				errmsg(email, "邮箱地址格式错误！");
				return false;
			}

		}else{
			errmsg(reg.find(".type"), "请选择注册方式");
			return false;
		}

		if(password.val() == ""){
			errmsg(password, "请输入密码！");
			return false;
		}else if(!/^.{5,}$/.test($.trim(password.val()))){
			errmsg(password, "密码长度最少为5位！");
			return false;
		}

		if(year == ""){
			errmsg(year_, "请选择出生日期！");
			return false;
		}

		if(month == ""){
			errmsg(month_, "请选择出生日期！");
			return false;
		}

		if(day == ""){
			errmsg(day_, "请选择出生日期！");
			return false;
		}

		if(addr == "" || addr == undefined){
			errmsg($("#addr"), "请选择所在区域！");
			return false;
		}

		t.addClass("disabled").val("注册中...");

		var data = [];
		data.push('type='+type);
		if(type == 1){
			data.push('mobile='+mobile.val());
		}else{
			data.push('email='+email.val());
		}
		data.push('password='+password.val());
		data.push('sex='+sex);
		data.push('year='+year);
		data.push('month='+month);
		data.push('day='+day);
		data.push('addr='+addr);

		$.ajax({
			url: masterDomain+'/include/ajax.php?service=member&action=regDating',
			data: data.join("&"),
			dataType: "html",
			success: function (data) {
				if(data){
					var dataArr = data.split("|");
					var info = dataArr[1];
					if(data.indexOf("100|") > -1){
						$("body").append(data);
						t.val("注册成功！");
						setTimeout(function(){
							location.reload();
						}, 300);
					}else{
						alert(info);
						t.removeClass("disabled").val("免费注册");
					}
				}else{
					alert("网络错误，请稍候重试！");
					t.removeClass("disabled").val("免费注册");
				}
			},
			error: function(){
				alert("网络错误，请稍候重试！");
				t.removeClass("disabled").val("免费注册");
			}
		});


	});


	//搜索
	$(".dsear .sbtn").bind("click", function(){
		var data = [];

		//性别
		var stype = $(".stype>span").attr("data-val");
		if(stype != "" && stype != undefined){
			data.push('sex='+stype);
		}

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

		var url = $(".dsear").data("url");
		location.href = url+"&"+data.join("&");
	});



	var imgLoad = function (url, callback) {
		var img = new Image();
		img.src = url;
		if (img.complete) {
			callback(img);
		} else {
			img.onload = function () {
				callback(img);
				img.onload = null;
			};
		}
	};

	//优质会员推荐
	$(".ltype a").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("curr")) return false;
		t.siblings("a").removeClass("curr");
		t.addClass("curr");
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=dating&action=memberList&typeid="+id+"&pageSize=22",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data.state == 100){

					var list = [], data = data.info.list;
					for(var i = 0; i < data.length; i++){
						list.push('<li class="r'+(i+1)+'"><a href="'+data[i].url+'" target="_blank"><img src="/static/images/blank.gif" _src="'+data[i].photo+'"><div class="info"><p><span>'+data[i].age+'岁 '+data[i].height+'CM</span>'+data[i].nickname+'</p><span class="bg"></span></div></a></li>');
					}

					t.closest(".list").find("ul").html(list.join(""));

					var imgArr = t.closest(".list").find('img');
					imgArr.each(function (i, ele) {
						var _src = imgArr.eq(i).attr('_src');
						if(typeof(_src) != 'undefined'){
							imgLoad(_src, function () {
								imgArr.eq(i).attr('src', _src);
								imgArr.eq(i).animate({opacity: 1});
							});
						}
					});

				}
			}
		});
	});

	$(".ltype a:eq(0)").click();

	//换一换
	$(".change").bind("click", function(){
		var index = $(".ltype .curr").index();
		if(index == 8){
			$(".ltype a:eq(0)").click();
		}else{
			$(".ltype .curr").next("a").click();
		}
	});

	//成功故事
	$(".tags a").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(t.hasClass("curr")) return false;
		t.siblings("a").removeClass("curr");
		t.addClass("curr");
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=dating&action=story&tags="+id+"&pageSize=11",
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data.state == 100){

					var list = [], data = data.info.list;
					for(var i = 0; i < data.length; i++){
						list.push('<li><a href="'+data[i].url+'" target="_blank"><img src="/static/images/blank.gif" _src="'+huoniao.changeFileSize(data[i].litpic, 'middle')+'" alt="'+data[i].fnickname+' & '+(data[i].tid == 0 ? '保密' : data[i].tnickname)+'" /><div class="info"><p>'+data[i].fnickname+' & '+(data[i].tid == 0 ? '保密' : data[i].tnickname)+'<br />'+data[i].kdate+'</p><span class="bg"></span></div></a></li>');
					}

					t.parent().parent().siblings("li").remove();

					t.closest("ul").append(list.join(""));

					var imgArr = t.closest("ul").find('img');
					imgArr.each(function (i, ele) {
						var _src = imgArr.eq(i).attr('_src');
						if(typeof(_src) != 'undefined'){
							imgLoad(_src, function () {
								imgArr.eq(i).attr('src', _src);
								setTimeout(function () {
									imgArr.eq(i).animate({opacity: 1});
								}, i * 100);
							});
						}
					});

				}
			}
		});
	});

	$(".tags a:eq(0)").click();

});
