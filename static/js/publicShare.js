// 引入微信脚本
// if(typeof(wx) == 'undefined') {
//     document.head.appendChild(document.createElement('script')).src = 'http://res2.wx.qq.com/open/js/jweixin-1.4.0.js?v=' + ~(-new Date());
//     // document.write(unescape("%3Cscript src='https://res.wx.qq.com/open/js/jweixin-1.3.2.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
// }
//
$(function() {
//
// 	function entityToString(str) {
// 		var div = document.createElement('div');
// 		div.innerHTML = str.replace(/&amp;/g, '&');
// 		return div.innerText;
// 	}
//
// 	wxconfig && (wxconfig.title = entityToString(wxconfig.title));
// 	wxconfig && (wxconfig.description = entityToString(wxconfig.description));
//
// 	if (wxconfig && wxconfig.imgUrl.indexOf('siteConfig/logo') > -1 && shareAdvancedUrl) {
// 		wxconfig.imgUrl = shareAdvancedUrl;
// 	}
//
// 	if (wxconfig) {
// 		var userid = $.cookie((window.cookiePre ? window.cookiePre : 'HN_') + 'userid');
// 		if (userid) {
// 			wxconfig.link = wxconfig.link.indexOf('?') > -1 ? (wxconfig.link + '&fromShear=' + userid) : (wxconfig.link + '?fromShear=' + userid)
// 		}
// 	}

	//小程序
	// if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
	// 	wx.miniProgram.getEnv(function (res) {
	// 		if (res.miniprogram) {
	// 			wx.miniProgram.postMessage({
	// 				data: {
	// 					title: wxconfig.title,
	// 					imgUrl: wxconfig.imgUrl,
	// 					desc: wxconfig.description,
	// 					link: wxconfig.link
	// 				}
	// 			});
	// 		}
	// 	});
	// }

	//分享功能只提供给APP使用
	// var deviceUserAgent = navigator.userAgent;
	// if (deviceUserAgent.indexOf('huoniao') > -1) {
	// 	$('.HN_PublicShare').show();
	// } else {
	// 	$('.HN_PublicShare').hide();
	// }
	//
	// // 由于每个页面都引入了touchBase.css，所以把公共分享的样式转移到了touchBase.css中  by: gz 20180314
	// // $("head").append('<link rel="stylesheet" type="text/css" href="'+staticPath+'css/publicShare.css?t='+~(-new Date())+'">');
	//
	// var hnShare = {
	// 	showShareBox: function () {
	// 		// $("#publit_shear_load").remove();
	// 		$('#HN_PublicShare_shearBox').removeClass('fn-hide').animate({'bottom': '0'}, 200);
	// 		$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '100%', 'opacity': 1});
	// 	}
	// 	, closeShearBox: function () {
	// 		$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
	// 		$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
	// 	}
	//
	// 	, showQRBox: function () {
	// 		$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
	// 		$('#HN_PublicShare_codeBox').animate({'bottom': '0'}, 200);
	// 	}
	// 	, closeQRBox: function () {
	// 		$('#HN_PublicShare_codeBox').animate({'bottom': '-100%'}, 200);
	// 		$('.HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
	// 	}
	// 	, showSRBox: function () {
	// 		$('.HN_PublicShare_zhiyin').show();
	// 		$('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height': '100%', 'opacity': 1});
	// 	}
	// 	, closeSRBox: function () {
	// 		$('.HN_PublicShare_zhiyin').hide();
	// 		$('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
	// 	}
	// }
	//
	// var shareHtml = '<div class="HN_PublicShare_shearBox fn-hide"id="HN_PublicShare_shearBox" >' +
	// 	'<div class="HN_PublicShare_sheark1"><div class="HN_PublicShare_sheark2">' +
	// 	'<div class="HN_PublicShare_HN_style_32x32"><ul class="fn-clear">' +
	// 	'<li><a class="HN_button_qzone" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + wxconfig.title + '"></a>QQ空间</li>' +
	// 	'<li><a class="HN_button_tsina" href="http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + document.title + '"></a>新浪微博</li>' +
	// 	'<li><a class="HN_button_tweixin" id="HN_button_tweixin" ></a>微信好友</li>' +
	// 	'<li><a class="HN_button_ttqq"></a>QQ好友</li>' +
	// 	'<li><a class="HN_button_comment"><span class="HN_txt jtico jtico_comment"></span></a>朋友圈</li>' +
	// 	'<li><a class="HN_button_code"><span class="HN_txt jtico jtico_code"></span></a>二维码</li></ul>' +
	// 	'</div></div><div class="HN_PublicShare_cancel"id="HN_PublicShare_cancelShear">取消</div></div>' +
	// 	'<div class="HN_PublicShare_bg"id="HN_PublicShare_shearBg"></div></div>' +
	// 	'<div class="HN_PublicShare_shearBox HN_PublicShare_codeBox"id="HN_PublicShare_codeBox">' +
	// 	'<div class="HN_PublicShare_sheark1"><img src="" alt="" width="130"height="130"><p>让朋友扫一扫访问当前网页</p>' +
	// 	'<div class="HN_PublicShare_cancel"id="HN_PublicShare_cancelcode">取消</div></div><div class="HN_PublicShare_bg"></div></div>' +
	// 	'<div class="HN_PublicShare_zhiyin fn-hide"><div class="HN_PublicShare_bg"><div class="HN_PublicShare_zhibox">' +
	// 	'<img src="' + staticPath + 'images/HN_Public_sharezhi.png"alt=""></div></div></div>';

	// $("head").append('<style id="publit_shear_load">.HN_PublicShare_shearBox,.HN_PublicShare_zhiyin {display:none;}</style>');
	// $("body").append(shareHtml);
// <button open-type="share" class="HN_button_tweixin" ></button>

	// var device = navigator.userAgent;
	// $("body").delegate(".HN_PublicShare", "tap click", function () {
	// 	//非客户端下调用默认分享功能
	// 	var device = navigator.userAgent;
	// 	if (device.indexOf('huoniao') <= -1) {
	// 		var QzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + wxconfig.title,
	// 			TsinaUrl = 'http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + wxconfig.title;
	// 		$('.HN_button_qzone').attr("href", QzoneUrl);
	// 		$('.HN_button_tsina').attr("href", TsinaUrl);
	// 		hnShare.showShareBox();
	// 		//客户端下调用原生分享功能
	// 	} else {
	// 		setupWebViewJavascriptBridge(function (bridge) {
	// 			bridge.callHandler("appShare", {
	// 				"platform": "all",
	// 				"title": wxconfig.title,
	// 				"url": wxconfig.link,
	// 				"imageUrl": wxconfig.imgUrl,
	// 				"summary": wxconfig.description
	// 			}, function (responseData) {
	// 				var data = JSON.parse(responseData);
	// 				// if(data.state == 100){
	// 				// 	alert("分享成功！");
	// 				// }else{
	// 				// 	alert(data.info);
	// 				// }
	// 			})
	// 		});
	// 	}
	//
	// 	//隐藏浮动菜单
	// 	$('.fixFooter').show();
	// 	$('.header').removeClass('open');
	// 	$('#navBox_4').hide();
	// 	$('#navBox_4 .bg').css({'height': '0', 'opacity': 0});
	//
	// 	return false;
	// });
	// $("body").delegate(".HN_PublicShare", "touchend", function (e) {
	// 	//取消点透事件
	// 	e.preventDefault();
	// });
	// //单独分享
	// $("body").delegate(".HN_PublicShare_Singel", "tap", function (event) {
	// 	event.preventDefault();
	// 	var id = $(this).attr("data-id");
	// 	var device = navigator.userAgent;
	// 	if (device.indexOf('huoniao') > -1) {
	// 		setupWebViewJavascriptBridge(function (bridge) {
	// 			bridge.callHandler(
	// 				"appShare", {
	// 				"platform": id,
	// 				"title": wxconfig.title,
	// 				"url": wxconfig.link,
	// 				"imageUrl": wxconfig.imgUrl,
	// 				"summary": wxconfig.description
	// 			}, function (responseData) {
	// 				var data = JSON.parse(responseData);
	// 				// if(data.state == 100){
	// 				// 	alert("分享成功！");
	// 				// }else{
	// 				// 	alert(data.info);
	// 				// }
	// 			})
	// 		});
	// 	} else {
	// 		if (id == "Qzone") {
	// 			location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + document.title;
	// 		} else if (id == "sina") {
	// 			location.href = 'http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + document.title;
	// 		} else if (id == "wechat") {
	// 			var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
	// 			hnShare.showQRBox();
	// 			hnShare.showSRBox();
	// 			// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
	// 			$('#HN_PublicShare_codeBox img').attr('src', code);
	// 		} else if (id == "QQ") {
	// 			var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
	// 			hnShare.showQRBox();
	// 			hnShare.showSRBox();
	// 			// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
	// 			$('#HN_PublicShare_codeBox img').attr('src', code);
	// 		}
	// 	}
	// });
	// $("body").delegate("#HN_PublicShare_shearBg", "tap click", function () {
	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// 	hnShare.closeSRBox();
	// });
	//
	// $("body").delegate(".HN_PublicShare_bg", "tap click", function () {
	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// 	hnShare.closeSRBox();
	// });
	// $("body").delegate(".HN_PublicShare_bg", "touchend", function (e) {
	// 	//取消点透事件
	// 	e.preventDefault();
	// });
	//
	// $("body").delegate("#HN_PublicShare_cancelShear", "tap click", function () {
	// 	hnShare.closeShearBox();
	// });
	//
	// $("body").delegate("#HN_PublicShare_cancelcode", "tap click", function () {
	//
	// 	hnShare.closeShearBox();
	// 	hnShare.closeQRBox();
	// });
	//
	// $("body").delegate(".HN_button_code", "tap", function () {
	// 	var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
	// 	hnShare.showQRBox();
	// 	$('#HN_PublicShare_codeBox img').attr('src', code);
	// });
	//
	// // $('.HN_button_tweixin, .HN_button_ttqq, .HN_button_comment').click(function(){
	// // 	hnShare.closeShearBox();
	// // 	hnShare.showSRBox();
	// });


	//微信分享
	// $('.HN_button_tweixin').click(function () {
	// 	if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {//判断是否是微信
	// 		var desc = pageData.desc;
	// 		var link = pageData.link;
	// 		var title = pageData.title;
	// 		var type;
	// 		// var type=1;
	// 		// var aid="1";
	// 		var aid = pageData.id;
	// 		var name = JubaoConfig.action;
	// 		if (name == "loupan") {
	// 			type = 1;
	// 		} else if (name == "sale") {
	// 			type = 2;
	// 		} else if (name == "zu") {
	// 			type = 3;
	// 		} else if (name == "sp") {
	// 			type = 4;
	// 		} else if (name == "xzl") {
	// 			type = 5;
	// 		} else if (name == "cf") {
	// 			type = 6;
	// 		}
	// // 		console.log(aid);
	// // 		console.log(type);
	// 		var aa = "1";
	// 		wx.config({
	// 			debug: false,
	// 			appId: wxconfig.appId,
	// 			timestamp: wxconfig.timestamp,
	// 			nonceStr: wxconfig.nonceStr,
	// 			signature: wxconfig.signature,
	// 			jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareWeibo', 'openLocation']
	// 		});//end config
	// 		$.ajax({
	// 			url: "/include/ajax.php?service=member&action=wxShare&aid=" + aid + "&type=" + type,
	// 			type: "get",
	// 			crossDomain: true,
	// 			datatype: "jsonp",
	// 			success: function (data) {
	// 				data = JSON.parse(data);
	// 				var sid = data.info.sid;
	// 				console.log(sid);
	// 				wx.ready(function () {
	// 					wx.updateAppMessageShareData({//分享到朋友或者qq
	// 						title: wxconfig.title,
	// 						desc: wxconfig.description,
	// 						link: link + '?ori=wxShare&sid="+sid',
	// 						imgUrl: wxconfig.imgUrl,
	// 						// trigger: function (res) {
	// 						//     hnShare.closeSRBox();
	// 						// },
	// 						success: function () {
	// 							$.ajax({
	// 								url: "/include/ajax.php?service=member&action=wxShare&sid=" + sid + "&description=" + desc + "&link=" + link + "&serverid=" + aa,
	// 								type: "get",
	// 								datatype: "jsonp",
	// 								success: function () {
	// 									// alert("分享成功");
	// 								}
	// 							})//end ajax
	// 						},
	// 						cancel: function () {
	// 							// alert("取消分享");
	// 						}
	// 					});//end message
	// 					wx.updateTimelineShareData({//分享给朋友圈或者qq空间
	// 						title: wxconfig.title,
	// 						link: link + '?ori=wxShare&sid="+sid',
	// 						imgUrl: wxconfig.imgUrl,
	// 						success: function () {
	// 							$.ajax({
	// 								url: "/include/ajax.php?service=member&action=wxShare&sid=" + sid + "&description=" + desc + "&link=" + link + "&serverid=" + aa,
	// 								type: "get",
	// 								datatype: "jsonp",
	// 								success: function () {
	// 									// alert("分享成功");
	// 								}
	// 							})//end ajax
	// 						},
	// 						cancel: function () {
	// 						}
	// 					});//end update
	// 					wx.onMenuShareAppMessage({//分享朋友
	// 						title: wxconfig.title,
	// 						desc: wxconfig.description,
	// 						link: link + '?ori=wxShare&sid="+sid',
	// 						imgUrl: wxconfig.imgUrl,
	// 						// trigger: function (res) {
	// 						//     hnShare.closeSRBox();
	// 						// },
	// 						success: function () {
	// 							$.ajax({
	// 								url: "/include/ajax.php?service=member&action=wxShare&sid=" +sid+"&description="+ desc + "&link=" + link + "&serverid=" + aa,
	// 								type: "get",
	// 								datatype: "jsonp",
	// 								success: function () {
	// 									// alert("分享成功");
	// 								}
	// 							})//end ajax
	// 						},
	// 						cancel: function () {
	// 							// alert("取消分享");
	// 						}
	// 					});//end on
	// 					wx.onMenuShareTimeline({//分享朋友圈
	// 						title: wxconfig.title,
	// 						desc: wxconfig.description,
	// 						link: link + '?ori=wxShare&sid="+sid',
	// 						imgUrl: wxconfig.imgUrl,
	// 						// trigger: function (res) {
	// 						//     hnShare.closeSRBox();
	// 						// },
	// 						success: function () {
	// 							$.ajax({
	// 								url: "/include/ajax.php?service=member&action=wxShare&sid=" + sid + "&description=" + desc + "&link=" + link + "&serverid=" + aa,
	// 								type: "get",
	// 								datatype: "jsonp",
	// 								success: function () {
	// 									// alert("分享成功");
	// 								}
	// 							})//end ajax
	// 						},
	// 						cancel: function () {
	// 							// alert("取消分享");
	// 						}
	// 					})//end on
	// 					});//end ready
	// 				// }//end date
	// 			},//end success
	// 			error: function (data) {
	// 				// console.log(data);
	// 			}//error end
	// 		});//ens ajax
	// 		// })// end dianji
	// 	}// end if
	// });//end click

	//app之微信分享

	//  document.addEventListener('plusready',function () {
	//   //获取分享服务列表
	//   plus.share.getServices(function(s) {
	//   shares = ss;
	//   for (var i in ss ) {
	//       var s = ss[i];
	//       var item = document.createElement("li");
	//       item.setAttribute("class", "ditem");
	//       item.setAttribute("onclick", (s.id == "weixin") ? "shareWeiXin(this.plusShare)" : "shareAction(this.plusShare)");
	//       item.innerText = s.description;
	//       item.plusShare = s;
	//       list.appendChild(item);
	//   }
	//   }, function(e) {
	//   alert("获取分享服务列表失败：" + e.message);
	//   });
	//
	// //是否授权
	// function shareAction(s, ex) {
	// outSet("分享操作：");
	// if (!s) {
	//     outLine("无效的分享服务！");
	//     return;
	// }
	// if (s.authenticated) {
	//     outLine("---已授权---");
	//     shareMessage(s, ex);
	// } else {
	//     outLine("---未授权---");
	//     s.authorize(function() {
	//         shareMessage(s, ex);
	//     }, function(e) {
	//         outLine("认证授权失败：" + e.code + " - " + e.message);
	//     });
	// }
	// }
	//
	// //分享内容
	// function shareMessage(s,ex){
	// var msg={
	// 	title:wxconfig.title,
	// 	content:wxconfig.description,
	// 	herf:wxconfig.link,
	// 	pictures:wxconfig.imgUrl,
	// 	extra:{scene:ex},
	// 	};
	// // if(pic&&pic.realUrl){
	// //     msg.pictures=[pic.realUrl];
	// // }
	// s.send( msg, function(){
	//     alert( "分享到\""+s.description+"\"成功！ " );
	// }, function(e){
	//     alert( "分享到\""+s.description+"\"失败: "+e.code+" - "+e.message );
	// } );
	// }
	// //分享按钮点击事件
	//
	//
	// //取消分享
	// function cancelAuth(){try{
	//
	// for ( var i in shares ) {
	//     var s = shares[i];
	//     if ( s.authenticated ) {
	//         outLine( "取消\""+s.description+"\"");
	//     }
	//     s.forbid();
	// }
	// // 取消授权后需要更新服务列表
	// updateServices();
	// outLine( "操作成功！" );}catch(e){alert(e);}
	// }

	// });// ready end

	// document.getElementById("share").addEventListener("click", function() {
	// 	if(navigator.userAgent.indexOf("Html5Plus") > -1) {
	// 		//5+ 原生分享
	// 		window.plusShare({
	// 			title: wxconfig.title,//应用名字
	// 			content: wxconfig.description,
	// 			href:wxconfig.link ,//分享出去后，点击跳转地址
	// 			thumbs:wxconfig.imgUrl //分享缩略图
	// 		}, function(result) {
	// 			//分享回调
	// 			alert("分享成功");
	// 		});
	// 	} else {
	// 		//原有wap分享实现
	// 	}
	// });// click end

// 	mui.init({
// 		swipeBack:true //启用右滑关闭功能
// 	});
//
// 	var Intent = null,
// 		File = null,
// 		Uri = null,
// 		main = null;
// 	var shares = null;
// 	var shareImageUrl = '';
// 	mui.plusReady(function() {
// 		updateSerivces();
// 		if (plus.os.name == "Android") {
// 			Intent = plus.android.importClass("android.content.Intent");
// 			File = plus.android.importClass("java.io.File");
// 			Uri = plus.android.importClass("android.net.Uri");
// 			main = plus.android.runtimeMainActivity();
// 		}
// 	});
// 	/**
// 	 * 更新分享服务
// 	 */
// 	function updateSerivces() {
// 		plus.share.getServices(function(s) {
// 			shares = {};
// 			for (var i in s) {
// 				var t = s[i];
// 				shares[t.id] = t;
// 			}
// 			outSet("获取分享服务列表成功");
// 		}, function(e) {
// 			outSet("获取分享服务列表失败：" + e.message);
// 		});
// 	}
// 	/**
// 	 * 分享操作
// 	 */
// 	function shareAction(id, ex) {
// 		var s = null;
// 		if (!id || !(s = shares[id])) {
// 			outLine("无效的分享服务！");
// 			return;
// 		}
// 		if (s.authenticated) {
// 			outSet("---已授权---");
// 			shareMessage(s, ex);
// 		} else {
// 			outSet("---未授权---");
// 			s.authorize(function() {
// 				shareMessage(s, ex);
// 			}, function(e) {
// 				outLine("认证授权失败");
// 			});
// 		}
// 	}
// 	/**
// 	 * 发送分享消息
// 	 */
// 	function shareMessage(s, ex) {
// 		var msg = {
// 			href: link+ '?ori=wxShare',
// 			title:wxconfig.title,
// 			content:desc,
// 			thumbs: wxconfig.imgUrl,
// 			pictures: wxconfig.imgUrl,
// 			extra: {
// 				scene: ex
// 			}
// 		};
// 		s.send(msg, function() {
// 			outLine("分享成功!");
// 			// $.ajax({
// 			// 	url: "/include/ajax.php?service=member&action=wxShare&aid=" + aid + "&type=" + type+"&serverid=" +aa+ "&description=" + desc + "&link=" + link ,
// 			//     type: "get",
// 			// 	datatype: "jsonp",
// 			// 	success: function () {
// 			// 		// alert("分享成功");
// 			// 	}
// 			// 	})//end ajax
// 		}, function(e) {
// 			outLine("分享失败!");
// 		});
// 	}
// 	/**
// 	 * 分享按钮点击事件
// 	 */
// 	function shareHref() {
// 		var ids = [{
// 				id: "weixin",
// 				ex: "WXSceneSession"  /*微信好友*/
// 			}, {
// 				id: "weixin",
// 				ex: "WXSceneTimeline" /*微信朋友圈*/
// 			}, {
// 				id: "qq"   /*QQ好友*/
// 			},{
// 				id: "sinaweibo"  /*新浪微博*/
// 			}],
// 			bts = [{
// 				title: "发送给微信好友"
// 			}, {
// 				title: "分享到微信朋友圈"
// 			}, {
// 				title: "分享到QQ"
// 			}, {
// 				title: "分享到新浪微博"
// 			}];
// 		plus.nativeUI.actionSheet({
// 				cancel: "取消",
// 				buttons: bts
// 			},
// 			function(e) {
// 				var i = e.index;
// 				if (i > 0) {
// 					shareAction(ids[i - 1].id, ids[i - 1].ex);
// 				}
// 			}
// 		);
// 	}
// 	// 控制台输出日志
// 	function outSet(msg) {
// 		console.log(msg);
// 	}
// 	// 界面弹出吐司提示
// 	function outLine(msg) {
// 		mui.toast(msg);
// 	}
//
// });
	$(".fenxiang").click(function () {
		var userid;
		if (cookiePre) {
			userid = $.cookie(cookiePre + "login_user");
		}
		if (userid == null || userid == " ") {
			location.href = "{#$cfg_basehost#}/login.html"
		} else {
			shareHref();
		}
	})
})