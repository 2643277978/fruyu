var pubStaticPath = (typeof staticPath != "undefined" && staticPath != "") ? staticPath : "/static/";
var pubModelType = (typeof modelType != "undefined") ? modelType : "siteConfig";
document.write('<script type="text/javascript" src="'+pubStaticPath+'js/webuploader/webuploader.js?t='+~(-new Date())+'"></script>');
$(function(){
	//实例化编辑器
	var ue = UE.getEditor('note');

	$("head").append('<link rel="stylesheet" type="text/css" href="'+pubStaticPath+'css/publicUpload.css?t='+~(-new Date())+'">');
	//删除图片
	$('.listImgBox').show();
	$('.filePicker').each(function() {
		  var picker = $(this), type = picker.data('type'), atlasMax = count = picker.data('count'), size = picker.data('size') * 1024, upType1,
			accept_title, accept_extensions, accept_mimeTypes;

		  if (type == "thumb") {
		  	serverUrl = '/include/upload.inc.php?mod='+pubModelType+'&filetype=image&type=thumb';
		  }
		  accept_title = 'Images';
		  accept_extensions = 'jpg,jpeg,gif,png';
		  accept_mimeTypes = 'image/*';

		  //上传凭证
  		  var i = $(this).attr('id').substr(10);
	      var $list = $('#listSection' + i),
		  	  uploadbtn = $('.uploadinp'),
			  ratio = window.devicePixelRatio || 1,
			  fileCount = 0,
			  thumbnailWidth = 200 * ratio,   // 缩略图大小
			  thumbnailHeight = 124 * ratio,  // 缩略图大小
			  uploader;

	     fileCount = $list.find('li').length;

         // 后加载进来的数据
		 var	img = picker.data('imglist');
		 if (img != "") {
    		if (type == "certs") {
      			var list = certs.split("||");
    		}else if (type == "pics") {
				var list = pics;
    		}else {
      			var list = imglist[img];
    		}
			var picList = [], fileCount = list_length = list.length, count = count - list_length;
		}

	    // 初始化Web Uploader
		uploader = WebUploader.create({
			auto: true,
			swf: pubStaticPath + 'js/webuploader/Uploader.swf',
			server: serverUrl,
			pick: '#filePicker' + i,
			fileVal: 'Filedata',
			accept: {
				title: accept_title,
				extensions: accept_extensions,
				mimeTypes: accept_mimeTypes
			},
			fileNumLimit: count,
			fileSingleSizeLimit: size
		});

		//删除已上传图片
		var delAtlasPic = function(b){
			var delbox = b.closest('.listImgBox'), delType = delbox.find('.filePicker').attr('data-type'), picpath = b.find("img").attr("data-val");
			if (delType == "thumb") {
				delType1 = "thumb";
			}else if (delType == "desc" || delType == "adv" || delType == "name" || delType == "album" || delType == "certs" || delType == "pics") {
		    delType1 = "atlas";
			}else {
		    delType1 = delType;
			}
			var g = {
				mod: pubModelType,
				type: "del"+delType1,
				picpath: picpath,
				randoms: Math.random()
			};
			$.ajax({
				type: "POST",
				url: "/include/upload.inc.php",
				data: $.param(g)
			})
		};

		//更新上传状态
		function updateStatus(obj){
	    var listImgBox = obj.closest('.listImgBox'), listSection = listImgBox.find(".listSection"),
	        li = listSection.find('li'), filePicker = listImgBox.find('.filePicker'), count = filePicker.attr('data-count');
			if(li.length == 0){
				$('.imgtip').show();
	      		obj.closest('.listImgBox').find('.filePicker').show();
				obj.closest('.listImgBox').find('.listSection').hide();
				obj.closest('.listImgBox').find('.deleteAllAtlas').hide();
			}else{
				$('.imgtip').hide();
				if(count == 1){
					obj.closest('.listImgBox').find('.uploadinp').hide();
				}
			}
			if (atlasMax == fileCount) {
				$('#previewQj').show();
			}else {
				$('#previewQj').hide();
			}
			$(".uploader-btn .utip").html((langData['siteConfig'][20][303]).replace('1',(atlasMax-fileCount)));   //还能上传--张图片
		}

		// 负责view的销毁
		var removeFile = function(file) {
			var $li = $('#'+file.id);
			fileCount--;
			delAtlasPic($li);
			$li.remove();
			updateStatus($li);
		}

		//从队列删除
		$list.delegate(".li-rm", "click", function(){
			var t = $(this), li = t.closest("li"), ul = li.closest('ul'), dd = t.closest('.listImgBox'), uploadinp = dd.find('.uploadinp'),
	        dataCount = uploadinp.attr("data-count");
			var file = [];
			file['id'] = li.attr("id");
			removeFile(file);
			updateStatus(ul);
			imgListVal(ul);
	    	//uploadinp.show();
	    	$('.uploadinp').show();
	    	$('#up-banner').show();
		});

		//删除所有图集
		$(".deleteAllAtlas").bind("click", function(){
			var t = $(this), dd = t.closest('.listImgBox'), listSection = dd.find('.listSection'),
					li = listSection.find("li"), file = [];

				for (var m = 0; m < li.length; m++) {
					file['id'] = li.eq(m).attr("id");
					removeFile(file);
				}

			fileCount = 0;
			updateStatus(t);
			listSection.hide();
			t.hide();
			imgListVal(listSection);

		});


		// 切换litpic
		if(atlasMax > 1){
			$list.delegate(".pubitem img", "click", function(){
				var t = $(this).parent('.pubitem');
				if(atlasMax > 1 && !t.hasClass('litpic')){
				console.log('eee')
					t.addClass('litpic').siblings('.pubitem').removeClass('litpic');
				}
			});
		}

	// 当有文件添加进来时执行，负责view的创建
	function addFile(file) {

		//删除本地上传图片
		var li = $('.li-rm').closest("li");
		var file_ = [];
		file_['id'] = li.attr("id");
		removeFile(file_);


	    if (type == "thumb") {
	      var $li = $('<li id="' + file.id + '" class="pubitem"><a href="" target="_blank" title="" class="enlarge"><img></a><a class="reupload li-rm" href="javascript:;">删除图片</a></li>');
	    }
		var $btns = $li.find('.li-rm'),
		    $img = $li.find('img');

		// 创建缩略图
		uploader.makeThumb(file, function(error, src) {
				$img.closest('.listSection').show();
				if(error){
					$list.show();
					$img.replaceWith('<span class="thumb-error">'+langData['siteConfig'][6][177]+'...</span>');  //上传中
					return;
				}
				$img.attr('src', src);
			}, thumbnailWidth, thumbnailHeight);

			$btns.on('click', function(){
				uploader.removeFile(file, true);
			});

			$('.deleteAllAtlas').on('click', function(){
				uploader.removeFile(file, true);
			});

			$list.append($li);

			$('#up-banner').css("display", "none");
			$(".sel_modal").css("display", "none");
			$(".reupload").css("display", "none");
	}

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {
    	var pick = $(this.options.pick);
		//先判断是否超出限制
		if(fileCount == atlasMax){
	    	alert(langData['siteConfig'][20][305]);  //图片数量已达上限
			return false;
		}

		fileCount++;
		addFile(file);
		updateStatus(pick);
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on('uploadProgress', function(file, percentage){
		var $li = $('#'+file.id),
		$percent = $li.find('.progress span');

		// 避免重复创建
		if (!$percent.length) {
			$percent = $('<p class="progress"><span></span></p>')
				.appendTo($li)
				.find('span');
		}
		$percent.css('width', percentage * 100 + '%');
	});

	// 文件上传成功，给pubitem添加成功class, 用样式标记上传成功。
	uploader.on('uploadSuccess', function(file, response){
		var $li = $('#'+file.id), listSection = $li.closest('.listSection');
		listSection.show();
		if(response.state == "SUCCESS"){
			var img = $li.find("img");
			if (img.length > 0) {
				img.attr("data-val", response.url).attr("data-url", response.turl).attr("src", response.turl);
				$li.find(".enlarge").attr("href", response.turl);
				//隐藏默认封面
				//$('#up-banner').hide();
				imgListVal(img);
	      if(fileCount == atlasMax && atlasMax == 1){
	        $(this.options.pick).closest('.uploadinp').hide();
	  			return false;
	  		}
			}else {
				fileObj = $li.find('.enlarge');
				fileObj.attr("href", response.turl).attr("data-val", response.url);
				fileObj.find('.thumb-error').text(langData['siteConfig'][26][193]);  //点击下载
				imgListVal(fileObj);
			}

		}else{
			removeFile(file, true);
			var length = listSection.find('li').length;
			if (length == 0) {
				listSection.siblings('.filePicker').show();
				alert(response.state);
			}
	    // showErr($(this.options.pick), "上传失败");
		}
	});

	// 文件上传失败，现实上传出错。
	uploader.on('uploadError', function(file){
		removeFile(file);
    alert(langData['siteConfig'][20][306]);//上传失败
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on('uploadComplete', function(file){
		$('#'+file.id).find('.progress').remove();
		//清空队列
    //  uploader.reset();
	});

	// 所有文件上传成功后调用
	uploader.on('uploadFinished', function () {
	    //清空队列
	     uploader.reset();
	});

	//上传失败
	uploader.on('error', function(code){
		var txt = langData['siteConfig'][20][306]+"！", size = this.options.fileSingleSizeLimit;   //上传失败！
		switch(code){
			case "Q_EXCEED_NUM_LIMIT":
				txt = langData['siteConfig'][20][305];  ////图片数量已达上限
				break;
			case "F_EXCEED_SIZE":
				txt = (langData['siteConfig'][20][307]).replace('1',(size/1024/1024));  //图片大小超出限制，单张图片最大不得超过1MB
				break;
			case "F_DUPLICATE":
				txt = langData['siteConfig'][20][308];   //此图片已上传过
				break;
		}
        alert(txt);
	});

	function imgListVal(obj){
		var dd = obj.closest('.listImgBox'), btn = dd.find('.filePicker'), type = btn.data("type"),listLi = dd.find('.listSection li'), $li_list = [];
		if (listLi.length != 0) {
			for (var k = 0; k < listLi.length; k++) {
				/*if (type == "thumb") {
					var imgsrc = listLi.find('img').attr('data-val');
					dd.find('.imglist-hidden').val(imgsrc);
				}*/
				var imgsrc = listLi.find('img').attr('data-val');
				$('.imglist-hidden').val(imgsrc);
			}
		}else{
			$li_list = [];
			dd.find('.imglist-hidden').val($li_list);
		}
	}
	//发起直播--选择封面图
	$(".btn_sel").click(function () {
		$(".sel_modal").css("display", "block");
		$(".uploadinp").show();
	});
	$(".btn_confirm").click(function () {
		$(".sel_modal").css("display", "none");
	});
	$(".btn_cancel").click(function () {
		$(".sel_modal").css("display", "none");
	});

	var backgrounds = [
		"/templates/member/images/live/a_banner01.png",
		"/templates/member/images/live/a_banner02.png",
		"/templates/member/images/live/a_banner03.png",
		"/templates/member/images/live/a_banner04.png",
		"/templates/member/images/live/a_banner05.png",
		"/templates/member/images/live/a_banner06.png",
		"/templates/member/images/live/a_banner07.png",
		"/templates/member/images/live/a_banner08.png",
		"/templates/member/images/live/a_banner09.png",
		"/templates/member/images/live/a_banner10.png",
		"/templates/member/images/live/a_banner11.png",
		"/templates/member/images/live/a_banner12.png",
		"/templates/member/images/live/a_banner13.png",
		"/templates/member/images/live/a_banner14.png",
		"/templates/member/images/live/a_banner15.png"
	];

	$(".modal_main ul li").click(function () {
		$(".modal_main ul li").removeClass('active');
		$(this).addClass('active');
		$("#up-banner").show();
		//删除本地上传图片
		var li = $('.listSection li:eq(0)');
		var file = [];
		file['id'] = li.attr("id");
		removeFile(file);
		$('.imglist-hidden').attr('value',backgrounds[$(this).val()]);
		$("#up-banner").css({
			'background': 'url(' + backgrounds[$(this).val()] + ') no-repeat center',
			'background-size': 'cover'
		});
		$(".sel_modal").css("display", "none");
	});

	$(".btn_cancel").click(function(){
		$('.imglist-hidden').attr('value','');
		$("#up-banner").css("background",'#f0f0f0 url('+templatePath+'images/picture.png) no-repeat center center');
	})

   })

	//选择横竖屏
	$(".h_live").click(function () {
		$("#h_screen").addClass("active");
		$("#v_screen").removeClass("active");
	});
	$(".v_live").click(function () {
		$("#v_screen").addClass("active");
		$("#h_screen").removeClass("active");
	});

	$('#live_lx').change(function(){
		var options=$("#live_lx option:selected"); //获取选中的项
		if(options.text()==langData['siteConfig'][31][57]){   //加密
			$(".li_collect").css("display","none");
			$(".li_pass").css("display","block");
		}else if(options.text()==langData['siteConfig'][19][889]){   //收费
			$(".li_pass").css("display","none");
			$(".li_collect").css("display","block");
		}else{
			$(".li_pass").css("display","none");
			$(".li_collect").css("display","none");
		}
	});
	//时间
	$("#start_time").click(function(){
		WdatePicker({
			el: 'start_time',
			isShowClear: false,
			isShowOK: false,
			isShowToday: false,
			qsEnabled: false,
			dateFmt:"yyyy-MM-dd HH:mm:ss"
		});
	});
	//加的效果
	$(".cAdd").click(function(){
		var n=$(this).prev().val();
		var num=parseInt(n)+1;
		if(num==-1){ return;}
		$(this).prev().val(num);
	});
	//减的效果
	$(".cReduce").click(function(){
		var n=$(this).next().val();
		var num=parseInt(n)-1;
		if(num==-1){ return;}
		$(this).next().val(num);
	});


	//推流地址
	$("#fbForm").submit(function(e){
		e.preventDefault();
	});
	$('.btn-create').click(function(){
		//event.preventDefault();
		var t = $(this);
		var type = $(".live_sel .active").attr("data-id");
		$("#show").val(type);
		var litpic = $('#litpic');
		if(litpic.val() == ''){
			//errmsg(litpic,'请上传直播封面');
			alert(langData['siteConfig'][31][93]);   //请上传直播封面
			$(window).scrollTop(0);
			return false;
		}
		if($('#live_title').val() == ''){
			//errmsg(litpic,'请填写直播标题');
			alert(langData['siteConfig'][31][94]);  //请填写直播标题
			$(window).scrollTop(0);
			return false;
		}
		if($('#live_class').val() == 0){
			//errmsg(litpic,'请选择直播分类');
			alert(langData['siteConfig'][31][48]);  //请选择直播分类
			$(window).scrollTop(0);
			return false;
		}
		var style = $('#live_style').val();
		if(style == 0){
			//errmsg(litpic,'请选择直播类型');
			//$(window).scrollTop(0);
			//return false;
		}else if(style == 2){
			if($('#password').val() == ''){
				//errmsg(litpic,'请填写密码');
				alert(langData['siteConfig'][20][502]);   //请填写密码
				$(window).scrollTop(0);
				return false;
			}
		}else if(style == 3){
			if($('#start_collect').val() ==0 || $('#start_collect').val() == ''){
				//errmsg(litpic,'请填写开始收费');
				alert(langData['siteConfig'][31][95]);  //请填写开始收费
				$(window).scrollTop(0);
				return false;
			}
			if($('#end_collect').val() ==0 || $('#end_collect').val() == ''){
				//errmsg(litpic,'请填写结束收费');
				alert(langData['siteConfig'][31][96]);   //请填写结束收费
				$(window).scrollTop(0);
				return false;
			}
		}
		if($('#live_liuchang').val() == 0){
			//errmsg(litpic,'请选择直播流畅度');
			alert(langData['siteConfig'][31][97]);  //请选择直播流畅度
			$(window).scrollTop(0);
			return false;
		}

		ue.sync();

		var r = menuSort(true);
		if(!r){
			$.dialog.alert('请填写完整直播菜单');
			return false;
		}

		var form = $("#fbForm"), action = form.attr("action");
		$.ajax({
			url: masterDomain + action,
			type: 'post',
			dataType: 'json',
			data:$("#fbForm").serialize(),
			success: function (data) {
				if(data && data.state == 100){

					fabuPay.check(data, userDomain, t);

					//console.log(data);
					// window.location.href = (action.indexOf('edit') > -1 ? detailUrl : userDomain) +'?id='+data.info.id;
				}else{
					alert(data.info)
				}
			},
			error: function(){
				alert(langData['siteConfig'][31][98]);  //请重新提交表单
			}
		})
	});

	// 切换拉流地址生成
	$('#pulltype').change(function(){
		var v = $(this).val();
		if(v == 1){
			$('.pullurlBox').show()
		}else{
			$('.pullurlBox').hide()
		}
	})

	// 新增菜单
	$('.menu').delegate('.add', 'click', function(){
	    var t = $(this), p = t.closest('li'), tpl = $('#menuTpl').html();
	    p.after(tpl);
	    menuSort();
	})
	// 删除菜单
	$('.menu').delegate('.del', 'click', function(){
	    var t = $(this), p = t.closest('li');
	    if(t.siblings('.sys').val() != '0' && t.siblings('.sys').val() != ''){
	        $.dialog.alert('该项无法删除');
	        return false;
	    }
	    p.remove();
	    menuSort();
	})
	// 显示隐藏
	$('.menu').delegate('.dn', 'click', function(){
	    var t = $(this);
	    if(t.hasClass('active')){
	        t.text('隐藏');
	        t.siblings('.show').val(0);
	    }else{
	        t.text('显示');
	        t.siblings('.show').val(1);
	    }
	    t.toggleClass('active');
	})
	// 菜单排序
	$('.menu').sortable({
	    items: 'li',
	    placeholder: 'placeholder',
	    orientation: 'vertical',
	    axis: 'y',
	    handle:'.sort',
	    opacity: .5,
	    revert: 0,
	    update:function(){
	        menuSort();
	    }
	});

	function menuSort(type){
			var r = true;
			return r;
	    $('.menu li').each(function(n){
	        var t = $(this), idx = t.attr('data-idx'), sys = t.find('.sys').val(), title = t.find('.name').val(), val = t.find('.url').val();
	        if(sys == 0){
	        	if((title != '' && val == '') || (title == '' && val != '')){
	        		if(type){
	        			r = false;
	        			return false;
	        		}
	        	}
	        }else{
	        	if(title == ''){
	        		r = false;
	        		return false;
	        	}
	        }
	        t.find('input').each(function(){
	            var inp = $(this), name = inp.attr('name');
	            inp.attr('name', name.replace('[0]', '['+n+']').replace(idx, n));
	        })
	        t.attr('data-idx', n);
	    })
	    return r;
	}
});
function getAddress(){
	$.ajax({
		url: masterDomain + "/include/ajax.php?service=live&action=getPushSteam",
		type: "GET",
		dataType : "json",
		success: function(data){
			if (data && data.state != 200) {
				var url=data.info.pushurl;
				console.log(url);
				return true;
			}
		}
	});
}
