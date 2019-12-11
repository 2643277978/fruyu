var slider1, slider;

huoniao.rowspan = function(t, colIdx) {
  return t.each(function() {
      var that;
      $('tr', this).each(function(row) {
          $('td:eq(' + colIdx + ')', this).filter(':visible').each(function(col) {
              if (that != null && $(this).html() == $(that).html()) {
                  rowspan = $(that).attr("rowSpan");
                  if (rowspan == undefined) {
                      $(that).attr("rowSpan", 1);
                      rowspan = $(that).attr("rowSpan");
                  }
                  rowspan = Number(rowspan) + 1;
                  $(that).attr("rowSpan", rowspan);
                  $(this).hide();
              } else {
                  that = this;
              }
          });
      });
  });
}

$(function(){

  slider = new Swiper('#slider .swiper-container', {pagination : '.pagination'});
  slider1 = new Swiper('#slider1 .swiper-container', {pagination : '.pagination'});
  if(id && $('.pagination span').length) $('.pagination').show();



  try{
		var upType1 = upType;
	}catch(e){
		var upType1 = 'atlas';
	}


//表单验证
  var regex = {

    regexp: function(t, reg, err){
      var val = $.trim(t.val()), dl = t.closest("dl"), name = t.attr("name"),
          tip = t.data("title"), etip = tip, hline = dl.find(".tip-inline"), check = true;

      if(val != ""){
        var exp = new RegExp("^" + reg + "$", "img");
        if(!exp.test(val)){
          etip = err;
          check = false;
        }
      }else{
        check = false;
      }
      if(dl.attr("data-required") == 1){
        if(val == "" || !check){
          showErr(etip);
        }
        return check;
      }
    }

    //名称
    ,title: function(){
      return this.regexp($("#title"), ".{5,50}", langData['siteConfig'][27][90]);
    }

    //市场价
    ,mprice: function(){
      return this.regexp($("#mprice"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
    }

    //一口价
    ,price: function(){
      return this.regexp($("#price"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
    }

    //运费
    ,logistic: function(){
      var t = $("#logistic"), val = t.val(), dl = t.closest("dl"), tip = dl.data("title"), etip = tip, hline = dl.find(".tip-inline");
      if(val == 0){
        showErr(etip);
        return false;
      }else{
        return true;
      }
    }

    //库存
    ,inventory: function(){
      return this.regexp($("#inventory"), "[0-9]\\d*", langData['siteConfig'][27][92]);
    }

    //购买限制
    ,limit: function(){
      return this.regexp($("#limit"), "[0-9]\\d*", langData['siteConfig'][27][92]);
    }


  }

  var inputObj = "";
  //商品属性选择或输入：点击
  $("#proItem input[type=text]").focus(function(){
    var itemList = $(this).siblings(".popup_key");
    inputObj = $(this).attr("id");
    if(itemList.html() != undefined){
      itemList.show();;
    }
    return false;
  }).blur(function(){
    setTimeout(function(){$(".popup_key").hide();},200)
  });

  //商品属性选择或输入：输入
  $("#proItem").delegate("input[type=text]", "input", function(){
    var itemList = $(this).siblings(".popup_key"), val = $(this).val(), sLength = 0;
    itemList.find("li").hide();
    itemList.hide();
    itemList.find("li").each(function(index, element) {
      var txt = $(this).attr("title");
      if(txt.indexOf(val) > -1){
        sLength++;
        $(this).show();
      }
    });
    if(sLength > 0){
      itemList.show();
    }
  });

  //商品属性选择完成关闭浮动层
  $(".popup_key").delegate("li", "click", function(){
    var id = $(this).attr("data-id"), val = $(this).attr("title"), parent = $(this).parent().parent();
    if(id && val){
      parent.siblings("input[type=text]").val(val);
    }
    parent.hide();
  });

  // 商品属性单选
  $("#proItem .radio span").click(function(){
    var t = $(this), id = t.data('id');
    t.addClass('curr').siblings('span').removeClass('curr').siblings('input').val(id);
  })

  //商品运费模板
  $('#logistic').scroller(
    $.extend({
      preset: 'select',
      // group: true
    })
  );
  //获取运费模板详细
  function getLogisticDetail(id){
    $.ajax({
      type: "GET",
      url: "/include/ajax.php?service=shop&action=logisticTemplate&sid="+$("#store").val()+"&id="+id,
      dataType: "jsonp",
      success: function(a) {
        if(a.state == 100){
          $("#logisticDetail").html(a.info).show();
        }
      }
    });
  }
  $("#logistic").change(function(){
    var id = $(this).val();
    if(id == 0){
      $("#logisticDetail").hide();
    }else{
      getLogisticDetail(id);
    }
  });

  //发布商品选择品牌
  $('.demo-select-opt').scroller(
  	$.extend({
      preset: 'select',
      group: true
    })
  );

	//错误提示
  var showErrTimer;
  function showErr(txt){
      showErrTimer && clearTimeout(showErrTimer);
      $(".popErr").remove();
      $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
      $(".popErr p").css({"margin-left": -$(".popErr p").width()/2, "left": "50%"});
      $(".popErr").css({"visibility": "visible"});
      showErrTimer = setTimeout(function(){
          $(".popErr").fadeOut(300, function(){
              $(this).remove();
          });
      }, 1500);
  }




$('.filePicker').each(function(){
  var pid = $(this).attr('data-id');
  //上传凭证
	var $list = $('#fileList'+pid),
		uploadbtn = $('.uploadbtn'),
			ratio = window.devicePixelRatio || 1,
			fileCount = 0,
			thumbnailWidth = 100 * ratio,   // 缩略图大小
			thumbnailHeight = 100 * ratio,  // 缩略图大小
			uploader;

	fileCount = $list.find(".thumbnail").length;

	// 初始化Web Uploader
	uploader = WebUploader.create({
		auto: true,
		swf: staticPath + 'js/webuploader/Uploader.swf',
		server: '/include/upload.inc.php?mod='+modelType+'&type='+upType1,
		pick: '#filePicker'+pid,
		fileVal: 'Filedata',
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,gif,png',
			mimeTypes: 'image/*'
		},
		compress: {
			width: 750,
	    height: 750,
	    // 图片质量，只有type为`image/jpeg`的时候才有效。
	    quality: 90,
	    // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
	    allowMagnify: false,
	    // 是否允许裁剪。
	    crop: false,
	    // 是否保留头部meta信息。
	    preserveHeaders: true,
	    // 如果发现压缩后文件大小比原来还大，则使用原来图片
	    // 此属性可能会影响图片自动纠正功能
	    noCompressIfLarger: false,
	    // 单位字节，如果图片大小小于此值，不会采用压缩。
	    compressSize: 1024*200
		},
		fileNumLimit: atlasMax,
		fileSingleSizeLimit: atlasSize
	});


	//删除已上传图片
	var delAtlasPic = function(b){
		var g = {
			mod: modelType,
			type: "delAtlas",
			picpath: b,
			randoms: Math.random()
		};
		$.ajax({
			type: "POST",
			url: "/include/upload.inc.php",
			data: $.param(g)
		})
	};

	//更新上传状态
	function updateStatus(){
		if(fileCount == 0){
			$('.imgtip').show();
		}else{
			$('.imgtip').hide();
			if(atlasMax > 1 && $list.find('.litpic').length == 0){
				$list.children('li').eq(0).addClass('litpic');
			}
		}
		$(".uploader-btn .utip").html('还能上传'+(atlasMax-fileCount)+'张图片');
	}

	// 负责view的销毁
	function removeFile(file) {
		var $li = $('#'+file.id);
		fileCount--;
		delAtlasPic($li.find("img").attr("data-val"));
		$li.remove();
		updateStatus();
	}

	//从队列删除
	$('body').delegate(".del", "click", function(){
		var t = $(this), li = t.closest(".thumbnail"), slide = t.closest('.swiper-slide'), index = slide.index();
		var file = [];
		file['id'] = slide.attr("id");

    slider1.removeSlide(index);
    getDelImg();

		removeFile(file);
		updateStatus();
	});

  //宝贝描述删除图片
  $('body').delegate(".cancel", "click", function(){
    var t = $(this), li = t.closest(".thumbnail"), slide = t.closest('.desc-box'), index = slide.index();
    var file = [];
    file['id'] = slide.attr("id");

    removeFile(file);
    updateStatus();
  });

	// 切换litpic
	if(atlasMax > 1){
		$list.delegate(".item img", "click", function(){
			var t = $(this).parent('.item');
			if(atlasMax > 1 && !t.hasClass('litpic')){
				t.addClass('litpic').siblings('.item').removeClass('litpic');
			}
		});
	}

	// 当有文件添加进来时执行，负责view的创建
	function addFile(file) {
    if (pid == 1) {
  		var $li   = $('<div class="swiper-slide" id="' + file.id + '"><div class="thumbnail"><img></div></div>'),
  				$btns = $('<div class="file-panel"><span class="cancel"></span></div>').appendTo($li),
  				$img = $li.find('img');
    }else {
      var $li = $('<div class="desc-box" id="' + file.id + '"><div class="thumbnail"><img></div></div>'),
          $btns = $('<span class="cancel"></span>').appendTo($li),
          $img = $li.find('img');
    }

		// 创建缩略图
		uploader.makeThumb(file, function(error, src) {
				if(error){
					$img.replaceWith('<span class="thumb-error">不能预览</span>');
					return;
				}
				$img.attr('src', src);
			}, thumbnailWidth, thumbnailHeight);

			$('body').delegate('.cancel', 'click', function(){
				uploader.removeFile(file, true);
			});

      $('body').delegate('.del', 'click', function(){
				uploader.removeFile(file, true);
			});

      if (pid == 1) {
        $('.slider').addClass('active');
        $('.slider .pagination').show();
        slider.appendSlide($li);
        scrollbox();
      }else {
        $('.desc-container').append($li);
      }
	}

	// 当有文件添加进来的时候
	uploader.on('fileQueued', function(file) {

		//先判断是否超出限制
		if(fileCount == atlasMax){
			showErr('图片数量已达上限');
			return false;
		}

		fileCount++;
		addFile(file);
		updateStatus();
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

	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on('uploadSuccess', function(file, response){
		var $li = $('#'+file.id);
		if(response.state == "SUCCESS"){
			$li.find("img").attr("data-val", response.url).attr("data-url", response.turl).attr("src", response.turl);
		}else{
			removeFile(file);
			showErr('上传失败！');
		}
	});

	// 文件上传失败，现实上传出错。
	uploader.on('uploadError', function(file){
		removeFile(file);
		showErr('上传失败！');
	});

	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on('uploadComplete', function(file){
		$('#'+file.id).find('.progress').remove();
	});

	//上传失败
	uploader.on('error', function(code){
		var txt = "上传失败！";
		switch(code){
			case "Q_EXCEED_NUM_LIMIT":
				txt = "图片数量已达上限";
				break;
			case "F_EXCEED_SIZE":
				txt = "图片大小超出限制，单张图片最大不得超过"+atlasSize/1024/1024+"MB";
				break;
			case "F_DUPLICATE":
				txt = "此图片已上传过";
				break;
		}
		alert(txt);
	});

})

  // 隐藏弹出层
  $('.back-btn').click(function(){
    $(this).closest('.layer').hide();
  })

  // 图片排序弹出层显示
  $('#slider').delegate('.swiper-slide', 'click', function(){
    $('.layer-slider').show();
    getSliderImg();
    showWin();
  })

  // 首页幻灯片变化
  var sliderImg = [], dragHtml = [];
  function getSliderImg(){
    sliderImg = [];
    dragHtml = [];
    $('#slider .swiper-slide').each(function(){
      var t = $(this), imgsrc = t.find('img')[0].src, id = t.attr('id');
      sliderImg.push(imgsrc);
    });

    slider1.removeAllSlides();
    for (var i = 0; i < sliderImg.length; i++) {
      dragHtml.push('<img src="'+sliderImg[i]+'">');
      slider1.appendSlide('<div class="swiper-slide" id="'+id+'"><div class="thumbnail"><img src="'+sliderImg[i]+'"><span class="del"></span></div></div>');
    }
    $('#drag').html(dragHtml.join(''));
  }

  // 弹出层编辑图片删除操作
  var delImg = [], dragHtml1 = [];
  function getDelImg(){
    delImg = [];
    dragHtml1 = [];
    $('#slider1 .swiper-slide').each(function(){
      var t = $(this), imgsrc = t.find('img')[0].src;
      delImg.push(imgsrc);
    });

    slider.removeAllSlides();
    if (delImg.length > 0) {
      for (var i = 0; i < delImg.length; i++) {
        dragHtml1.push('<img src="'+delImg[i]+'">');
        slider.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+delImg[i]+'"></div></div>');
      }
    }else {
      $('.layer-slider').hide();
      $('#slider').removeClass('active');
      $('.slider .pagination').hide();
      showWin('close');
    }
    $('#drag').html(dragHtml1.join(''));
  }


  // 图片拖拽排序
  var drag = document.getElementById("drag");
  new Sortable(drag);

  var winSct = 0;
  function showWin(type){
    var type = type ? type : 'open';
    if(type == 'open'){
      $('html').addClass('openwin');
      winSct = $(window).scrollTop();
      $(window).scrollTop(0);
    }else{
      $(window).scrollTop(winSct);
      $('html').removeClass('openwin');
    }
  }

  // 商品规格弹出层显示
  $('.guige-btn').click(function(){
    $('.layer-size').show();
    showWin();
    scrollbox();
  })

  if($('#category').length){
    var config = [];
    $('#category').children().each(function(i){
      var t = $(this), val, txt, id = t.data('id'), pid = t.data('pid');
      if(!id) return;
      if(t.is('optgroup')){
        val = t.attr('label').split('|--')[1];
        if(config[id] == undefined){
          config[id] = {
            typename: val,
            list: []
          };
        }
      }else if(t.is('option')){
        var val = t.attr("value"), txt = t.text().split('|--')[1];
        if(val){
          var selected = t.attr('selected') ? 1 : 0;
          if(pid == undefined){
            config[id] = {
              typename: txt,
              list: [{id: val, 'typename': txt, selected: selected}]
            }
          }else{
            config[pid]['list'].push({id: val, 'typename': txt, selected : selected});
          }
        }
      }
    })

    var html = [];
    for(var i in config){
      var d = config[i];
      html.push('<dl class="fn-clear">');
      html.push('  <dt>');
      html.push('    <label>'+d.typename+'：</label></dt>');
      html.push('  <dd>');
      html.push('    <div class="fn-clear checkbox">');
      for(var s = 0; s < d.list.length; s++){
        if(d.list[s].selected){
          html.push('      <label class="active"><input type="checkbox" name="category[]" value="'+d.list[s].id+'" checked="checked">'+d.list[s].typename+'</label>');
        }else{
          html.push('      <label><input type="checkbox" name="category[]" value="'+d.list[s].id+'">'+d.list[s].typename+'</label>');
        }
      }
      html.push('    </div>');
      html.push('  </dd>');
      html.push('</dl>');
    }

    $('#category').parent().html(html.join(""));

  }

  // 分类弹出层
  $('.storetype-btn').click(function(){

    $('.layer-storetype').show();
    showWin();
    scrollbox();
  })

  // 选择分类
  $("#storeType").delegate("input[type=checkbox]", "click", function(){
    var t = $(this);
    if(!t.is(":checked")){
      t.parent().removeClass('active');
    }else{
      t.parent().addClass('active');
    }
  });
  // 商品确定分类
  $('.layer-storetype .confirm').click(function(){
    var res = [];
    $("#storeType").find("input").each(function(index, element) {
      var t = $(this), txt = t.parent().text();
      if(t.is(":checked")){
        res.push(txt);
      }
    });
    $('#storeTypeCon .selgroup p').text(res.length ? res.join(",") : langData['siteConfig'][20][119]);
    $('.layer-storetype').hide();
    showWin('close');
  })

  // 确定商品详情
  $('.layer-desc .confirm').click(function(){
    $('.layer-desc').hide();
    showWin('close');
  })

    // 关闭图片幻灯
    $('.layer-slider .confirm').click(function(){
        $('.layer-slider').hide();
        showWin('close');
    })


  //选择规格
 	var fth;
 	$("#specification").delegate("input[type=checkbox]", "click", function(){
    var t = $(this);
    if(!t.is(":checked")) t.parent().removeClass('active');
 		createSpecifi();
 	});

 	if(specifiVal.length > 0){
 		createSpecifi();
 	}

 	//规格选择触发
 	function createSpecifi(){
 		var checked = $("#specification input[type=checkbox]:checked");
 		if(checked.length > 0){

 			$("#inventory").val("0").attr("disabled", true);

 			//thead
 			var thid = [], thtitle = [], th1 = [],
 				th2 = '<th>原价 <font color="#f00">*</font></th><th>价格 <font color="#f00">*</font></th><th>库存 <font color="#f00">*</font></th>';
 			for(var i = 0; i < checked.length; i++){
 				var t = checked.eq(i),
 					title = t.parent().parent().parent().attr("data-title"),
 					id = t.parent().parent().parent().attr("data-id");

 				if(thid.indexOf(id) < 0){
 					thid.push(id);
 					thtitle.push(title);
 				}
 			}
 			for(var i = 0; i < thtitle.length; i++){
 				th1.push('<th>'+thtitle[i]+'</th>');
 			}
 			$("#speList thead").html(th1.join('')+th2);

 			//tbody 笛卡尔集
 			var th = new Array(), dl = $("#specification dl");
 			for(var i = 0; i < dl.length - 1; i++){
 				var tid = [];

 				//取得已选规格
 				dl.eq(i).find("input[type=checkbox]:checked").each(function(index, element) {
          var id = $(this).val(), val = $(this).attr("title");
          $(this).closest('label').addClass('active');
 					tid.push(id+"###"+val);
        });

 				//已选规格分组
 				if(tid.length > 0){
 					th.push(tid);
 				}
 			}

 			if(th.length > 0){
 				fth = th[0];
 				for (var i = 1; i < th.length; i++) {
 					descartes(th[i]);
 				}

 				//输出
 				createTbody(fth);
 			}

 		}else{
 			$("#inventory").val("").attr("disabled", false);
 			$("#speList thead, #speList tbody").html("");
 			$("#speList").hide();
 		}
 	}

 	//输出规格内容
 	function createTbody(fth){
 		if(fth.length > 0){

 			var tr = [], inventory = 0;
 			for(var i = 0; i < fth.length; i++){
 				var fthItem = fth[i].split("***"), id = [], val = [];
 				for(var k = 0; k < fthItem.length; k++){
 					var items = fthItem[k].split("###");
 					id.push(items[0]);
 					val.push(items[1]);
 				}
 				if(id.length > 0){
 					tr.push('<tr>');

 					var name = [];
 					for(var k = 0; k < id.length; k++){
 						tr.push('<td>'+val[k]+'</td>');
 						name.push(id[k]);
 					}

 					var price = $("#price").val();
 					var mprice = $("#mprice").val();
 					var f_inventory = "";
 					if(specifiVal.length > 0 && specifiVal.length > i){
 						value = specifiVal[i].split("#");
 						mprice = value[0];
 						price = value[1];
 						f_inventory = value[2];
 						inventory = inventory + Number(f_inventory);
 					}
 					tr.push('<td><input class="inp" type="text" id="f_mprice_'+name.join("-")+'" name="f_mprice_'+name.join("-")+'" data-type="mprice" value="'+mprice+'" /></td>');
 					tr.push('<td><input class="inp" type="text" id="f_price_'+name.join("-")+'" name="f_price_'+name.join("-")+'" data-type="price" value="'+price+'" /></td>');
 					tr.push('<td><input class="inp" type="text" id="f_inventory_'+name.join("-")+'" name="f_inventory_'+name.join("-")+'" data-type="inventory" value="'+f_inventory+'" /></td>');
 					tr.push('</tr>');
 				}
 			}

 			if(specifiVal.length > 0){
 				$("#inventory").val(inventory);
 			}
 			$("#speList tbody").html(tr.join(""));
 			$("#speList").show();

 			//合并相同单元格
 			var th = $("#speList thead th");
 			for (var i = 0; i < th.length-3; i++) {
 				huoniao.rowspan($("#speList"), i);
 			};
 		}
 	}

 	//笛卡尔集
 	function descartes(array) {
     var ar = fth;
     fth = new Array();
     for (var i = 0; i < ar.length; i++) {
       for (var j = 0; j < array.length; j++) {
         var v = fth.push(ar[i] + "***" + array[j]);
       }
     }
   }

  //计算库存
  $("#speList").delegate("input", "blur", function(){
    var inventory = 0;
    $("#speList").find("input").each(function(index, element) {
      var val = Number($(this).val()), type = $(this).attr("data-type");
      if(type == "inventory" && val){
        inventory = Number(inventory + val);
      }
    });
    $("#inventory").val(parseInt(inventory));
  });

  // 商品规格验证
  $('.layer-size .confirm').click(function(){
    if(guigeCheck()){
      $("#speList").find(".tip-inline").hide();
      $('.layer-size').hide();
      showWin('close');
    }else{
      $("#speList").find(".tip-inline").html('价格和库存不得为空，类型为数字！').show();
      $("#specification").scrollTop(999);
    }
  })

  // 宝贝描述弹出层出现
  $('.describe-btn').click(function(){
    $('.layer-desc').show();
    showWin();
    scrollbox();
  })

  // 弹出层中间滑动部分
  function scrollbox(drift){
    var headerHeight = $('.header').height(), footHeight = $('.footer').height(),
        winHeight = $(window).height();
    $('.scrollbox').not('#mainBox').css('height', winHeight - headerHeight - footHeight - 20);
  }
  scrollbox();

  function guigeCheck(){
    var r = true;
    //规格表值验证
    $("#speList").find("input").each(function(index, element) {
      var val = $(this).val();
      if(!/^0|\d*\.?\d+$/.test(val)){
        // $(window).scrollTop(Number($("#speList").offset().top)-8);
        $("#speList").find(".tip-inline").removeClass().addClass("tip-inline tip-error");
        $("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][93]);
        r = false;
      }else{
        $("#speList").find(".tip-inline").removeClass().addClass("tip-inline success");
        $("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][94]);
      }
    });
    return r;
  }

  // 提交
  $('.fabubtn').click(function(){
    var btn = $(this);
    var litpic   = '', imglist  = [];
    var empty = false;

    if(btn.hasClass("disabled")) return;

    $("#typeid").val(typeid);
    $("#id").val(id);

    var body = $('.desc-container').html();
    body = body.replace(/WU_FILE_/g, 'WU_FILE_LAST_', body);
    $('#body').val(body);

    $('#slider .swiper-slide').each(function(i){
      var val = $(this).find('img').attr('data-val');
      if(i == 0){
        litpic = val;
      }else{
        imglist.push(val);
      }
    })
    $('#litpic').val(litpic);
    $('#imglist').val(imglist.join(","));


    // var data = [];
    // $('#storeType .active input').each(function(){
    //   var t = $(this);
    //   t.attr('checked', true);
    //   data.push(t.prop('outerHTML'));
    // })
    // $('.layer-size input:checked').each(function(){
    //   data.push($(this).prop('outerHTML'));
    // })
    // $('#storetype_data').html(data.join("")+$('#speList .speTab').html());

    var offsetTop = 0;
    //自定义字段验证
    $("#proItem").find("dl").each(function(){
      var t = $(this), type = t.data("type"), required = parseInt(t.data("required")), tipTit = t.data("title"), tip = t.find(".tip-inline"), input = t.find("input").val();

      if(required == 1){
        //单选
        if(type == "radio"){
          if(input == ""){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            if(offsetTop <= 0) offsetTop = t.offset().top;
            empty = true;
          }
        }

        //多选
        if(type == "checkbox"){
          if(t.find("input:checked").val() == "" || t.find("input:checked").val() == undefined){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            empty = true;
          }
        }

        //下拉菜单
        if(type == "select"){
          if(input == ""){
            tip.removeClass().addClass("tip-inline tip-error").html("<s></s>"+tipTit);
            if(offsetTop <= 0) offsetTop = t.offset().top;
            empty = true;
          }
        }
      }
    });
    if(empty){
      $('#mainBox').scrollTop(offsetTop - $('.header').height());
      return false;
    }

    if(!regex.title()){
      offsetTop = $("#title").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.mprice()){
      offsetTop = $("#mprice").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.price()){
      offsetTop = $("#price").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.logistic()){
      offsetTop = $("#logistic").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    //规格表值验证
    if(!guigeCheck()){
      $('.guige-btn').click();
      offsetTop = $("#speList").offset().top;
      $('#specification').scrollTop(999);
      return false;
    }

    if(!regex.inventory()){
      offsetTop = $("#inventory").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(!regex.limit()){
      offsetTop = $("#limit").offset().top;
      $(window).scrollTop(offsetTop);
      return false;
    }

    if(litpic == ""){
      showMsg(langData['siteConfig'][27][78]);
      $(window).scrollTop(0);
      return false;
    }

    //图集
    if(imglist.length <= 0){
      showMsg(langData['siteConfig'][20][436]);
      $(window).scrollTop(0);
      return false;
    }

    if(body == ''){
      showMsg(langData['shop'][4][66]);
      $('.describe-btn').click();
      return false;
    }

    var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
    data = form.serialize();
    $('.layer-storetype input:checked').each(function(){
      var inp = $(this), name = inp.attr('name'), val = inp.attr('value');
      data += '&'+name+'='+val;
    })

    if($('#specificationForm').length){
      var specification = $('#specificationForm').serialize();
      if(specification != '='){
        data += '&' + specification;
      }
    }

    btn.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

    $.ajax({
      url: action,
      data: data,
      type: "POST",
      dataType: "json",
      success: function (data) {
        if(data && data.state == 100){
          var tip = langData['siteConfig'][20][341];
          if(id != undefined && id != "" && id != 0){
            tip = langData['siteConfig'][20][229];
          }

          showErr(tip + "，"+langData['siteConfig'][20][404]);
          setTimeout(function(){
            location.href = url;
          }, 1000)
        }else{
          showErr(data.info);
          btn.removeClass("disabled").html(langData['siteConfig'][11][19]);
          $("#verifycode").click();
        }
      },
      error: function(){
        showErr(langData['siteConfig'][20][183]);
        btn.removeClass("disabled").html(langData['siteConfig'][11][19]);
        $("#verifycode").click();
      }
    });
  })
  $("#fabuForm").submit(function(e){
    e.preventDefault();
    $('.fabubtn').click();
  })


})

// 弹出层图片排序
var sortImg = [];
function getImgSort(){
  sortImg = [];
  $('#drag img').each(function(){
    var t = $(this), imgsrc = t[0].src;
    sortImg.push(imgsrc);
  });

  slider.removeAllSlides();
  slider1.removeAllSlides();
  for (var i = 0; i < sortImg.length; i++) {
    slider.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+sortImg[i]+'"></div></div>');
    slider1.appendSlide('<div class="swiper-slide"><div class="thumbnail"><img src="'+sortImg[i]+'"><span class="del"></span></div></div>');
  }
}
// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}


function in_array(arr, str){
  for(var i in arr){
    if(arr[i] == str) return true;
  }
  return false
}
