$(function(){
	//实例化编辑器
	var ue = UE.getEditor('review', {"term": "small"});

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();
	
	//会员模糊匹配
	$("#user").bind("input", function(){
		$("#uid").val("0");
		var t = $(this), val = t.val();
		if(val != ""){
			t.addClass("input-loading");
			huoniao.operaJson("../inc/json.php?action=checkUser", "key="+val, function(data){
				t.removeClass("input-loading");
				if(!data) {
					$("#userList").html("").hide();
					return false;
				}
				var list = [];
				for(var i = 0; i < data.length; i++){
					list.push('<li data-id="'+data[i].id+'" title="'+data[i].username+'">'+data[i].username+'</li>');
				}
				if(list.length > 0){
					var pos = t.position();
					$("#userList")
						.css({"left": pos.left, "top": pos.top + 36, "width": t.width() + 12})
						.html('<ul>'+list.join("")+'</ul>')
						.show();
				}else{
					$("#userList").html("").hide();
				}
			});
			
		}else{
			$("#userList").html("").hide();
		}
    });
	
	$("#userList").delegate("li", "click", function(){
		var name = $(this).text(), id = $(this).attr("data-id");
		$("#user").val(name);
		$("#uid").val(id);
		$("#userList").html("").hide();
		$("#user").siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>请输入网站对应会员名');
		return false;
	});
	
	$(document).click(function (e) {
        var s = e.target;
        if (!jQuery.contains($("#userList").get(0), s)) {
            if (jQuery.inArray(s.id, "user") < 0) {
                $("#userList").hide();
            }
        }
    });
	
	$("#user").bind("blur", function(){
		var t = $(this), val = t.val(), id = $("#uid").val();
		if(id == 0){
			t.siblings(".input-tips").removeClass().addClass("input-tips input-error").html('<s></s>请从列表中选择会员');
		}else{
			t.siblings(".input-tips").removeClass().addClass("input-tips input-ok").html('<s></s>请输入网站对应会员名');
		}
	});

	//选择品牌
	$("#cBrand, #cCar, #cParam").bind("click", function(){
		var t = $(this), top = t.offset().top + t.height() + 11, left = t.offset().left, 
			obj = t.attr("id"), type = t.attr("data-type"), id = t.attr("data-id");
		if(obj == "cCar" && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
			return false;
		}

		if(obj == "cParam" && $("#cCar").attr("data-id") == 0 && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
			return false;
		}

		if(obj == "cParam" && $("#cCar").attr("data-id") == 0) {
			$("#cCar").click(); 
			return false;
		}

		//选择品牌
		if(obj == "cBrand" && $("#Mast_"+type).html() == undefined){
			getBrand(t);
		}

		if($("#Mast_"+type).html() != undefined){
			if($("#Mast_"+type).is(":visible") == false){
				$("#Mast_"+type).css({
					top: top,
					left: left
				}).show();
			}else{
				$("#Mast_"+type).hide();
			}
		}
	});

	//字母检索
	$("#carBtn").delegate(".pinpzm a", "click", function(e){
		$(this).closest(".pinpzm").find(".on").removeClass("on");
        $(this).parent().addClass("on");

        var obj = $(this).closest(".zcfcbox").attr("id");
        if($("#"+obj + $(this).html()).html() != undefined){
	        $(this).closest(".zcfcbox").find(".pinp_main").get(0).scrollTop = $("#" + obj + $(this).html()).get(0).offsetTop;
	    }
        e.stopPropagation();
	});

	//选择结果
	$("#carBtn").delegate(".pinp_main a", "click", function(e){
		$(this).closest(".pinp_main").find(".on").removeClass("on");
        $(this).addClass("on");

        var id = $(this).attr("data"), text = $(this).html().substring(2), brand = 0, car = 1, obj = $(this).closest(".zcfcbox").attr("id").replace("Mast_", "");

        //车系
        if(obj == "Car" || obj == "Param"){
        	text = $(this).html();
        	if(obj == "Param"){
        		car = 0;
        	}
        }else{
        	brand = 1;
        }

        $("#pid").val(0);
		$("#c"+obj)
			.attr("data-id", id)
			.html(text + "<span class=\"caret\"></span>");

		if(brand){
			//初始化车系信息
			$("#cCar")
				.attr("data-id", 0)
				.html('请选择车系<span class="caret"></span>');

			$("#cParam")
				.attr("data-id", 0)
				.html('请选择车型<span class="caret"></span>');

			//获取车系
            var t = $("#cCar"), type = "Car";
            $("#Mast_"+type).remove();
            getCars(t, type);
            $("#cCar").click();
		}else{
			if(car){
				//初始化车系信息
				$("#cParam")
					.attr("data-id", 0)
					.html('请选择车型<span class="caret"></span>');

				var t = $("#cParam"), type = "Param";
				getParam(t, type);
			}else{
				$("#pid").val(id);
				$("#Mast_Param").hide();
				return false;
			}
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		if ($(".zcfcbox").html() != undefined) {
			if (!jQuery.contains($(".btn").get(0), s)) {
				if (jQuery.inArray(s, $(".btn")) < 0) {
					$(".zcfcbox").hide();
				}
			}
		}
	});

	//初始加载
	if($("#dopost").val() == "edit"){
		getCars($("#cCar"), "Car");
		getParam($("#cParam"), "Param");
	}

	//评分
	var star_text= { 
        rating:         {r0:{text:'请选择评分'    },r1:{text:'非常差'  },r2:{text:'差'      },r3:{text:'一般'    },r4:{text:'满意'    },r5:{text:'非常满意'}},
        waiguanrating:  {r0:{text:'请给外观打分'  },r1:{text:'惨不忍睹'},r2:{text:'毫无亮点'},r3:{text:'中庸平和'},r4:{text:'眼前一亮'},r5:{text:'倾国倾城'}},
        neishirating:   {r0:{text:'请给内饰打分'  },r1:{text:'难以忍受'},r2:{text:'廉价十足'},r3:{text:'朴实无华'},r4:{text:'精致舒适'},r5:{text:'豪华高档'}},
        kongjianrating: {r0:{text:'请给空间打分'  },r1:{text:'难以立臀'},r2:{text:'略显拥挤'},r3:{text:'恰到好处'},r4:{text:'绰绰有余'},r5:{text:'宽敞通透'}},
        donglirating:   {r0:{text:'请给动力打分'  },r1:{text:'柔弱无力'},r2:{text:'力不从心'},r3:{text:'满足家用'},r4:{text:'冲劲十足'},r5:{text:'澎湃强劲'}},
        caokongrating:  {r0:{text:'请给操控打分'  },r1:{text:'指向模糊'},r2:{text:'指向不明'},r3:{text:'指向明确'},r4:{text:'指向精准'},r5:{text:'人车合一'}},
        peizhirating:   {r0:{text:'请给配置打分'  },r1:{text:'要啥没啥'},r2:{text:'少的可怜'},r3:{text:'标准配置'},r4:{text:'配置丰富'},r5:{text:'丰富易用'}},
        shushirating:   {r0:{text:'请给舒适度打分'},r1:{text:'将就乘坐'},r2:{text:'一切刚好'},r3:{text:'惬意感觉'},r4:{text:'尊贵体验'},r5:{text:'奢华享受'}},
        xingjiabirating:{r0:{text:'请给性价比打分'},r1:{text:'真想退货'},r2:{text:'不值此价'},r3:{text:'马马虎虎'},r4:{text:'物有所值'},r5:{text:'物超所值'}}
    };
    $('.pingfen').mousemove(function (e) {
        var sender = $(this);
        var name= sender.attr('data-sync');
        var data_rating = $('input[name="'+name+'"]');
        var width = sender.width();
        var left = sender.offset().left;
        var percent = (e.pageX - left) / width * 100;
        var stars = Math.ceil((percent > 100 ? 100 : percent) / 100 * 5);
        sender.find('.pingfen_selected').css({ width: stars * 20 + '%' });
        var starcfg = star_text && star_text[name] && star_text[name]['r' + stars] ? star_text[name]['r' + stars] : null;
        if (starcfg) {
            sender.next('.pingfen_tip')
            	.text(starcfg.text)
            	.removeClass('text-error');
        }else{
        	sender.next('.pingfen_tip').addClass('text-error');
        }
    }).click(function(e){
        e.preventDefault();
        var sender = $(this);
        var name= sender.attr('data-sync');
        var data_rating = $('input[name="'+ name+'"]');
        var width = sender.width();
        var left = sender.offset().left;
        var percent = (e.pageX - left) / width * 100;
        var stars = Math.ceil((percent > 100 ? 100 : percent) / 100 * 5);
        if(data_rating.length) data_rating.val(parseInt(stars));
        var starcfg = star_text && star_text[name] && star_text[name]['r' + stars] ? star_text[name]['r' + stars] : null;
        sender.next('.pingfen_tip')
        	.text(starcfg ? starcfg.text : sender.attr('title'))
        	.removeClass('text-error');
    }).mouseleave(function(e){
        e.preventDefault();
        var sender = $(this);
        var name= sender.attr('data-sync');
        var data_rating = $('input[name="'+ name+'"]');
        var width = sender.width();
        var val= data_rating.val();
        var stars = (val && val.length ? val : 0);
        var starcfg = star_text && star_text[name] && star_text[name]['r' + stars] ? star_text[name]['r' + stars] : null;
        sender.find('.pingfen_selected').css({ width: val * 10 * 2 + '%' });
        sender.next('.pingfen_tip')
        	.text(starcfg.text)
        	.removeClass('text-error');
    });


	//填充图集
	if(imglist != ""){
		var picList = [];
		for(var i = 0; i < imglist.length; i++){
			picList.push('<li class="clearfix" id="SWFUpload_1_0'+i+'">');
			picList.push('  <a class="li-rm" href="javascript:;">×</a>');
			picList.push('  <div class="li-thumb" style="display:block;">');
			picList.push('    <div class="r-progress"><s></s></div>');
			picList.push('    <span class="ibtn">');
			picList.push('      <a href="javascript:;" class="Lrotate" title="逆时针旋转90度"></a>');
			picList.push('      <a href="javascript:;" class="Rrotate" title="顺时针旋转90度"></a>');
			picList.push('      <a href="'+cfg_attachment+imglist[i]+'&type=large" target="_blank" class="enlarge" title="放大"></a>');
			picList.push('    </span>');
			picList.push('    <span class="ibg"></span>');
			picList.push('    <img data-val="'+imglist[i]+'" src="'+cfg_attachment+imglist[i]+'&type=small" />');
			picList.push('  </div>');
			picList.push('</li>');
		}
		$("#listSection").html(picList.join(""));
		$("#deleteAllAtlas").show();
	}
	
	//单张删除图集
	$("#listSection").delegate(".li-rm","click", function(){
		var t = $(this), img = t.siblings(".li-thumb").find("img").attr("data-val");
		delAtlasImg(t.parent().attr("id"), img);
	});
	
	//删除所有图集
	$("#deleteAllAtlas").bind("click", function(){
		var li = $("#listSection li"), picList = [];
		for(var i = 0; i < li.length; i++){
			picList.push($("#listSection li:eq("+i+")").find("img").attr("data-val"));
		}
		delAtlasImg("", picList.join(","));
		$("#deleteAllAtlas").hide();
		$("#listSection").html("");
	});

	//swfupload s
	var picList;	
	//上传图集
	picList = function() {
		new SWFUpload({
			upload_url: "/include/upload.inc.php?mod="+modelType+"&type=atlas&filetype=image",
			file_post_name: "Filedata",
			file_size_limit: atlasSize,
			file_types: atlasType,
			file_types_description: "图片文件",
			file_upload_limit: 0,
			file_queue_limit: 0,
			swfupload_preload_handler: preLoad,
			swfupload_load_failed_handler: loadFailed,
			file_queued_handler: fileQueuedList_,
			file_queue_error_handler: fileQueueErrorList,
			file_dialog_complete_handler: fileDialogCompleteList,
			upload_start_handler: uploadStart,
			upload_progress_handler: uploadProgressList,
			upload_error_handler: uploadError,
			upload_success_handler: uploadSuccessList,
			upload_complete_handler: uploadComplete,
			//button_image_url: "/static/images/ui/swfupload/uploadbutton.png",
			button_placeholder_id: "flasHolder",
			flash_url : adminPath+"../static/js/swfupload/swfupload.swf",
			flash9_url: adminPath+"../static/js/swfupload/swfupload_fp9.swf",
			button_width: 100,
			button_height: 25,
			button_cursor: SWFUpload.CURSOR.HAND,
			button_window_mode: "transparent",
			debug: false
		});
	};
	picList();
	
	//组合图集html
	function fileQueuedList_(file) {
		var listSection = $("#listSection"), t = this;
		
		var pli = $('<li class="clearfix" id="'+file.id+'"></li>'),
			lir = $('<a class="li-rm" href="javascript:;">&times;</a>'),
			lin = $('<span class="li-name">'+file.name+'</span>'),
			lip = $('<span class="li-progress"><s></s></span>'),
			lit = $('<div class="li-thumb"><div class="r-progress"><s></s></div><span class="ibtn"><a href="javascript:;" class="Lrotate" title="逆时针旋转90度"></a><a href="javascript:;" class="Rrotate" title="顺时针旋转90度"></a><a href="javascript:;" target="_blank" class="enlarge" title="放大"></a></span><span class="ibg"></span><img></div>');
		
		//关闭
		lir.bind("click", function(){
			t.cancelUpload(file.id, false);
			
			$("#"+file.id).remove();
			var stats = t.getStats();
			stats.successful_uploads--;
			t.setStats(stats);
		});
		
		pli.append(lir);
		pli.append(lin);
		pli.append(lip);
		pli.append(lit);
		
		listSection.append(pli);
	}
	
	//旋转图集文件
	var rotateAtlasPic = function(direction, img, c) {
			var g = {
				mod: modelType,
				type: "rotateAtlas",
				direction: direction,
				picpath: img,
				randoms: Math.random()
			};
			$.ajax({
				type: "POST",
				cache: false,
				async: false,
				url: "/include/upload.inc.php",
				dataType: "json",
				data: $.param(g),
				success: function(a) {
					try {
						c(a)
					} catch(b) {}
				}
			});
		}
	
	//逆时针旋转
	$("#listSection").delegate(".Lrotate", "click", function(){
		var t = $(this), img = t.parent().siblings("img").attr("data-val");
		rotateAtlasPic("left", img, function(data){
			if(data.state == "SUCCESS"){
				t.parent().siblings("img").attr("src", cfg_attachment+img+"&type=small&v="+Math.random());
			}else{
				$.dialog.alert(data.info);
			}
		});
	});
	
	//顺时针旋转
	$("#listSection").delegate(".Rrotate", "click", function(){
		var t = $(this), img = t.parent().siblings("img").attr("data-val");
		rotateAtlasPic("right", img, function(data){
			if(data.state == "SUCCESS"){
				t.parent().siblings("img").attr("src", cfg_attachment+img+"&type=small&v="+Math.random());
			}else{
				$.dialog.alert(data.info);
			}
		});
	});
	
	//图集排序
	$(".list-holder ul").dragsort({ dragSelector: "li", placeHolderTemplate: '<li class="holder"></li>' });	
	
	//选择年月
	var year = $("#year").attr("data-val"), month = $("#month").attr("data-val");
	var yearHtml = [], monthHtml = [];
	var y = new Date().getFullYear();
	yearHtml.push('<option value="0">请选择</option>');
	monthHtml.push('<option value="0">请选择</option>');
	for(var i = 0; i < 10; i++){
		var selected = "";
		if(y == year) selected = "selected='selected'";
		yearHtml.push('<option value="'+y+'"'+selected+'>'+y+'</option>');
		y = y - 1;
	}
	$("#year").html(yearHtml.join(""));
	for (var i = 1; i < 13; i++) {
		var selected = "";
		if(i == month) selected = "selected='selected'";
		monthHtml.push('<option value="'+i+'"'+selected+'>'+i+'</option>');
	};
	$("#month").html(monthHtml.join(""));

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});
	
	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});
	
	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});
	
	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t               = $(this),
			id              = $("#id").val(),
			uid             = $("#uid").val(),
			user            = $("#user").val(),
			pid             = $("#pid").val(),
			title           = $("#title"),
			rating          = $("#rating").val(),
			waiguan         = $("#waiguan"),
			waiguanrating   = $("#waiguanrating").val(),
			neishi          = $("#neishi"),
			neishirating    = $("#neishirating").val(),
			kongjian        = $("#kongjian"),
			kongjianrating  = $("#kongjianrating").val(),
			dongli          = $("#dongli"),
			donglirating    = $("#donglirating").val(),
			caokong         = $("#caokong"),
			caokongrating   = $("#caokongrating").val(),
			peizhi          = $("#peizhi"),
			peizhirating    = $("#peizhirating").val(),
			shushi          = $("#shushi"),
			shushirating    = $("#shushirating").val(),
			xingjiabi       = $("#xingjiabi"),
			xingjiabirating = $("#xingjiabirating").val(),
			fuel            = $("#fuel");

		ue.sync();

		//会员名
		if(uid == "" || uid == 0 || user == ""){
			$("#user").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			tj = false;
			huoniao.goTop();
			return false;
		}
				
		if(pid == "" || pid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择车型！");
			return false;
		}

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		}

		if(rating == "" || rating == 0){
			var obj = $(".pingfen[data-sync=\"rating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(ue.getContent() == ""){
			huoniao.goTop();
			$.dialog.alert("请填写综合点评！");
			return false;
		}		
		
		//实拍照片
		var picList = [];
		var picli = $("#listSection li");
		if(picli.length > 0){
			for(var i = 0; i < picli.length; i++){
				var imgval = $("#listSection li:eq("+i+")").find(".li-thumb img").attr("data-val");
				picList.push(imgval);
			}
		}

		if(!huoniao.regex(waiguan)){
			huoniao.goInput(waiguan);
			return false;
		}

		if(waiguanrating == "" || waiguanrating == 0){
			var obj = $(".pingfen[data-sync=\"waiguanrating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(neishi)){
			huoniao.goInput(neishi);
			return false;
		}

		if(neishirating == "" || neishirating == 0){
			var obj = $(".pingfen[data-sync=\"neishirating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(kongjian)){
			huoniao.goInput(kongjian);
			return false;
		}

		if(kongjianrating == "" || kongjianrating == 0){
			var obj = $(".pingfen[data-sync=\"kongjianrating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(dongli)){
			huoniao.goInput(dongli);
			return false;
		}

		if(donglirating == "" || donglirating == 0){
			var obj = $(".pingfen[data-sync=\"donglirating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(caokong)){
			huoniao.goInput(caokong);
			return false;
		}

		if(caokongrating == "" || caokongrating == 0){
			var obj = $(".pingfen[data-sync=\"caokongrating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(peizhi)){
			huoniao.goInput(peizhi);
			return false;
		}

		if(peizhirating == "" || peizhirating == 0){
			var obj = $(".pingfen[data-sync=\"peizhirating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(shushi)){
			huoniao.goInput(shushi);
			return false;
		}

		if(shushirating == "" || shushirating == 0){
			var obj = $(".pingfen[data-sync=\"shushirating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(xingjiabi)){
			huoniao.goInput(xingjiabi);
			return false;
		}

		if(xingjiabirating == "" || xingjiabirating == 0){
			var obj = $(".pingfen[data-sync=\"xingjiabirating\"]");
			huoniao.goInput(obj);
			obj.next(".pingfen_tip").addClass("text-error");
			return false;
		}

		if(!huoniao.regex(fuel)){
			huoniao.goInput(fuel);
			return false;
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carKoubei.php", $("#editform").serialize() + "&pics="+picList.join(",")+"&submit="+encodeURI("提交"), function(data){
			ue.execCommand('cleardoc');
			if(data.state == 100){
				if($("#dopost").val() == "Add"){
					$.dialog({
						fixed: true,
						title: "添加成功",
						icon: 'success.png',
						content: "添加成功！",
						ok: function(){
							huoniao.goTop();
							window.location.reload();
						},
						cancel: false
					});
					
				}else{
					$.dialog({
						fixed: true,
						title: "修改成功",
						icon: 'success.png',
						content: "修改成功！",
						ok: function(){
							try{
								$("body",parent.document).find("#nav-carKoubeiphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carKoubeiphp"));
								$("body",parent.document).find("#nav-carKoubeiEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carKoubei.php";
							}
						},
						cancel: false
					});
				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		});
	});
	
});


//获取品牌
function getBrand(t){
	huoniao.operaJson("carParam.php", "dopost=getBrand", function(data){
		if(data){
			var top = t.offset().top + t.height() + 11, left = t.offset().left, type = t.attr("data-type")
			var str = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\" style=\"display:block; top:"+top+"; left:"+left+"\">";
            var strChar = "<div class=\"pinpzm\">";
            var strBrand = " <div class=\"pinp_rit\"><div class=\"pinp_main\">";
            var Chr = "";
            var bid = $("#cBrand").attr("data-id");
            for (var i = 0, len = data.length; i < len; i++) {
                var letter = data[i].letter;
                var on = "";
                if (Chr != letter) {
                    if (Chr == "") {
                        strChar += "<div class=\"on\"><a href=\"javascript:;\">" + letter + "</a></div>";
                        strBrand += "<div class=\"pinp_main_zm\" id=\"Mast_" + type + letter + "\">";
                    } else {
                        strChar += "<div><a href=\"javascript:;\">" + letter + "</a></div>";
                        strBrand += "</div><div class=\"pinp_main_zm\" id=\"Mast_" + type + letter + "\">";
                    }
                }
                if(bid != 0 && data[i].id == bid){
                	on = " class='on'";
                }
                strBrand += "<p><a href=\"javascript:;\" data=\"" + data[i].id + "\""+on+">" + letter + " " + data[i].typename + "</a></p>";
                Chr = letter;
            }
            strChar += "</div>"
            strBrand += "</div></div></div>";
            str += strChar + strBrand + "</div>";

            t.after(str);
		}
	});
}

//获取车系
function getCars(t, type){
	huoniao.operaJson("carParam.php", "dopost=getCars&brand="+$("#cBrand").attr("data-id"), function(data){
		if(data){
			var strSerial = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\"><div class=\"cxtit\">" + $("#cBrand").text() + "</div><div class=\"pinp_main\" style=\"height:auto;\">";
            var len = data.length;
            var groupName = "";
            var cid = $("#cCar").attr("data-id");
            for (var i = 0; i < len; i++) {
            	var on = "";
                if(data[i].GroupName != null){
                if (groupName != data[i].GroupName) {
                    if (groupName == "") {
                        strSerial += "<div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    } else {
                        strSerial += "</div><div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    }
                }
              }else{
              	if (groupName != null) {
                    strSerial += "<div class=\"pinp_main_zm\">";
                }
              }
                if(cid != 0 && data[i].Value == cid){
                	on = " class='on'";
                }
                strSerial += "<p><a href=\"javascript:;\" data=\"" + data[i].Value + "\""+on+">" + data[i].Text + "</a></p>";
                groupName = data[i].GroupName;
            }

            strSerial += "</div></div></div>";

            t.after(strSerial);

            //$("#cCar").click();
		}
	});
}

//获取车型
function getParam(t, type){
	huoniao.operaJson("carParam.php", "dopost=getParam&cid="+$("#cCar").attr("data-id"), function(data){
		if(data){
			var strSerial = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\"><div class=\"cxtit\">" + $("#cCar").text() + "</div><div class=\"pinp_main\" style=\"height:auto;\">";
            var len = data.length;
            var groupName = "";
            var pid = $("#cParam").attr("data-id");
            for (var i = 0; i < len; i++) {
            	var on = "";
                if (groupName != data[i].GroupName) {
                    if (groupName == "") {
                        strSerial += "<div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    } else {
                        strSerial += "</div><div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    }
                }
                if(pid != 0 && data[i].Value == pid){
                	on = " class='on'";
                }
                strSerial += "<p><a href=\"javascript:;\" data=\"" + data[i].Value + "\""+on+">" + data[i].Text + "</a></p>";
                groupName = data[i].GroupName;
            }

            strSerial += "</div></div></div>";

            t.after(strSerial);

            //$("#cCar").click();
		}
	});
}

//判断是否显示年款及颜色
function getYearColor(){
	var carid = $("#cCar").attr("data-id"), type = $("#type").val();
	if(carid != 0 && type < 4 && type > 0){
		//获取年款
		huoniao.operaJson("carParam.php", "dopost=getYear&carid="+carid, function(data){
			if(data){
				var str = [];
				for(var i = 0; i < data.length; i++){
					var year = $("#year").val(), on = "", text = data[i];
					if($.trim(year) != ""){
						if(year == text){
							on = " class='on'";
						}else{
							on = "";
						}
					}
					str.push('<li'+on+'><a href="javascript:;">'+text+'款<em></em></a></li>');
				}
				$("#divYear").html(str.join(""));
				$("#yearObj").show();
			}
		});

		//获取颜色
		huoniao.operaJson("carParam.php", "dopost=getColor&carid="+carid, function(data){
			if(data){
				var str = [];
				for(var i = 0; i < data.length; i++){
					var color = $("#color").val(), on = "", text = data[i].text;
					if($.trim(color) != ""){
						if(data[i].color == "#"+color){
							on = " class='on'";
						}else{
							on = "";
						}
					}
					str.push('<li'+on+' data-color="'+data[i].color+'"><a href="javascript:;"><img src="'+cfg_attachment+data[i].pic+'&type=middle" />'+text+'<em></em></a></li>');
				}
				$("#divColor").html(str.join(""));
				$("#colorObj").show();
			}
		});
	}else{
		$("#year, #color").val("");
		$("#yearObj, #colorObj").hide();
	}
}