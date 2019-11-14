//实例化编辑器
var content = UE.getEditor('content');

$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();

	//初始加载
	if(dopost == "edit"){
		getParamInfo();
		getDealerBrand($("#cOffer").attr("data-id"));
		getCarsSingle($("#cCar"), "Car");
	}

	var init = {
		//树形递归分类
		treeTypeList: function(){
			var typeList = [], cl = "";
			var l = addrListArr;
			for(var i = 0; i < l.length; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower;
					typeList.push('<a href="javascript:;" data="'+jsonArray["id"]+'">'+cl+"|--"+jsonArray["typename"]+'</a>');
					if(jArray != undefined){
						for(var k = 0; k < jArray.length; k++){
							cl += '    ';
							if(jArray[k]['lower'] != ""){
								arguments.callee(jArray[k]);
							}else{
								typeList.push('<a href="javascript:;" data="'+jArray[k]["id"]+'">'+cl+"|--"+jArray[k]["typename"]+'</a>');
							}
							if(jsonArray["lower"] == null){
								cl = "";
							}else{
								cl = cl.replace("    ", "");
							}
						}
					}
				})(l[i]);
			}
			return typeList.join("");
		}
	}

	//选择经销商
	$("#cOffer").bind("click", function(){
		huoniao.showTip("loading", "数据读取中，请稍候...");
		huoniao.operaJson("carParam.php?dopost=getBrand", "", function(data){
			huoniao.hideTip();
			if(data){
				
				var content = [], type = "Brand";

				//选择车系
				content.push('<div class="selectCarBrand-item"><h2>选择车系：</h2>');
				content.push('<div class="selectCarBrand-container clearfix">');

				var strChar = "<div class=\"pinpzm\">";
	            var strBrand = " <div class=\"pinp_rit\"><div class=\"pinp_main\" id=\"selectBrand\">";
	            var Chr = "";
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
	                strBrand += "<div class=\"pinp-zm-item\"><a href=\"javascript:;\" data=\"" + data[i].id + "\" data-name=\"" + data[i].typename + "\">" + letter + " " + data[i].typename + "</a></div>";
	                Chr = letter;
	            }
	            strChar += "</div>"
	            strBrand += "</div></div></div>";
	            str = strChar + strBrand + "</div>";

	            content.push(str);
				content.push('</div>');

				//选地区
				content.push('<div class="selectCarBrand-item" id="selectAddr" style="margin-left:30px;"><h2>选择地区：</h2><div class="selectCarBrand-container clearfix">');
				content.push('<div class="pinp_main"><div class="pinp_main_zm">'+init.treeTypeList()+'</div></div>');
				content.push('</div></div>');

				//选经销商
				content.push('<div class="selectCarBrand-item" id="selectOffer" style="width:230px; margin-left:30px;"><h2>选择经销商：</h2><div class="selectCarBrand-container clearfix">');
				content.push('<div class="pinp_main"><div class="pinp_main_zm"><center style="line-height:335px;">没有相关经销商！</center></div></div>');
				content.push('</div></div>');
				
				$.dialog({
					id: "selectCarBrand",
					fixed: false,
					title: "选择经销商",
					content: '<div class="selectCarBrand clearfix">'+content.join("")+'</div>',
					width: 800,
					okVal: "确定",
					ok: function(){
						
						//确定选择结果
						var obj = parent.$("#selectOffer .cur"),
							id = obj.attr("data-id"),
							text = obj.attr("data-title");
						if(id != undefined && text != undefined){
							$("#aid").val(id);
							$("#cOffer")
								.attr("data-id", id)
								.html(text+'<span class="caret"></span>');

							$("#chooseCars").html("");
							$("#cid, #pid").val("");

							$("#cBrand")
								.attr("data-id", 0)
								.html('请选择品牌<span class="caret"></span>');

							$("#cCar")
								.attr("data-id", 0)
								.html('请选择车系<span class="caret"></span>');

							//获取经销商主营品牌
							getDealerBrand(id);
						}else{
							alert("请选择经销商！");
							return false;
						}
						
					},
					cancelVal: "关闭",
					cancel: true
				});
				
				//字母检索
				parent.$(".pinpzm a").bind("click", function(){
					var t = parent.$(this);
					t.closest(".pinpzm").find(".on").removeClass("on");
			        t.parent().addClass("on");
				    t.closest(".selectCarBrand-container").find(".pinp_main").get(0).scrollTop = parent.$("#Mast_Brand" + t.html()).get(0).offsetTop - 51;
				});
				
				//获取车系
				parent.$("#selectBrand a").bind("click", function(){
					var t = $(this), id = t.attr("data"), name = t.attr("data-name"), ul = t.next("ul");
					if(ul.html() != undefined) {
						if(ul.is(":visible")){
							ul.hide();
						}else{
							ul.show();
						}
						return false;
					}

					huoniao.operaJson("carParam.php", "dopost=getSubCars&brand="+id, function(data){
						if(data){
							var strSerial = "<ul>";
				            var len = data.length;
				            var groupId = "";
				            for (var i = 0; i < len; i++) {
				                if (groupId != data[i].GroupId) {
				                    strSerial += "<li data='"+data[i].GroupId+"'>" + data[i].GroupName + "</li>";
				                }
				                groupId = data[i].GroupId;
				            }
				            strSerial += "</ul>";
				            if(len > 0){
					            t.after(strSerial);
					            ul.show();
					        }else{
					        	parent.$("#selectBrand a").removeClass("cur");
					        	parent.$("#selectBrand li").removeClass("cur");
					        	t.addClass("cur");
					        	getDealer();
					        }
						}
					});
				});

				//选择车系
				parent.$("#selectBrand").delegate("li", "click", function(){
					var t = parent.$(this).parent(), id = t.attr("data"), name = t.text();
					parent.$("#selectBrand a").removeClass("cur");
					parent.$("#selectBrand li").removeClass("cur");
					parent.$(this).addClass("cur");
					getDealer();
				});

				//选择地区
				parent.$("#selectAddr a").bind("click", function(){
					parent.$("#selectAddr a").removeClass("cur");
		        	$(this).addClass("cur");
		        	getDealer();
				});

				//获取经销商
				function getDealer(){
					var cid = parent.$("#selectBrand .cur").attr("data"),
						addr = parent.$("#selectAddr .cur").attr("data");

					cid = cid != undefined ? cid : 0;
					addr = addr != undefined ? addr : 0;
					
					parent.$("#selectOffer .pinp_main_zm").html('<center style="line-height:335px;">搜索中...</center>');
					huoniao.operaJson("carDealer.php", "dopost=getDealer&cid="+cid+"&addr="+addr, function(data){
						if(data){
							var dealer = [];
							for (var i = 0; i < data.length; i++) {
								dealer.push('<a href="javascript:;" data-id="'+data[i].id+'" data-title="'+data[i].subtitle+'" title="'+data[i].title+'"> '+(i+1)+'. '+data[i].subtitle+'</a>');
							};
							parent.$("#selectOffer .pinp_main_zm").html(dealer.join(""));
						}else{
							parent.$("#selectOffer .pinp_main_zm").html('<center style="line-height:335px;">没有相关经销商！</center>');
						}
					});
				}

				//选择经销商
				parent.$("#selectOffer").delegate("a", "click", function(){
					parent.$("#selectOffer a").removeClass("cur");
		        	$(this).addClass("cur");
				});

			}
		});
	});

	//选择品牌
	$("#cBrand, #cCar").bind("click", function(){
		var aid = $("#aid").val();
		if(aid == "" || aid == 0){
			$.dialog.alert("请先选择经销商！");
			return false;
		}

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

	//选择结果
	$("#carBtn").delegate(".pinp_main a", "click", function(e){
		$(this).closest(".pinp_main").find(".on").removeClass("on");
        $(this).addClass("on");

        var id = $(this).attr("data"), text = $(this).html(), brand = 0, car = 1, obj = $(this).closest(".zcfcbox").attr("id").replace("Mast_", "");

        //车系
        if(obj == "Car" || obj == "Param"){
        	text = $(this).html();
        	if(obj == "Param"){
        		car = 0;
        	}
        }else{
        	brand = 1;
        }

        $("#guanfang").val("");
		$("#divColor").html('<span style="line-height:60px;">请先选择车型！</span>');

        $("#cid").val(0);
		$("#c"+obj)
			.attr("data-id", id)
			.html(text + "<span class=\"caret\"></span>");

		$("#chooseCars").html("");
		$("#pid").val("");

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
            getCarsSingle(t, type);
            $("#cCar").click();
		}else{
			$("#cid").val(id);
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

	//选择活动车型
	$("#chooseCar").bind("click", function(){
		var aid = $("#aid").val();
		if(aid == "" || aid == 0){
			$.dialog.alert("请先选择经销商！");
			return false;
		}

		huoniao.showTip("loading", "数据读取中，请稍候...");
		huoniao.operaJson("carDealerOffer.php", "dopost=getParam&aid="+$("#aid").val()+"&cid="+$("#cid").val()+"&brand="+$("#cBrand").attr("data-id"), function(data){
			huoniao.hideTip();
			if(data){
				
				var content = [], type = "Brand";

				//选车型
				content.push('<div class="selectCarBrand-item" id="chooseCar" style="width:230px;"><h2>选择车型：</h2><div class="selectCarBrand-container clearfix">');
				content.push('<div class="pinp_main"><div class="pinp_main_zm">');

				//填充车型
				var dealer = [];
				for (var i = 0; i < data.length; i++) {
					dealer.push('<a href="javascript:;" data-id="'+data[i].id+'" title="'+data[i].title+'"> '+data[i].title+'<s class="icon-plus-sign"></s></a>');
				};
				content.push(dealer.join(""));

				content.push('</div></div></div></div>');

				

				//已选车型
				content.push('<div class="selectCarBrand-item" id="selectedCar" style="width:230px; margin-left:30px;"><h2>已选车型：</h2><div class="selectCarBrand-container clearfix">');
				content.push('<div class="pinp_main"><div class="pinp_main_zm"><center style="line-height:335px;">请选择车型！</center></div></div>');
				content.push('</div></div>');
				
				$.dialog({
					id: "chooseCars",
					fixed: false,
					title: "选择活动车型",
					content: '<div class="selectCarBrand clearfix">'+content.join("")+'</div>',
					width: 600,
					okVal: "确定",
					ok: function(){
						
						//确定选择结果
						var ids = parent.$("#selectedCar a");
						if(ids.length > 0){
							var id = [];
							for (var i = 0; i < ids.length; i++) {
								id[i] = parent.$("#selectedCar a:eq("+i+")").attr("data-id");
							};
							$("#pid").val(id.join(","));
							getParamInfo();
						}else{
							alert("请选择经销商！");
							return false;
						}
						
					},
					cancelVal: "关闭",
					cancel: true
				});

				//填充已选车型
				var CarsTr = $("#chooseCars tr");
				for(var i = 1; i < CarsTr.length; i++){
					var tr = $("#chooseCars tr:eq("+i+")"), title = tr.find("td:eq(0)").html().replace("&nbsp;&nbsp;", ""), id = tr.find("td:last").find("a").attr("data-id");
					if(parent.$("#selectedCar a").length <= 0){
						parent.$("#selectedCar .pinp_main_zm").empty();
					}
					parent.$("#selectedCar .pinp_main_zm").append('<a href="javascript:;" data-id="'+id+'" title="'+title+'">'+title+'<s class="icon-trash"></s></a>');
				};

				//选择车型
				parent.$("#chooseCar").delegate("a", "click", function(){
					var t = $(this), id = t.attr("data-id"), title = t.attr("title"), tj = true;
					parent.$("#selectedCar a").each(function(){
						var iid = $(this).attr("data-id");
						if(id == iid){
							tj = false;
						}
					});
					if(!tj) return false;
					if(parent.$("#selectedCar a").length <= 0){
						parent.$("#selectedCar .pinp_main_zm").empty();
					}
					parent.$("#selectedCar .pinp_main_zm").append('<a href="javascript:;" data-id="'+id+'" title="'+title+'">'+title+'<s class="icon-trash"></s></a>');
				});

				//删除已选车型
				parent.$("#selectedCar").delegate("a", "click", function(){
					$(this).remove();
				});

			}else{
				huoniao.showTip("error", "此经销商暂无车型报价！", "auto");
			}
		});
	});

	//删除已选车型
	$("#chooseCars").delegate(".delete", "click", function(){
		var cid = $("#pid").val(), id = $(this).attr("data-id");
		if(id){
			$(this).closest("tr").remove();
			cid = cid.split(",");
			cid.splice($.inArray(id, cid), 1);
			$("#pid").val(cid.join(","));

			if($("#pid").val() == ""){
				$("#chooseCars").empty();
			}
		}
	});

	//swfupload s
	var thumbnail;
	
	//上传缩略图
	thumbnail = function() {
		new SWFUpload({
			upload_url: "/include/upload.inc.php?mod="+modelType+"&type=thumb&filetype=image",
			file_post_name: "Filedata",
			file_size_limit: thumbSize,
			file_types: thumbType,
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
					type: "delThumb",
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
	thumbnail();

	//开始时间
	$("#start").datetimepicker({format: 'yyyy-mm-dd', minView: 3, autoclose: true, language: 'ch'});
	$("#end").datetimepicker({format: 'yyyy-mm-dd', minView: 3, autoclose: true, language: 'ch'});

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
		var t        = $(this),
			id       = $("#id").val(),
			aid      = $("#aid").val(),
			title    = $("#title"),
			litpic   = $("#litpic").val(),
			start    = $("#start").val(),
			end      = $("#end").val(),
			cid      = $("#cid").val(),
			pid      = $("#pid").val();

		content.sync();

		if(aid == "" || aid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择经销商！");
			return false;
		}

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		}

		if($.trim(litpic) == ""){
			huoniao.goInput($("#litpic"));
			$.dialog.alert("请上传缩略图！");
			return false;
		}

		if($.trim(start) == ""){
			huoniao.goTop();
			$.dialog.alert("请选择活动开始时间！");
			return false;
		}

		if($.trim(end) == ""){
			huoniao.goTop();
			$.dialog.alert("请选择活动结束时间！");
			return false;
		}

		if(cid == ""){
			huoniao.goTop();
			$.dialog.alert("请选择活动车系！");
			return false;
		}

		if(pid == ""){
			huoniao.goTop();
			$.dialog.alert("请选择活动车型！");
			return false;
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carDealerEvent.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			content.execCommand('cleardoc');
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
								$("body",parent.document).find("#nav-carDealerEventphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carDealerEventphp"));
								$("body",parent.document).find("#nav-carDealerEventEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carDealerEvent.php";
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

//获取经销商主营品牌
function getDealerBrand(id){
	huoniao.operaJson("carDealer.php", "dopost=getBrand&id="+id, function(data){
		if(data){
			var content = '<div class="zcfcbox" id="Mast_Brand"><div class="cxtit">选择品牌</div><div class="pinp_main" style="height:auto;"><div class="pinp_main_zm">';
			for (var i = 0; i < data.length; i++) {
				var on = "";
				if(data[i].id == $("#cBrand").attr("data-id")){
					on = ' class="on"';
				}
				content += '<p><a href="javascript:;" data="'+data[i].id+'"'+on+'>'+data[i].typename+'</a></p>';
			};
			content += '</div></div></div>';
			$("#cBrand").after(content);
		}
	});
}

//获取车系
function getCarsSingle(t, type){
	huoniao.operaJson("carParam.php", "dopost=getCarsSingle&brand="+$("#cBrand").attr("data-id"), function(data){
		if(data){
			var strSerial = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\"><div class=\"cxtit\">" + $("#cBrand").text() + "</div><div class=\"pinp_main\" style=\"height:auto;\"><div class=\"pinp_main_zm\">";
            var len = data.length;
            var cid = $("#cCar").attr("data-id");
            for (var i = 0; i < len; i++) {
            	var on = "";
                if(cid != 0 && data[i].id == cid){
                	on = " class='on'";
                }
                strSerial += "<p><a href=\"javascript:;\" data=\"" + data[i].id + "\""+on+">" + data[i].title + "</a></p>";
            }
            strSerial += "</div></div></div></div>";
            t.after(strSerial);
		}
	});
}


//获取车型详细信息
function getParamInfo(){
	var cid = $("#pid").val();
	huoniao.operaJson("carDealerOffer.php", "dopost=getParamInfo&aid="+$("#aid").val()+"&cid="+cid, function(data){
		if(data){
			var table = '<table class="speTab" width="750"><tbody><tr><th style="text-align:left">&nbsp;&nbsp;车型</th><th>指导价</th><th>优惠幅度</th><th>优惠价</th><th>库存情况</th><th>操作</th></tr>';
			for (var i = 0; i < data.length; i++) {
				table += '<tr>';
				table += '<td style="text-align:left">&nbsp;&nbsp;'+data[i].title+'</td>';
				table += '<td>'+data[i].guide+'万</td>';
				table += '<td class="text-success">↓ '+data[i].deal+'万</td>';
				table += '<td class="text-error">'+data[i].price+'万</td>';
				table += '<td>'+data[i].inventory+'</td>';
				table += '<td><a href="javascript:" data-id="'+data[i].id+'" class="delete" title="删除此车型"><s class="icon-trash"></s></a></td>';
				table += '</tr>';
			};
			table += '</tbody></table>';
			$("#chooseCars").html(table);
		}
	});
}