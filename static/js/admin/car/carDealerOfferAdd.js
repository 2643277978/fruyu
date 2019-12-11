var toolbar = [["bold","italic","underline","inserttable","redo","undo","preview"]];
//实例化编辑器
var maincycle = UE.getEditor('maincycle', {"term": toolbar});
var mainprice = UE.getEditor('mainprice', {"term": toolbar});

$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();

	//初始加载
	if(dopost == "edit"){
		getDealerBrand($("#aid").val());
		getCarsSingle($("#cCar"), "Car");
		getParam($("#cParam"), "Param");
		getColor();
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

							//清除已选车型、官方价、车身颜色
							$("#Mast_Brand, #Mast_Car, #Mast_Param").remove();

							$("#cBrand")
								.attr("data-id", 0)
								.html('请选择品牌<span class="caret"></span>');

							$("#cCar")
								.attr("data-id", 0)
								.html('请选择车系<span class="caret"></span>');

							$("#cParam")
								.attr("data-id", 0)
								.html('请选择车型<span class="caret"></span>');

							$("#guanfang").val("");
							$("#divColor").html('<span style="line-height:60px;">请先选择车型！</span>');

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
	$("#cBrand, #cCar, #cParam").bind("click", function(){
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
            getCarsSingle(t, type);
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
				$("#Mast_Param").hide();
				$("#cid").val($("#cCar").attr("data-id"));
				$("#pid").val($("#cParam").attr("data-id"));
				getColor();
				return false;
			}
		}

		$("#bid").val($("#cBrand").attr("data-id"));
		$("#cid").val($("#cCar").attr("data-id"));
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

	//选择车身颜色
	$("#divColor").delegate("li", "click", function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}else{
			$(this).addClass("on");
		}
		var text = [];
		$("#divColor").find(".on").each(function(){
			text.push($(this).text()+"||"+$(this).attr("data"));
		});
		$("#color").val(text.join(","));
	});

	//全选颜色
	$("#selectAllColor").bind("click", function(){
		if($("#divColor li").length > 0){
			$("#divColor li").addClass("on");
		}
		var text = [];
		$("#divColor").find(".on").each(function(){
			text.push($(this).text()+"||"+$(this).attr("data"));
		});
		$("#color").val(text.join(","));
	});

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
			bid      = $("#bid").val(),
			cid      = $("#cid").val(),
			pid      = $("#pid").val(),
			price    = $("#price").val(),
			color    = $("#color").val();

		maincycle.sync();
		mainprice.sync();

		if(aid == "" || aid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择经销商！");
			return false;
		}

		if(bid == "" || bid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择品牌！");
			return false;
		}

		if(cid == "" || cid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择车系！");
			return false;
		}

		if(pid == "" || pid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择车型！");
			return false;
		}

		if(price == ""){
			huoniao.goInput($("#price"));
			$.dialog.alert("请输入报价！");
			return false;
		}

		if(color == ""){
			huoniao.goTop();
			$.dialog.alert("请选择车身颜色！");
			return false;
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carDealerOffer.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			maincycle.execCommand('cleardoc');
			mainprice.execCommand('cleardoc');
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
								$("body",parent.document).find("#nav-carDealerOfferphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carDealerOfferphp"));
								$("body",parent.document).find("#nav-carDealerOfferEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carDealerOffer.php";
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
                if(pid != 0 && data[i].Value == pid){
                	on = " class='on'";
                }
                strSerial += "<p><a href=\"javascript:;\" data=\"" + data[i].Value + "\""+on+">" + data[i].Text + "</a></p>";
                groupName = data[i].GroupName;
            }

            strSerial += "</div></div></div>";

            t.after(strSerial);
		}
	});
}

//获取车身颜色
function getColor(){
	//官方价格
	huoniao.operaJson("carParam.php", "dopost=getParamPrice&pid="+$("#pid").val(), function(data){
		if(data){
			$("#guanfang").val(data);
		}
	});

	//车身颜色
	huoniao.operaJson("carParam.php", "dopost=getSubColor&cid="+$("#cCar").attr("data-id")+"&pid="+$("#pid").val(), function(data){
		if(data){
			var str = [];
			for(var i = 0; i < data.length; i++){
				var color = $("#color").val(), on = "", text = data[i].text, col = data[i].color;
				if($.trim(color) != ""){
					color = color.split(",");
					if($.inArray(text+"||"+col, color) > -1){
						on = " class='on'";
					}else{
						on = "";
					}
				}
				str.push('<li'+on+' data="'+col+'"><a href="javascript:;"><img src="'+cfg_attachment+data[i].pic+'&type=middle" />'+text+'<em></em></a></li>');
			}
			$("#divColor").html(str.join(""));
		}
	});

	//保养
	huoniao.operaJson("carBaoyang.php", "dopost=getMain&cid="+$("#cCar").attr("data-id")+"&pid="+$("#pid").val(), function(data){
		if(data){
			maincycle.execCommand('cleardoc');
			mainprice.execCommand('cleardoc');
			UE.getEditor('maincycle').execCommand('insertHtml', data.cycle);
			UE.getEditor('mainprice').execCommand('insertHtml', data.price);
		}
	});
}