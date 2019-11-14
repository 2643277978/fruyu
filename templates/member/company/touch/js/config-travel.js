
//店铺类型
$('.chosetype ul').delegate('li','click',function(){
	var t = $(this), p = t.parent();
	var r = [];
	if(t.data('type')==4){
		t.toggleClass('on');
		$('.permission').toggle();
	}else{
		t.toggleClass('on');
	}
	p.children('li').each(function(){
		var d = $(this), id = d.data('type');
		if($(this).hasClass('on')){
			r.push(id);
		}
	});
	$('input#shop_type').val(r.join(","));
});

$('.btn-keep').on('click',function(e){
	e.preventDefault();

	var t = $("#fabuForm"), action = t.attr('data-action');
	t.attr('action', action);
	var addrid = 0, cityid = 0, r = true;

	var shopname =$('#shopname').val(),    //商铺名称
		address = $('#address').val(),     //详细地址
		phone = $('#phone').val(),         //手机号
		contact = $('#contact').val();    //联系人

	if($('#fileList li.thumbnail').length<=0){
		r = false;
		showErr(langData['travel'][3][27]);  //'请至少上传1张图片'
		return;
	}else if(shopname=='' ||shopname==undefined){
		r = false;
		showErr(langData['travel'][3][34]);//请输入商铺名称
		return;
	}else if(address=='' ||address==undefined){
		r = false;
		showErr(langData['travel'][8][61]);//请输入详细地址
		return;
	}else if(phone=='' ||phone==undefined){
		r = false;
		showErr(langData['travel'][9][13]);//请输入联系方式
		return;
	}else if(contact=='' ||contact==undefined){
		r = false;
		showErr(langData['travel'][8][63]);//请输入联系人
		return;
	}

	var ids = $('.gz-addr-seladdr').attr("data-ids");
	if(ids != undefined && ids != ''){
		addrid = $('.gz-addr-seladdr').attr("data-id");
		ids = ids.split(' ');
		cityid = ids[0];
	}else{
		r = false;
		showErr(langData['homemaking'][5][19]);  //请选择所在地
		return;
	}
	$('#addrid').val(addrid);
	$('#cityid').val(cityid);

	var pics = [];
	$("#fileList").find('.thumbnail').each(function(){
		var src = $(this).find('img').attr('data-val');
		pics.push(src);
	});
	$("#pics").val(pics.join(','));

	var video = [];
	$("#fileList2").find('.thumbnail').each(function(){
		var src = $(this).find('video').attr('data-val');
		video.push(src);
	});
	$("#video").val(video.join(','));

	if(!r){
		return;
	}

	$.ajax({
		url: action,
		data: t.serialize(),
		type: 'post',
		dataType: 'json',
		success: function(data){
			if(data && data.state == 100){
				showErr(data.info);
			}else{
				showErr(data.info);
			}
		},
		error: function(){
			showErr(langData['siteConfig'][6][203]);
		}
	})
	
})
	//错误提示
	var showErrTimer;
	function showErr(txt){
	    showErrTimer && clearTimeout(showErrTimer);
	    $(".popErr").remove();
	    $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
	    $(".popErr p").css({"margin-left": -$(".popErr p").width()/2, "left": "50%"});
	    $(".popErr").css({"visibility": "visible"});
	    showErrTimer = setTimeout(function(){
	        $(".popErr").fadeOut(300, function(){
	            $(this).remove();
	        });
	    }, 1500);
	}