$(function(){

	if(typeid == 0 && id == 0){
		//大类切换
		$(".seltype .slide li").bind("click", function(){
			var t = $(this), index = t.index();
			if(!t.hasClass("curr")){
				t.addClass("curr").siblings("li").removeClass("curr");
				$(".seltype .stype ul").hide();
				$(".seltype .stype ul:eq("+index+")").show();
			}
		});

		$("#skey").val("");
		$("#skey").autocomplete({
			source: function( request, response ) {
				$.ajax({
					url: "/include/ajax.php?service=info&action=searchType",
					dataType: "jsonp",
					data:{
						key: request.term
					},
					success: function( data ) {
						if(data && data.state == 100){
							response( $.map( data.info, function( item, index ) {
								return {
									id: item.id,
									value: item.typename,
									label: (index+1)+". "+item.typename
								}
							}));
						}else{
							response([])
						}
					}
				});
			},
			minLength: 1,
			select: function( event, ui ) {
				location.href = getUrl(ui.item.id);
			}
		}).autocomplete( "instance" )._renderItem = function( ul, item ) {
			return $("<li>")
				.append(item.label)
				.appendTo( ul );
		};

		function getUrl(id){
			var url = $(".sform").data("url");
			return url.replace("%id%", id);
		}

		//二级分类
		$(".seltype .stype li").hover(function(){
			var sub = $(this).find(".subnav");
			if(sub.find("a").length > 0){
				$(this).addClass("curr");
				sub.show();
			}
		}, function(){
			var sub = $(this).find(".subnav");
			if(sub.find("a").length > 0){
				$(this).removeClass("curr");
				sub.hide();
			}
		});

		return false;

	}

	getEditor("body");

	//自动获取交易地点
	//百度地图
	if(site_map == "baidu"){
		var coords = $().coords();
		var transform = function(e, t) {
			coords.transform(e,	function(e, n) {
				n != null ? $("#address").val(n.street + n.streetNumber) : alert(e.message);
				$("#address").siblings(".tip-inline").removeClass().addClass("tip-inline success");
				var dist = n.district;
				$("#selAddr .sel-group:eq(0) li").each(function(){
					var t = $(this).find("a"), v = t.text(), i = t.attr("data-id");
					if(v.indexOf(dist) > -1){
						$("#addr").val(i);
						$("#selAddr .sel-group:eq(0)").find("button").html(v+'<span class="caret"></span>');
						$("#selAddr .sel-group:eq(0)").siblings(".sel-group").remove();
						getChildAddr(i);
					}
				});
				t.hide();
			}, true);
		};
		$("#getlnglat").bind("click", function() {
			var e = $(this);
			coords.get(function(t, n) {
				transform(n, e);
			}),
			$(this).unbind("click").html("<s></s>"+langData['siteConfig'][7][3]+"...");  //获取中
		});

		//搜索联想
		var autocomplete = new BMap.Autocomplete({
				input: "address"
		});
		autocomplete.setLocation(map_city);

	//google 地图
	}else if(site_map == "google"){

		$("#getlnglat").hide();
	    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), {placeIdOnly: true});

	}

	//选择区域
	$("#selAddr").delegate("a", "click", function(){
		if($(this).text() != langData['siteConfig'][22][96] && $(this).attr("data-id") != $("#addr").val()){  //不限
			var id = $(this).attr("data-id");
			$(this).closest(".sel-group").nextAll(".sel-group").remove();
			getChildAddr(id);
		}
	});

	//获取子级区域
	function getChildAddr(id){
		if(!id) return;
		$.ajax({
			url: "/include/ajax.php?service=info&action=addr&type="+id,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){
					var list = data.info, html = [];

					html.push('<div class="sel-group">');
					html.push('<button class="sel">'+langData['siteConfig'][22][96]+'<span class="caret"></span></button>');  //不限
					html.push('<ul class="sel-menu">');
					html.push('<li><a href="javascript:;" data-id="'+id+'">'+langData['siteConfig'][22][96]+'</a></li>');  //不限
					for(var i = 0; i < list.length; i++){
						html.push('<li><a href="javascript:;" data-id="'+list[i].id+'">'+list[i].typename+'</a></li>');
					}
					html.push('</ul>');
					html.push('</div>');

					$("#addr").before(html.join(""));

				}
			}
		});
	}


	//有效期
	$("#valid").click(function(){
		WdatePicker({
			el: 'valid',
			doubleCalendar: true,
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			minDate: '%y-%M-{%d+1}',
			onpicking: function(dp){

			}
		});
	});

	//价格开关
	$("input[name=price_switch]").bind("click", function(){
		if($(this).is(":checked")){
			$(".priceinfo").hide();
		}else{
			$(".priceinfo").show();
		}
	});



	//提交发布
	$("#submit").bind("click", function(event){

		event.preventDefault();

		$('#addr').val($('#selAddr .addrBtn').attr('data-id'));
        var addrids = $('#selAddr .addrBtn').attr('data-ids').split(' ');
        $('#cityid').val(addrids[0]);
		var t       = $(this),
				typeid  = $("#typeid").val(),
				title   = $("#title"),
				price   = $("#price").val(),
				addr    = $("#addr").val(),
				person  = $("#person"),
				tel     = $("#tel"),
				valid   = $("#valid");

		if(t.hasClass("disabled")) return;

		var offsetTop = 0;
		if(!typeid){
			$.dialog.alert(langData['siteConfig'][20][342]);  //分类ID获取失败，请重新选择类目！
			return false;
		}

		//验证标题
		var exp = new RegExp("^" + titleRegex + "$", "img");
		if(!exp.test(title.val())){
			title.siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+titleErrTip);
			offsetTop = title.offset().top;
		}



		$("#itemList").find("input, .radio, .sel-group").each(function() {
			var t = $(this), dl = t.closest("dl");

			//下拉菜单
			if(t[0].tagName == "DIV" && t[0].className == "sel-group"){
				if(dl.find("input[type=hidden]").val() == "" && dl.data("required") == 1){
					dl.find(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+dl.find(".sel-group:eq(0)").attr("data-title"));
					offsetTop = offsetTop == 0 ? dl.offset().top : offsetTop;
				}

			//单选
			}else if(t[0].tagName == "DIV" && t[0].className == "radio"){
				if(dl.find("input[type=hidden]").val() == "" && dl.data("required") == 1){
					dl.find(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+dl.find(".radio").attr("data-title"));
					offsetTop = offsetTop == 0 ? dl.offset().top : offsetTop;
				}

			//多选
			}else if(t[0].tagName == "INPUT" && t[0].type == "checkbox"){
				if(dl.find("input:checked").length <= 0 && dl.data("required") == 1){
					dl.find(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+dl.find(".checkbox").attr("data-title"));
					offsetTop = offsetTop == 0 ? dl.offset().top : offsetTop;
				}

			//文本
			}else if(t[0].tagName == "INPUT" && t[0].type == "text"){
				if(t.val() == "" && dl.data("required") == 1){

					//价格
					if(t[0].name == "price"){
						t.parent().siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+t.attr("data-title"));
					}else{
						t.siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+t.attr("data-title"));
					}
					offsetTop = offsetTop == 0 ? t.offset().top : offsetTop;
				}
			}

		});

		ue.sync();

		//验证区域
		if(addr == "" || addr == 0){
			$("#selAddr .tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+$("#selAddr .sel-group:eq(0)").attr("data-title"));
			offsetTop = offsetTop == 0 ? $("#selAddr").offset().top : offsetTop;
		}

		//验证联系人
		var exp = new RegExp("^" + personRegex + "$", "img");
		if(!exp.test(person.val())){
			person.siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+personErrTip);
			offsetTop = offsetTop == 0 ? person.offset().top : offsetTop;
		}

		//验证手机号码
		var exp = new RegExp("^" + telRegex + "$", "img");
		if(!exp.test(tel.val())){
			tel.siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+telErrTip);
			offsetTop = offsetTop == 0 ? tel.offset().top : offsetTop;
		}

		//验证有效期
		if(valid.val() == 0 || valid.val() == ""){
			valid.siblings(".tip-inline").removeClass().addClass("tip-inline error").html("<s></s>"+langData['siteConfig'][20][22]);  //请选择有效期！
			offsetTop = offsetTop == 0 ? valid.offset().top : offsetTop;
		}

		if(offsetTop){
			$('html, body').animate({scrollTop: offsetTop - 5}, 300);
			return false;
		}


		var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
		data = form.serialize();

		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");  //提交中

		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){

					fabuPay.check(data, url, t);

				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['siteConfig'][11][19]);   //立即发布
					$("#verifycode").click();
				}

			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][184]);  //加载中，请稍候
				t.removeClass("disabled").html(langData['siteConfig'][11][19]);//立即发布
				$("#verifycode").click();
			}
		});


	});
	//视频预览
	$("#listSection3").delegate(".enlarge", "click", function(event){
		event.preventDefault();
		var href = $(this).attr("href");

		window.open(href, "videoPreview", "height=500, width=650, top="+(screen.height-500)/2+", left="+(screen.width-650)/2+", toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
	});

	//删除文件
	$(".spic .reupload").bind("click", function(){
		var t = $(this), parent = t.parent(), input = parent.prev("input"), iframe = parent.next("iframe"), src = iframe.attr("src");
		delFile(input.val(), false, function(){
			input.val("");
			t.prev(".sholder").html('');
			parent.hide();
			iframe.attr("src", src).show();
		});
	});

});
//上传成功接收
function uploadSuccess(obj, file, filetype, fileurl){
	console.log(obj);
	$("#"+obj).val(file);
	$("#"+obj).siblings(".spic").find(".sholder").html('<a href="/include/videoPreview.php?f=" data-id="'+file+'">预览视频</a>');
	$("#"+obj).siblings(".spic").find(".reupload").attr("style", "display: contents");
	$("#"+obj).siblings(".spic").show();
	$("#"+obj).siblings("iframe").hide();
}
//删除已上传的文件
function delFile(b, d, c) {
	var g = {
		mod: "info",
		type: "delVideo",
		picpath: b,
		randoms: Math.random()
	};
	$.ajax({
		type: "POST",
		cache: false,
		async: d,
		url: "/include/upload.inc.php",
		dataType: "json",
		data: $.param(g),
		success: function(a) {
			try {
				c(a)
			} catch(b) {}
		}
	})
}
