// 插件的最大闭包，用于获取外部变量
(function($) {
    $.fn.tb_flash = function() {
        var _this = $(this);
		_this.find('.JQ-slide-content').css('left',"0px");
        // 元素的宽度|高度|数量
        var width = _this.width();
        var height = _this.height();
        var nums = _this.find('.JQ-slide-content li').length - 1;
		// 将宽度设置为属性 拖拽之后会变动
		_this.attr('width',width);
        // 通过图像的数量生成小标签
        var html = '';
        for (var i = 0; i <= nums; i++) {
            html += (i == 0) ? '<li class="on" data="' + i + '"></li>' : '<li data="' + i + '"></li>';
        }
        _this.find('.JQ-slide-nav').html(html);
        // 设置当前图像为第几张
        _this.attr('frame', 0);
        // 设置图像LI的宽度 防止溢出
        _this.find('.JQ-slide-content').width(width * (nums + 1)).css('left',0).find('li').width(width);
        // 用于判断是否点击过，如果点击过延迟一次自动循环
        _this.attr('click', 0);
        // 小标签绑定事件
        _this.find('.JQ-slide-nav li').bind('click', function() {
            $.fn.tb_flash.run(_this, nums, width, $(this).attr('data'));
        });
		// 如果图片小于宽度，将设为最大宽度，否则会出现很多空白
	/*	_this.find('img').each(function(i,n){
			var img = new Image();
			img.src = $(n).attr('src');
			if(img.width < width){
				$(n).attr('width',width);
			}
		});*/
		
		if(_this.attr('is_one') != 1){
			
			// 执行效果
			setInterval(function() {
				$.fn.tb_flash.run(_this, nums, width);
			}, 6000);
		}
		_this.attr('is_one',1);

    };

    $.fn.tb_flash.run = function(_this, nums, width, click_frame) {
		width = _this.attr('width');
        var frame = parseInt(_this.attr('frame')) + 1;
        // 如果上次是用户点击过的，延迟一次滑动
        if (_this.attr('click') == 1) {
            _this.attr('click', 0);
            return;
        }
        // 最后一张的话将返回第一长
        if (frame > nums) {
            frame = 0;
        }
        // 如果是点击，直接跳转到点击那张
        if (click_frame) {
            frame = click_frame;
            _this.attr('click', 1);
        }
        // 设置当前是第几张
        _this.attr('frame', frame);
        // 计算css中的left
        var left = -width * frame;
        // 开始滑动
        _this.find('.JQ-slide-content').animate({'left': left}, 500);
        // 小标签的样式
        _this.find('.JQ-slide-nav li').removeClass().each(function(i, n) {
            if (i == frame) {
                $(this).addClass('on');
            }
        });
    };

})(jQuery); 