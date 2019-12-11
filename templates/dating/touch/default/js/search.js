$(function(){

	var device = navigator.userAgent;
	if (device.indexOf('huoniao_iOS') > -1) {
		$('.header').addClass('padTop20');
		$('.se-list').css('top', 'calc(.9rem + 20px)');
	}

	var focusuid = 0;

	// 筛选
	$('.header-search').click(function(){
		$("#navBox").hide();
		var x = $(this);
		var box = $('.se-list')
		if (box.css('display') == 'none'){
			x.addClass('fan');
			$('.se-list').show();
			$('.disk').show();
		}else {
			x.removeClass('fan');
			$('.se-list').hide();
			$('.disk').hide();
		}
	})
	$('.disk').click(function(){
		$('.se-list').hide();
		$('.disk').hide();
		$('.header-search p img').removeClass('fan');
		$(".txt").hide();
	})
    $('.disk,.txt p').click(function(){
        $('.txt').hide();
        $('.mask').hide();
    })

		$('.mask').click(function(){
			$('.mask').hide();
			$('.header-search p img').removeClass('fan');
			$(".txt").hide();
		})

	// 发私信
    $('.main').delegate('.first-nic', 'click', function(){
    	var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = '/login.html';
			return false;
		}
        var x = $(this);
        focusuid = x.closest('.main-m').attr('userid');
        var box = $('.txt')
        if (box.css('display') == 'none'){
            $('.txt').show();
            $('.mask').show();
        }else {
            $('.txt').hide();
            $('.mask').hide();
        }
    })
    $('html').delegate('.sendmsgbtn','click',function(){
    	var btn = $(this), box = $('.shuru');
    	if($.trim(box.html()) == ''){
    		alert('请输入私信内容');
    		box.focus();
    		return false;
    	}
    	$.ajax({
            url: masterDomain + "/include/ajax.php?service=dating&action=fabuReview&id="+focusuid+"&note="+box.html(),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
            	if(data.state == 100){
            		btn.html('发送成功');
            		setTimeout(function(){
            			$('.mask,.txt p').click();
            			btn.html('发送');
            			box.html('');
            		},300)
            	}else{
                	alert(data.info);
              	}
            },
            error: function(){
            	alert('网络错误，发送失败！');
            }
        });
    })
    // 打招呼
    $('.main').delegate('.second-nic', 'click', function(){
    	var x = $(this);
    	if(x.hasClass('disabled')) {return;}

    	var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = '/login.html';
			return false;
		}
		x.addClass('disabled').html('<i></i>已打招呼');

        focusuid = x.closest('.main-m').attr('userid');
        x.addClass('disabled').html('<a href="javascript:;"><i></i>已打招呼</a>');
    	$('.zhaohu').show();
    	setTimeout(function(){$('.zhaohu').hide()},1000);

    	$.post("/include/ajax.php?service=dating&action=visitOper&type=3&id="+focusuid);
    })
    // 点关注
	$('.main').delegate('.last-nic', 'click', function(){
		var x = $(this);
		if(x.hasClass('guanzhu')) {return;}

	 	var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			location.href = '/login.html';
			return false;
		}

		x.addClass('guanzhu').html('<a href="javascript:;"><em></em>已关注</a>');
        focusuid = x.closest('.main-m').attr('userid');

        $.post("/include/ajax.php?service=dating&action=visitOper&type=2&id="+focusuid);
    })

	// 列表body置顶
	$('.header-search p img,.first-nic').click(function(){
		var dom = $('.se-list')
		if (dom.css('display') == 'none'){
			$('body').removeClass('by')
		}else{
			$('body').addClass('by')
		}
	})
	$('.first-nic').click(function(){
		var dom = $('.txt')
		if (dom.css('display') == 'none'){
			$('body').removeClass('by')
		}else{
			$('body').addClass('by')
		}
	})
	$('.disk,.txt p').click(function(){
		var dom = $('.disk')
		if (dom.css('display') == 'none'){
			$('body').removeClass('by')
		}else{
			$('body').addClass('by')
		}
	})

	// 区域选择
	$("#addrid").change(function(){
	    $("#addrid option").each(function(i,o){
	        if($(this).attr("selected"))
	        {
	           $(".area2").hide();
	           $(".area2").eq(i).show();
	        }
	    });
	});
	$("#addrid").change();

	//填充年龄
	var ageb = [], agee = [];
	for(var i = 18; i < 100; i++){
		var sel0 = i == 18 ? ' selected' : '';
		var sel1 = i == 0 ? ' selected' : '';
		ageb.push('<option value="'+i+'"'+sel0+'>'+i+'</option>');
		agee.push('<option value="'+i+'"'+sel1+'>'+i+'</option>');
	}
	$("#agebegin").html(ageb.join(""));
	$("#ageend").html('<option value="">不限</option>'+agee.join(""));

	changeAge()

	$("#agebegin").change(function(){
		var tmpValStart = $("#agebegin").val();
		var htmlContent = "<option value=''>不限</option>";
		for(var i=(tmpValStart=='' ? 18:tmpValStart) ; i < 100; i++){
			htmlContent += "<option value='"+i+"'>"+i+"</option>";
		}
		$("#ageend").html(htmlContent);

		var tmpValEnd = $("#ageend").val();
		$("#ageend").val(tmpValEnd);

		changeAge();
	})
	$("#ageend").change(function(){
		changeAge();
	})

	function changeAge(){
		$('.age-t span').html($('#agebegin').val()+'&nbsp;&nbsp;&nbsp;&nbsp;');
		$('.age-t em').html($('#ageend').val() == '' ? '不限' : $('#ageend').val());
	}


	//填充身高
	var heib = [], heie = [];
	for(var i = 140; i < 261; i++){
		var sel0 = i == 140 ? ' selected' : '';
		heib.push('<option value="'+i+'"'+sel0+'>'+i+'</option>');
		heie.push('<option value="'+i+'">'+i+'</option>');
	}
	$("#h1").html(heib.join(""));
	$("#h2").html('<option value="">不限</option>'+heie.join(""));
	changeHeight();

	$("#h1").change(function(){
		var tmpValStart = $("#h1").val();
		var tmpValEnd = $("#h2").val();
		var htmlContent = "<option value=''>不限</option>";
		for(var i=(tmpValStart=='' ? 140:tmpValStart) ; i < 261; i++){
			htmlContent += "<option value='"+i+"'>"+i+"</option>";
		}
		$("#h2").html(htmlContent);
		$("#h2").val(tmpValEnd);
		changeHeight();
	});
	$("#h2").change(function(){
		changeHeight();
	})

	function changeHeight(){
		$('.hei-t span').html($('#h1').val()+'&nbsp;&nbsp;');
		$('.hei-t em').html($('#h2').val() == '' ? '不限' : $('#h2').val());
	}

	//区域
	$("#addrlist").delegate("select", "change", function(){
		var sel = $(this), id = sel.val(), index = sel.index();

		if(id == 0){
			// sel.parent().parent().addClass("error");
			sel.next("select ").remove();
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
						sel.next("select").remove();
						$("#addrlist").append('<select id="addr" name="addrid[]">'+opt.join("")+'</select>');
					}
				},
				error: function(msg){
					alert(msg.status+":"+msg.statusText);
				}
			});
		}
		// setAddressStr('#addrlist','.cond_main_addres em');
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


	$('#sex').change(function(){
		var t = $(this), val = t.val();
		console.log(val)
		if (val == "") {
			$('.sex-t span').text('不限');
		}
		else if (val == 1) {
			$('.sex-t span').text('男');
		}
		else if (val == 0) {
			$('.sex-t span').text('女');
		}
	})


	$('#addrid').change(function(){
		var t = $(this), val = t.val();
		$('.pla-t span').text(val);
	})
	$('.area2').change(function(){
		var t = $(this), val = t.val();
		$('.pla-t em').text(val);
	})
	$('#lear').change(function(){
		var t = $(this), val = t.val();
		$('.lear-t span').text(val);
		$('#education').val(val);
	})
	$('#money-1').change(function(){
		var t = $(this), val = t.val(), text = t.children('[value="'+val+'"]').text();
		$('.mone-t span').text(text);
	})


	var  isload = false, isend = false;
	// 下拉加载
	$(document).ready(function() {
		$(window).scroll(function() {
			var h = $('.main-m').height();
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - h - w;
			if ($(window).scrollTop() > scroll && !isload && !isend) {
				atpage++;
				getList();
			};
		});
	});


	var objId = $('.main');
	$('.search-s a').click(function(){
		objId.html('');
		getList(1);
		$('.se-list, .disk').hide();
		$('body').removeClass('by');
		$('.header-search p img').removeClass('fan');
	})




	var pageInfo = {totalCount:-1,totalPage:0};

	getList(1);


	function getList(tr){

		isload = true;
        $('.loading').remove();
        objId.append('<div class="loading">正在加载，请稍后···</div>');

		//如果进行了筛选或排序，需要从第一页开始加载
		if(tr){
			atpage = 1;
            pageInfo.totalCount = -1;
            pageInfo.totalPage = 0;
		}

		var data = [];
		var sex = $('#sex').val(), agebegin = $('#agebegin').val(),
				ageend = $('#ageend').val(), h1 = $('#h1').val(), h2 = $('#h2').val(),
				addr = $('#addrlist select:last').val(), education = $('#education').val(), income = $('#money-1').val();

				if (sex != "") {
					data.push("sex="+sex);
				}
				if (agebegin != "" || ageend != "") {
					data.push("age="+agebegin+','+ageend);
				}
				data.push("height="+h1+','+h2);
				if (addr != "" && addr != undefined) {
					data.push("addr="+addr);
				}
				if (education != "") {
					data.push("education="+education);
				}
				if (income != "") {
					data.push("income="+income);
				}

		$.ajax({
			url: masterDomain+"/include/ajax.php?service=dating&action=memberList&page="+atpage+"&pageSize=15",
			data: data.join("&"),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state != 200){
					if(data.state == 101){
						checkResult();
					}else{

						if(pageInfo.totalCount == -1){
                            pageInfo.totalCount = data.info.pageInfo.totalCount;
                            pageInfo.totalPage = data.info.pageInfo.totalPage;
                        }

						var list = [], data = data.info.list;

						if (data.length > 0) {

							for(var i = 0; i < data.length; i++){

								var  educationName = data[i].educationName, incomeName = data[i].incomeName, age = data[i].age, sign = data[i].sign, addr = data[i].addr[0];

								list.push('<div class="main-m fn-clear" userid="'+data[i].id+'">');
								list.push('<a href="'+data[i].url+'">');
								list.push('<div class="sear-img">');
								list.push('<div class="sear-pic">');
								list.push('<img src="'+data[i].photo+'">');
								list.push('<div class="infor">');
								list.push('<ul>');
								list.push('<li class="name">');
								list.push('<em>'+data[i].nickname+'</em>');
								list.push('</li>');
								list.push('<li>');
								var certifyState = data[i].certifyState;
								if (certifyState == 0) {
									list.push('<em>未认证身份</em>');
								}else {
									list.push('<em>已认证身份</em>');
								}
								if (addr) {
									list.push('<p>|</p><em>工作生活在：'+addr+'</em>');
								}
								list.push('</li>');
								list.push('</ul>');
								list.push('</div>');
								list.push('</div>');
								list.push('<div class="infor-list">');
								list.push('<ul class="fn-clear">');
								if (age) {
									list.push('<li><em>'+age+'岁</em></li>');
								}
								list.push('<li><em>'+data[i].height+'cm</em></li>');
								if (educationName) {
									list.push('<li><em>'+educationName+'</em></li>');
								}
								if (incomeName) {
									list.push('<li><em>收入：'+incomeName+'元</em></li>');
								}
								list.push('</ul>');
								if (sign) {
									list.push('<div class="infor-txt" style="height: 1.2rem;">'+sign+'</div>');
								}
								list.push('</div>');
								list.push('</div>');
								list.push('</a>');
								list.push('<div class="nic fn-clear">');
								list.push('<ul>');
								list.push('<li class="first-nic"><a href="javascript:;"><em></em>发私信</a></li>');
								if(data[i].visit){
									list.push('<li class="second-nic disabled"><a href="javascript:;"><i></i>已打招呼</a></li>');
								}else{
									list.push('<li class="second-nic"><a href="javascript:;"><em></em>打招呼</a></li>');
								}
								if(data[i].follow){
									list.push('<li class="last-nic guanzhu"><a href="javascript:;"><em></em>已关注</a></li>');
								}else{
									list.push('<li class="last-nic"><a href="javascript:;"><em></em>加关注</a></li>');
								}
								list.push('</ul>');
								list.push('</div>');
								list.push('</div>');
							}

							objId.append(list.join(""));
							checkResult();

						}else {
							checkResult();
						}

					}
				}else {
					checkResult();
				}
			}
		});
	}

	function checkResult(){
		$('.loading').remove();
        if(pageInfo.totalCount <= 0){
            objId.append('<div class="loading">非常抱歉，找不到你要求的结果</div>');
            isend = true;
        }else{
            if(pageInfo.totalPage == atpage){
                isend = true;
                objId.append('<div class="loading">已显示全部搜索结果</div>');
            }else{
                isload = false;
            }
        }
    }












})
