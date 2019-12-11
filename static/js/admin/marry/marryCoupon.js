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
					
					huoniao.operaJson("marryCoupon.php?action="+action+"&dopost=del&cid="+cid, "id="+id, function(data){
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
	
	//初始加载
	getList();
	
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
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");
			
			defaultBtn.hide();
		}
	});
	
	//新增优惠券
	$("#addNew").bind("click", function(){
		var href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("marryCouponAdd"+cid, "marry", "新增优惠券-"+cname, "marry/"+href);
		} catch(e) {}
	});
	
	//记录
	$("#list").delegate(".diary", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("marryCouponDiary"+id, "marry", title, "marry/"+href);
		} catch(e) {}
	});
	
	//修改
	$("#list").delegate(".modify", "click", function(event){
		var id = $(this).attr("data-id"),
			title = $(this).attr("data-title"),
			href = $(this).attr("href");
			
		try {
			event.preventDefault();
			parent.addPage("marryCouponEdit"+id, "marry", title, "marry/"+href);
		} catch(e) {}
	});
	
	//删除
	$("#delBtn").bind("click", function(){
		$.dialog.confirm('此操作不可恢复，您确定要删除吗？', function(){
			init.del();
		});
	});
	
	//单条删除
	$("#list").delegate(".delete", "click", function(){
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
	
});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";
		
	var data = [];
		data.push("pagestep="+pagestep);
		data.push("page="+page);
	
	huoniao.operaJson("marryCoupon.php?action="+action+"&cid="+cid+"&dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, marryCoupon = val.marryCoupon;
		obj.attr("data-totalpage", val.pageInfo.totalPage);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();
			
			for(i; i < marryCoupon.length; i++){
				list.push('<tr data-id="'+marryCoupon[i].id+'">');
				list.push('  <td class="row3"><span class="check"></span></td>');
				var img = "";
				if(marryCoupon[i].litpic != ""){
					img = '<img src="'+cfg_attachment+marryCoupon[i].litpic+'&type=small" class="litpic" />';
				}
				list.push('  <td class="row30 left">'+img+'<span>'+marryCoupon[i].title+'</span></td>');
				list.push('  <td class="row10">'+marryCoupon[i].from+'</del></td>');
				list.push('  <td class="row10">'+marryCoupon[i].end+'</del></td>');
				list.push('  <td class="row12">'+marryCoupon[i].count+' / '+marryCoupon[i].has+'</td>');
				list.push('  <td class="row15">'+marryCoupon[i].pubdate+'</td>');
				list.push('  <td class="row20">');
				list.push('<a data-id="'+marryCoupon[i].id+'" data-title="'+marryCoupon[i].title+'" href="marryCouponDiary.php?action='+action+'&cid='+cid+'&did='+marryCoupon[i].id+'" title="领取记录" class="link diary">记录</a>&nbsp;|&nbsp;');
				list.push('<a data-id="'+marryCoupon[i].id+'" data-title="'+marryCoupon[i].title+'" href="marryCoupon.php?action='+action+'&dopost=edit&cid='+cid+'&id='+marryCoupon[i].id+'" title="修改" class="link modify">修改</a>&nbsp;|&nbsp;');
				list.push('<a href="javascript:;" title="删除" class="link delete">删除</a></td>');
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