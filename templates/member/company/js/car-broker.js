/**
 * 会员中心房产经纪人列表
 * by guozi at: 20160615
 */

var objId = $("#list");
$(function(){

	$(".nav-tabs li[data-id='"+state+"']").addClass("active");

	$(".nav-tabs li").bind("click", function(){
		var t = $(this), id = t.attr("data-id");
		if(!t.hasClass("active") && !t.hasClass("add")){
			state = id;
			atpage = 1;
			t.addClass("active").siblings("li").removeClass("active");
			getList();
		}
	});

	getList(1);

	// 新增经纪人
	$('.add').click(function(){
		$('.model_edit .nickname').val('');
		$('.model_edit .phone').val('');

		$('.model_edit .up img').remove();
		$('.model_edit .up').removeClass('has');

		$('#photo').val('');
		$('#userid').val(0);
		$('.model_edit .submit').val('添加');
		$('#password').val('').attr('placeholder', '请输入密码');
		$('.model_edit').show();
	})

	$('.model .close, .model .cancel').click(function(){
		$(this).closest('.model').hide();
	})

	$('#searchForm').submit(function(e){
		e.preventDefault();
		getList(1);
	})
	$('#zjuserForm').submit(function(e){
		e.preventDefault();
		var f = $(this),
				t = f.find('.submit'),
				info = f.find('.info'),
				photo = $('#photo').val(),
				userid = $('#userid').val(),
				nickname = $('#nickname').val(),
				phone = $('#phone').val(),
				password = $('#password').val();
		info.text('');
		if(photo == ''){
			info.text('请上传头像');
			return;
		}
		if(nickname == ''){
			info.text('请填写姓名');
			return;
		}
		if(phone == ''){
			info.text('请填写手机号');
			return;
		}
		if(userid == 0){
			if(password == ''){
				info.text('请填写登陆密码');
				return;
			}
		}
		var action = userid == 0 ? 'addAdviser' : 'operAdviser&type=update';
		t.attr('disabled', true);
		$.ajax({
			url: masterDomain + '/include/ajax.php?service=car&action='+action,
			type: 'GET',
			data: f.serialize(),
			dataType: 'jsonp',
			success: function(data){
				info.text(data.info);
				t.attr('disabled', false);
				if(data && data.state == 100){
					$('.model_edit .close').click();
					getList(1);	
				}
			},
			error: function(){
				info.text('网络错误，请重试！');
				t.attr('disabled', false);
			}
		})
	})

	//编辑
	objId.delegate(".edit", "click", function(){
		var t = $(this), par = t.closest(".item"), id = par.attr('data-id');
		if(t.hasClass("disabled")) return false;

		t.addClass("disabled");
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=car&action=adviserList&type=getnormal&u=1&userid="+id+"&comid="+comid,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {

				t.removeClass("disabled");

				if(data.state == 100 && data.info.pageInfo.totalCount == 1){

					var info = data.info.list[0];

					$('.model_edit .nickname').val(info.nickname);
					$('.model_edit .phone').val(info.phone);

					$('.model_edit .up img').remove();
					if(info.photo != ''){
						$('.model_edit .up').addClass('has').append('<img src="'+info.photo+'">');
					}else{
							$('.model_edit .up').removeClass('has');
					}
					$('#photo').val(info.photoSource);
					$('#userid').val(id);
					$('#password').val('').attr('placeholder', '不修改请留空');
					$('.model_edit .submit').val('修改');
					$('.model_edit').show();
					if(info.quality==1){
						$('#quality').attr('checked', true);
					}
					
				}else{
					$.dialog.alert(langData['siteConfig'][27][107]);
				}

			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][27][108]);
			}
		});
	});

	//删除
	objId.delegate(".del", "click", function(){
		$('.model_del').show().data('t', $(this));
	});
	// 确定删除
	$('.model_del .ok').click(function(){
		var t = $('.model_del').data('t'), par = t.closest(".item"), id = par.attr('data-id');
		$.ajax({
			url: masterDomain+"/include/ajax.php?service=car&action=operAdviser&type=del&id="+id+"&comid="+comid,
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				t.removeClass("disabled");
				if(data && data.state == 100){
					$('.model_del .close').click();
					getList(1);
					par.remove();
				}else{
					$.dialog.alert(langData['siteConfig'][27][107]);
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][27][108]);
			}
		});
	})

	//上传单张图片
	function mysub(id){
    var t = $("#"+id), p = t.parent(), img = t.parent().children(".img");

    var data = [];
    data['mod'] = 'member';
    data['filetype'] = 'image';
    data['type'] = 'photo';

    $.ajaxFileUpload({
      url: "/include/upload.inc.php",
      fileElementId: id,
      dataType: "json",
      data: data,
      success: function(m, l) {
        if (m.state == "SUCCESS") {
        	if(img.length > 0){
        		img.attr('src', m.turl);

        		delAtlasPic(p.find(".icon").val());
        	}else{
        		p.append('<img src="'+m.turl+'" alt="" class="img" style="height:40px;">');
        	}
        	$("#photo").val(m.url);
        	$(".up").addClass('has').children('.txt');

        } else {
          uploadError(m.state, id, uploadHolder);
        }
      },
      error: function() {
        uploadError("网络错误，请重试！", id, uploadHolder);
      }
  	});

	}

	function uploadError(info, id, uploadHolder){
		$.dialog.alert(info);
		uploadHolder.removeClass('disabled').text('上传图片');
	}

	//删除已上传图片
	var delAtlasPic = function(picpath){
		var g = {
			mod: "member",
			type: "delPhoto",
			picpath: picpath,
			randoms: Math.random()
		};
		$.ajax({
			type: "POST",
			url: "/include/upload.inc.php",
			data: $.param(g)
		})
	};

	$("#Filedata").change(function(){
		if ($(this).val() == '') return;
    mysub($(this).attr("id"));
	})

	// 删除头像
	$('.up').delegate('.remove', 'click', function(){
		var img = $('#photo').val();
		delAtlasPic(img);
		$('#photo').val('');
		$('.up').removeClass('has').children('img').remove();
	})



});

