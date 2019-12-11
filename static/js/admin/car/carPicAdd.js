$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();

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
		//获取年款及颜色
		getYearColor();
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

	//选择年款
	$("#divYear").delegate("li", "click", function(){
		$(this).siblings("li").removeClass("on");
		$(this).addClass("on");
		var text = $(this).text().replace("款", "");
		$("#year").val(text);
	});

	//选择车身颜色
	$("#divColor").delegate("li", "click", function(){
		$(this).siblings("li").removeClass("on");
		$(this).addClass("on");
		var color = $(this).attr("data-color").replace("#", "");
		$("#color").val(color);
	});

	//初始加载
	if($("#dopost").val() == "edit"){
		getCars($("#cCar"), "Car");
		getParam($("#cParam"), "Param");
		getYearColor();
	}

	//分类切换
	$("#type").change(function(){
		//获取年款及颜色
		getYearColor();
	});
				
	//swfupload s
	var thumbnail, picList;
	
	//上传缩略图
	thumbnail = function() {
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
			file_queued_handler: fileQueuedThumb,
			file_queue_error_handler: fileQueueErrorThumb,
			file_dialog_complete_handler: fileDialogCompleteThumb,
			upload_start_handler: uploadStart,
			upload_progress_handler: uploadProgressThumb,
			upload_error_handler: uploadError,
			upload_success_handler: uploadSuccessThumb,
			upload_complete_handler: uploadComplete,
			button_action:SWFUpload.BUTTON_ACTION.SELECT_FILE,
			button_placeholder_id: "uploadBt",
			flash_url : adminPath+"../static/js/swfupload/swfupload.swf",
			flash9_url: adminPath+"../static/js/swfupload/swfupload_fp9.swf",
			button_width: 100,
			button_height: 25,
			button_cursor: SWFUpload.CURSOR.HAND,
			button_window_mode: "transparent",
			debug: false
		});
		
		var delThumbPic = function(b, d, c) {
				var g = {
					mod: modelType,
					type: "delAtlas",
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
            },
			e = $("#license"),
			j = $("#litpic"),
			k = $("#licenseFiles,#cancelUploadBt,#licenseProgress,#reupload"); 
		
		$("#reupload").click(function() {
			//删除已经上传的文件
			delThumbPic(j.val(), true, function(){
				k.eq(0).find("img").attr({
					style: "margin-top:10px; width:16px;",
					src: adminPath+"../static/images/ui/loading.gif"
				});
				j.val(""),
				e.attr("class", "uploadinp");
				k.hide();
			});
		});
		
	};

	if(dopost == "edit"){
		thumbnail();
	}
	
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
			upload_success_handler: uploadSuccessList_,
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

	if(dopost == "Add"){
		picList();
	}
	
	//组合图集html
	function fileQueuedList_(file) {
		var listSection = $("#listSection"), t = this;
		
		var pli = $('<li class="clearfix" id="'+file.id+'"></li>'),
			lim = $('<i class="li-move" href="javascript:;" title="拖动调整图片顺序">移动</i>'),
			lir = $('<a class="li-rm" href="javascript:;">&times;</a>'),
			lin = $('<span class="li-name">'+file.name+'</span>'),
			lip = $('<span class="li-progress"><s></s></span>'),
			lit = $('<div class="li-thumb"><div class="r-progress"><s></s></div><span class="ibtn"><a href="javascript:;" class="Lrotate" title="逆时针旋转90度"></a><a href="javascript:;" class="Rrotate" title="顺时针旋转90度"></a><a href="javascript:;" target="_blank" class="enlarge" title="放大"></a></span><span class="ibg"></span><img></div>'),
			lii = $('<div class="li-info"><input class="li-title" placeholder="请输入图片名称" style="width:225px;" value=""></div>');
		
		//关闭
		lir.bind("click", function(){
			t.cancelUpload(file.id, false);
			
			$("#"+file.id).remove();
			var stats = t.getStats();
			stats.successful_uploads--;
			t.setStats(stats);
		});
		
		pli.append(lim);
		pli.append(lir);
		pli.append(lin);
		pli.append(lip);
		pli.append(lit);
		pli.append(lii);
		
		listSection.append(pli);
	}

	//上传成功
	function uploadSuccessList_(file, serverData) {
		var b = eval('('+serverData+')');
		var pro = file.id;
		if(b.state == "SUCCESS"){
			$("#"+pro).find(".li-name").hide();
			$("#"+pro).find(".li-progress").hide();
			$("#"+pro).find(".li-move").show();
			$("#"+pro).find(".li-thumb").show();
			$("#"+pro).find(".li-thumb img").attr("data-val", b.url);
			$("#"+pro).find(".li-thumb img").attr("src", cfg_attachment+b.url+"&type=small");
			$("#"+pro).find(".li-thumb .enlarge").attr("href", cfg_attachment+b.url);
			$("#"+pro).find(".li-info").show();	
			
			$("#deleteAllAtlas").show();
			
			$("#"+pro).find(".li-rm").bind("click", function(){
				var t = $(this), img = t.siblings(".li-thumb").find("img").attr("data-val");
				delAtlasImg(pro, img);
			});
		}else{
			$.dialog.alert(b.state);
			$("#"+pro).remove();
		}
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
	
	//图集排序
	$(".list-holder ul").dragsort({ dragSelector: "li", placeHolderTemplate: '<li class="holder"></li>' });	
	
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
		var t      = $(this),
			id     = $("#id").val(),
			pid    = $("#pid").val(),
			type   = $("#type").val(),
			year   = $("#year").val(),
			color  = $("#color").val(),
			title  = $("#title"),
			litpic = $("#litpic").val();
				
		if(pid == "" || pid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择车型！");
			return false;
		}

		if(type == "" || type == 0){
			huoniao.goInput($("#type"));
			$("#typeList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			return false;
		}else{
			$("#typeList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		}

		if(type < 4 && type > 0){
			if(year == "" || year == 0){
				huoniao.goTop();
				$.dialog.alert("请选择年款！");
				return false;
			}
			if(color == "" || color == 0){
				huoniao.goTop();
				$.dialog.alert("请选择颜色！");
				return false;
			}
		}
		
		//图集
		var picList = [];
		if(dopost == "Add"){
			var picli = $("#listSection li");
			if(picli.length > 0){
				for(var i = 0; i < picli.length; i++){
					var imgval = $("#listSection li:eq("+i+")").find(".li-thumb img").attr("data-val"),
						imgtitle = $("#listSection li:eq("+i+")").find(".li-title").val();
					picList.push(imgval+"||"+imgtitle);
				}
			}
		}else if(dopost == "edit"){
			if(!huoniao.regex(title)){
				huoniao.goInput(title);
				return false;
			};

			if(litpic == ""){
				huoniao.goTop();
				$.dialog.alert("请上传图片！");
				return false;
			}
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carPic.php", $("#editform").serialize() + "&pics="+picList.join("###")+"&submit="+encodeURI("提交"), function(data){
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
								$("body",parent.document).find("#nav-carPicphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carPicphp"));
								$("body",parent.document).find("#nav-carPicEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carPic.php";
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