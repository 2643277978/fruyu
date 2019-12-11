
   var staticPath = typeof staticPath != "undefined" && staticPath != "" ? staticPath : "/static/";

	var new_element1=document.createElement("script"),
	new_element2=document.createElement("script"),
	new_element3=document.createElement("script"),
	new_element4=document.createElement("script"),
	new_element5=document.createElement("script"),
	new_element6=document.createElement("script"),
	new_element7=document.createElement("script");
	new_element8=document.createElement("script");
	new_element1.setAttribute("type","text/javascript");
	new_element2.setAttribute("type","text/javascript");
	new_element3.setAttribute("type","text/javascript");
	new_element4.setAttribute("type","text/javascript");
	new_element5.setAttribute("type","text/javascript");
	new_element6.setAttribute("type","text/javascript");
	new_element7.setAttribute("type","text/javascript");
	new_element8.setAttribute("type","text/javascript");
	new_element1.setAttribute("src",staticPath+"js/im/jquery-migrate-1.2.1.js?v=" + ~(-new Date()));
	new_element2.setAttribute("src",staticPath+"js/ui/calendar/WdatePicker.js?v=" + ~(-new Date()));
	new_element3.setAttribute("src","//g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js");
	new_element4.setAttribute("src",staticPath+"js/ui/jquery.dragsort-0.5.1.min.js?v=" + ~(-new Date()));
	new_element5.setAttribute("src",staticPath+"js/ui/jquery.ajaxFileUpload.js?v=" + ~(-new Date()));
	new_element6.setAttribute("src",staticPath+"js/im/getlist.js?v=" + ~(-new Date()));
	new_element7.setAttribute("src",staticPath+"js/im/Map_position.js?v=" + ~(-new Date()));
	new_element8.setAttribute("src",staticPath+"js/im/chat.js?v=" + ~(-new Date()));
	document.body.appendChild(new_element1);
	document.body.appendChild(new_element2);
	document.body.appendChild(new_element3);
	document.body.appendChild(new_element4);
	document.body.appendChild(new_element5);
	document.body.appendChild(new_element6);
	document.body.appendChild(new_element7);
	document.body.appendChild(new_element8);

var css_1;
    css_0 = document.getElementsByTagName('head')[0].appendChild(document.createElement('link'));
    css_0.href = staticPath+'css/im/chat.css?v=' + ~(-new Date());
    css_0.rel ="stylesheet";
    css_0.type= "text/css";
    css_2 = document.getElementsByTagName('head')[0].appendChild(document.createElement('link'));
    css_2.href ="//g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css";
    css_2.rel ="stylesheet";
    css_2.type= "text/css";

