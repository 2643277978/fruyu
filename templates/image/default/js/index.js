$(function(){
	$('img').scrollLoading();
	// 第一栏焦点图
	jQuery(".picFocus").slide({ mainCell:".bd ul",effect:"left",autoPlay:true,startFun:function(i,c,s){
		var p = $('.picFocus'), t = p.find('.title'), o = p.find('.hd ul li').eq(i).find('img');
		t.text(o.attr('alt'));
	}});
	$(window).scrollTop(1);
})
