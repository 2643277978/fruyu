$(function(){
	
	var defaultBtn = $("#delBtn"),
		init = {
		
			//选中样式切换
			funTrStyle: function(){
				var trLength = $("#list tbody tr").length, checkLength = $("#list tbody tr.selected").length;
				if(trLength == checkLength){
					$("#selectBtn .check").removeClass("checked").addClass("checked");
				}else{
					$("#selectBtn .check").removeClass("checked");
				}
				
				if(checkLength > 0){
					defaultBtn.css('display', 'inline-block');
				}else{
					defaultBtn.hide();
				}
			}

			//树形递归分类
			,treeTypeList: function(){
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
			
			//删除
			,del: function(){
				var checked = $("#list tbody tr.selected");
				if(checked.length < 1){
					huoniao.showTip("warning", "未选中任何信息！", "auto");
				}else{
					huoniao.showTip("loading", "正在操作，请稍候...");
					var id = [];
					for(var i = 0; i < checked.length; i++){
						id.push($("#list tbody tr.selected:eq("+i+")").attr("data-id"));
					}
					
					huoniao.operaJson("carDealerNews.php?dopost=del", "id="+id, function(data){
						if(data.state == 100){
							huoniao.showTip("success", data.info, "auto");
							$("#selectBtn a:eq(1)").click();
							setTimeout(function() { 
								getList();
							}, 800);
						}else{
							var info = [];
							for(var i = 0; i < $("#list tbody tr").length; i++){
								var tr = $("#list tbody tr:eq("+i+")");
								for(var k = 0; k < data.info.length; k++){
									if(data.info[k] == tr.attr("data-id")){
										info.push("▪ "+tr.find("td:eq(1) a").text());
									}
								}
							}
							$.dialog.alert("<div class='errInfo'><strong>以下信息删除失败：</strong><br />" + info.join("<br />") + '</div>', function(){
								getList();
							});
						}
					});
					$("#selectBtn a:eq(1)").click();
				}
			}
			
		};

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

	//初始加载
	getList();
	
	//搜索
	$("#searchBtn").bind("click", function(){
		$("#sKeyword").html($("#keyword").val());
		$("#sAid").html($("#cOffer").attr("data-id"));
		$("#list").attr("data-atpage", 1);
		getList();
	});
		
	//新增信息
	$("#addNew").bind("click", function(e){
		var href = $(this).attr("href");
		try {
			e.preventDefault();
			parent.addPage("carDealerNewsAdd", "car", "添加公司新闻", "car/"+href);
		} catch(e) {}
	});
	
	$("#pageBtn, #paginationBtn").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).html(), obj = $(this).parent().parent().parent();
		obj.attr("data-id", id);
		if(obj.attr("id") == "paginationBtn"){
			var totalPage = $("#list").attr("data-totalpage");
			$("#list").attr("data-atpage", id);
			obj.find("button").html(id+"/"+totalPage+'页<span class="caret"></span>');
			$("#list").attr("data-atpage", id);
		}else{
			if(obj.attr("id") != "propertyBtn"){
				obj.find("button").html(title+'<span class="caret"></span>');
			}
			$("#list").attr("data-atpage", 1);
		}
		getList();
	});

	//下拉菜单过长设置滚动条
	$(".dropdown-toggle").bind("click", function(){
		if($(this).parent().attr("id") != "typeBtn"){
			var height = document.documentElement.clientHeight - $(this).offset().top - $(this).height() - 30;
			$(this).next(".dropdown-menu").css({"max-height": height, "overflow-y": "auto"});
		}
	});
	
	//全选、不选
	$("#selectBtn a").bind("click", function(){
		var id = $(this).attr("data-id");
		if(id == 1){
			$("#selectBtn .check").addClass("checked");
			$("#list tr").removeClass("selected").addClass("selected");
			
			defaultBtn.css('display', 'inline-block');
			
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");
			
			defaultBtn.hide();
		}
	});
	
	//修改
	$("#list").delegate(".edit", "click", function(e){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");
			
		try {
			e.preventDefault();
			parent.addPage("carDealerNewsEdit"+id, "car", title, "car/"+href);
		} catch(e) {}
	});
	
	//删除
	$("#delBtn").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});
	
	//单条删除
	$("#list").delegate(".del", "click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});
	
	//单选
	$("#list tbody").delegate("tr", "click", function(e){
		var isCheck = $(this), checkLength = $("#list tbody tr.selected").length;
		if(e.target.className.indexOf("check") > -1) {
			if(isCheck.hasClass("selected")){
				isCheck.removeClass("selected");
			}else{
				isCheck.addClass("selected");
			}
		}else if(e.target.className.indexOf("edit") > -1 || e.target.className.indexOf("del") > -1) {
			$("#list tr").removeClass("selected");
			isCheck.addClass("selected");
		}else{
			if(checkLength > 1){
				$("#list tr").removeClass("selected");
				isCheck.addClass("selected");
			}else{
				if(isCheck.hasClass("selected")){
					isCheck.removeClass("selected");
				}else{
					$("#list tr").removeClass("selected");
					isCheck.addClass("selected");
				}
			}
		}
		
		init.funTrStyle();
	});
	
	//拖选功能
	$("#list tbody").selectable({
		distance: 3,
		cancel: '.check, a',
		start: function(){
			$("#smartMenu_state").remove();
		},
		stop: function() {
			init.funTrStyle();
		}
	});
	
});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候..."); 
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var sKeyword = encodeURIComponent($("#sKeyword").html()),
		sAid    = $("#sAid").html(),
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";
		
	var data = [];
		data.push("sKeyword="+sKeyword);
		data.push("aid="+sAid);
		data.push("pagestep="+pagestep);
		data.push("page="+page);
	
	huoniao.operaJson("carDealerNews.php?dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, carDealerNews = val.carDealerNews;
		obj.attr("data-totalpage", val.pageInfo.totalPage);

		$(".totalCount").html(val.pageInfo.totalCount);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();
			
			for(i; i < carDealerNews.length; i++){
				list.push('<tr data-id="'+carDealerNews[i].id+'">');
				list.push('  <td class="row3"><span class="check"></span></td>');
				list.push('  <td class="row40 left"><a href="/carDealerNews.php?id='+carDealerNews[i].id+'" target="_blank">'+carDealerNews[i].title+'</a></td>');
				list.push('  <td class="row20 left"><a href="/carParam.php?id='+carDealerNews[i].aid+'" target="_blank">'+carDealerNews[i].aName+'</a></td>');
				list.push('  <td class="row25 left">'+carDealerNews[i].pubdate+'</td>');
				list.push('  <td class="row12">');
				list.push('<a data-id="'+carDealerNews[i].id+'" data-title="修改公司新闻" href="carDealerNews.php?dopost=edit&id='+carDealerNews[i].id+'" title="修改" class="edit">修改</a>');
				list.push('<a href="javascript:;" title="删除" class="del">删除</a>');
				list.push('</td>');
				list.push('</tr>');
			}
			
			obj.find("tbody").html(list.join(""));
			$("#loading").hide();
			$("#list table").show();
			huoniao.showPageInfo();
		}else{
			
			obj.find("tbody").html("");
			huoniao.showTip("warning", val.info, "auto");
			$("#loading").html(val.info).show();
		}
	});
	
};