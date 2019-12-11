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
					defaultBtn.show();
				}else{
					defaultBtn.hide();
				}
			}
			
			//菜单递归分类
			,selectTypeList: function(){
				var typeList = [], title = "全部分类";
				typeList.push('<ul class="dropdown-menu">');
				typeList.push('<li><a href="javascript:;" data-id="">'+title+'</a></li>');
				
				var l = typeListArr;
				for(var i = 0; i < l.length; i++){
					(function(){
						var jsonArray =arguments[0], jArray = jsonArray.lower, cl = "";
						if(jArray.length > 0){
							cl = ' class="dropdown-submenu"';
						}
						typeList.push('<li'+cl+'><a href="javascript:;" data-id="'+jsonArray["id"]+'">'+jsonArray["typename"]+'</a>');
						if(jArray.length > 0){
							typeList.push('<ul class="dropdown-menu">');
						}
						for(var k = 0; k < jArray.length; k++){
							if(jArray[k]['lower'] != ""){
								arguments.callee(jArray[k]);
							}else{
								typeList.push('<li><a href="javascript:;" data-id="'+jArray[k]["id"]+'">'+jArray[k]["typename"]+'</a></li>');
							}
						}
						if(jArray.length > 0){
							typeList.push('</ul></li>');
						}else{
							typeList.push('</li>');				
						}
					})(l[i]);
				}
				
				typeList.push('</ul>');
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
					
					huoniao.operaJson("carNews.php?dopost=del", "id="+id, function(data){
						if(data.state == 100){
							$("#selectBtn a:eq(1)").click();
							getList();
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

	//选择品牌
	$("#cBrand, #cCar").bind("click", function(){
		var t = $(this), top = t.offset().top + t.height() + 11, left = t.offset().left, 
			obj = t.attr("id"), type = t.attr("data-type"), id = t.attr("data-id");
		if(obj == "cCar" && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
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

        var text = $(this).html().substring(2), brand = 0;
        //车系
        if($(this).closest(".zcfcbox").attr("id") == "Mast_Car"){
        	text = $(this).html();
        }else{
        	brand = 1;
        }

		var id = $(this).attr("data"), obj = $(this).closest(".zcfcbox").attr("id").replace("Mast_", "");
		$("#sCid").html("");
		$("#c"+obj)
			.attr("data-id", id)
			.html(text + "<span class=\"caret\"></span>");

		if(brand){
			//初始化车系信息
			$("#cCar")
				.attr("data-id", 0)
				.html('请选择车系<span class="caret"></span>');
			$("#divColor").html("<span style=\"line-height:60px;\">请先选择车型！</span>");

			//获取车系
            var t = $("#cCar"), type = "Car";
            $("#Mast_"+type).remove();
            getCars(t, type);
            $("#cCar").click();
		}else{
			$("#sCid").html(id);
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
	
	//菜单递归分类
	$("#typeBtn").append(init.selectTypeList());
	
	//初始加载
	getList();
	
	//搜索
	$("#searchBtn").bind("click", function(){
		$("#sKeyword").html($("#keyword").val());
		$("#sType").html($("#typeBtn").attr("data-id"));
		$("#list").attr("data-atpage", 1);
		getList();
	});
	
	//搜索回车提交
    $("#keyword").keyup(function (e) {
        if (!e) {
            var e = window.event;
        }
        if (e.keyCode) {
            code = e.keyCode;
        }
        else if (e.which) {
            code = e.which;
        }
        if (code === 13) {
            $("#searchBtn").click();
        }
    });
	
	//新增信息
	$("#addNew").bind("click", function(event){
		event.preventDefault();
		var href = $(this).attr("href"), type = "car";
		try {
			event.preventDefault();
			parent.addPage("carNewsphpdopostAdd", type, "新增汽车资讯", "car/"+href);
		} catch(e) {}
	});
	
	//二级菜单点击事件
	$("#typeBtn a").bind("click", function(){
		var id = $(this).attr("data-id"), title = $(this).text();
		$("#typeBtn").attr("data-id", id);
		$("#typeBtn button").html(title+'<span class="caret"></span>');
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
			
			$("#typeBtn")
				.attr("data-id", "")
				.find("button").html('全部分类<span class="caret"></span>');
			
			$("#sType").html("");
			
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
			
			defaultBtn.show();
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");
			
			defaultBtn.hide();
		}
	});
	
	//修改
	$("#list").delegate(".edit", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("carNewsEdit"+id, "car", title, "car/"+href);
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
	$("#list tbody").delegate("tr", "click", function(event){
		var isCheck = $(this), checkLength = $("#list tbody tr.selected").length;
		if(event.target.className.indexOf("check") > -1) {
			if(isCheck.hasClass("selected")){
				isCheck.removeClass("selected");
			}else{
				isCheck.addClass("selected");
			}
		}else if(event.target.className.indexOf("edit") > -1 || event.target.className.indexOf("revert") > -1 || event.target.className.indexOf("del") > -1) {
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
			//$("#smartMenu_state").remove();
		},
		stop: function() {
			init.funTrStyle();
		}
	});
	
	//分类链接点击
	$("#list").delegate(".type", "click", function(event){
		event.preventDefault();
		var id = $(this).attr("data-id"), txt = $(this).text();
		
		$("#typeBtn")
			.attr("data-id", id)
			.find("button").html(txt+'<span class="caret"></span>');
		
		$("#sType").html(id);
		
		$("#list").attr("data-atpage", 1);
		getList();
		
		$("#selectBtn a:eq(1)").click();
	});
	
});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var sKeyword = encodeURIComponent($("#sKeyword").html()),
		sCid     = $("#sCid").html(),
		sType    = $("#sType").html(),
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";
		
	var data = [];
		data.push("sKeyword="+sKeyword);
		data.push("cid="+sCid);
		data.push("sType="+sType);
		data.push("pagestep="+pagestep);
		data.push("page="+page);
	
	huoniao.operaJson("carNews.php?dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, carNews = val.carNews;
		if(val.state == "100"){
			huoniao.hideTip();
			
			obj.attr("data-totalpage", val.pageInfo.totalPage);
			
			for(i; i < carNews.length; i++){
				list.push('<tr data-id="'+carNews[i].id+'">');
				list.push('  <td class="row3"><span class="check"></span></td>');
				list.push('  <td class="row15 left">'+carNews[i].cname+'</td>');
				list.push('  <td class="row25 left">'+carNews[i].title+'</td>');
				list.push('  <td class="row5">'+carNews[i].weight+'</td>');
				list.push('  <td class="row15"><a href="javascript:;" data-id="'+carNews[i].typeid+'" class="type">'+carNews[i].type+'</a></td>');
				list.push('  <td class="row15">'+carNews[i].date+'</td>');
				list.push('  <td class="row12">'+carNews[i].state+'</td>');
				list.push('  <td class="row10"><a data-id="'+carNews[i].id+'" data-title="'+carNews[i].title+'" href="carNews.php?dopost=Edit&id='+carNews[i].id+'" title="修改" class="edit">修改</a><a href="javascript:;" title="删除" class="del">删除</a></td>');
				list.push('</tr>');
			}
			
			obj.find("tbody").html(list.join(""));
			$("#loading").hide();
			$("#list table").show();
			huoniao.showPageInfo();
		}else{
			obj.attr("data-totalpage", "1");
			
			huoniao.showPageInfo();
			
			obj.find("tbody").html("");
			huoniao.showTip("warning", val.info, "auto");
			$("#loading").html(val.info).show();
		}
	});
	
};



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
            var cid = $("#cid").val();
            for (var i = 0; i < len; i++) {
            	var on = "";
                if (groupName != data[i].GroupName) {
                    if (groupName == "") {
                        strSerial += "<div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    } else {
                        strSerial += "</div><div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
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