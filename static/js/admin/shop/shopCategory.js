$(function(){
	var treeLevel = 1;
	var init = {

		//拼接分类
		printTypeTree: function(){
			var typeList = [], l=typeListArr.length, cl = -45, level = 0, addType = '';
			for(var i = 0; i < l; i++){
				(function(){
					var jsonArray =arguments[0], jArray = jsonArray.lower;
					typeList.push('<li class="li'+level+'">');
					if(level < treeLevel){
						addType = '<a href="javascript:;" class="add-type" data-level="'+level+'">添加下级分类</a>';
					}else{
						addType = '';
					}

					typeList.push('<div class="tr clearfix tr_'+jsonArray["id"]+'">');
					if(jsonArray["parentid"] == 0){
						typeList.push('  <div class="row3"><a href="javascript:;" class="fold">折叠</a></div>');
						typeList.push('  <div class="row60 left"><input type="text" data-id="'+jsonArray["id"]+'" value="'+jsonArray["typename"]+'">'+addType+'</div>');
					}else{
						typeList.push('  <div class="row3"></div>');
						typeList.push('  <div class="row60 left"><span class="plus-icon" style="margin-left:'+cl+'px;"></span><input type="text" data-id="'+jsonArray["id"]+'" value="'+jsonArray["typename"]+'">'+addType+'</div>');
					}
					typeList.push('  <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');

					typeList.push('  <div class="row17 left">');
					typeList.push('  <a href="javascript:;" class="del" title="删除">删除编辑</a></div>');
					typeList.push('</div>');

					if(jArray.length > 0){
						typeList.push('<ul class="subnav ul'+level+'">');
					}
					for(var k = 0; k < jArray.length; k++){

						cl = cl + 45, level = level + 1;

						if(jArray[k]['lower'] != null){
							arguments.callee(jArray[k]);
						}
					}
					if(jsonArray["parentid"] == 0){
						cl = -45, level = 0;
					}else{
						cl = cl - 45, level = level - 1;
					}
					if(jArray.length > 0){
						typeList.push('</ul></li>');
					}else{
						typeList.push('</li>');
					}
				})(typeListArr[i]);
			}
			$(".root").html(typeList.join(""));
			init.dragsort();
		}

		//拖动排序
		,dragsort: function(){
			//一级
			$('.root').sortable({
	            items: '>li.li0',
				placeholder: 'placeholder',
	            orientation: 'vertical',
	            axis: 'y',
				handle:'>div.tr',
	            opacity: .5,
	            revert: 0,
				stop:function(){
					// saveOpera(1);
					huoniao.stopDrag();
				}
	        });
			for(var i = 0; i <= treeLevel; i++){
				$('.root .li'+i).sortable({
					items: '.li'+(i+1),
					placeholder: 'placeholder',
					orientation: 'vertical',
					axis: 'y',
					handle:'>div.tr',
					opacity: .5,
					revert: 0,
					stop:function(){
						// saveOpera(1);
						huoniao.stopDrag();
					}
				});
			}
		}
	};

	//拼接现有分类
	if(typeListArr != ""){
		init.printTypeTree();
	};

	//搜索
	$("#searchBtn").bind("click", function(){
		var keyword = $("#keyword").val(), typeList = [], l=typeListArr.length, addType = '';
		if(keyword == "") {
			$("#keyword").focus(); return false;
		}
		$("#list .tr").removeClass("light");
		for(var i = 0; i < l; i++){
			(function(){
				var jsonArray =arguments[0], jArray = jsonArray.lower;
				if(jsonArray["typename"].indexOf(keyword) > -1){
					$(".tr_"+jsonArray["id"]).addClass("light");
				}
				for(var k = 0; k < jArray.length; k++){
					if(jArray[k]['lower'] != null){
						arguments.callee(jArray[k]);
					}
				}

			})(typeListArr[i]);
		}
		//定位第一个
		if($('#list .light').length > 0){
			$(document).scrollTop(Number($('#list .light:first').offset().top));
		}
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

	//头部添加新分类
	$("#addNew_").bind("click", function(){
		var html = [];

		html.push('<li class="li0">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row3"><a href="javascript:;" class="fold">折叠</a></div>');
		html.push('    <div class="row60 left"><input data-id="0" type="text" value=""><a href="javascript:;" class="add-type" data-level="0">添加下级分类</a></div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');

		$(".root").prepend(html.join(""));
	});

	//底部添加新分类
	$("#addNew").bind("click", function(){
		var html = [];

		html.push('<li class="li0">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row3"><a href="javascript:;" class="fold">折叠</a></div>');
		html.push('    <div class="row60 left"><input data-id="0" type="text" value=""><a href="javascript:;" class="add-type" data-level="0">添加下级分类</a></div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');

		$(this).parent().parent().prev(".root").append(html.join(""));
	});

	//全部展开
	$("#unfold").bind("click", function(){
		$(".root .li0 .fold").removeClass("unfold");
		$(".root .subnav").show();
	});

	//全部收起
	$("#away").bind("click", function(){
		$(".root .li0 .fold").addClass("unfold");
		$(".root .subnav").hide();
	});

	//添加下级分类
	$(".root").delegate(".add-type", "click", function(){
		var parent = $(this).parent().parent(), level = Number($(this).attr("data-level")), m = $(this).siblings(".plus-icon").css("margin-left"), margin = Number(m == undefined ? -45 : m.replace("px", "")), html = [], addType = '';
		if(level < treeLevel - 1){
			addType = '<a href="javascript:;" class="add-type" data-level="'+Number(level+1)+'">添加下级分类</a>';
		}else{
			addType = '';
		};
		html.push('<li class="li'+Number(level+1)+'">');
		html.push('  <div class="tr clearfix">');
		html.push('    <div class="row3"></div>');
		html.push('    <div class="row60 left"><span class="plus-icon" style="margin-left:'+Number(margin+45)+'px"></span><input data-id="" type="text" value="">'+addType+'</div>');
		html.push('    <div class="row20"><a href="javascript:;" class="up">向上</a><a href="javascript:;" class="down">向下</a></div>');
		html.push('    <div class="row17 left"><a href="javascript:;" class="del">删除</a></div>');
		html.push('  </div>');
		html.push('</li>');
		if(parent.next("ul").html() != undefined){
			parent.next("ul").append(html.join(""));
		}else{
			parent.after('<ul class="subnav">'+html.join("")+'</ul>');
		}

		$(this).parent().siblings(".row3").find(".fold").removeClass("unfold");
		parent.next("ul").show();
		//parent.next("ul").find("input:last").focus();
	});

	//折叠、展开
	$(".root").delegate(".fold", "click", function(){
		if($(this).hasClass("unfold")){
			$(this).removeClass("unfold");
			$(this).parent().parent().parent().find("ul").show();
		}else{
			$(this).addClass("unfold");
			$(this).parent().parent().parent().find("ul").hide();
		}
	});

	//表单回车提交
	$("#list").delegate("input", "keyup", function(e){
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
			e.preventDefault();
            //$("#saveBtn").click();
        }
    });

	//input焦点离开自动保存
	$("#list").delegate("input[type=text]", "blur", function(){
		var id = $(this).attr("data-id"), value = $(this).val();
		if(id != "" && id != 0){
			huoniao.operaJson("shopCategory.php?dopost=updateType&id="+id+"&action="+action+"&tid="+tid, "type=single&typename="+value, function(data){
				if(data.state == 100){
					huoniao.showTip("success", data.info, "auto");
				}else if(data.state == 101){
					//huoniao.showTip("warning", data.info, "auto");
				}else{
					huoniao.showTip("error", data.info, "auto");
				}
			});
		}
	});

	//鼠标经过li
	$("#list").delegate(".tr", "mouseover", function(){
		$(this).parent().addClass("hover");
	});
	$("#list").delegate(".tr", "mouseout", function(){
		$(this).parent().removeClass("hover");
	});

	//排序向上
	$(".root").delegate(".up", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != 0){
			parent.after(parent.prev("li"));
			//saveOpera(1);
			huoniao.stopDrag();
		}
	});

	//排序向下
	$(".root").delegate(".down", "click", function(){
		var t = $(this), parent = t.parent().parent().parent(), index = parent.index(), length = parent.siblings("li").length;
		if(index != length){
			parent.before(parent.next("li"));
			//saveOpera(1);
			huoniao.stopDrag();
		}
	});

	//删除
	$(".root").delegate(".del", "click", function(event){
		event.preventDefault();
		var t = $(this), id = t.parent().parent().find("input").attr("data-id"), type = t.parent().text();

		if(t.parent().parent().next("ul").html() != undefined && t.parent().parent().next("ul").html() != ""){
			$.dialog.alert("该分类下含有子级分类，请先删除(或转移)子级内容！");
		}else{
			//从数据库删除
			if(type.indexOf("编辑") > -1){
				huoniao.operaJson("shopCategory.php?dopost=del&action="+action+"&tid="+tid, "id="+id, function(data){
					if(data.state == 100){
						huoniao.showTip("success", data.info, "auto");
						setTimeout(function() {
							location.reload();
						}, 800);
					}else{
						alert(data.info);
						return false;
					}
				});
				//跳转到对应删除页面
			}else{
				t.parent().parent().parent().remove();
			}
		}
	});

	//保存
	$("#saveBtn").bind("click", function(){
		saveOpera("");
	});

	//返回最近访问的位置
	huoniao.scrollTop();

});