;(function(){ //code
	// <!--新消息底部弹出框s-->
	$('body').append('<div class="im-msg_tip  fn-clear"><span class="im-tip_head"><img onerror="nofind();" src="'+staticPath+'images/noPhoto_60.jpg"/></span><i></i><p>加载中~</p></div>');
	// <!--新消息底部弹出框e-->
	//聊天框
	var html = [], login=0;
	var login_if = !login?"im-no_login":''
	html.push('<div class="im-panel_box" ><div class="im-mask"></div>')
	//==-----==
	html.push('<div class="im-panel_list"><div class="im-pub_box"><div class="im-user_info fn-clear"><a class="im-_left '+login_if+'" href="javascript:;">');
	html.push('<i><img onerror="nofind();" src="'+staticPath+'images/noPhoto_60.jpg"/></i><span>未登录</span></a><a href="javascript:;" class="im-hide_btn" title="收起"></a></div>')
	html.push('<ul class="im-tab_ul fn-clear"><li class="im-cur_btn im-on"><a href="javascript:;" title="进行中的会话"><i></i></a></li><li class="im-F_btn"><a href="javascript:;" title="好友"><i ></i></a></li><li class="im-tip_btn"><a href="javascript:;" title="通知"><i class="im-tip_num">0</i></a></li></ul></div>	');
	//==-----==
	html.push('<div class="im-listBox">');
	html.push('<ul class="im-cur_chat im-chat_list im-box  im-show"></ul><ul class="im-f_list im-chat_list im-box"></ul><ul class="im-msg_list im-box"></ul>');
	html.push('</div>');
	//==---此处需要根据后台请求获取数据--==
	html.push('<div class="im-bottom_btn im-btn_group"><a href="javascript:;" class="im-search_btn" title="搜索用户"></a>');
	html.push('<a href="javascript:;" class="im-msg_btn"><div class="im-op_tip"><ul><li class="im-btn_comm"><span>评论</span></li><li class="im-btn_zan"><span>赞</span></li></ul></div></a>');
	html.push('</div></div>');
	$('body').append(html.join(''));

	//删除好友
	$('body').append('<div class="im-f_del im-tip_p"><h2>删除好友   <i title="关闭" class="im-close_p"></i></h2><div class="im-con_del"><p>删除后将互相从对方好友列表中消失</p><div class="im-del_box"><div class="im-del_head im-vip_head"><img src="'+staticPath+'images/noPhoto_60.jpg" /></div><div class="im-del_info"><h2>昵称</h2><p>(ID:加载中)</p></div></div><div class="im-btn_group"><a href="javascript:;" class="im-sure_del">确定</a><a href="javascript:;" class="im-cancel">取消</a></div></div></div>');

	//好友验证
	$('body').append('<div class="im-f_add im-tip_p"><h2>好友验证   <i title="关闭" class="im-close_p"></i></h2><div class="im-con_del"><textarea id="im-msg_txt"></textarea><div class="im-btn_group"><a href="javascript:;" class="im-cancel">取消</a><a href="javascript:;" class="im-send_test">发送</a></div></div></div>');

	//表情
	$('body').find('.im-panel_box').append('<div class="im-emoji-hide"><h2>选择表情</h2><ul class="im-emoji-list"></ul></div>');
	var emoj_list = []
	for(var i=1;i<51;i++){
		var m;//序号
		if(i<10){
			m='0'+i
		}else{
			m=i
		}
		emoj_list.push('<li><a href="javascript:;"><img src="/static/images/ui/emot/baidu/i_f'+m+'.png" alt="" /></a></li>');
	}
	$('.im-emoji-hide .im-emoji-list').html(emoj_list.join(''));

	//大图显示
	$('body').append('<div class="im-big_img"><img src="" /><i></i></div>');
	$('body').append('<div class="im-photo"><input type="file" name="Filedata" class="Filedata" id="image"></div>')
	//聊天记录
	$('body').append('<div class="im-notebox im-notes_panel"><h2>与<span>SIMMON</span>的聊天记录<i title="关闭" class="im-close_btn"></i></h2><div class="im-msg_record"><ul></ul><div class="im-rec_loading2"><i></i><p>加载中</p></div></div><div class="im-bottom_box" ><div class="im-date_chose" onclick="WdatePicker({el:\'im-date\', opposite:true, showButtonPanel: false,isShowClear:false, disabledDates:datelist})"   id="im-chose_date" title="选择日期"  ><input size="16" type="text" value="" readonly="readonly" id="im-date"></div><div class="im-page_chose"><a href="javascript:;" class="im-to_first" title="第一页"></a><a href="javascript:;" class="im-prev" title="上一页"></a><input type="text" class="im-page_mum" value="" readonly="readonly"/><a href="javascript:;" class="im-next" title="下一页"></a><a href="javascript:;" class="im-to_last" title="最后一页"></a><i title="选项" class="im-btn_op"></i><div class="im-zhe"><div class="im-pop_record"><a href="javascript:;" class="im-pop_btn">导出记录</a></div></div></div></div></div>');
	//播放器
	$('body').append('<div class="im-video_box"><div class="prism-player" id="im-video_player"></div><i class="im-close_video"></i></div>')
})();
