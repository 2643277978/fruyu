$(function(){
	var $container = $('#device');
	$container.masonry({
		columnWidth: 226,
		itemSelector: ".item",
		gutterWidth: 18,
		isAnimated: false,
		isRTL: false
	});

	var loading = $('.loading');

	var atpage = 1;				// 数据是否加载完毕 测试加载6次
	var loadMoreLock = false;		// 一次加载完成前
	var first = true;
	var pageData = {"totalPage": 1};
	$(window).scroll(function(){
		if(loadMoreLock) return;
		var sct = $(document).scrollTop();
		if((sct + $(window).height() + 300 > $(document).height() || first) && (pageData && atpage <= pageData.totalPage)) {
			loadMoreLock = true;
			loading.show();

			$.ajax({
				url: masterDomain+'/include/ajax.php?service=dating&action=memberList&page='+atpage+'&pageSize=20'+data,
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						var list = data.info.list;
						pageData = data.info.pageInfo;
						first = false;
						atpage++;

						var html = '';
						$.each(list, function(idx, item) {

							var data1 = [];
							if(item.age) data1.push(item.age + '岁');
							if(item.addr) data1.push(item.addr[1]);
							if(item.educationName) data1.push(item.educationName);
							if(item.incomeName) data1.push(item.incomeName);
							data1 = data1.join(" ");

							var data2 = '';
							if(item.sign)	data2 = '<p class="monologue"><em>个性签名：</em><a target="_blank" href="' + item.url + '">'+item.sign+'</a></p>';

							html += '<div class="item" data-id="'+item.id+'"><div class="inner"><div class="photo"><a target="_blank" href="'+item.url+'"><img src="'+item.photo+'"/></a><a href="javascript:;" target="_blank" class="send_zh'+(item.visit ? ' sended' : '')+'"><i></i>'+(item.visit ? '已打招呼' : '打招呼')+'</a></div><p class="name_p"><a href="'+item.url+'" class="name" target="_blank"><strong>'+item.nickname+'</strong></a>'+(item.online ? '<span style="color: #8db600;font-family: Tahoma;margin-right: 4px;margin-left: 4px;vertical-align: middle;">在线</span>' : '')+'</p><p><a href="'+item.url+'" class="u-info">'+data1+'</a></p>'+data2+'</div></div>';
						})
						if (html == '') {
							loading.removeClass('ldimg').html('已经到最后了');
							$(window).off('scroll');
						} else {
							loading.hide();
							if(loading.hasClass('first')) {loading.removeClass('first')}
							var $elems = $(html);
							$container.append($elems);
							$container.masonry('appended', $elems, 'isAnimatedFromBottom');
							setTimeout(function() {
								$container.masonry('reload');
								loadMoreLock = false;
							}, 200);
						}

					}else{

						if(first){
							$("#device").remove();
							loading.hide();
							$(".search_null").show();
						}else{
							loading.removeClass('ldimg').html('已经到最后了').show();
						}
						$(window).off('scroll');

					}
				}
			});
		}else{
			if(first){
				$("#device").remove();
				$(".search_null").show();
			}else{
				loading.removeClass('ldimg').html('已经到最后了').show();
			}
		}
	}).scroll();
	$(window).resize(function(){
		$container.masonry({
			columnWidth: 226,
			itemSelector: ".item",
			gutterWidth: 18,
			isAnimated: false,
			isRTL: false
		});
	})

	//展开、收起更多条件
	$('.selected_conditions .more_txt').click(function(){
		$(this).toggleClass('active')
		$('.more_conditions').toggle()
	})

	// 选择地区
	//区域
	$("#addrlist").delegate("select", "change", function(){
		var sel = $(this), id = sel.val(), index = sel.index();

		if(id == 0){
			// sel.parent().parent().addClass("error");
			sel.nextAll("select , span").remove();
		} else if(id != 0 && id != ""){
			$.ajax({
				type: "GET",
				url: masterDomain+"/include/ajax.php?service=dating&action=addr&type="+id,
				dataType: "jsonp",
				success: function(data){
					var i = 0, opt = [];
					if(data instanceof Object && data.state == 100){
						var list = data.info;
						for(var i = 0; i < list.length; i++){
							var sele = '';
							if(addr2 == list[i]['id']){
								sele = ' selected';
							}
							opt.push('<option value="'+list[i]['id']+'"'+sele+'>'+list[i]['typename']+'</option>');
						}
						sel.nextAll("select , span").remove();
						$("#addrlist").append('<span class="conectSel">-</span><select id="addr" name="addrid[]">'+opt.join("")+'</select>');
					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}
		setAddressStr('#addrlist','.cond_main_addres em');
	});
	if(addr1){
		$("#addrid").change();
	}

	function setAddressStr(box,em){
		var str = '';
		setTimeout(function(){
			$(box).find("[name='addrid[]']").each(function(){
				var sel = $(this);
				var v = sel.val();
				var t = sel.children("[value='" + v + "']").text();
				if(t != '请选择区域'){
					str +=  t + ' ';
				}
			})
			if($.trim(str) == '') {
				str = '地区';
			}
			//$(em).html(str);
		},100)
	}

	// 鼠标移入移除用户列表块
	$(document).on('mouseover','#device .item',function(){
		$(this).addClass('device_item_hover')
	})
	$(document).on('mouseleave','#device .item',function(){
		$(this).removeClass('device_item_hover')
	})

	//打招呼
	$(document).on('click','#device .send_zh',function(){
		var a = $(this), uid = a.closest(".item").attr("data-id");
		if(a.hasClass('sended') || a.hasClass('unpermiss')) {
			return;
		}

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

		$(this).html('<i></i>已打招呼').addClass('sended');

		$.post("/include/ajax.php?service=dating&action=visitOper&type=3&id="+uid);
	})

	//更多条件 选项
	$('.cond_item').click(function(e){
		e = e || window.event;
	     if(e.stopPropagation) { //W3C阻止冒泡方法
	         e.stopPropagation();
	     } else {
	         e.cancelBubble = true; //IE阻止冒泡方法
	     }
		$(this).addClass('flip_item').siblings('.cond_item').removeClass('flip_item');
	})

	$(document).on('click',function(){
		$('.cond_item').removeClass('flip_item');
	})


	//点击条件确定按钮
	$('.moreSle a').click(function(event){
		event.stopPropagation();
		var a = $(this);
		a.parents('.cond_item').removeClass('flip_item');
		var str = a.text();
		a.parents('.cond_item').find('.cond_main_txt em').text(str);
	})


	//填充年龄
	var ageb = [];
	for(var i = 18; i < 99; i++){
		var sel = '';
		if(bage == i){
			sel = ' selected';
		}
		ageb.push('<option value="'+i+'"'+sel+'>'+i+'</option>');
	}
	$("#agebegin").html(ageb.join(""));

	var agee = [];
	agee.push('<option value="">不限</option>');
	for(var i = 19; i < 100; i++){
		var sel = "";
		if(eage == i){
			sel = ' selected';
		}
		agee.push('<option value="'+i+'"'+sel+'>'+i+'</option>');
	}
	$("#ageend").html(agee.join(""));

	//填充身高
	var heib = [];
	for(var i = 140; i < 261; i++){
		var sel = '';
		if(bhei == i){
			sel = ' selected';
		}
		heib.push('<option value="'+i+'"'+sel+'>'+i+'</option>');
	}
	$("#h1").html(heib.join(""));

	var heie = [];
	heie.push('<option value="">不限</option>');
	for(var i = 140; i < 261; i++){
		var sel = "";
		if(ehei == i){
			sel = ' selected';
		}
		heie.push('<option value="'+i+'"'+sel+'>'+i+'</option>');
	}
	$("#h2").html(heie.join(""));


	$("#agebegin").change(function(){
		var tmpValStart = $("#agebegin").val();
		var htmlContent = "<option value=''>不限</option>";
		for(var i=(tmpValStart=='' ? 18:tmpValStart) ; i < 100; i++){
			htmlContent += "<option value='"+i+"'>"+i+"</option>";
		}
		$("#ageend").html(htmlContent);

		var tmpValEnd = $("#ageend").val();
		$("#ageend").val(tmpValEnd);
	})
	$("#ageend").change(function(){
		var tmpValStart = $("#agebegin").val();
		var tmpValEnd = $("#ageend").val();
	})
	$("#h1").change(function(){
		var tmpValStart = $("#h1").val();
		var tmpValEnd = $("#h2").val();
		var htmlContent = "<option value=''>不限</option>";
		for(var i=(tmpValStart=='' ? 140:tmpValStart) ; i < 261; i++){
			htmlContent += "<option value='"+i+"'>"+i+"</option>";
		}
		$("#h2").html(htmlContent);
		$("#h2").val(tmpValEnd);
	});
	$("#h2").change(function(){
		var tmpValStart = $("#h1").val();
		var tmpValEnd = $("#h2").val();
	})

	//确定年龄
	$(".cage").bind("click", function(e){
		e.preventDefault();
		var url = $(this).attr("href");
		var agebegin = $("#agebegin").val();
		var ageend   = $("#ageend").val();
		location.href = url.replace("%age", agebegin+","+ageend);
	});

	//确定身高
	$(".cheight").bind("click", function(e){
		e.preventDefault();
		var url = $(this).attr("href");
		var h1 = $("#h1").val();
		var h2   = $("#h2").val();
		location.href = url.replace("%height", h1+","+h2);
	});

	//确定地区
	$(".caddr").bind("click", function(e){
		e.preventDefault();
		var url = $(this).attr("href");
		var addr = $("#addr").val();
		addr = addr == undefined ? 0 : addr;
		location.href = url.replace("%addr", addr);
	});


})
