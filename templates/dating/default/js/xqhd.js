$(function(){
	//大图幻灯
	$("#slide").cycle({
		pager: '#slidebtn'
	});

	//tab按钮
	$('.tabhead li').hover(function(){
		$(this).addClass('hover').siblings().removeClass('hover')
	},function(){
		$(this).removeClass('hover')
	})

	$('.tab-panel').eq(0).fadeIn()
	$('.tabhead li').click(function(){
		if($(this).hasClass('active')) return;
		$(this).addClass('active').siblings().removeClass('active')
		var index = $(this).index();
		$('.tab-panel').eq(index).fadeIn().siblings().fadeOut();
	})
	//活动列表
	$('.hdlist li').hover(function(){
		$(this).addClass('hover')
	},function(){
		$(this).removeClass('hover')
	})

})
