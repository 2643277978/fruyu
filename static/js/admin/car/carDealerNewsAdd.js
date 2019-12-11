//实例化编辑器
var content = UE.getEditor('content');

$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();

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
	$("#btnSubmit").bind("click", function(e){
		e.preventDefault();
		var t        = $(this),
			id       = $("#id").val(),
			aid      = $("#aid").val(),
			title    = $("#title");

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
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carDealerNews.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
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
								$("body",parent.document).find("#nav-carDealerNewsphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carDealerNewsphp"));
								$("body",parent.document).find("#nav-carDealerNewsEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carDealerNews.php";
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