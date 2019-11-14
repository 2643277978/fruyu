$(function(){


  // 搜索
	$('.search dl').hover(function(){
		var a = $(this);
		a.addClass('hover');
		a.find('dd .curr').addClass('active').siblings().removeClass();
	},function(){
		$(this).removeClass('hover');
	}).find('dd a').click(function(){
		var a = $(this);
		a.addClass('active curr').siblings().removeClass();
		$('.keytype').text(a.text());
		$('.search dl').removeClass('hover');
	}).hover(function(){
		var a = $(this);
		a.addClass('active').siblings().removeClass('active');
	})

	$('.searchkey').focus(function(){
		$('.hotkey').addClass('leave').stop().animate({
			'right' : '-400px'
		},500);
	}).blur(function(){
		$('.hotkey').removeClass('leave').stop().animate({
			'right' : '15px'
		},500);
	})

  //鼠标经过头部链接显示浮动菜单
	$(".topbarlink li").hover(function(){
		var t = $(this), pop = t.find(".pop");
		pop.show();
		t.addClass("hover");
	}, function(){
		var t = $(this), pop = t.find(".pop");
		pop.hide();
		t.removeClass("hover");
	});

	//切换导航颜色
	$(".changeSkin").colorPicker({
		callback: function(color) {
			var color = color.length === 7 ? color : '';
			changeSkin(color);
		}
	});

	var navbarSkin = $.cookie("navbarSkin");
	if(navbarSkin != null && navbarSkin != ""){
		changeSkin(navbarSkin);
	}

	function changeSkin(color){
		$(".searchwrap, .nav, .mainnav li dd").css({"background": color});
		$(".search .type dd").css({"border-color": color});

		var rgbaVal = "";
		if(color != ""){
			rgbcolor = color.replace("#", "");
			rgbcolor = rgbcolor.toLowerCase();
			var rgba = new Array();
			for(x = 0; x < 3; x++){
				rgba[0] = rgbcolor.substr(x * 2, 2);
				rgba[3] = "0123456789abcdef";
				rgba[1] = rgba[0].substr(0,1);
				rgba[2] = rgba[0].substr(1,1);
				rgba[20 + x] = rgba[3].indexOf(rgba[1]) * 16 + rgba[3].indexOf(rgba[2]);
			}
			rgbaVal = "rgba("+rgba[20]+", "+rgba[21]+", "+rgba[22]+", .95)";
		}
		$(".mainnav li dd").css({"background": rgbaVal});

		var style = '<style id="changeSkinStyle">.search .type dd a.active, .search .type dd a:hover{background:'+color+';}.mainnav li.mainnav li dd, .hover .dropbox, .mainnav li:hover, .mainnav li:hover .dropbox, .search .hotkey a:hover, .search .submit:hover{background:'+color+';background:rgba('+rgbaVal+');}';

		$("#changeSkinStyle").remove();
		$("head").append(style);

		$.cookie("navbarSkin", color, {expires: 365, domain: masterDomain.replace("http://", ""), path: '/'});
	}





})
