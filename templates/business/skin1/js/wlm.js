/*
	[Destoon B2B System] Copyright (c) 2008-2016 www.destoon.com
	This is NOT a freeware, use is subject to license.txt
*/
function Print(i) {if(isIE) {window.print();} else {var i = i ? i : 'content'; var w = window.open('','',''); w.opener = null; w.document.write('<div style="width:630px;">'+Dd(i).innerHTML+'</div>'); w.window.print();}}
function addFav(t) {document.write('<a href="'+window.location.href+'" title="'+document.title.replace(/<|>|'|"|&/g, '')+'" rel="sidebar" onclick="if(UA.indexOf(\'chrome\') != -1){alert(\''+L['chrome_fav_tip']+'\');return false;}window.external.addFavorite(this.href, this.title);return false;">'+t+'</a>');}
function SendPage() {
	var htm = '<form method="post" action="'+MEPath+'sendmail.php" id="dsendmail" target="_blank">';
	htm += '<input type="hidden" name="action" value="page"/>';
	htm += '<input type="hidden" name="title" value="'+$('#title').html()+'"/>';
	htm += '<input type="hidden" name="linkurl" value="'+window.location.href+'"/>';
	htm += '</form>';
	$('#destoon_space').html(htm);
	Dd('dsendmail').submit();
}
function SendFav() {
	var htm = '<form method="post" action="'+MEPath+'favorite.php" id="dfavorite" target="_blank">';
	htm += '<input type="hidden" name="action" value="add"/>';
	htm += '<input type="hidden" name="title" value="'+$('#title').html()+'"/>';
	htm += '<input type="hidden" name="url" value="'+window.location.href+'"/>';
	htm += '</form>';
	$('#destoon_space').html(htm);
	Dd('dfavorite').submit();
}
function SendReport(c) {
	var c = c ? c : ($('#title').length > 0 ? $('#title').html() : document.title)+'\n'+window.location.href;
	var htm = '<form method="post" action="'+DTPath+'api/report.php" id="dreport" target="_blank">';
	htm += '<textarea style="display:none;" name="content">'+c+'</textarea>';
	htm += '</form>';
	$('#destoon_space').html(htm);
	Dd('dreport').submit();
}
function Dsearch(i) {
	if(Dd('destoon_kw').value.length < 1 || Dd('destoon_kw').value == L['keyword_message']) {
		Dd('destoon_kw').value = '';window.setTimeout(function(){Dd('destoon_kw').value = L['keyword_message'];}, 500);
		return false;
	}
	if(i && Dd('destoon_search').action.indexOf('/api/') == -1) {$('#destoon_moduleid').remove();$('#destoon_spread').remove();}
	return true;
}
function Dsearch_adv() {Go(Dd('destoon_search').action.indexOf('/api/') != -1 ? DTPath+'api/search.php?moduleid='+Dd('destoon_moduleid').value : Dd('destoon_search').action);}
function Dsearch_top() {if(Dsearch(0)){Dd('destoon_search').action = DTPath+'api/search.php';Dd('destoon_spread').value=1;Dd('destoon_search').submit();}}
function View(s) {window.open(DTPath+'api/view.php?img='+s);}
function setModule(i, n) {Dd('destoon_search').action = DTPath+'api/search.php';Dd('destoon_moduleid').value = i;searchid = i;Dd('destoon_select').value = n;$('#search_module').fadeOut('fast');Dd('destoon_kw').focus();}
function setTip(w) {Dh('search_tips'); Dd('destoon_kw').value = w; Dd('destoon_search').submit();}
var tip_word = '';
function STip(w) {
	if(w.length < 2) {Dd('search_tips').innerHTML = ''; Dh('search_tips'); return;}
	if(w == tip_word) {return;} else {tip_word = w;}
	makeRequest('action=tipword&mid='+searchid+'&word='+w, AJPath, '_STip');
}
function _STip() {
	if(xmlHttp.readyState==4 && xmlHttp.status==200) {
		if(xmlHttp.responseText) {
			Ds('search_tips'); Dd('search_tips').innerHTML = xmlHttp.responseText + '<label onclick="Dh(\'search_tips\');">'+L['search_tips_close']+'&nbsp;&nbsp;</label>';
		} else {
			Dd('search_tips').innerHTML = ''; Dh('search_tips');
		}
	}
}
function SCTip(k) {
	var o = Dd('search_tips');
	if(o.style.display == 'none') {
		if(o.innerHTML != '') Ds('search_tips');
	} else {
		if(k == 13) {Dd('destoon_search').submit(); return;}
		Dd('destoon_kw').blur();
		var d = o.getElementsByTagName('div'); var l = d.length; var n, p; var c = w = -2;
		for(var i=0; i<l; i++) {if(d[i].className == 'search_t_div_2') c = i;}
		if(c == -2) {
			n = 0; p = l-1;
		} else if(c == 0) {
			n = 1; p = -1;
		} else if(c == l-1) {
			n = -1; p = l-2; 
		} else {
			n = c+1; p = c-1;
		}
		w = k == 38 ? p : n;
		if(c >= 0) d[c].className = 'search_t_div_1';
		if(w >= 0) d[w].className = 'search_t_div_2';
		if(w >= 0) {var r = d[w].innerHTML.split('>'); Dd('destoon_kw').value = r[2];} else {Dd('destoon_kw').value = tip_word;}
	}
}
function user_login() {
	if(Dd('user_name').value.length < 2) {Dd('user_name').focus(); return false;}
	if(Dd('user_pass').value == 'password' || Dd('user_pass').value.length < 6) {Dd('user_pass').focus(); return false;}
}
function show_answer(i) {document.write('<iframe src="'+MEPath+'answer.php?itemid='+i+'" name="destoon_answer" id="des'+'toon_answer" style="width:100%;height:0px;" scrolling="no" frameborder="0"></iframe>');}
function show_task(s) {document.write('<script type="text/javascript" src="'+DTPath+'api/task.js.php?'+s+'&refresh='+Math.random()+'.js"></sc'+'ript>');}
var sell_n = 0;
function sell_tip(o, i) {
	if(o.checked) {sell_n++; Dd('item_'+i).style.backgroundColor='#F1F6FC';} else {Dd('item_'+i).style.backgroundColor='#FFFFFF'; sell_n--;}
	if(sell_n < 0) sell_n = 0;
	if(sell_n > 1) {
		var aTag = o; var leftpos = toppos = 0;
		do {aTag = aTag.offsetParent; leftpos	+= aTag.offsetLeft; toppos += aTag.offsetTop;
		} while(aTag.offsetParent != null);
		var X = o.offsetLeft + leftpos - 10;
		var Y = o.offsetTop + toppos - 70;
		Dd('sell_tip').style.left = X + 'px';
		Dd('sell_tip').style.top = Y + 'px';
		o.checked ? Ds('sell_tip') : Dh('sell_tip');
	} else {
		Dh('sell_tip');
	}
}
function img_tip(o, i) {
	if(i) {
		if(i.indexOf('nopic.gif') == -1) {
			if(i.indexOf('.thumb.') != -1) {var t = i.split('.thumb.');var s = t[0];} else {var s = i;}
			var aTag = o; var leftpos = toppos = 0;
			do {aTag = aTag.offsetParent; leftpos	+= aTag.offsetLeft; toppos += aTag.offsetTop;
			} while(aTag.offsetParent != null);
			var X = o.offsetLeft + leftpos + 90;
			var Y = o.offsetTop + toppos - 20;
			Dd('img_tip').style.left = X + 'px';
			Dd('img_tip').style.top = Y + 'px';
			Ds('img_tip');
			Inner('img_tip', '<img src="'+s+'" onload="if(this.width<200) {Dh(\'img_tip\');}else if(this.width>300){this.width=300;}Dd(\'img_tip\').style.width=this.width+\'px\';"/>')
		}
	} else {
		Dh('img_tip');
	}
}
function GoMobile(url) {
	if((UA.indexOf('phone') != -1 || UA.indexOf('mobile') != -1 || UA.indexOf('android') != -1 || UA.indexOf('ipod') != -1) && get_cookie('mobile') != 'pc' && UA.indexOf('ipad') == -1) {
		Go(url);
	}
}
function Dqrcode() {
	var url = $('meta[http-equiv=mobile-agent]').attr('content') ? $('meta[http-equiv=mobile-agent]').attr('content').substr(17) : window.location.href;
	if($('#destoon_qrcode').length > 0) {
		if($('#destoon_qrcode').html().length < 10) {
			$('#destoon_qrcode').css({'position':'fixed','z-index':'99999','left':'50%','top':'0','margin-left':'-130px','width':'260px','background':'#FFFFFF','text-align':'center'});
			$('#destoon_qrcode').html('<div style="text-align:right;color:#555555;font-size:16px;padding-right:6px;cursor:pointer;">x</div><img src="'+DTPath+'api/qrcode.png.php?auth='+encodeURIComponent(url)+'" width="140" height="140"/><div style="padding:10px 0;font-size:14px;font-weight:bold;color:#555555;">扫一扫，直接在手机上打开</div><div style="padding-bottom:20px;color:#999999;">推荐微信、QQ扫一扫等扫码工具</div>');
			$('#destoon_qrcode').click(function(){$('#destoon_qrcode').fadeOut('fast');});
		}
		$('#destoon_qrcode').fadeIn('fast');
	}
}
function oauth_logout() {
	set_cookie('oauth_site', '');
	set_cookie('oauth_user', '');
	window.location.reload();
}

/*
	[Destoon B2B System] Copyright (c) 2008-2015 www.destoon.com
	This is NOT a freeware, use is subject to license.txt
*/
var UA = navigator.userAgent.toLowerCase();
var isIE = (document.all && window.ActiveXObject && !window.opera) ? true : false;
var isGecko = UA.indexOf('webkit') != -1;
var DMURL = document.location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '')+'/';
if(DTPath.indexOf(DMURL) != -1) DMURL = DTPath;
var AJPath = DMURL+'ajax.php';
var UPPath = DMURL+'upload.php';
if(isIE) try {document.execCommand("BackgroundImageCache", false, true);} catch(e) {}
var xmlHttp;
var Try = {
	these: function() {
		var returnValue;
		for (var i = 0; i < arguments.length; i++) {var lambda = arguments[i]; try {returnValue = lambda(); break;} catch (e) {}}
		return returnValue;
	}
}
function makeRequest(queryString, php, func, method) {
	xmlHttp = Try.these(
		function() {return new XMLHttpRequest()},
		function() {return new ActiveXObject('Msxml2.XMLHTTP')},
		function() {return new ActiveXObject('Microsoft.XMLHTTP')}
	);
	method = (typeof method == 'undefined') ? 'post' : 'get';
	if(func) xmlHttp.onreadystatechange = eval(func);
	xmlHttp.open(method, method == 'post' ? php : php+'?'+queryString, true);
	xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xmlHttp.send(method == 'post' ? queryString : null);
}
function Dd(i) {return document.getElementById(i);}
function Ds(i) {Dd(i).style.display = '';}
function Dh(i) {Dd(i).style.display = 'none';}
function Dsh(i) {Dd(i).style.display = Dd(i).style.display == 'none' ? '' : 'none';}
function Df(i) {Dd(i).focus();}
var tID=0;
function Tab(ID) {
	var tTab = Dd('Tab'+tID); var tTabs = Dd('Tabs'+tID); var Tab = Dd('Tab'+ID); var Tabs = Dd('Tabs'+ID);
	if(ID!=tID)	{tTab.className='tab'; Tab.className='tab_on'; tTabs.style.display='none'; Tabs.style.display=''; tID = ID; try{Dd('tab').value=ID;}catch(e){}}
}
function checkall(f, t) {
	var t = t ? t : 1;
	for(var i = 0; i < f.elements.length; i++) {
		var e = f.elements[i];
		if(e.type != 'checkbox' || e.name == 'msg' || e.name == 'eml' || e.name == 'sms' || e.name == 'wec') continue;
		if(t == 1) e.checked = e.checked ? false : true;
		if(t == 2) e.checked = true;
		if(t == 3) e.checked = false;	
	}
}
function Dmsg(str, i, s, t) {
	var t = t ? t : 5000; var s = s ? 1 : 0; var h = i == 'content' ? 450 : 50;
	try{
		if(typeof Dbrowser != 'undefined') {alert(str);return;}
		if(s || i == 'content'){$("html, body").animate({scrollTop:$('#d'+i).offset().top-h}, 100);}
		Dd('d'+i).innerHTML = '<img src="'+SKPath+'image/check_error.gif" width="12" height="12" align="absmiddle"/> '+str+sound('tip');
		Dd(i).focus();
	}catch(e){}
	window.setTimeout(function(){Dd('d'+i).innerHTML = '';}, t);
}
function Inner(i,s) {try {Dd(i).innerHTML = s;}catch(e){}}
function Go(u) {window.location = u;}
function confirmURI(m,f) {if(confirm(m)) Go(f);}
function showmsg(m, t) {
	var t = t ? t : 5000; var s = m.indexOf(L['str_delete']) != -1 ? 'delete' : 'ok';
	try{Dd('msgbox').style.display = '';Dd('msgbox').innerHTML = m+sound(s);window.setTimeout('closemsg();', t);}catch(e){}
}
function closemsg() {try{Dd('msgbox').innerHTML = '';Dd('msgbox').style.display = 'none';}catch(e){}}
function sound(f) {return '<div style="float:left;"><embed src="'+DTPath+'file/flash/'+f+'.swf" quality="high" type="application/x-shockwave-flash" height="0" width="0" hidden="true"/></div>';}
function Eh(t) {
	var t = t ? t : 'select';
	if(isIE) {
		var arVersion = navigator.appVersion.split("MSIE"); var IEversion = parseFloat(arVersion[1]);		
		if(IEversion >= 7 || IEversion < 5) return;
		var ss = document.body.getElementsByTagName(t);					
		for(var i=0;i<ss.length;i++) {ss[i].style.visibility = 'hidden';}
	}
}
function Es(t) {
	var t = t ? t : 'select';
	if(isIE) {
		var arVersion = navigator.appVersion.split("MSIE"); var IEversion = parseFloat(arVersion[1]);		
		if(IEversion >= 7 || IEversion < 5) return;
		var ss = document.body.getElementsByTagName(t);					
		for(var i=0;i<ss.length;i++) {ss[i].style.visibility = 'visible';}
	}
}
function FCKLen(i) {return EditorAPI(i, 'len');}
function FCKXHTML(i) {return EditorAPI(i, 'get');}
function Tb(d, t, p, c) {
	for(var i=1; i<=t; i++) {
		if(d == i) {Dd(p+'_t_'+i).className = c+'_2'; Ds(p+'_c_'+i);} else {Dd(p+'_t_'+i).className = c+'_1'; Dh(p+'_c_'+i);}
	}
}
function ext(v) {return v.substring(v.lastIndexOf('.')+1, v.length).toLowerCase();}
function PushNew() {
	$('#destoon_push').remove();
	s = document.createElement("script");
	s.type = "text/javascript";
	s.id = "destoon_push";
	s.src = DTPath+"api/push.js.php?refresh="+Math.random()+".js";
	document.body.appendChild(s);
}
function Dnotification(id, url, icon, title, content) {
	 if(window.webkitNotifications) {
		 if(webkitNotifications.checkPermission()==1) {
			 window.onclick = function() {
				window.webkitNotifications.requestPermission(function() {
					if(webkitNotifications.checkPermission()==0) {						
						var N = window.webkitNotifications.createNotification(icon, title, content);
						N.replaceId = id;N.onclick = function() {window.focus();window.top.location = url;N.cancel();};N.show();
					}
				});
			 };
		 } else if(webkitNotifications.checkPermission()==0) {	
			var N = window.webkitNotifications.createNotification(icon, title, content);
			N.replaceId = id;N.onclick = function() {window.focus();window.top.location = url;N.cancel();};N.show();
		 }
	 }
}
function set_cookie(n, v, d) {
	var e = ''; 
	var f = d ? d : 365;
	e = new Date((new Date()).getTime() + f * 86400000);
	e = "; expires=" + e.toGMTString();
	document.cookie = CKPrex + n + "=" + v + ((CKPath == "") ? "" : ("; path=" + CKPath)) + ((CKDomain =="") ? "" : ("; domain=" + CKDomain)) + e; 
}
function get_cookie(n) {
	var v = ''; var s = CKPrex + n + "=";
	if(document.cookie.length > 0) {
		o = document.cookie.indexOf(s);
		if(o != -1) {	
			o += s.length;
			end = document.cookie.indexOf(";", o);
			if(end == -1) end = document.cookie.length;
			v = unescape(document.cookie.substring(o, end));
		}
	}
	return v;
}
function del_cookie(n) {var e = new Date((new Date()).getTime() - 1 ); e = "; expires=" + e.toGMTString(); document.cookie = CKPrex + n + "=" + escape("") +";path=/"+ e;}
function set_local(n, v) {window.localStorage ? localStorage.setItem(CKPrex + n, v) : set_cookie(n, v);}
function get_local(n) {return window.localStorage ? localStorage.getItem(CKPrex + n) : get_cookie(n);}
function del_local(n) {window.localStorage ? localStorage.removeItem(CKPrex + n) : del_cookie(n);}
function substr_count(str, exp) {if(str == '') return 0;var s = str.split(exp);return s.length-1;}
function checked_count(id) {var c=0;$('#'+id).find(':checked').each(function(i){c++;});return c;}
function lang(s, a) {for(var i = 0; i < a.length; i++) {s = s.replace('{V'+i+'}', a[i]);} return s;}
function get_cart() {var cart = parseInt(get_cookie('cart'));return cart > 0 ? cart : 0;}
document.onkeydown = function(e) {
	var k = typeof e == 'undefined' ? event.keyCode : e.keyCode;
	if(k == 37) {
		try{if(Dd('destoon_previous').value && typeof document.activeElement.name == 'undefined')Go(Dd('destoon_previous').value);}catch(e){}
	} else if(k == 39) {
		try{if(Dd('destoon_next').value && typeof document.activeElement.name == 'undefined')Go(Dd('destoon_next').value);}catch(e){}
	} else if(k == 38 || k == 40 || k == 13) {
		try{if(Dd('search_tips').style.display != 'none' || Dd('search_tips').innerHTML != ''){SCTip(k);return false;}}catch(e){}
	}
}
$(document).ready(function(){
	$(window).bind("scroll.back2top", function() {
		var st = $(document).scrollTop(), winh = $(window).height();
        (st > 0) ? $('.back2top').show() : $('.back2top').hide();        
        if(!window.XMLHttpRequest) { $('.back2top').css("top", st + winh - 166);}//IE6
	});
	$('.back2top').click(function() {
		$("html, body").animate({scrollTop:0}, 200);
	});
});

/*
	首页上面最新新提示
*/

function check() {
	var l;
	var f;
	var brand=$("#brand").val();
	f = 'company';
	l = Dd(f).value.length;
	if(l < 2) {
		alert('请填写联系人');
		Dd(f).focus();
		return false;{}
	}
	f = 'mobile';
	l = Dd(f).value.length;
	if(l < 2) {
		alert('请填写联系电话');
		Dd(f).focus();
		return false;{}
	}
	if(brand=="" || brand=="请选择品牌"){
	alert("请选择您要加盟的品牌");
	return false;
	}
	f = 'joinqy';
	l = Dd(f).value.length;
	if(l < 2) {
		alert('请填写您的区域');
		Dd(f).focus();
		return false;{}
	}					

}


/**file:v2/js/index.js**/
/**
*包含首页所有的滚动的js
**/
$(function () {
    
})
<!--主要用于：微直播，诚信品牌，招商加盟滚动，十大品牌左右选择，企业频道滚动
/*MSClass (Class Of Marquee Scroll通用不间断滚动JS封装类) Ver 1.65*\
　应用说明:页面包含<script type="text/javascript" src="MSClass.js"></script>
	
	创建实例:
		//参数直接赋值法
		new Marquee("marquee")
		new Marquee("marquee","top")
		......
		new Marquee("marquee",0,1,760,52)
		new Marquee("marquee","top",1,760,52,50,5000)
		......
		new Marquee("marquee",0,1,760,104,50,5000,3000,52)
		new Marquee("marquee",null,null,760,104,null,5000,null,-1)

		//参数动态赋值法
		var marquee1 = new Marquee("marquee")	*此参数必选
		marquee1.Direction = "top";	或者	marquee1.Direction = 0;
		marquee1.Step = 1;
		marquee1.Width = 760;
		marquee1.Height = 52;
		marquee1.Timer = 50;
		marquee1.DelayTime = 5000;
		marquee1.WaitTime = 3000;
		marquee1.ScrollStep = 52;
		marquee1.Start();

	参数说明:
		ID		"marquee"	容器ID		(必选)
		Direction	(0)		滚动方向	(可选,默认为0向上滚动) 可设置的值包括:0,1,2,3,"top","bottom","left","right" (0向上 1向下 2向左 3向右)
		Step		(1)		滚动的步长	(可选,默认值为2,数值越大,滚动越快)
		Width		(760)		容器可视宽度	(可选,默认值为容器初始设置的宽度)
		Height		(52)		容器可视高度	(可选,默认值为容器初始设置的高度)
		Timer		(50)		定时器		(可选,默认值为30,数值越小,滚动的速度越快,1000=1秒,建议不小于20)
		DelayTime	(5000)		间歇停顿延迟时间(可选,默认为0不停顿,1000=1秒)
		WaitTime	(3000)		开始时的等待时间(可选,默认或0为不等待,1000=1秒)
		ScrollStep	(52)		间歇滚动间距	(可选,默认为翻屏宽/高度,该数值与延迟均为0则为鼠标悬停控制,-1禁止鼠标控制)

　使用建议:
		1、建议直接赋予容器的显示区域的宽度和高度，如(<div id="marquee" style="width:760px;height:52px;">......</div>)
		2、建议为容器添加样式overflow = auto，如(<div id="marquee" style="width:760px;height:52px;overflow:auto;">......</div>)
		3、为了更准确的获取滚动区域的宽度和高度，请尽可能将各滚动单位直接赋予正确宽高度
		4、对于TABLE标记的横向滚动，需要对TABLE添加样式display = inline，如(<div id="marquee" style="width:760px;height:52px;overflow:auto;"><table style="display:inline">......</table></div>)
		5、对于翻屏滚动或间歇滚动，要注意各滚动单位间的间距，同时需要对容器的可视高度和可视宽度做好准确的设置，对于各滚动单位间的间距可以通过设置行间距或者单元格的高宽度来进行调整
		6、对于LI自动换行的问题暂时没有更好的解决办法，建议将其转换成表格(TABLE)的形式来达到同等的效果
		7、针对横向滚动的文字段落，如果最末端是以空格" "结束的，请将空格" "转换成"&nbsp;"
		8、鼠标悬停滚动思想源自Flash，所以有一定的局限性（容器内仅允许用图片<img>或者带链接的图片<a><img></a>的形式，并需要禁止其自动换行）
\***程序制作/版权所有:崔永祥(333) E-Mail:zhadan007@21cn.com 网址:http://www.popub.net***/
function Marquee()
{
	this.ID = document.getElementById(arguments[0]);
	if(!this.ID)
	{
		//alert("您要设置的\"" + arguments[0] + "\"初始化错误\r\n请检查标签ID设置是否正确!");
		this.ID = -1;
		return;
	}
	this.Direction = this.Width = this.Height = this.DelayTime = this.WaitTime = this.CTL = this.StartID = this.Stop = this.MouseOver = 0;
	this.Step = 1;
	this.Timer = 30;
	this.DirectionArray = {"top":0 , "up":0 , "bottom":1 , "down":1 , "left":2 , "right":3};
	if(typeof arguments[1] == "number" || typeof arguments[1] == "string")this.Direction = arguments[1];
	if(typeof arguments[2] == "number")this.Step = arguments[2];
	if(typeof arguments[3] == "number")this.Width = arguments[3];
	if(typeof arguments[4] == "number")this.Height = arguments[4];
	if(typeof arguments[5] == "number")this.Timer = arguments[5];
	if(typeof arguments[6] == "number")this.DelayTime = arguments[6];
	if(typeof arguments[7] == "number")this.WaitTime = arguments[7];
	if(typeof arguments[8] == "number")this.ScrollStep = arguments[8];
	this.ID.style.overflow = this.ID.style.overflowX = this.ID.style.overflowY = "hidden";
	this.ID.noWrap = true;
	this.IsNotOpera = (navigator.userAgent.toLowerCase().indexOf("opera") == -1);
	if(arguments.length >= 7)this.Start();
}

Marquee.prototype.Start = function()
{
	if(this.ID == -1)return;
	if(this.WaitTime < 800)this.WaitTime = 800;
	if(this.Timer < 20)this.Timer = 20;
	if(this.Width == 0)this.Width = parseInt(this.ID.style.width);
	if(this.Height == 0)this.Height = parseInt(this.ID.style.height);
	if(typeof this.Direction == "string")this.Direction = this.DirectionArray[this.Direction.toString().toLowerCase()];
	this.HalfWidth = Math.round(this.Width / 2);
	this.HalfHeight = Math.round(this.Height / 2);
	this.BakStep = this.Step;
	this.ID.style.width = this.Width + "px";
	this.ID.style.height = this.Height + "px";
	if(typeof this.ScrollStep != "number")this.ScrollStep = this.Direction > 1 ? this.Width : this.Height;
	var templateLeft = "<table cellspacing='0' cellpadding='0' style='border-collapse:collapse;display:inline;'><tr><td noWrap=true style='white-space: nowrap;word-break:keep-all;'>MSCLASS_TEMP_HTML</td><td noWrap=true style='white-space: nowrap;word-break:keep-all;'>MSCLASS_TEMP_HTML</td></tr></table>";
	var templateTop = "<table cellspacing='0' cellpadding='0' style='border-collapse:collapse;'><tr><td>MSCLASS_TEMP_HTML</td></tr><tr><td>MSCLASS_TEMP_HTML</td></tr></table>";
	var msobj = this;
	msobj.tempHTML = msobj.ID.innerHTML;
	if(msobj.Direction <= 1)
	{
		msobj.ID.innerHTML = templateTop.replace(/MSCLASS_TEMP_HTML/g,msobj.ID.innerHTML);
	}
	else
	{
		if(msobj.ScrollStep == 0 && msobj.DelayTime == 0)
		{
			msobj.ID.innerHTML += msobj.ID.innerHTML;
		}
		else
		{
			msobj.ID.innerHTML = templateLeft.replace(/MSCLASS_TEMP_HTML/g,msobj.ID.innerHTML);
		}
	}
	var timer = this.Timer;
	var delaytime = this.DelayTime;
	var waittime = this.WaitTime;
	msobj.StartID = function(){msobj.Scroll()}
	msobj.Continue = function()
				{
					if(msobj.MouseOver == 1)
					{
						setTimeout(msobj.Continue,delaytime);
					}
					else
					{	clearInterval(msobj.TimerID);
						msobj.CTL = msobj.Stop = 0;
						msobj.TimerID = setInterval(msobj.StartID,timer);
					}
				}

	msobj.Pause = function()
			{
				msobj.Stop = 1;
				clearInterval(msobj.TimerID);
				setTimeout(msobj.Continue,delaytime);
			}

	msobj.Begin = function()
		{
			msobj.ClientScroll = msobj.Direction > 1 ? msobj.ID.scrollWidth / 2 : msobj.ID.scrollHeight / 2;
			if((msobj.Direction <= 1 && msobj.ClientScroll <= msobj.Height + msobj.Step) || (msobj.Direction > 1 && msobj.ClientScroll <= msobj.Width + msobj.Step))			{
				msobj.ID.innerHTML = msobj.tempHTML;
				delete(msobj.tempHTML);
				return;
			}
			delete(msobj.tempHTML);
			msobj.TimerID = setInterval(msobj.StartID,timer);
			if(msobj.ScrollStep < 0)return;
			msobj.ID.onmousemove = function(event)
						{
							if(msobj.ScrollStep == 0 && msobj.Direction > 1)
							{
								var event = event || window.event;
								if(window.event)
								{
									if(msobj.IsNotOpera)
									{
										msobj.EventLeft = event.srcElement.id == msobj.ID.id ? event.offsetX - msobj.ID.scrollLeft : event.srcElement.offsetLeft - msobj.ID.scrollLeft + event.offsetX;
									}
									else
									{
										msobj.ScrollStep = null;
										return;
									}
								}
								else
								{
									msobj.EventLeft = event.layerX - msobj.ID.scrollLeft;
								}
								msobj.Direction = msobj.EventLeft > msobj.HalfWidth ? 3 : 2;
								msobj.AbsCenter = Math.abs(msobj.HalfWidth - msobj.EventLeft);
								msobj.Step = Math.round(msobj.AbsCenter * (msobj.BakStep*2) / msobj.HalfWidth);
							}
						}
			msobj.ID.onmouseover = function()
						{
							if(msobj.ScrollStep == 0)return;
							msobj.MouseOver = 1;
							clearInterval(msobj.TimerID);
						}
			msobj.ID.onmouseout = function()
						{
							if(msobj.ScrollStep == 0)
							{
								if(msobj.Step == 0)msobj.Step = 1;
								return;
							}
							msobj.MouseOver = 0;
							if(msobj.Stop == 0)
							{
								clearInterval(msobj.TimerID);
								msobj.TimerID = setInterval(msobj.StartID,timer);
							}
						}
		}
	setTimeout(msobj.Begin,waittime);
}

Marquee.prototype.Scroll = function()
{
	switch(this.Direction)
	{
		case 0:
			this.CTL += this.Step;
			if(this.CTL >= this.ScrollStep && this.DelayTime > 0)
			{
				this.ID.scrollTop += this.ScrollStep + this.Step - this.CTL;
				this.Pause();
				return;
			}
			else
			{
				if(this.ID.scrollTop >= this.ClientScroll)
				{
					this.ID.scrollTop -= this.ClientScroll;
				}
				this.ID.scrollTop += this.Step;
			}
		break;

		case 1:
			this.CTL += this.Step;
			if(this.CTL >= this.ScrollStep && this.DelayTime > 0)
			{
				this.ID.scrollTop -= this.ScrollStep + this.Step - this.CTL;
				this.Pause();
				return;
			}
			else
			{
				if(this.ID.scrollTop <= 0)
				{
					this.ID.scrollTop += this.ClientScroll;
				}
				this.ID.scrollTop -= this.Step;
			}
		break;

		case 2:
			this.CTL += this.Step;
			if(this.CTL >= this.ScrollStep && this.DelayTime > 0)
			{
				this.ID.scrollLeft += this.ScrollStep + this.Step - this.CTL;
				this.Pause();
				return;
			}
			else
			{
				if(this.ID.scrollLeft >= this.ClientScroll)
				{
					this.ID.scrollLeft -= this.ClientScroll;
				}
				this.ID.scrollLeft += this.Step;
			}
		break;

		case 3:
			this.CTL += this.Step;
			if(this.CTL >= this.ScrollStep && this.DelayTime > 0)
			{
				this.ID.scrollLeft -= this.ScrollStep + this.Step - this.CTL;
				this.Pause();
				return;
			}
			else
			{
				if(this.ID.scrollLeft <= 0)
				{
					this.ID.scrollLeft += this.ClientScroll;
				}
				this.ID.scrollLeft -= this.Step;
			}
		break;
	}
}
<!--主要用于：墙面效果图大图滚动
if (!window.sLiDer) {
    var sLiDer = (function () {
        var slider_Interval = []; //多个.sina_g计数器

        var s_types = new Array(); //每个slider_s的切换触发类型

        var hasAjax = false; //是否具有ajax切换插件


        //添加默认切换数量图标
        var appendNums = function (sina_g) {
            var o = $(sina_g);
            if (o.find(".num_s").length == 0) {
                var num_s = $("<ul>").addClass("num_s").attr("style", "width:auto;margin:0 auto;display:inline-block;*display:inline;*zoom:1;");
                if (o.hasClass("num_s_hide")) {
                    num_s.css("display", "none");
                }
                for (var j = 0; j < o.find(".slider_s").children(":not(.item_template)").length; j++) {
                    var num_s_li = $("<li>").attr("style", "display: block;float: left;width: 14px;height: 14px;margin:0px 4px;cursor: pointer;overflow: hidden;border:1px #fff solid;background-color:#ccc;").html("&nbsp;");
                    num_s.append(num_s_li);
                }
                o.append($("<div>").attr("style", "height: 30px;position:absolute;z-index:999;bottom:25px;width:100%;left:0;text-align:center;").append(num_s));
            }
        };

        ///附加左右点击按钮
        var appendBtn = function (o) {
            var btn_s_left, btn_s_right;
            if (o.parents(".sina_g").find(".photo_right_btn").length > 0 && o.parents(".sina_g").find(".photo_left_btn").length > 0) {
                btn_s_left = o.parents(".sina_g").find(".photo_left_btn");
                btn_s_right = o.parents(".sina_g").find(".photo_right_btn");
            } else {
                var btn_s = $("<div>");
                btn_s.attr("style", "width:26px;height:52px;overflow:hidden;position:absolute;cursor:pointer;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;z-index:9999;").css("top", "38%");

                btn_s_left = $(btn_s[0].outerHTML).hover(function () {
                    $(this).css("filter", "alpha(opacity=100)").css("-moz-opacity", "1").css("opacity", "1");
                }, function () {
                    $(this).css("filter", "alpha(opacity=50)").css("-moz-opacity", "0.5").css("opacity", "0.5");
                });
                btn_s_right = $(btn_s[0].outerHTML).hover(function () {
                    $(this).css("filter", "alpha(opacity=100)").css("-moz-opacity", "1").css("opacity", "1");
                }, function () {
                    $(this).css("filter", "alpha(opacity=50)").css("-moz-opacity", "0.5").css("opacity", "0.5");
                });
                btn_s_left.css("left", "10px");
                btn_s_left.html('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0 26 L16 0 L23 4 L9 26 L23 46 L18 52 Z" style="fill:#666;stroke:#fff;stroke-width:1"/></svg>');
                var rlh = (o.parent().width() - o.parents(".sina_g").width());
                if (rlh < 0) {
                    rlh = 0;
                }
                btn_s_right.css("right", rlh == 0 ? "10px" : (rlh + "px"));
                btn_s_right.html('<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M6 0 L26 26 L6 52 L0 46 L16 26 L0 6 L6 0 Z" style="fill:#666;stroke:#fff;stroke-width:1"/></svg>');

                o.parent().append(btn_s_left).append(btn_s_right);
            }

            btn_s_right.bind("click", function () {
                Incremental($(this).parents(".sina_g"), true);
            }).css("-webkit-user-select", "none");

            btn_s_left.bind("click", function () {
                Incremental($(this).parents(".sina_g"), false);
            }).css("-webkit-user-select", "none");
        };

        var adaptive = {
            //不固定宽高的自适子集和宽高(o:slider_s)
            imageRes: function (o) {
                var pw = o.parent().width();
                var ph = o.parent().height();
                o.children().width(pw);
                o.find("img").width(pw);
                if (ph != 0) {
                    o.find("img").height(ph);
                } else {
                    var first = o.children().eq(0);
                    first.find("img").bind("load", function () {
                        var th = $(this).parents(".slider_s").children().eq(0).height();
                        $(this).parents(".slider_s").height(th).parent().height(th);
                    });
                    if (first.height() > 0) {
                        o.height(first.height()).parent().height(first.height());
                    }
                }
            },
            //背景幻灯，子集元素图片为背景时的默认操作方法
            imageBg: function (o) {
                var cli = o.children().eq(0);
                var w = o.parent().width();
                o.children().width(w);
                $(window).resize(function () {
                    var ro = o;
                    var rcli = ro.children().eq(0);
                    var rindex = Math.round(ro.attr("index"));
                    ro.width(ro.parent().width() * ro.children().length);
                    ro.children().width(ro.parent().width());
                    ro.stop(true, false).animate({ left: -ro.parent().width() * rindex }, 1);
                });
            },
            //父级高度默认设定
            parentdefautHeight: function (o) {

                o.parent().css("overflow", "hidden");
                var index = parseInt(o.attr("index") || "0");
                if (o.parent().height() == 0) {
                    ///当.slider_s的父级高度为0时处理高度问题
                    var childimg = o.children().eq(index).find("img");

                    if (childimg.length > 0) {
                        childimg.bind("load", function () {
                            //$(this).width(o.parent().width());
                            var w = $(this).width();
                            var h = $(this).height();
                            var r = true;
                            for (var k = 0; k < childimg.length; k++) {
                                if (childimg.eq(k).width() == 0 || childimg.eq(k).height() == 0) {
                                    r = false;
                                }
                            }

                            if (!r) {
                                return;
                            }

                            var childheight = o.children().eq(0).height();
                            if (childheight != 0) {
                                o.parent().height(childheight);
                                o.height(childheight);
                            } else {
                                o.parent().height(w);
                                o.height(h);
                            }
                            if (!o.parents(".sina_g").hasClass("sinbo_l") && !o.parents(".sina_g").hasClass("ad_fade")) {
                                if (o.height() == 0) {
                                    o.height(o.parent().height() * o.children().length);
                                }
                            }
                        });
                    }

                    var childheight = o.children().eq(index).height();
                    if (childheight > 0) {
                        o.parent().height(childheight);
                        o.height(childheight);
                    }
                } else {

                    if (o.attr('auto_h')) {
                        o.parent().height(o.children().eq(index).height());
                    } else {
                        o.height(o.parent().height());
                    }
                }
            },
            numsRes: function (o) {
                var first = o.find("img");
                if (first.length > 0) {
                    first.eq(0).bind("load", function () {
                        var th = $(this).parent(0).height();
                        var parent = $(this).parents(".num_s").parent();
                        if (!parent.hasClass("sina_g")) {
                            $(this).parents(".num_s").parent().height(th);
                        }
                    });
                    if (first.height() > 0 && !o.parent().hasClass("sina_g")) {
                        o.parent().height(GetRealHeight(first));
                    }
                }
            },
            //无缝属性
            noGap: function (o) {
                var hasitem = o.parents(".sina_g").hasClass("ad_item");
                var html = o.html();
                var length = o.children().length;
                o.append(html);

                var num_s = o.parents(".sina_g").find(".num_s");
                if (hasitem) {
                    var lihtml = num_s.children()[0].outerHTML;

                    for (var i = 0; i < length; i++) {
                        num_s.append(lihtml);
                    }
                } else {
                    num_s.append(num_s.html());
                }
            }
        };


        var slideDirection = {
            //向左滑动
            Left: function (o) {
                var pw = o.parent().width();
                var cli = o.children().eq(0);
                var boxwidth = 0;
                if (!o.parents(".sina_g").hasClass("ad_item")) {
                    boxwidth = o.parent().width() > cli.width() ? o.parent().width() : cli.width();
                } else {
                    boxwidth = GetItemWidth(o);
                }
                var childwidth = o.children().eq(0).width();
                o.children().width(childwidth);
                o.width(boxwidth * o.children().length);

                //该处是碰到鬼了//320屏幕手机再iframe下设置slider宽度后父级宽度直接变成640
                if (o.parent().width() != pw && o.parent().width() > boxwidth) {
                    o.parent().width(pw);
                }
                o.children().css("float", "left");
            },
            //渐隐渐现
            Fade: function (o) {
                o.children().css("position", "absolute").css("opacity", "0").eq(0).css("opacity", "1");
                o.css("position", "static");
            },
            Top: function (o) {
                o.height(o.parent().height() * o.children().length);
            },
            Wheel: function (o) {
                //实现鼠标滚动切换
                o.parents(".sina_g").bind('mousewheel', function (event, delta, deltaX, deltaY) {
                    var p = $(this);
                    if (delta == null) {
                        if (event.originalEvent != null) {
                            delta = event.originalEvent.wheelDelta;
                        } else {
                            return;
                        }
                    }
                    event.preventDefault();
                    if (delta < 0) {
                        Incremental(p, true);
                    } else {
                        Incremental(p, false);
                    }
                });
            },
            AutoTime: function (p, i) {
                if (p.hasClass("sinbo_t")) {
                    slider_Interval[i] = setInterval("sLiDer.DelayEvent(" + i + ",'" + s_types[i] + "')", 4000);
                    p.hover(function (e) {
                        if (e.toElement != null) {

                            clearInterval(slider_Interval[i]);
                        }
                    }, function () {
                        clearInterval(slider_Interval[i]);
                        slider_Interval[i] = setInterval("sLiDer.DelayEvent(" + i + ",'" + s_types[i] + "')", 4000);
                    });
                }
            }
        };

        //加载处理主方法
        var Init = function (init_index) {
            if (//!window.sliderInit
				true) {
                window.sliderInit = 1;
                $(function () {
                    var ad_ss = $(".sina_g");
                    if (init_index != null && init_index > -1) {
                        ad_ss = ad_ss.eq(init_index);
                    }

                    //判断无.num_s的sina_g中添加默认num_s
                    ad_ss.each(function (i) {
                        appendNums(this);
                    });

                    var s_i = 0;
                    var olist = ad_ss.find('.num_s').children();
                    var s_list = ad_ss.find(".slider_s");
                    s_list.each(function (i) {
                        var o = $(this);
                        o.attr("slider_index", i);
                    });



                    //判断是否具有ajax插件
                    try {
                        if (sLiDer["Ajax"] != null) {
                            hasAjax = true;
                            sLiDer.Ajax.Init();
                        } else {
                            //alert("未加载slider-ajax插件");
                        }
                    }
                    catch (e) {

                    }

                    s_list.each(function (i) {
                        var o = $(this);

                        var owidth = o.width();

                        o.parent().css("position", "relative");
                        o.css("position", "absolute");
                        if (o.width() != owidth) {
                            o.width(owidth);
                        }

                        var cli = o.children().css({ "display": "block", "min-height": "32px" }).eq(0);

                        if (cli.length > 0) {
                            if (o.parents(".sina_g").hasClass("ad_nogap")) {
                                adaptive.noGap(o);
                            }
                            //自动缩放class ad_res(自适应)
                            if (o.parents(".sina_g").hasClass("ad_res")) {
                                adaptive.imageRes(o);
                            }

                            if (o.parents(".sina_g").hasClass("sinbo_l")) {
                                slideDirection.Left(o);
                            } else if (o.parents(".sina_g").hasClass("ad_fade")) {
                                slideDirection.Fade(o);
                            }
                            else {
                                slideDirection.Top(o);
                            }

                            if (o.parents(".sina_g").hasClass("ad_bg")) {
                                adaptive.imageBg(o);
                            }

                            if (o.parents(".sina_g").hasClass("sinbo_an")) {
                                appendBtn(o);
                            }


                            if (o.parents(".sina_g").hasClass("ad_wheel")) {
                                slideDirection.Wheel(o);
                            }

                            //实现拖拽
                            Drop(o);

                            //重置宽高
                            adaptive.parentdefautHeight(o);
                        }
                    });

                    s_list.each(function (i) {
                        var p = $(this).parents(".sina_g");

                        if (p.hasClass("ad_click")) {
                            s_types[i] = "click";
                            p.find(".num_s").children().bind("click", function () {
                                ChangeEvent(this);
                            });
                        }
                        else {
                            s_types[i] = "mouseover";
                            p.find(".num_s").children().bind("mouseover", function () {
                                ChangeEvent(this);
                            });
                        }
                    });

                    olist.each(function (a) { //选中第一个
                        var p = $(this).parents('.sina_g');
                        var ps = p.find(".slider_s");
                        var index = 0;
                        if (ps.attr("index") != null) {
                            index = parseInt(ps.attr("index"));
                        }
                        if ($(this).parents('.sina_g').find('.num_s').children().index(this) == index) {
                            ChangeEvent(this, index != 0 ? 0 : 400);
                            s_i++;
                            if (index != 0) {
                                $(this).parents('.sina_g').find(".slider_s").css("visibility", "visible");
                            }
                        }
                    });

                    ///自动滚动
                    ad_ss.each(function (i) {
                        slideDirection.AutoTime($(this), i);
                        var num_s = $(this).find(".num_s");
                        if (!num_s.hasClass("noHide")) {
                            InitNums(num_s);
                        }
                    });
                });
            }
        };

        var ADSupportsTouches = ("createTouch" in document) || ('ontouchstart' in window) || 0

        return { Init: Init, CancelSlider: CancelSlider, StartSlider: StartSlider, ChangeEvent: ChangeEvent, DelayEvent: DelayEvent };

        function InitNums(num_s) {
            var p = num_s.parents(".sina_g");
            if (p.hasClass("sinbo_l")) {
                var childrens = num_s.children();
                if (childrens.length > 0) {
                    var w = 0;
                    //adaptive.numsRes(num_s);

                    for (var i = 0; i < childrens.length; i++) {
                        childrens.eq(i).css("width", childrens.eq(i).width());
                        w += GetRealWidth(childrens.eq(i));
                    }

                    if (w > num_s.width()) {
                        num_s.width(w);
                        num_s.addClass("hideNum_s");
                        num_s.parent().css("position", "relative");
                        num_s.css("position", "absolute");
                    }
                }
            }
        }

        //增量方法
        function DelayEvent(i, eventname) {
            var lis = $(".sina_g").eq(i).find('.num_s').children();
            var lon = $(".sina_g").eq(i).find('.num_s').find(".on");
            var index = lis.index(lon);
            if (index == lis.length - 1) {
                index = 0;
            } else {
                index = index + 1;
            }
            lis.eq(index).trigger(eventname);
        }


        //拖拽方法
        function Drop(obj) {
            var s = $(obj);
            var p = s.parents(".sina_g");
            if (!p.hasClass("ad_fade") && !p.hasClass("ad_noTouch")) {
                //是否向左
                var isleft = p.hasClass("sinbo_l");
                //切换总数
                var nums = s.parents(".sina_g").find(".num_s").children().length;
                //子集切换距离
                var l = 0, index = 0;

                //获取子集距离
                if (isleft) {
                    l = GetItemWidth(s);
                } else {
                    l = s.parent().height();
                }


                //对象
                var start = {}; //初始点击点位置及时间记录
                var delta = {}; //移动距离记录对象
                var isScrolling; //是否滚动
                //

                s.unbind(ADSupportsTouches ? "touchstart" : "mousedown").bind(ADSupportsTouches ? "touchstart" : "mousedown", function (e) {
                    var touches = ADSupportsTouches ? e.originalEvent.touches[0] : e;

                    index = parseInt($(this).attr("index"));

                    // measure start values
                    start = {

                        // get initial touch coords
                        x: touches.pageX,
                        y: touches.pageY,

                        // store time to determine touch duration
                        time: +new Date,
                        direction: isleft ? "left" : "top",
                        defaultsize: isleft ? parseInt($(this).css("left")) : parseInt($(this).css("top"))
                    };

                    // used for testing first move event
                    isScrolling = undefined;

                    // reset delta and end measurements
                    delta = {};

                    //判断并关闭自动滚动
                    if (s.parents(".sina_g").hasClass("sinbo_t")) {
                        var ad_index = $(".sina_g").index(s.parents(".sina_g"));
                        clearInterval(slider_Interval[ad_index]);
                    }

                    //添加移动时间
                    $(ADSupportsTouches ? s : document).unbind(ADSupportsTouches ? "touchmove" : "mousemove").bind(ADSupportsTouches ? "touchmove" : "mousemove", function (e) {
                        //移动端且多点触控式无法移动
                        if (ADSupportsTouches && (e.originalEvent.touches.length > 1 || e.originalEvent.scale && e.originalEvent.scale !== 1)) return;

                        var touches = ADSupportsTouches ? e.originalEvent.touches[0] : e;

                        delta = {
                            x: touches.pageX - start.x,
                            y: touches.pageY - start.y
                        }
                        //判断是否滚动
                        if (typeof isScrolling == 'undefined') {
                            if (ADSupportsTouches) {
                                if (isleft) {
                                    isScrolling = !!(isScrolling || Math.abs(delta.x) > Math.abs(delta.y));
                                } else {
                                    isScrolling = !!(isScrolling || Math.abs(delta.y) > Math.abs(delta.x));
                                }
                            } else {
                                isScrolling = true;
                            }
                        }

                        if (isScrolling) {
                            e.preventDefault(); //注销默认事件
                            //console.log("start-x:" + start.x + " start-y:" + start.y + " delta-x:" + delta.x + " delta-y:" + delta.y + " isScrolling:" + isScrolling);

                            var min = 0, max = 0;

                            if (!ADSupportsTouches && (delta.x != 0 || delta.y != 0)) {
                                s.children().each(function () {
                                    if ($(this).find(".pingbi_s").length == 0) {
                                        $(this).append($("<div>").addClass("pingbi_s").attr("style", "width:100%;height:100%;position:absolute;filter:alpha(opacity=0);-moz-opacity:0;opacity:0;background-color:#fff;left:0px;top:0px;z-index: 100;"));
                                    }
                                }); //拖动遮盖a标签防止点击(可否有更好的方法？)
                            }

                            min = -parseInt(l * (nums - 1) + l / 2);
                            max = parseInt(l / 2);
                            var size = isleft ? delta.x : delta.y;
                            var move = start.defaultsize + size > max ? max : (start.defaultsize + size < min ? (min) : start.defaultsize + size);

                            s.css(start.direction, parseInt(move));
                        }
                    }).unbind(ADSupportsTouches ? "touchend" : "mouseup").bind(ADSupportsTouches ? "touchend" : "mouseup", function (e) {
                        var touches = ADSupportsTouches ? e.originalEvent.touches[0] : e;

                        if (!ADSupportsTouches) {
                            $(document).unbind("mousemove mouseup");
                        }

                        var size = (isleft ? delta.x : delta.y);
                        var duration = +new Date - start.time;

                        var isone = Number(duration) < 250 && Math.abs(size) > 20;

                        // determine if slide attempt triggers next/prev slide
                        var isValidSlide = isone || Math.abs(size) > l / 2;      // or if slide amt is greater than half the width

                        if (isValidSlide) {
                            var addindex = Math.round(size / l);
                            addindex = addindex == 0 ? (isone ? (size > 0 ? 1 : -1) : 0) : addindex;
                            index = index - addindex;

                            if (index < 0) {
                                index = 0;
                            } else if (index > nums - 1) {
                                index = nums - 1;
                            }
                        }

                        ChangeEvent(s.parents(".sina_g").find(".num_s").children().eq(index));
                        s.find(".pingbi_s").remove(); //拖动遮盖a标签防止点击(可否有更好的方法？)


                        if (s.parents(".sina_g").hasClass("sinbo_t")) {
                            var ad_index = $(".sina_g").index(s.parents(".sina_g"));
                            clearInterval(slider_Interval[ad_index]);
                            slider_Interval[ad_index] = setInterval("sLiDer.DelayEvent(" + ad_index + ",'" + s_types[ad_index] + "')", 4000);
                        }
                    });
                });


            }
        }

        //增量方式
        function Incremental(o, isright) {
            var num_s = o.find(".num_s");
            var index = num_s.children().index(num_s.find(".on"));
            if (isright) {
                if (index == num_s.children().length - 1) {
                    index = 0;
                } else {
                    index = index + 1;
                }
            } else {
                if (index == 0) {
                    index = num_s.children().length - 1;
                } else {
                    index = index - 1;
                }
            }
            ChangeEvent(num_s.children().eq(index));
        }

        function GetItemWidth(o) {
            var item = o.children().eq(0);
            var w = Math.round(item.width());
            var blw = Math.round(item.css("border-left-width").replace("px", ""));
            if (blw.toString() == "NaN") {
                blw = 0;
            }
            var brw = Math.round(item.css("border-right-width").replace("px", ""));
            if (brw.toString() == "NaN") {
                brw = 0;
            }
            var mlw = Math.round(item.css("margin-left").replace("px", ""));
            if (mlw.toString() == "NaN") {
                mlw = 0;
            }

            var mrw = Math.round(item.css("margin-right").replace("px", ""));
            if (mrw.toString() == "NaN") {
                mrw = 0;
            }

            var plw = Math.round(item.css("padding-left").replace("px", ""));
            if (plw.toString() == "NaN") {
                plw = 0;
            }

            var prw = Math.round(item.css("padding-right").replace("px", ""));
            if (prw.toString() == "NaN") {
                prw = 0;
            }

            //console.log(w + blw + brw + mlw + mrw + plw + prw);
            return w + blw + brw + mlw + mrw + plw + prw;
        }

        function GetRealWidth(item) {
            var w = Math.round(item.width());
            var blw = Math.round(item.css("border-left-width").replace("px", ""));
            if (blw.toString() == "NaN") {
                blw = 0;
            }
            var brw = Math.round(item.css("border-right-width").replace("px", ""));
            if (brw.toString() == "NaN") {
                brw = 0;
            }
            var mlw = Math.round(item.css("margin-left").replace("px", ""));
            if (mlw.toString() == "NaN") {
                mlw = 0;
            }

            var mrw = Math.round(item.css("margin-right").replace("px", ""));
            if (mrw.toString() == "NaN") {
                mrw = 0;
            }

            var plw = Math.round(item.css("padding-left").replace("px", ""));
            if (plw.toString() == "NaN") {
                plw = 0;
            }

            var prw = Math.round(item.css("padding-right").replace("px", ""));
            if (prw.toString() == "NaN") {
                prw = 0;
            }


            return w + blw + brw + mlw + mrw + plw + prw;
        }


        function GetRealHeight(item) {
            var h = Math.round(item.height());
            var blh = Math.round(item.css("border-top-width").replace("px", ""));
            if (blh.toString() == "NaN") {
                blh = 0;
            }
            var brh = Math.round(item.css("border-bottom-width").replace("px", ""));
            if (brh.toString() == "NaN") {
                brh = 0;
            }
            var mlh = Math.round(item.css("margin-top").replace("px", ""));
            if (mlh.toString() == "NaN") {
                mlh = 0;
            }

            var mrh = Math.round(item.css("margin-bottom").replace("px", ""));
            if (mrh.toString() == "NaN") {
                mrh = 0;
            }

            var plh = Math.round(item.css("padding-top").replace("px", ""));
            if (plh.toString() == "NaN") {
                plh = 0;
            }

            var prh = Math.round(item.css("padding-bottom").replace("px", ""));
            if (prh.toString() == "NaN") {
                prh = 0;
            }


            return h + blh + brh + mlh + mrh + plh + prh;
        }

        //改变处理事件
        function ChangeEvent(obj, speed, runcallback) {
            speed = speed != null && !isNaN(speed) ? speed : 400;
            runcallback = runcallback === false ? false : true;
            var p = $(obj).parents('.sina_g');
            //        if (p.hasClass("ad_ing")) {
            //            return;
            //        }
            var num = p.find('.num_s').children();
            var i = num.index(obj);


            p.addClass("ad_ing");
            num.removeClass('on');
            $(obj).addClass('on');
            if ($(obj).attr("style") != null && $(obj).attr("style") != "" && $(obj).attr("style").indexOf("background-color") > -1) {
                num.css("background-color", "#ccc");
                $(obj).css("background-color", "#EE040F");
            }

            var s = p.find(".slider_s");

            if (p.hasClass("sinbo_l")) {
                var w = 0;
                if (!p.hasClass("ad_item")) {
                    w = s.parent().width() > s.children().eq(0).width() ? s.parent().width() : s.children().eq(0).width();
                } else {
                    w = GetItemWidth(s);
                }
                s.stop(true, false).animate({ left: -Math.round(w) * i }, speed, function () { if (speed > 0) { ChangeCallBack(s, i, runcallback); } });
            }
            else if (p.hasClass("ad_fade")) {
                s.children().hide("slow").eq(i).show("slow");
                s.children().stop(true, false).animate({ opacity: 0 }, speed, function () { if (speed > 0) { $(this).css("visibility", "hidden"); ChangeCallBack(s, i, runcallback); } });
                s.children().eq(i).css("visibility", "initial").stop(true, false).animate({ opacity: 1 }, speed, function () { if (speed > 0) { ChangeCallBack(s, i, runcallback); } });
            }
            else {
                var h = s.parent().height();
                s.stop(true, false).animate({ top: -Math.round(h) * i }, speed, function () { if (speed > 0) { ChangeCallBack(s, i, runcallback); } });
            }
            if (speed == 0) {
                ChangeCallBack(s, i, runcallback);
            }
            //判断是否存在hideNum_s的切换元素隐藏选项
            var num_s = $(obj).parent();

            if (num_s.hasClass("hideNum_s")) {
                if (i == 0) {
                    num_s.css("left", 0);
                } else {
                    var rw = GetRealWidth($(obj));
                    var ppwidth = num_s.parent().width();
                    if (ppwidth < (i + 1) * rw) {
                        num_s.stop(true, false).animate({ left: -((i + 1) * rw - ppwidth) + "px" }, speed);
                    }
                }

            }

        }

        //切换时间触发完成后调用方法
        function ChangeCallBack(s, i, runcallback) {
            var oldindex = parseInt(s.attr("index"));
            s.attr('index', i);
            var p = s.parents(".sina_g");
            p.removeClass("ad_ing");

            if (!isNaN(oldindex) && oldindex != i && runcallback) {
                var slider_index = parseInt(s.attr("slider_index"));
                try {
                    var tc = s.children().eq(i).attr("class");
                    //sman 20160608 增加自动高度处理 设置auto_h = 1
                    if (s.attr('auto_h')) s.stop(true).parent().animate({ height: s.children().eq(i).height() + 'px' }, 200);

                    var callback = "";
                    if (rgx.test(tc)) {
                        var rgx = /\bad_callback_([a-zA-Z0-9])+\b/g;
                        callback = tc.match(rgx)[0].replace("ad_callback_", "");
                    }

                    if (callback != "") {
                        if (window[callback] != null) {
                            window[callback](s.children().eq(i));
                        } else {
                            alert("不存在滚动callback:" + callback);
                        }
                    }

                    if (p.hasClass("ad_ajax") && hasAjax) {
                        try {
                            sLiDer.Ajax.AjaxCallBack(parseInt(s.attr("slider_index")), oldindex > i);
                        }
                        catch (e) {

                        }
                    }
                }
                catch (e) {
                }
            }
        }




        //    function AllChangeEvent(obj) {
        //        ChangeEvent(obj);
        //        //DelayEvent(obj);
        //    }


        //注销方法
        function CancelSlider(index) {
            var o = $(".sina_g").eq(index);
            if (o.length == 0) {
                return;
            }

            var t_index = parseInt(o.find(".slider_s").attr("index")) || 0;
            ChangeEvent(o.find(".num_s").children()[t_index], 0, false);


            if (o.hasClass("sinbo_an")) {
                o.find(".photo_right_btn").unbind("click");
                o.find(".photo_left_btn").unbind("click");
            }

            if (o.hasClass("ad_wheel")) {
                o.unbind("mousewheel");
            }

            if (!o.hasClass("ad_fade") && !o.hasClass("ad_noTouch")) {
                o.find(".slider_s").unbind("touchstart mousedown touchmove mousemove touchend mouseup");
            }

            o.find(".num_s").children().unbind("click mouseover change mouseout");

            if (o.hasClass("sinbo_t")) {
                clearInterval(slider_Interval[index]);
            }
        }

        //开始方法
        function StartSlider(index) {
            var p = $(".sina_g").eq(index);
            if (p.length == 0) {
                return;
            }
            var o = p.find(".slider_s");

            if (p.hasClass("sinbo_an")) {
                appendBtn(o);
            }

            if (p.hasClass("ad_wheel")) {
                slideDirection.Wheel(o);
            }
            //实现拖拽
            Drop(o);

            //重置宽高
            adaptive.parentdefautHeight(o);

            p.find(".num_s").children().bind(s_types[index], function () {
                ChangeEvent(this);
            });

            slideDirection.AutoTime(p, index);

        }

    })();

    //require模块化判断支持。
    if (typeof define === "function" && define.amd && define.amd.jQuery) {
        define('slider', ["jquery"], function ($) {
            return { Init: function () { sLiDer.Init(-1); } };
        });
    } else {
        sLiDer.Init(-1);
    }
}
 //主要用去。
(function ($) {
    var defaluts = {
        disblocknode: "dt", //要显示或者隐藏的元素
        clickparentnode: "", //鼠标移上去切的父元素
        clicknode: "li", //鼠标移上去切的元素
        onclass: "", //要添加的样式
        disfun: "mouseenter"//指定绑定方法
    };
    $.fn.extend({
        "togTab": function (options) {
            var opts = $.extend({}, defaluts, options);
            var $this = this;
            this.find(opts.clickparentnode + " " + opts.clicknode).bind(opts.disfun, function () {
                var nothis = $(this);
                nothis.addClass(opts.onclass).siblings().removeClass(opts.onclass);
                nothis.siblings().removeClass("on");
                $this.find(opts.disblocknode).eq(nothis.index()).show().siblings(opts.disblocknode).hide();
            });
        }
    });
})(window.jQuery);
 //以下是商学院
$(document).ready(function(){
$('.tabon li').mouseover(function(){
TabSelect(".tabon li", ".taboff>div", "on", $(this))
});
$('.tabon li').eq(0).trigger("mouseover");

function TabSelect(tab,con,addClass,obj){
var $_self = obj;
var $_nav = $(tab);
$_nav.removeClass(addClass),
$_self.addClass(addClass);
var $_index = $_nav.index($_self);
var $_con = $(con);
$_con.hide(),
$_con.eq($_index).show();
}

});

/**file:v2/js/specialinterval.js**/
//专场定时器
(function ($) {
    var defaluts = {
        nowtime: new Date().getDate(),//当前时间,必须传
        endtime: new Date().getDate(), //结束时间,必须传
        innode: "i" //定时刷新的时间格式
    };
    $.fn.extend({
         "CovertDate":function (datetime) {
                var a = datetime.split(" ");
                var b = a[0].split("-");
                var c = a[1].split(":");
                return new Date(b[0], b[1] - 1, b[2], c[0], c[1], c[2]);
            },
         "CountDown": function (nowtime, endtime, innode) {
                nowtime.setSeconds(nowtime.getSeconds() + 1);
                var time = endtime - nowtime;
                var tday = Math.floor(time / (1000 * 60 * 60 * 24));
                var thour = Math.floor(time / (1000 * 60 * 60)) % 24;
                var tminute = Math.floor(time / (1000 * 60)) % 60;
                var tsecond = Math.floor(time / 1000) % 60;
                var curnode = this; //用变量存当前的jquery对象 setTimeout 是在当前的html文档里面找的
                if (tday <= -1) {
                    curnode.html("入团结束");
                }
                else {
                    curnode.html("<" + innode + ">" + tday + "</" + innode + ">天<" + innode + ">" + thour + "</" + innode + ">小时<" + innode + ">" + tminute + "</" + innode + ">分<" + innode + ">" + tsecond + "</" + innode + ">秒");
                    setTimeout(function () { curnode.CountDown(nowtime, endtime, innode) }, 1000);
                }
            },
            "SpecialInterval": function (options) {
            var opts = $.extend({}, defaluts, options);
            this.CountDown(this.CovertDate(opts.nowtime),  this.CovertDate(opts.endtime),  opts.innode);
        }
    });
})(window.jQuery);
// sally
(function(a){a.fn.tab=function(b){var c={events:"mouseover"};var b=a.extend(c,b);this.each(function(){var g=a(this),f=g.children("dt").children("ul").children("li");
var d=g.children("dd");f.bind(b.events,function(){var e=f.index(this),h=a(this);h.addClass("active").siblings().removeClass("active").end();d.eq(e).addClass("active").siblings("dd").removeClass("active").end();
});});};})(jQuery);$(function(){var a=$('[data-event="tab"]');a.each(function(c,d){var e=$(this);var b=(e.attr("data-type"))||"mouseover";$(this).tab({events:b});
});});(function(a){a.fn.carousel=function(b){var c={};var b=a.extend(c,b);return this.each(function(){var k=a(this);var j=parseInt(k.css("width"));var l=k.find("ul");
var m=a("li",l);var e=m.size();var i="";m.css({width:j,"float":"left",position:"relative"});l.css({width:e*j,position:"absolute",left:0,top:0});if(k.children().length==1){m.each(function(n,p){var o=a(this).find("a").attr("href");
var q=a(this).find("img").attr("alt");i+=n==0?'<a href="'+o+'" class="active" title='+q+">"+q+"</a>":'<a href="'+o+'"  title='+q+">"+q+"</a>";});k.append('<div class="u-dot">'+i+"</div>");
}k.ind=0;k.stime=setInterval(g,3000);var d=k.children("div");var f=d.find("a");f.hover(function(){clearInterval(k.stime);k.ind=f.index(this);h(k.ind);},function(){k.stime=setInterval(g,3000);
});function g(){k.ind=k.ind>=e-1?0:++k.ind;h(k.ind);}function h(n){l.animate({left:-n*j},{queue:false,duration:250});f.eq(n).addClass("active").siblings().removeClass("active").end();
}});};})(jQuery);$(function(){$('[data-event="carousel"]').carousel();});(function(d){d.fn.jCarouselLite=function(e){e=d.extend({btnPrev:null,btnNext:null,btnGo:null,mouseWheel:false,auto:null,speed:200,easing:null,vertical:false,circular:true,visible:3,start:0,scroll:1,beforeStart:null,afterEnd:null},e||{});
return this.each(function(){var w=false,n=e.vertical?"top":"left",i=e.vertical?"height":"width";var u=d(this),t=d("ul",u),l=d("li",t),y=l.size(),x=e.visible;
if(e.circular){t.prepend(l.slice(y-x-1+1).clone()).append(l.slice(0,x).clone());e.start+=x;}var s=d("li",t),r=s.size(),z=e.start;u.css("visibility","visible");
s.css({overflow:"hidden","float":e.vertical?"none":"left"});t.css({margin:"0",padding:"0",position:"relative","list-style-type":"none","z-index":"1"});
u.css({overflow:"hidden",position:"relative","z-index":"2",left:"0px"});var q=e.vertical?a(s):c(s);var p=q*r;var o=q*x;s.css({width:s.width(),height:s.height()});
t.css(i,p+"px").css(n,-(z*q));u.css(i,o+"px");if(e.btnPrev){d(e.btnPrev).click(function(){return m(z-e.scroll);});}if(e.btnNext){d(e.btnNext).click(function(){return m(z+e.scroll);
});}if(e.btnGo){d.each(e.btnGo,function(g,f){d(f).click(function(){return m(e.circular?e.visible+g:g);});});}if(e.mouseWheel&&u.mousewheel){u.mousewheel(function(f,g){return g>0?m(z-e.scroll):m(z+e.scroll);
});}if(e.auto){setInterval(function(){m(z+e.scroll);},e.auto+e.speed);}function k(){return s.slice(z).slice(0,x);}function m(f){if(!w){if(e.beforeStart){e.beforeStart.call(this,k());
}if(e.circular){if(f<=e.start-x-1){t.css(n,-((r-(x*2))*q)+"px");z=f==e.start-x-1?r-(x*2)-1:r-(x*2)-e.scroll;}else{if(f>=r-x+1){t.css(n,-((x)*q)+"px");z=f==r-x+1?x+1:x+e.scroll;
}else{z=f;}}}else{if(f<0||f>r-x){return;}else{z=f;}}w=true;t.animate(n=="left"?{left:-(z*q)}:{top:-(z*q)},e.speed,e.easing,function(){if(e.afterEnd){e.afterEnd.call(this,k());
}w=false;});if(!e.circular){d(e.btnPrev+","+e.btnNext).removeClass("disabled");d((z-e.scroll<0&&e.btnPrev)||(z+e.scroll>r-x&&e.btnNext)||[]).addClass("disabled");
}}return false;}});};function b(f,e){return parseInt(d.css(f[0],e))||0;}function c(e){return e[0].offsetWidth+b(e,"marginLeft")+b(e,"marginRight");}function a(e){return e[0].offsetHeight+b(e,"marginTop")+b(e,"marginBottom");
}})(jQuery);$(function(){var a=$('[data-event="scroll"]');a.each(function(b,f){var h=$(this);var g=h.attr("data-mum")>>>0;if(h.find("li").length==0){return;
}else{if(h.find("img").length!=0){var c=h.find(".next"),e=h.find(".prev");var d=h.children("div");d.jCarouselLite({btnNext:c,btnPrev:e,visible:g,scroll:1,speed:350,auto:4000,mouseOver:true});
}else{h.jCarouselLite({vertical:true,visible:g,scroll:1,speed:350,auto:3000,mouseOver:true});}}});});(function(b){b.fn.lazyload=function(a){var h={attr:"data-url"};
var g=b.extend({},h,a||{});g.cache=[];b(this).each(function(){var d=this.nodeName.toLowerCase(),e=b(this).attr(g.attr);if(!e){return;}var c={obj:b(this),tag:d,url:e};
g.cache.push(c);});var f=function(){var d=b(window).scrollTop(),c=d+b(window).height();b.each(g.cache,function(n,i){var e=i.obj,p=i.tag,o=i.url;if(e){post=e.offset().top;
posb=post+e.height();if((post>d&&post<c)||(posb>d&&posb<c)){if(p==="img"){e.attr("src",o);}else{e.load(o);}i.obj=null;}}});return false;};f();b(window).bind("scroll",f);
};})(jQuery);$(function(){$("img").lazyload();});(function(a){a.fn.sallytoggle=function(b){var c={};var b=a.extend(c,b);this.each(function(){var g=a(this);
var d=g.attr("data-target");var e=g.attr("data-event");var f={close:function(){g.bind("click",function(h){a(this).parents("."+d).fadeOut();h.preventDefault();
h.stopPropagation();});},hover:function(){g.bind("mouseenter",function(){clearTimeout(g.ctimes);g.addClass(d);}).bind("mouseleave",function(){clearTimeout(g.ctimes);
g.ctimes=setTimeout(function(){g.removeClass(d);},150);});},dropdown:function(){var h=g.children("."+d);g.bind("click.dropdown",function(i){h.toggle();
i.preventDefault();i.stopPropagation();});a(document).bind("click.dropdown",function(i){!h.is(":hidden")&&h.hide();});},layer:function(){g.bind("click",function(h){a("#"+d).fadeIn();
h.preventDefault();h.stopPropagation();});}};!!f[e]&&f[e]();});};})(jQuery);$(function(){$("[data-target]").sallytoggle();});(function(a){a.fn.placeholder=function(b){var c={events:"mouseover"};
var b=a.extend(c,b);this.each(function(){var e=a(this);var d=e.attr("placeholder");e.val(d).focus(function(){if(e.val()===e.attr("placeholder")){e.val("");
}}).blur(function(){if(e.val().length===0){e.val(e.attr("placeholder"));}});});};})(jQuery);$(function(){var a=$("input[placeholder]");if(!("placeholder" in document.createElement("input"))){a.placeholder();
}});