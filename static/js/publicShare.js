// 引入微信脚本
if(typeof(wx) == 'undefined') {
    document.head.appendChild(document.createElement('script')).src = 'http://res2.wx.qq.com/open/js/jweixin-1.4.0.js?v=' + ~(-new Date());
    // document.write(unescape("%3Cscript src='https://res.wx.qq.com/open/js/jweixin-1.3.2.js?v=" + ~(-new Date()) + "'type='text/javascript'%3E%3C/script%3E"));
}

$(function() {

	function entityToString(str) {
		var div = document.createElement('div');
		div.innerHTML = str.replace(/&amp;/g, '&');
		return div.innerText;
	}

	wxconfig && (wxconfig.title = entityToString(wxconfig.title));
	wxconfig && (wxconfig.description = entityToString(wxconfig.description));

	if (wxconfig && wxconfig.imgUrl.indexOf('siteConfig/logo') > -1 && shareAdvancedUrl) {
		wxconfig.imgUrl = shareAdvancedUrl;
	}

	if (wxconfig) {
		var userid = $.cookie((window.cookiePre ? window.cookiePre : 'HN_') + 'userid');
		if (userid) {
			wxconfig.link = wxconfig.link.indexOf('?') > -1 ? (wxconfig.link + '&fromShear=' + userid) : (wxconfig.link + '?fromShear=' + userid)
		}
	}

	//小程序
	if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {
		wx.miniProgram.getEnv(function (res) {
			if (res.miniprogram) {
				wx.miniProgram.postMessage({
					data: {
						title: wxconfig.title,
						imgUrl: wxconfig.imgUrl,
						desc: wxconfig.description,
						link: wxconfig.link
					}
				});
			}
		});
	}

	//分享功能只提供给APP使用
	var deviceUserAgent = navigator.userAgent;
	if (deviceUserAgent.indexOf('huoniao') > -1) {
		$('.HN_PublicShare').show();
	} else {
		$('.HN_PublicShare').hide();
	}

	// 由于每个页面都引入了touchBase.css，所以把公共分享的样式转移到了touchBase.css中  by: gz 20180314
	// $("head").append('<link rel="stylesheet" type="text/css" href="'+staticPath+'css/publicShare.css?t='+~(-new Date())+'">');

	var hnShare = {
		showShareBox: function () {
			// $("#publit_shear_load").remove();
			$('#HN_PublicShare_shearBox').removeClass('fn-hide').animate({'bottom': '0'}, 200);
			$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '100%', 'opacity': 1});
		}
		, closeShearBox: function () {
			$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
			$('#HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
		}

		, showQRBox: function () {
			$('#HN_PublicShare_shearBox').animate({'bottom': '-100%'}, 200);
			$('#HN_PublicShare_codeBox').animate({'bottom': '0'}, 200);
		}
		, closeQRBox: function () {
			$('#HN_PublicShare_codeBox').animate({'bottom': '-100%'}, 200);
			$('.HN_PublicShare_shearBox .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
		}
		, showSRBox: function () {
			$('.HN_PublicShare_zhiyin').show();
			$('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height': '100%', 'opacity': 1});
		}
		, closeSRBox: function () {
			$('.HN_PublicShare_zhiyin').hide();
			$('.HN_PublicShare_zhiyin .HN_PublicShare_bg').css({'height': '0', 'opacity': 0});
		}
	}

	var shareHtml = '<div class="HN_PublicShare_shearBox fn-hide"id="HN_PublicShare_shearBox" >' +
		'<div class="HN_PublicShare_sheark1"><div class="HN_PublicShare_sheark2">' +
		'<div class="HN_PublicShare_HN_style_32x32"><ul class="fn-clear">' +
		'<li><a class="HN_button_qzone" href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + wxconfig.title + '"></a>QQ空间</li>' +
		'<li><a class="HN_button_tsina" href="http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + document.title + '"></a>新浪微博</li>' +
		'<li><a class="HN_button_tweixin" ></a>微信好友</li>' +
		'<li><a class="HN_button_ttqq"></a>QQ好友</li>' +
		'<li><a class="HN_button_comment"><span class="HN_txt jtico jtico_comment"></span></a>朋友圈</li>' +
		'<li><a class="HN_button_code"><span class="HN_txt jtico jtico_code"></span></a>二维码</li></ul>' +
		'</div></div><div class="HN_PublicShare_cancel"id="HN_PublicShare_cancelShear">取消</div></div>' +
		'<div class="HN_PublicShare_bg"id="HN_PublicShare_shearBg"></div></div>' +
		'<div class="HN_PublicShare_shearBox HN_PublicShare_codeBox"id="HN_PublicShare_codeBox">' +
		'<div class="HN_PublicShare_sheark1"><img src=""alt=""width="130"height="130"><p>让朋友扫一扫访问当前网页</p>' +
		'<div class="HN_PublicShare_cancel"id="HN_PublicShare_cancelcode">取消</div></div><div class="HN_PublicShare_bg"></div></div>' +
		'<div class="HN_PublicShare_zhiyin fn-hide"><div class="HN_PublicShare_bg"><div class="HN_PublicShare_zhibox">' +
		'<img src="' + staticPath + 'images/HN_Public_sharezhi.png"alt=""></div></div></div>';

	// $("head").append('<style id="publit_shear_load">.HN_PublicShare_shearBox,.HN_PublicShare_zhiyin {display:none;}</style>');
	$("body").append(shareHtml);


	var device = navigator.userAgent;
	$("body").delegate(".HN_PublicShare", "tap click", function () {
		//非客户端下调用默认分享功能
		var device = navigator.userAgent;
		if (device.indexOf('huoniao') <= -1) {
			var QzoneUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + wxconfig.title,
				TsinaUrl = 'http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + wxconfig.title;
			$('.HN_button_qzone').attr("href", QzoneUrl);
			$('.HN_button_tsina').attr("href", TsinaUrl);
			hnShare.showShareBox();
			//客户端下调用原生分享功能
		} else {
			setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler("appShare", {
					"platform": "all",
					"title": wxconfig.title,
					"url": wxconfig.link,
					"imageUrl": wxconfig.imgUrl,
					"summary": wxconfig.description
				}, function (responseData) {
					var data = JSON.parse(responseData);
					// if(data.state == 100){
					// 	alert("分享成功！");
					// }else{
					// 	alert(data.info);
					// }
				})
			});
		}

		//隐藏浮动菜单
		$('.fixFooter').show();
		$('.header').removeClass('open');
		$('#navBox_4').hide();
		$('#navBox_4 .bg').css({'height': '0', 'opacity': 0});

		return false;
	});
	$("body").delegate(".HN_PublicShare", "touchend", function (e) {
		//取消点透事件
		e.preventDefault();
	});
	//单独分享
	$("body").delegate(".HN_PublicShare_Singel", "tap", function (event) {
		event.preventDefault();
		var id = $(this).attr("data-id");
		var device = navigator.userAgent;
		if (device.indexOf('huoniao') > -1) {
			setupWebViewJavascriptBridge(function (bridge) {
				bridge.callHandler(
					"appShare", {
					"platform": id,
					"title": wxconfig.title,
					"url": wxconfig.link,
					"imageUrl": wxconfig.imgUrl,
					"summary": wxconfig.description
				}, function (responseData) {
					var data = JSON.parse(responseData);
					// if(data.state == 100){
					// 	alert("分享成功！");
					// }else{
					// 	alert(data.info);
					// }
				})
			});
		} else {
			if (id == "Qzone") {
				location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + wxconfig.link + '&desc=' + document.title;
			} else if (id == "sina") {
				location.href = 'http://service.weibo.com/share/share.php?url=' + wxconfig.link + '&desc=' + document.title;
			} else if (id == "wechat") {
				var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
				hnShare.showQRBox();
				hnShare.showSRBox();
				// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
				$('#HN_PublicShare_codeBox img').attr('src', code);
			} else if (id == "QQ") {
				var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
				hnShare.showQRBox();
				hnShare.showSRBox();
				// $('.HN_PublicShare_bg').css({'height':'100%','opacity':1});
				$('#HN_PublicShare_codeBox img').attr('src', code);
			}
		}
	});
	$("body").delegate("#HN_PublicShare_shearBg", "tap click", function () {
		hnShare.closeShearBox();
		hnShare.closeQRBox();
		hnShare.closeSRBox();
	});

	$("body").delegate(".HN_PublicShare_bg", "tap click", function () {
		hnShare.closeShearBox();
		hnShare.closeQRBox();
		hnShare.closeSRBox();
	});
	$("body").delegate(".HN_PublicShare_bg", "touchend", function (e) {
		//取消点透事件
		e.preventDefault();
	});

	$("body").delegate("#HN_PublicShare_cancelShear", "tap click", function () {
		hnShare.closeShearBox();
	});

	$("body").delegate("#HN_PublicShare_cancelcode", "tap click", function () {

		hnShare.closeShearBox();
		hnShare.closeQRBox();
	});

	$("body").delegate(".HN_button_code", "tap", function () {
		var code = masterDomain + '/include/qrcode.php?data=' + encodeURIComponent(wxconfig.link);
		hnShare.showQRBox();
		$('#HN_PublicShare_codeBox img').attr('src', code);
	});

	$('.HN_button_tweixin, .HN_button_ttqq, .HN_button_comment').click(function(){
		hnShare.closeShearBox();
		hnShare.showSRBox();
	});


	//微信分享
	// $('.HN_button_tweixin').click(function () {
	// 	if (navigator.userAgent.toLowerCase().match(/micromessenger/)) {//判断是否是微信

	        var desc = wxconfig.description;
			var link = wxconfig.link;
			if(typeof JubaoConfig === 'function') {
                var aid = JubaoConfig['id'];
                var name = JubaoConfig['action'];
                var type = "";
                if (name == "loupan") {
                    type = 1;
                } else if (name == "sale") {
                    type = 2;
                } else if (name == "zu") {
                    type = 3;
                } else if (name == "sp") {
                    type = 4;
                } else if (name == "xzl") {
                    type = 5;
                } else if (name == "cf") {
                    type = 6;
                }
            }else {
			    aid="";
			    type="";
            }
			 console.log(aid);
			 console.log(type);
			 console.log("a");
            wx.config({
                debug: true,
                appId: wxconfig.appId,
                timestamp: wxconfig.timestamp,
                nonceStr: wxconfig.nonceStr,
                signature: wxconfig.signature,
                jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData', 'onMenuShareWeibo', 'openLocation']
            });//end config
			$.ajax({
				url:'include/ajax.php?service=member&action=wxShare&aid='+aid+'&link='+link+'&description='+desc+'&type='+type,
				type:"get",
				datatype: "jsonp",
				success:function (data) {
						var sid =data.sid;
                        wx.ready(function () {
                            wx.updateAppMessageShareData({//分享到朋友或者qq
                                title: wxconfig.title,
                                desc: wxconfig.description,
                                link: link+'?ori='+wxShare+'&sid='+sid,
                                imgUrl: wxconfig.imgUrl,
                                // trigger: function (res) {
                                //     hnShare.closeSRBox();
                                // },
                                success: function () {
                                },
                                cancel: function () {
                                    // alert("取消分享");
                                }
                            });//end message
                            wx.updateTimelineShareData({//分享给朋友圈或者qq空间
                                title: wxconfig.title,
                                link: wxconfig.link,
                                imgUrl: wxconfig.imgUrl,
                                success:function () {
                                },
                                cancel:function () {
                                }
                            });//end update
                            wx.onMenuShareWeibo({//分享到微博
                                title: wxconfig.title,
                                desc: wxconfig.description,
                                link: wxconfig.link,
                                imgUrl: wxconfig.imgUrl,
                                success:function () {
                                },
                                cancel:function () {
                                }
                            });//end menu
                        });//end ready
				},//end success
                error:function (data) {
                    alert(errMsg);
                }
     });//ens ajax
		// }
});