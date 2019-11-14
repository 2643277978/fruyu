;(function($) {
	/**
	 * 设置数组下标，方便递归加载
	 */
	var imScriptUrlIndex = 0,


		menuPath = "http://static.99114.com/static/menu", //公用图标路径

		/**
		 * 开发环境
		 */

		// webImUIPath = "http://webim2.99114.cn/webImUI", //静态工程路径
		// windows_dl = "http://im01.yyuap.com/tenancy/wk/WK_WIN.zip",
		// mac_dl = "http://im01.yyuap.com/tenancy/wk/WK_MAC.zip",

		/**
		 * 测试环境
		 */
		// webImUIPath = "http://static.99114.cn/static/webImUI", //静态工程路径
		// windows_dl = "http://im01.yyuap.com/tenancy/wk/WK_WIN.zip",
		// mac_dl = "http://im01.yyuap.com/tenancy/wk/WK_MAC.zip",

		/**
		 * 线上环境
		 */
		webImUIPath = "http://static.99114.com/static/webImUI", //静态工程路径
		windows_dl = "http://im.yyuap.com/tenancy/wk/WK_WIN.zip",
		mac_dl = "http://im.yyuap.com/tenancy/wk/WK_MAC.zip",

		/**
		 * css数组
		 */
		imCssUrlArrays = [
			'<link type="text/css" rel="stylesheet" href="'+webImUIPath+'/ui/im.css"/>',
			'<link type="text/css" rel="stylesheet" href="'+webImUIPath+'/ui/jquery.mCustomScrollbar.css"/>',
			'<link type="text/css" rel="stylesheet" href="'+webImUIPath+'/ui/face.css"/>'
		],
		/**
		 * 要加载的js数组
		 */
		imScriptUrlArrays = [
			webImUIPath+'/js/jquery.qqFace.js',
			// webImUIPath+'/js/My97DatePicker/WdatePicker.js',
			webImUIPath+'/js/dateUtil.js',
			webImUIPath+'/js/jquery-ui-1.10.4.min.js',
			webImUIPath+'/js/jquery.mousewheel.js',
			webImUIPath+'/js/jquery.mCustomScrollbar.min.js',
			webImUIPath+'/js/jsCalMethod.js',
			webImUIPath+'/js/iNotify.js',
			webImUIPath+'/js/YYIM/YYIMSDK.js',
			webImUIPath+'/js/YYIM/YYIMCache.js'
			,webImUIPath+'/webIm.js'
		];

	/**
	 * 增加css
	 */
	function getCssForIM() {

		var $head = $('head');
		for (var i=0,len=imCssUrlArrays.length; i<len; i++) {
			$head.append(imCssUrlArrays[i]);
		}
	}

	/**
	 * 判断嵌入页面是否有对应的div容器没有则创建
	 */
	function getHtmlForIM() {

		if ($('#WK_IM_DIV').length == 0) {
			$('body').append('<div id="WK_IM_DIV"/>');
		}
		$('#WK_IM_DIV').html(createHtmlForIM());
	}

	/**
	 * 加载IM脚本
	 * @param url
	 */
	function getScriptForIM(url) {
		if (url) {
			imScriptUrlIndex++;
			$.ajax({
				url: url,
				dataType: "script",
				scriptCharset: "utf-8",
				cache: true
			}).done(function() {
				getScriptForIM(imScriptUrlArrays[imScriptUrlIndex]);
			});
		} else {
			//初始化IM
			IMLoadEntrance();
		}
	}

	/**
	 * 加载完js后执行主函数初始化IM
	 */
	function IMLoadEntrance() {
		//判断是否有自定义初始化方法
		setTimeout(function() {
			if (typeof(IMInitializeEntrance) === 'function') {
				IMInitializeEntrance();
			} else {
				var loginMemberId = $('#IM_LOGIN_MEMBER_ID').val();
				var chat = new Chat();
				chat.init({
					memberId: loginMemberId,
					showChatPanel: true,
					source: "", //来源传1 采购  来源2 供应
					sourceURL: "" //来源如果是客服或者店铺 传来源url
				});
			}
		}, 2000);
	}

	/**
	 * 拼接IM html
	 * @returns dom
	 */
	function createHtmlForIM() {
		var html = '';
		html += '<div class="im_imBox"> ';
		html += '	<div class="imTop-div" id="imTop-div"> ';
		html += '		<div class="imT"> ';
		html += '			<div class="imTitle"> ';
		html += '				<div class="download"> ';
		html += '					<a href="javascript:void(0);"><i>';
		html += '						<img src="'+webImUIPath+'/images/im/download_btn.png"/></i>';
		html += '					</a>';
		html += '					<div class="banben">';
		html += '						<a href="'+windows_dl+'" target="_blank" class="tb_windows"></a>';
		html += '						<a href="'+mac_dl+'" target="_blank" class="tb_mac"></a>';
		html += '					</div>';
		html += '				</div> ';
		html += '				<div class="close_window"> ';
		html += '					<img src="'+webImUIPath+'/images/im/close.jpg"/>';
		html += '				</div> ';
		html += '				<span class="chat_friend_name"></span> ';
		html += '				<a target="_blank" class="chat_friend_name">网库帮帮</a> ';
		// html += '				<img id="dkfTips" class="bz fr hid" src="'+webImUIPath+'/images/bz.png" /> ';
		// html += '                <div class="bz_all hid">代客服是在您所联系的企业客服不在线的情况下，由网库平台代来接洽的人工服务</div>   ';
		html += '			</div> ';
		html += '		</div> ';
		html += '		<div class="imM"> ';
		html += '			<div class="info-c clearfix"> ';
		html += '				<div class="i-logo fl"> ';
		html += '					<img class="m-pic" src="'+webImUIPath+'/images/im/head01.jpg"/>	 ';
		html += '					<div class="im-zz"></div> ';
		html += '				</div> ';
		html += '				<div class="i-comt fl wk-member"> ';
		html += '					<p class="Authentication fl"> ';
		html += '						<span></span> ';
		html += '					</p> ';
		// html += '					<p class="phone fl"> ';
		// html += '						手机： ';
		// html += '					<span></span></p> ';
		html += '					<p class="wrap fl" style="width: 100%;"> ';
		html += '						<span></span> ';
		html += '					</p> ';
		html += '				</div> ';
		html += '				<div class="fl wk-dkf hid"> ';
		html += '					<p class="dkf_title fl" > ';
		html += '						代客服：<span></span> ';
		html += '					</p> ';
		html += '					<p class="dkf_title wrap fl"> ';
		html += '						委托方：<a target="_blank"></a> ';
		html += '					</p> ';
		html += '				</div> ';
		html += '			</div> ';
		html += '			<div class="im-main clearfix"> ';
		html += '				<div class="friendRecord fl"> ';
		html += '					<div class="clearfix" id="Achat"> ';
		html += '						<div class="Prompt clearfix im_prompt_fixed" id="im_prompt"> ';
		html += '							<span class="srcive fl">已开启"网库代客服"，离线状态由代客服提供服务！</span>  ';
		html += '							<i class="Prompt_active Prompt_img  fr"> ';
		html += '								<img src="'+webImUIPath+'/images/close.png"> ';
		html += '							</i> ';
		html += '						</div> ';
		html += '						<div class="Prompt clearfix im_prompt_fixed" id="im_agent"> ';
		html += '							<span class="srcive fl"> ';
		html += '							</span> ';
		html += '							<i class="Prompt_img fr">  ';
		html += '								<img src="'+webImUIPath+'/images/close.png"/> ';
		html += '							</i> ';
		html += '						</div> ';
		html += '						<div id="chatLoading" class="contloading" style="display: none;">正在玩命加载中...</div> ';
		html += '						<div class="pd_friend hid" style="display: block;">';
		html += '							<span>你们还不是好友是否 <a id="addFriendsHint">加为好友</a></span><i><img src="'+webImUIPath+'/images/im/remove.png"/></i> ';
		html += '						</div> ';
		html += '						<div id="chat-scrollBar"> ';
		html += '							<div class="record-top"> ';
		html += '							</div> ';
		html += '						</div> ';
		html += '					</div> ';
		html += '					<div class="con-mid-bar clearfix"> ';
		// html += '						<div class="bar-line fl"></div> ';
		html += '						<div class="fl im-pl5" id="emotionDiv"> ';
		html += '							<span> ';
		html += '								<a href="javascript:void(0);"> ';
		html += '									<img src="'+webImUIPath+'/images/im/face_hover_icon.png" /> ';
		html += '								</a> ';
		html += '							</span> ';
		html += '						</div> ';
		html += '						<div class="fl im-pl5" id="sendPic"> ';
		html += '							<span> ';
		html += '								<a href="javascript:void(0);"> ';
		html += '									<img src="'+webImUIPath+'/images/im/img_hover_icon.png"/>';
		html += '								</a> ';
		html += '							</span> ';
		html += '						</div> ';
		html += '						<div class="fl im-pl5" id="sendFile"> ';
		html += '							<span> ';
		html += '								<a href="javascript:void(0);"> ';
		html += '									<img src="'+webImUIPath+'/images/im/file_hover_icon.png"/>';
		html += '								</a> ';
		html += '							</span> ';
		html += '						</div> ';
		html += '						<div class="bar-record fr"> ';
		html += '							<span> ';
		// html += '								<a href="javascript:void(0);" id="readChatMes"> ';
		// html += '									聊天记录 ';
		// html += '								</a> ';
		html += '							</span> ';
		html += '						</div> ';
		html += '					</div> ';
		html += '					<div class="con-bot" id="chatText"> ';
		html += '						<textarea id="chatArea" class="textarea"></textarea> ';
		html += '						<div class="b-btn"> ';
		html += '							<img class="float-label hid" src="'+webImUIPath+'/images/im_empty.png" /> ';
		html += '							<span id="areaCount" class="bot-span"> ';
		// html += '								您还可以输入<i class="col-blue">150</i>字 ';
		html += '							</span>  ';
		html += '							<a class="orangeBtn sendBtn mr10" href="javascript:void(0);" title="发送">发&nbsp;送</a> ';
		html += '						</div> ';
		html += '					</div> ';
		html += '				</div> ';
		html += '				<div class="imTab tabDiv clearfix fr"> ';
		html += '				   		<div class="Card"> ';
		html += '                            <ul class="Card_all clearfix" id="ul_Top"> ';
		html += '                                <li class="gift fl on"  > ';
		html += '                                	对话来源 ';
		html += '                                </li> ';
		html += '                                <li class="gift fl"> ';
		html += '                                	企业资料 ';
		html += '                                </li> ';
		html += '                            </ul> ';
		html += '                         </div> ';
		html += '						<div class="c_box"> ';
		html += '							<ul class="count_ul clearfix" id="ul_Bottom"> ';
		html += '								<li class="count_show show fl" id="sourceLi"> ';
		html += '									<div id="supply" class="hid"> ';
		html += '										<div class="card_count "> ';
		html += '											<img class="m-pro-pic" src="'+webImUIPath+'/images/alb_h156.gif"/> ';
		html += '										</div> ';
		html += '										<div class="c_tit"> ';
		html += '											<a  href="javascript:void(0);" target="_blank"></a> ';
		html += '										</div> ';
		html += '										<div class="c_tit"> ';
		html += '										</div> ';
		html += '									</div> ';
		html += '									<div id="purchase" class="cg_source hid"> ';
		html += '										<p class="message_text"><a href="javascript:void(0);" target="_blank"></a></p> ';
		html += '										<p class="message_p_text">采购规模：<span></span></p> ';
		html += '										<p class="message_p_text">截止日期：<span></span></p> ';
		html += '									</div> ';
		html += '									<div id="other" class="hid"> ';
		html += '										<p class="message_text"><a id="im_source_a" href="javascript:void(0);" target="_blank"></a></p> ';
		html += '									</div> ';
		html += '									<span class="available">暂无来源信息！</span> ';
		html += '								</li> ';
		html += '								<li class="card_message fl" id="infoLi"> ';
		html += '									<div class="hid"> ';
		html += '										<p class="message_text"></p> ';
		html += '										<div class="Icon hid"> ';
		html += '											<span class="fl dpt hid">  ';
		html += '												<img alt="单品通" title="单品通" src="'+menuPath+'/images/icon/dp.gif"/> ';
		html += '											</span>  ';
		html += '											<span class="fl xyrz hid"> ';
		html += '												<img alt="实名认证" title="实名认证" src="'+menuPath+'/images/icon/xinb_ico.jpg" /> ';
		html += '											</span> ';
		html += '											<span class="fl yong hid">  ';
		html += '												<img alt="佣金协议" title="佣金协议" src="'+menuPath+'/images/icon/fanli.png"/> ';
		html += '											</span> ';
		html += '											<span class="fl wx hid"> ';
		html += '												<img alt="微店" title="微店" src="'+menuPath+'/images/icon/weib_ico.gif" /> ';
		html += '											</span> ';
		html += '										</div> ';
		html += '										<p class="message_p_text"> ';
		html += '											经营模式：<span></span> ';
		html += '										</p> ';
		html += '										<p class="message_p_text"> ';
		html += '											所在地区：<span></span> ';
		html += '										</p> ';
		html += '									</div> ';
		html += '									<div class="hid"> ';
		html += '										<p class="tit_txt">网库代客服</p> ';
		html += '                                    	<p class="describe_txt">代客服是在您所联系的企业客服不在线的情况下，由网库平台代来接洽的人工服务。</p> ';
		html += '									</div> ';
		html += '									<span class="available">网库帮帮</span> ';
		html += '								</li> ';
		html += '							</ul> ';
		html += '						</div> ';
		html += '                           <div class="line-toggle">';
		html += '								<a href="javascript:void(0)" class="line-f curr"> ';
		html += '									最近联系人 ';
		html += '								</a> ';
		html += '								<a href="javascript:void(0)" class="line-f"> ';
		html += '									我的好友';
		html += '								</a> ';
		html += '							</div> ';
		html += '					<div id="contacts-scrollBar"> ';
		html += '						<div class="tabCon"> ';
		html += '							<ul> ';
		html += '								<li class="liOne" id="chatList"> ';
		html += '								<ul style="display: block;"> ';
		html += '								</ul> ';
		html += '								</li> ';
		html += '							</ul> ';
		html += '						</div> ';
		html += '					</div> ';
		html += '				</div> ';
		html += '				<div id="noFriend" class="warn-popup hid" >' +
									'<div  class="empty-warn"> 							' +
										'<p>您好，这里是网库帮帮</p> 								' +
										'<p>您可以点击页面中的<img src="'+webImUIPath+'/images/online.png">按钮发起会话</p>' +
										'<p>赶紧试试吧~</p> 	' +
									'</div>' +
								'</div> ';
		html += '			</div> ';
		html += '		</div> ';
		html += '		<div class="chatRecord-small chat"> ';
		html += '			<div class="record-head"> ';
		html += '				<a class="close fr" href="javascript:void(0);"></a> ';
		html += '				<h3> ';
		html += '					<a href="javascript:void(0);">展开</a> ';
		html += '				</h3> ';
		html += '			</div> ';
		html += '			<div id="chat-historyRecord" class="recordCon"> ';
		html += '				<div id="chat-historyRecord-loading" class="contloading right-s">正在玩命加载中...</div> ';
		html += '				<div class="clearfix"> ';
		html += '					<div id="records-scrollBar-small" class="scroll"> ';
		html += '						<div class="chatInner"></div> ';
		html += '					</div> ';
		html += '				</div> ';
		html += '				<div class="record-bottom clearfix"> ';
		html += '					<span class="date fl"> ';
		html += '						<img id="dateImg" src="'+webImUIPath+'/images/date.jpg" />  ';
		html += '						<span id="selDate"></span> ';
		html += '					</span> ';
		html += '					<div class="page fr"></div> ';
		html += '				</div> ';
		html += '			</div> ';
		html += '		</div> ';
		html += '	</div> ';
		html += '	<div class="imB"> ';
		html += '		<div class="innerIm clearfix" id="innerIm"> ';
		html += '			<span class="Bubble hid"></span> ';
		html += '			<div class="photo fl"> ';
		html += '				<span class="imp"><img src="'+webImUIPath+'/images/im/aicon_small.png" /></span>  ';
		html += '					<img class="line_on fl" src="'+webImUIPath+'/images/lineDown.gif" /> ';
		html += '			</div> ';
		html += '			<div class="client fl clearfix"> ';
		html += '				<span class="g-iconT fl"> ';
		html += '					联系人<span id="chatCount"></span> ';
		html += '				</span>  ';
		html += '				<span class="fl hid" id="currentChat"></span>  ';
		html += '				<span id="messageCount"></span> ';
		html += '				<span class="iconS fr"></span> ';
		html += '			</div> ';
		html += '			<div class="comprofDiv"> ';
		html += '				<div class="comprofT"> ';
		html += '					<a href="javascript:void(0);" class="c-close fr"></a> ';
		html += '					<div class="title" style="height: 25px;"> ';
		html += '						公司档案 ' ;
		// html += '	<img id="new_btn" class="im_cursor" src="'+webImUIPath+'/images/load.png" title="刷新" />  ';
		// html += '							 <img id="set_btn" class="im_cursor" src="'+webImUIPath+'/images/set.png" title="设置" /> ';
		html += '						<div class="set_page hid" id="set_page"> ';
		html += '							<div class="Explain"> ';
		html += '								<input type="checkbox" id="message_agent" />  ';
		html += '									<span class="open">开启网库"代消息"</span> ';
		html += '								<span class="srcive_problem">  ';
		html += '									<b id ="PromptTip">  ';
		html += '										<img src="'+webImUIPath+'/images/problem.png" width="14" height="14" /> ';
		html += '									</b> ';
		html += '									<p class="Explain hid" id="explain_close"> ';
		html += '										代客服是在您所联系的企业客服不在线的情况下，由网库平台代来接洽的人工服务 ';
		html += '									</p> ';
		html += '								</span> ';
		html += '							</div> ';
		html += '							<div> ';
		html += '								<input type="checkbox" id="message_sound" />  ';
		html += '									<span>开启"消息提醒音"</span> ';
		html += '							</div> ';
		html += '						</div> ';
		html += '					</div> ';
		html += '				</div> ';
		html += '				<div class="comprofB"> ';
		html += '					<h3> ';
		html += '						<span class="wrap comName"></span>  ';
		html += '						<span class="dpt hid">  ';
		html += '							<img alt="单品通" title="单品通" src="'+menuPath+'/images/icon/dp.gif"/> ';
		html += '						</span>  ';
		html += '						<span class="xyrz hid"> ';
		html += '							<img alt="实名认证" title="实名认证" src="'+menuPath+'/images/icon/xinb_ico.jpg" /> ';
		html += '						</span> ';
		html += '						<span class="yong hid">  ';
		html += '							<img alt="佣金协议" title="佣金协议" src="'+menuPath+'/images/icon/fanli.png"/> ';
		html += '						</span> ';
		html += '						<span class="wx hid"> ';
		html += '							<img alt="微店" title="微店" src="'+menuPath+'/images/icon/weib_ico.gif" /> ';
		html += '						</span> ';
		html += '					</h3> ';
		html += '					<p> ';
		html += '						企业信息核实：<span></span> ';
		html += '					</p> ';
		html += '					<p> ';
		html += '						在线支付：  ';
		html += '						<span class="hid"> ';
		html += '							<img src="'+webImUIPath+'/images/pay_zhifubao.jpg" /> ';
		html += '						</span> ';
		html += '						<span class="hid"> ';
		html += '							<img src="'+webImUIPath+'/images/pay_wangyin.jpg" /> ';
		html += '						</span> ';
		html += '					</p> ';
		html += '					<p> ';
		html += '						经营模式：<span></span> ';
		html += '					</p> ';
		html += '					<p class="wrap"> ';
		html += '						主营业务：<span></span> ';
		html += '					</p> ';
		html += '					<p class="wrap"> ';
		html += '						所在地区：<span></span> ';
		html += '					</p> ';
		html += '					<p class="noLogin hid">请先登录，未登录状态无法获取详细信息！</p> ';
		html += '					<div class="wrap-btn hid"> ';
		html += '						<a href="javascript:void(0);" id="im_login"> ';
		html += '							<img src="'+webImUIPath+'/images/im/btn.png" /> ';
		html += '						</a>';
		html += '					</div> ';
		html += '				</div> ';
		html += '			</div> ';
		html += '		</div> ';
		html += '	</div> ';
		html += '	<div class="chat chatRecord-big"> ';
		html += '		<div class="record-head"> ';
		html += '			<a id="close-bigRecord" class="stop fr" href="javascript:void(0);">收起</a> ';
		html += '			<h3> ';
		html += '				与<span id="chatMember"></span>的聊天记录 ';
		html += '			</h3> ';
		html += '		</div> ';
		html += '	</div> ';
		html += '</div> ';
		return html;
	}

	//为了不影响主页面其他脚本加载，延迟500ms请求
	setTimeout(function() {
		var _scope = document;

		//为会员中心的iframe页面也绑定事件
		try {
			_scope = window.parent.document;
		} catch (e) {

		}

		if ($('#WK_IM_DIV', _scope).length == 0) {
			//动态添加IM css
			getCssForIM();
			//动态添加IM dom
			getHtmlForIM();
			//动态加载IM scripts
			getScriptForIM(imScriptUrlArrays[imScriptUrlIndex]);
		}
	}, 500);

})(jQuery);