function getList(is){

	$('.main').animate({scrollTop: 0}, 300);

	objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');
	$(".pagination").hide();

	if(is){
		atpage = 1;
	}

	var keywords = $('.keywords').val();

	state = state ? state : 1;

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=car&action=adviserList&type=getnormal&u=1&comid="+comid+"&state=1&keywords="+keywords+"&page="+atpage+"&pageSize="+pageSize + "&state=" + state,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					$('.total span').text(0);
					objId.html("<p class='loading'>"+data.info+"</p>");
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
					if(state == 1){
						$('.total span').text(pageInfo.state1);
					}else if(state == 2){
						$('.total span').text(pageInfo.state2);
					}else{
						$('.total span').text(pageInfo.state0);
					}
					

					//拼接列表
					if(list.length > 0){

						for(var i = 0; i < list.length; i++){
							var item      = [],
									id        = list[i].id,
									nickname  = list[i].nickname,
									phone     = list[i].phone,
									store     = list[i].store,
									url       = list[i].url,
									photo     = list[i].photo,
									click     = list[i].click,
									saleCount = list[i].saleCount,
									zuCount   = list[i].zuCount,
									xzlCount  = list[i].xzlCount,
									spCount   = list[i].spCount,
									cfCount   = list[i].cfCount,
									pubdate   = huoniao.transTimes(list[i].pubdate, 2);

							html.push('<div class="item" data-id="'+id+'">');
							html.push('	<div class="pic"><img src="'+(photo != '' ? huoniao.changeFileSize(photo, "middle") : '/static/images/default_user.jpg')+'" alt=""></div>');
							html.push('	<div class="info">');
							html.push('		<p class="name">'+nickname+'</p>');
							html.push('		<p class="tel">'+(phone ? phone : '&nbsp;')+'</p>');
							html.push('		<p class="time">加入时间：'+pubdate+'</p>');
							html.push('	</div>');
							html.push('	<a href="javascript:;" class="del"></a>');
							html.push('	<a href="javascript:;" class="edit"></a>');
							html.push('</div>');

						}

						objId.html(html.join(""));

					}else{
						objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
					}

					switch(state){
						case "":
							totalCount = pageInfo.totalCount;
							break;
						case "0":
							totalCount = pageInfo.state0;
							break;
						case "1":
							totalCount = pageInfo.state1;
							break;
						case "2":
							totalCount = pageInfo.state2;
							break;
					}

					$("#total").html(pageInfo.totalCount);
					$("#state0").html(pageInfo.state0);
					$("#state1").html(pageInfo.state1);
					$("#state2").html(pageInfo.state2);
					showPageInfo();
				}
			}else{
				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
			}
		}
	});
}
