$(function(){
	// 顶部二维码
	$(".topbarlink li").hover(function(){
		var t = $(this), pop = t.find(".pop");
		pop.show();
		t.addClass("hover");
	}, function(){
		var t = $(this), pop = t.find(".pop");
		pop.hide();
		t.removeClass("hover");
	});


	// 幻灯片
	$('.flash ').slide({mainCell:".bd", titCell:".hd ul", autoPlay:true, autoPage:"<li><a></a></li>",effect:"fold"});


	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"16"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];


	// 贴吧点赞效果
	$(".zan").click(function(){
		var x = $(this);
		var praise_img = $(".EF_right span i");
		var text_box = x.closest('.EF_right').find('.add-num');
		var praise_txt = x.closest('.EF_right').find('.zan em');
		var num=parseInt(praise_txt.text());
		if(x.hasClass('zan_bc')){
			x.removeClass('zan_bc');
			text_box.show().html("<em class='add-animation'>-1</em>");
			$(".add-animation").removeClass("hover");
			num -=1;
			praise_txt.text(num)
		}else{
			x.addClass('zan_bc');
			text_box.show().html("<em class='add-animation'>+1</em>");
			$(".add-animation").addClass("hover");
			num +=1;
			praise_txt.text(num)
		}
	});

	// 资讯页面点赞
	$("#NewList32").delegate('.zan','click',function(){
		var x = $(this);
		if (x.hasClass('zan_bc')) {
			x.removeClass('zan_bc')
		}else{
			x.addClass('zan_bc')
		}
	})

	// 资讯页面hover发布信息便民工具遮罩层
	$('.fabu').hover(function(){
		$('.tool_bc').show();
	},function(){
		$('.tool_bc').hide();
	})

	// 资讯页面关注
	$('.vip_club ul li p').click(function(){
		var x = $(this);
		if (x.hasClass('guanzhu')) {
			x.removeClass('guanzhu');
			x.text('关注');
		}else{
			x.addClass('guanzhu');
			x.text('已关注');
		}
	})

	$('.attention').click(function(){
		$(this).remove();
	})

	// 二手信息点击显示全文
	$('.all').click(function(){
		var x =$(this).closest('.EL_detail').find('.Summarize');
		if (x.hasClass('height')) {
			x.removeClass('height');
			$(this).text('全文');
		}else{
			x.addClass('height');
			$(this).text('收起');
		}
	})
	
})