//保存
function saveOpera(type){
	var first = $("ul.root>li"), json = '[';
	for(var i = 0; i < first.length; i++){
		(function(){
			var html =arguments[0], count = 0, jArray = $(html).find(">ul>li"), tr = $(html).find(".tr input"), id = tr.attr("data-id"), val = tr.val();

			if(jArray.length > 0 && val != ""){
				json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": [';
				for(var k = 0; k < jArray.length; k++){
					if($(jArray[k]).find(">ul>li").length > 0){
						arguments.callee(jArray[k]);
					}else{
						var tr = $(jArray[k]).find(".tr input"), id = tr.attr("data-id"), val = tr.val();
						if(val != ""){
							json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": null},';
						}else{
							count++;
						}
					}
				}
				json = json.substr(0, json.length-1);
				if(count == jArray.length){
					json = json + 'null},';
				}else{
					json = json + ']},';
				}
			}else{
				if(val != ""){
					json = json + '{"id": "'+id+'", "name": "'+encodeURIComponent(val)+'", "lower": null},';
				}
			}
		})(first[i]);
	}
	json = json.substr(0, json.length-1);
	json = json + ']';

	if(json == "]") return false;

	var scrolltop = $(document).scrollTop();
	var href = huoniao.changeURLPar(location.href, "scrolltop", scrolltop);

	huoniao.showTip("loading", "正在保存，请稍候...");
	huoniao.operaJson("shopCategory.php?dopost=typeAjax&tid="+tid, "data="+json, function(data){
		if(data.state == 100){
			huoniao.showTip("success", data.info, "auto");
			if(type == ""){
				window.scroll(0, 0);
				setTimeout(function() {
					location.href = href;
				}, 800);
			}
		}else{
			huoniao.showTip("error", data.info, "auto");
		}
	});
}