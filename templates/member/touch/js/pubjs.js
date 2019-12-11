//主要是各页面的公用的一些事件
//房源标题填充
    $('input.space').change(function(){
    	autoTitle();
    });
    $('#price').change(function(){
    	autoTitle()
    });
    
 	// 错误提示
	function showMsg(str){
	  var o = $(".error");
	  o.html('<p>'+str+'</p>').show();
	  setTimeout(function(){o.hide()},1000);
	}	
 
 function autoTitle(){
	var housename = $('#house_chosed').val();
	var space = $('input.space').val();
	var price =  $('#price').val();
	var room = $('.tip').text();
	var title =housename+' ';
	
	if(space !='' || space != undefined){
		title +=' '+ space+'㎡';
	}
	if(price !=''){
		title +=' '+ price+$('#price').next('span').text();
	}
//		console.log(space)
	$('#house_title').val(title);
  }
$(function(){

	//APP端取消下拉刷新
	toggleDragRefresh('off');
	
	//房源所在小区选择触发
	$('.posi_house').bind('click',function(){
		$(this).parents('.page').hide();
		$('.gz-address').css('z-index','50').show().find('#house_name').focus();
		$(window).scrollTop(0);
	});
	//选择地址的返回按钮
	$('.gz-address .go_back').click(function(){
		$(this).parents('.gz-address ').hide();
		$('.page.input_info').show();
	});
	//补充更多信息
	$('.more_btn').bind('click',function(){
		$('.more_info ').show();
	});
	
	//全景图片、url切换
	$('.qjimg_box .active').bind('click',function(){
		$('#qj_type').val($(this).find('a').data('id'));
		$(this).addClass('chose_btn').siblings('.active').removeClass('chose_btn');
		if($(this).find('a').data('id')==1){
			$('.url_box').show();
			$('#qjshow_box').hide();
		}else{
			$('.url_box').hide();
			$('#qjshow_box').show();
		}
	});
	
	//联系方式
	$('.user_sex .active').bind('click',function(){
		$(this).addClass('chose_btn').siblings('.active').removeClass('chose_btn');
		$('#usersex').val($(this).find('a').data('id'));
	});
	$('.wx_phone .active').bind('click',function(){
		$(this).toggleClass('chose_btn');
		if($(this).hasClass('chose_btn')){
			$(this).find('#wx_tel').val('1')
		}else{
			$(this).find('#wx_tel').val('0')
		}
	})
	
	
})
