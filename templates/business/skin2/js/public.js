$(function(){
    $(".fixedwrap .nav").remove();

  // 搜索
	$('.search dl').hover(function(){
		var a = $(this);
		a.addClass('hover');
		a.find('dd .curr').addClass('active').siblings().removeClass();
	},function(){
		$(this).removeClass('hover');
	}).find('dd a').click(function(){
		var a = $(this);
		a.addClass('active curr').siblings().removeClass();
		$('.keytype').text(a.text());
		$('.search dl').removeClass('hover');
	}).hover(function(){
		var a = $(this);
		a.addClass('active').siblings().removeClass('active');
	})


  $('.searchkey').focus(function(){
		$('.hotkey').addClass('leave').stop().animate({
			'right' : '-400px'
		},500);
	}).blur(function(){
		$('.hotkey').removeClass('leave').stop().animate({
			'right' : '15px'
		},500);
	})
    
});
