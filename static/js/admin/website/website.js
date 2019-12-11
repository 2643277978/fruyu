$(function(){

	var defaultBtn = $("#delBtn, #batchAudit"),
		checkedBtn = $("#stateBtn"),
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
					checkedBtn.hide();
				}else{
					defaultBtn.hide();
					checkedBtn.css('display', 'inline-block');
				}
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

					huoniao.operaJson("website.php?dopost=del", "id="+id, function(data){
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

			//更新信息状态
			,updateState: function(type){
				huoniao.showTip("loading", "正在操作，请稍候...");
				$("#smartMenu_state").remove();

				var checked = $("#list tbody tr.selected");
				if(checked.length < 1){
					huoniao.showTip("warning", "未选中任何信息！", "auto");
				}else{
					var state = "";
					if(type == "待审核"){
						state = 0;
					}else if(type == "已审核"){
						state = 1;
					}else if(type == "拒绝审核"){
						state = 2;
					}

					huoniao.showTip("loading", "正在操作，请稍候...");
					var id = [];
					for(var i = 0; i < checked.length; i++){
						id.push($("#list tbody tr.selected:eq("+i+")").attr("data-id"));
					}
					huoniao.operaJson("website.php?dopost=updateState", "id="+id+"&state="+state, function(data){
						if(data.state == 100){
							huoniao.showTip("success", data.info, "auto");
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
							$.dialog.alert("<div class='errInfo'><strong>以下信息修改失败：</strong><br />" + info.join("<br />") + '</div>', function(){
								getList();
							});
						}
					});
					$("#selectBtn a:eq(1)").click();
				}
			}

		};

    //填充分站列表
    huoniao.buildAdminList($("#cityList"), cityList, '请选择分站');
    $(".chosen-select").chosen(); //填充分站列表
    huoniao.buildAdminList($("#cityList"), cityList, '请选择分站');
    $(".chosen-select").chosen();

	//初始加载
	getList();

	//搜索
	$("#searchBtn").bind("click", function(){
		$("#sKeyword").html($("#keyword").val());
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

	//二级菜单点击事件
	$("#typeBtn a").bind("click", function(){
		var id = $(this).attr("data-id"), title = $(this).text();
		$("#typeBtn").attr("data-id", id);
		$("#typeBtn button").html(title+'<span class="caret"></span>');
	});

	$("#stateBtn, #pageBtn, #paginationBtn").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).html(), obj = $(this).parent().parent().parent();
		obj.attr("data-id", id);
		if(obj.attr("id") == "paginationBtn"){
			var totalPage = $("#list").attr("data-totalpage");
			$("#list").attr("data-atpage", id);
			obj.find("button").html(id+"/"+totalPage+'页<span class="caret"></span>');
			$("#list").attr("data-atpage", id);
		}else{

			$("#addrBtn")
				.attr("data-id", "")
				.find("button").html('全部地区<span class="caret"></span>');

			$("#sAddr").html("");

			if(obj.attr("id") != "propertyBtn"){
				obj.find("button").html(title+'<span class="caret"></span>');
			}
			$("#list").attr("data-atpage", 1);
		}
		getList();
	});

	//下拉菜单过长设置滚动条
	$(".dropdown-toggle").bind("click", function(){
		if($(this).parent().attr("id") != "typeBtn" && $(this).parent().attr("id") != "addrBtn"){
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
			checkedBtn.hide();
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");

			defaultBtn.hide();
			checkedBtn.css('display', 'inline-block');
		}
	});

	//修改
	$("#list").delegate(".modify", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");

		try {
			event.preventDefault();
			parent.addPage("websiteEdit"+id, "website", title, "website/"+href);
		} catch(e) {}
	});

	//删除
	$("#delBtn").bind("click", function(){
		$.dialog.confirm('确定后将删除此网站信息<br />此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});

	//单条删除
	$("#list").delegate(".delete", "click", function(){
		$.dialog.confirm('确定后将删除此网站信息<br />此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});

	//新闻中心
	$("#list").delegate(".news", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteArticle"+id, "website", title+"新闻中心", "website/websiteArticle.php?website="+id);
		} catch(e) {}
	});

	//活动中心
	$("#list").delegate(".events", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteEvents"+id, "website", title+"活动中心", "website/websiteEvents.php?website="+id);
		} catch(e) {}
	});

	//产品展示
	$("#list").delegate(".product", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteProduct"+id, "website", title+"产品展示", "website/websiteProduct.php?website="+id);
		} catch(e) {}
	});

	//成功案例
	$("#list").delegate(".case", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteCase"+id, "website", title+"成功案例", "website/websiteCase.php?website="+id);
		} catch(e) {}
	});

	//视频中心
	$("#list").delegate(".video", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteVideo"+id, "website", title+"视频中心", "website/websiteVideo.php?website="+id);
		} catch(e) {}
	});

	//全景展示
	$("#list").delegate(".360qj", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("website360qj"+id, "website", title+"全景展示", "website/website360qj.php?website="+id);
		} catch(e) {}
	});

	//网站留言
	$("#list").delegate(".guest", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteGuest"+id, "website", title+"网站留言", "website/websiteGuest.php?website="+id);
		} catch(e) {}
	});

	//企业荣誉
	$("#list").delegate(".honor", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteHonor"+id, "website", title+"企业荣誉", "website/websiteHonor.php?website="+id);
		} catch(e) {}
	});

	//企业动态
	$("#list").delegate(".event", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteEvent"+id, "website", title+"企业动态", "website/websiteEvent.php?website="+id);
		} catch(e) {}
	});

	//人才招聘
	$("#list").delegate(".job", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteJob"+id, "website", title+"人才招聘", "website/websiteJob.php?website="+id);
		} catch(e) {}
	});

	//其它配置
	$("#list").delegate(".videoQj", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title");

		try {
			event.preventDefault();
			parent.addPage("websiteVideoQj"+id, "website", title+"其它配置", "website/websiteVideoQj.php?website="+id);
		} catch(e) {}
	});

	//批量审核
	$("#batchAudit a").bind("click", function(){
		init.updateState($(this).text());
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
		}else if(event.target.className.indexOf("edit") > -1 || event.target.className.indexOf("del") > -1) {
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

	//审核状态更新
	$("#list").delegate(".more", "click", function(event){
		event.preventDefault();

		var t = $(this), top = t.offset().top - 5, left = t.offset().left + 15, obj = "smartMenu_state";
		if($("#"+obj).html() != undefined){
			$("#"+obj).remove();
		}

		t.parent().parent().removeClass("selected").addClass("selected");

		var htmlCreateStateMenu = function(){
			var htmlMenu = [];
			htmlMenu.push('<div id="'+obj+'" class="smart_menu_box">');
			htmlMenu.push('  <div class="smart_menu_body">');
			htmlMenu.push('    <ul class="smart_menu_ul">');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">待审核</a></li>');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">已审核</a></li>');
			htmlMenu.push('      <li class="smart_menu_li"><a href="javascript:" class="smart_menu_a">拒绝审核</a></li>');
			htmlMenu.push('    </ul>');
			htmlMenu.push('  </div>');
			htmlMenu.push('</div>');

			return htmlMenu.join("");
		}

		$("body").append(htmlCreateStateMenu());

		$("#"+obj).find("a").bind("click", function(event){
			event.preventDefault();
			init.updateState($(this).text());
		});

		$("#"+obj).css({
			top: top,
			left: left - $("#"+obj).width()/2
		}).show();

		return false;
	});

	$(document).click(function (e) {
		var s = e.target;
		if ($("#smartMenu_state").html() != undefined) {
			if (!jQuery.contains($("#smartMenu_state").get(0), s)) {
				if (jQuery.inArray(s, $(".smart_menu_body")) < 0) {
					$("#smartMenu_state").remove();
				}
			}
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
		state    = $("#stateBtn").attr("data-id") ? $("#stateBtn").attr("data-id") : "",
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";

	var data = [];
		data.push("sKeyword="+sKeyword);
    	data.push("adminCity="+$("#cityList").val());
		data.push("state="+state);
		data.push("pagestep="+pagestep);
		data.push("page="+page);

	huoniao.operaJson("website.php?dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, website = val.website;
		obj.attr("data-totalpage", val.pageInfo.totalPage);

		$(".totalCount").html(val.pageInfo.totalCount);
		$(".totalGray").html(val.pageInfo.totalGray);
		$(".totalAudit").html(val.pageInfo.totalAudit);
		$(".totalRefuse").html(val.pageInfo.totalRefuse);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();

			for(i; i < website.length; i++){
				list.push('<tr data-id="'+website[i].id+'">');
				list.push('  <td class="row3"><span class="check"></span></td>');
				list.push('  <td class="row30 left"><a href="'+website[i].url+'" target="_blank">'+website[i].title+'</a></td>');
				list.push('  <td class="row15 left"><a href="javascript:;" data-id="'+website[i].userid+'" class="userinfo">'+website[i].username+'</a></td>');
				list.push('  <td class="row5 left">'+website[i].weight+'</td>');
				list.push('  <td class="row15 left">'+website[i].pubdate+'</td>');
				var state = "";
				switch (website[i].state) {
					case "0":
						state = '<span class="gray">待审核</span>';
						break;
					case "1":
						state = '<span class="audit">已审核</span>';
						break;
					case "2":
						state = '<span class="refuse">审核拒绝</span>';
						break;
				}
				list.push('  <td class="row12 state">'+state+'<span class="more"><s></s></span></td>');
				list.push('  <td class="row20">');
				list.push('<a data-id="'+website[i].id+'" data-title="'+website[i].title+'" href="websiteAdd.php?dopost=edit&id='+website[i].id+'" title="修改" class="link modify">修改</a>&nbsp;|&nbsp;');
				list.push('<a href="websiteDesign.php?id='+website[i].projectid+'" target="websiteDesign" title="设计网站" class="link">设计</a>&nbsp;|&nbsp;');
				list.push('<a href="javascript:;" title="删除" class="link delete">删除</a>&nbsp;|&nbsp;');
				list.push('<span class="actions"><a href="javascript:;" title="更多操作" class="btn btn-link dropdown-toggle" data-toggle="dropdown">更多操作<span class="caret"></span></a>');
				list.push('<ul class="dropdown-menu">');
				list.push('<li><a href="javascript:;" class="news" data-id="'+website[i].id+'" data-title="'+website[i].title+'">新闻中心</a></li>');
				// list.push('<li><a href="javascript:;" class="events" data-id="'+website[i].id+'" data-title="'+website[i].title+'">活动中心</a></li>');
				list.push('<li><a href="javascript:;" class="product" data-id="'+website[i].id+'" data-title="'+website[i].title+'">产品展示</a></li>');
				// list.push('<li><a href="javascript:;" class="case" data-id="'+website[i].id+'" data-title="'+website[i].title+'">成功案例</a></li>');
				list.push('<li><a href="javascript:;" class="video" data-id="'+website[i].id+'" data-title="'+website[i].title+'">视频中心</a></li>');
				// list.push('<li><a href="javascript:;" class="360qj" data-id="'+website[i].id+'" data-title="'+website[i].title+'">全景展示</a></li>');
				list.push('<li><a href="javascript:;" class="guest" data-id="'+website[i].id+'" data-title="'+website[i].title+'">网站留言</a></li>');
				list.push('<li><a href="javascript:;" class="honor" data-id="'+website[i].id+'" data-title="'+website[i].title+'">企业荣誉</a></li>');
				// list.push('<li><a href="javascript:;" class="event" data-id="'+website[i].id+'" data-title="'+website[i].title+'">企业动态</a></li>');
				list.push('<li><a href="javascript:;" class="job" data-id="'+website[i].id+'" data-title="'+website[i].title+'">人才招聘</a></li>');
				list.push('<li><a href="javascript:;" class="videoQj" data-id="'+website[i].id+'" data-title="'+website[i].title+'">其它配置</a></li>');
				list.push('</ul></span>');
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
