/**
 * Created by Administrator on 2018/4/26.
 */
$(function () {
	var lng = "", lat = "";

	$("#map .lead p").bind("click", function() {
        $(".pageitem").hide();
    });


    if ($("#lnglat").val() != "") {
        var lnglat = $("#lnglat").val().split(",");
        lng = lnglat[0];
        lat = lnglat[1];
    }

    $("#location").bind("click", function(){
        $(".pageitem").hide();
        $('#map').show();

        //百度
        if(site_map == 'baidu') {
            var myGeo = new BMap.Geocoder();

            //第一次进入自动获取当前位置
            if(lng == "" || lat == ""){

                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        lat = r.point.lat;
                        lng = r.point.lng;

                        //定位地图
                        map = new BMap.Map("mapdiv");
                        var mPoint = new BMap.Point(lng, lat);
                        map.centerAndZoom(mPoint, 16);
                        getLocation(mPoint);

                        map.addEventListener("dragend", function (e) {
                            getLocation(e.point);
                        });
                    }
                    else {
                        alert('failed' + this.getStatus());
                    }
                }, {enableHighAccuracy: true});

            }else{
                //定位地图
                map = new BMap.Map("mapdiv");
                var mPoint = new BMap.Point(lng, lat);
                map.centerAndZoom(mPoint, 16);
                getLocation(mPoint);

                map.addEventListener("dragend", function (e) {
                    getLocation(e.point);
                });
            }

            //关键字搜索
            var autocomplete = new BMap.Autocomplete({input: "searchAddr"});
            autocomplete.addEventListener("onconfirm", function (e) {
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;

                var options = {
                    onSearchComplete: function (results) {
                        // 判断状态是否正确
                        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                            var s = [];
                            for (var i = 0; i < results.getCurrentNumPois(); i++) {
                                if (i == 0) {
                                    lng = results.getPoi(i).point.lng;
                                    lat = results.getPoi(i).point.lat;
                                    $("#local strong").html(_value.business);
									$("#lnglat").val(lng + ',' + lat);
                                    $(".pageitem").hide();
                                }
                            }
                        } else {
                            alert(langData['siteConfig'][20][431]);
                        }
                    }
                };
                var local = new BMap.LocalSearch(map, options);
                local.search(myValue);

            });

            //周边检索
            function getLocation(point){
                myGeo.getLocation(point, function mCallback(rs) {
                    var allPois = rs.surroundingPois;
                    if (allPois == null || allPois == "") {
                        return;
                    }
                    var list = [];
                    for (var i = 0; i < allPois.length; i++) {
                        list.push('<li data-lng="' + allPois[i].point.lng + '" data-lat="' + allPois[i].point.lat + '"><h5>' + allPois[i].title + '</h5><p>' + allPois[i].address + '</p></li>');
                    }

                    if (list.length > 0) {
                        $(".mapresults ul").html(list.join(""));
                        $(".mapresults").show();
                    }

                }, {
                    poiRadius: 1000,  //半径一公里
                    numPois: 50
                });
            }


            //高德
        }else if(site_map == 'amap'){

            var map = new AMap.Map('mapdiv');

            if(lng != '' && lat != ''){
                map.setZoomAndCenter(14, [lng, lat]);
            }

            AMap.service('AMap.PlaceSearch',function(){//回调函数
                var placeSearch= new AMap.PlaceSearch();

                var s = function(){
                    if(lng != '' && lat != ''){
                        placeSearch.searchNearBy("", [lng, lat], 500, function(status, result) {
                            callback(result, status);
                        });
                    }else{
                        setTimeout(s,1000)
                    }
                }

                AMap.event.addListener(map ,"complete", function(status, result){
                    lnglat = map.getCenter();
                    lng = lnglat['lng'];
                    lat = lnglat['lat'];
                    console.log(lnglat);
                    s();
                });

                AMap.event.addListener(map ,"dragend", function(status, result){
                    lnglat = map.getCenter();
                    lng = lnglat['lng'];
                    lat = lnglat['lat'];
                    console.log(lnglat);
                    s();
                });

            })

            function callback(results, status) {
                if (status === 'complete' && results.info === 'OK') {
                    var list = [];
                    var allPois = results.poiList.pois;
                    for(var i = 0; i < allPois.length; i++){
                        list.push('<li data-lng="'+allPois[i].location.lng+'" data-lat="'+allPois[i].location.lat+'"><h5>'+allPois[i].name+'</h5><p>'+allPois[i].address+'</p></li>');
                    }
                    if(list.length > 0){
                        $(".mapresults ul").html(list.join(""));
                        $(".mapresults").show();
                    }
                }else{
                    $(".mapresults ul").html('');
                }
            }

            map.plugin('AMap.Autocomplete', function () {
                console.log('Autocomplete loading...')
                autocomplete = new AMap.Autocomplete({
                    input: "searchAddr"
                });
                // 选中地址
                AMap.event.addListener(autocomplete, 'select', function(result){
                    lng = result.poi.location.lng;
                    lat = result.poi.location.lat;
                    var r = result.poi.name ? result.poi.name : (result.poi.address ? result.poi.address : result.poi.district);

                    $("#local strong").html(r);
					$("#lnglat").val(lng + ',' + lat);
                    $(".pageitem").hide();
                });
            });

        }

    });


	//点击检索结果
	$(".mapresults").delegate("li", "click", function(){
		var t = $(this), title = t.find("h5").text() ,title1 = t.find("p").text();
		lng = t.attr("data-lng");
		lat = t.attr("data-lat");
		$("#lnglat").val(""+lng+","+lat+"" );
        $('.pageitem').hide();
	});

    //APP端取消下拉刷新
    toggleDragRefresh('off');

    //首页导航
    $(".menu_list a").click(function () {
        var index=$(this).index();
        $(this).addClass("active").siblings().removeClass("active");
    });

    var distance=100;
    $('.nav_more').on('click',function (){
        $('.menu_list').scrollLeft(distance);
        distance+=100;
    });

    //主播列表切换
    /*$(".nav_tab .tab_title").click(function(){
        var index=$(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".con_list").eq(index).addClass("an_show").siblings().removeClass("an_show");
    });*/
  
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
          alert('该项无法删除');
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
  // 上移
  $('.menu').delegate('.up, .down', 'click', function(){
    var t = $(this), p = t.closest('li'), len = p.siblings().length, idx = p.index(), isup = t.hasClass('up');
    if(isup && (idx == 0 || len == 0)) return;
    if(!isup && idx == len) return;
    if(isup){
      p.prev().before(p.clone());
    }else{
      p.next().after(p.clone())
    }
    p.remove();
    menuSort();
  })


  function menuSort(type){
      var r = true;
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

//关注切换
$(function () {
    $(".btn_care").click(function () {
        $(".btn_care").removeClass('btn_care').addClass('btn_care1').text('已关注');
    });
    $(".btnCare").click(function () {
        $(".btnCare").removeClass('btnCare').addClass('btnCare1').text('已关注');
    });
});


//直播详情--刷新页面
$(function(){
    $("#v_refresh").click(function(){
       window.location.reload();
    });

    $("#refresh").click(function(){
        window.location.reload();
    });

});


//发起直播
$(function () {
    //下拉菜单
    $('.demo-test-select').scroller(
        $.extend({preset: 'select'})
    );

    //年月日
    $('.demo-test-date').scroller(
        $.extend({preset: 'datetime', dateFormat: 'yy-mm-dd'})
    );

    //选择横竖屏
    $(".h_live").click(function () {
        $("#h_screen").addClass("active");
        $("#v_screen").removeClass("active");
    });
    $(".v_live").click(function () {
        $("#v_screen").addClass("active");
        $("#h_screen").removeClass("active");
    });

    $('#live_style').change(function(){
        var options=$("#live_style option:selected"); //获取选中的项
        if(options.text()=="加密"){
            $(".li_collect").css("display","none");
            $(".li_pass").css("display","block");
        }else if(options.text()=="收费"){
            $(".li_pass").css("display","none");
            $(".li_collect").css("display","block");
        }else{
            $(".li_pass").css("display","none");
            $(".li_collect").css("display","none");
        }
    });


});

$(function(){
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
});

//发起直播
$(function () {
		var changeFileSize = function(url, to, from){
			if(url == "" || url == undefined) return "";
			if(to == "") return url;
			var from = (from == "" || from == undefined) ? "large" : from;
			var newUrl = "";
			if(hideFileUrl == 1){
				newUrl =  url + "&type=" + to;
			}else{
				newUrl = url.replace(from, to);
			}

			return newUrl;
		}
		//上传凭证
		var $list = $('#fileList'),
			uploadbtn = $('.uploadbtn'),
			ratio = window.devicePixelRatio || 1,
			fileCount = 0,
			thumbnailWidth = 100 * ratio,   // 缩略图大小
			thumbnailHeight = 100 * ratio,  // 缩略图大小
			uploader;
		fileCount = $list.find("li.item").length;
		// 初始化Web Uploader
		$(".default_tip").css("display", "block");
		uploader = WebUploader.create({
			auto: true,
			swf: staticPath + 'js/webuploader/Uploader.swf',
			server: '/include/upload.inc.php?mod='+modelType+'&type=thumb',
			pick: '#filePicker',
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
			fileNumLimit: 1,
			fileSingleSizeLimit: 10 * 1024 * 1024 * 1024   //10M
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
		$list.delegate(".cancel", "click", function(){
			var t = $(this), li = t.closest("li");
			var file = [];
			file['id'] = li.attr("id");
			removeFile(file);
			updateStatus();
    	$("#litpic").val('');
      $('.input_file').show();
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
			var $li   = $('<li id="' + file.id + '" class="thumbnail"><img></li>'),
					$btns = $('<div class="file-panel"><span class="cancel"></span></div>').appendTo($li),
					$img = $li.find('img');

			// 创建缩略图
			uploader.makeThumb(file, function(error, src) {
					if(error){
						$img.replaceWith('<span class="thumb-error">不能预览</span>');
						return;
					}
					$img.attr('src', src);
				}, thumbnailWidth, thumbnailHeight);

				$btns.on('click', 'span', function(){
					uploader.removeFile(file, true);
					$('.input_file').show();

				});

				uploadbtn.after($li);
        $('.input_file').hide();
		}

		// 当有文件添加进来的时候
		uploader.on('fileQueued', function(file) {
			//先判断是否超出限制
			if(fileCount == atlasMax){
				showErr('图片数量已达上限');
				// $(".uploader-btn .utip").html('<font color="ff6600">图片数量已达上限</font>');
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
	            $('#litpic').val(response.url);
			}else{
				removeFile(file);
				showErr('上传失败！');
        $('.input_file').show();

				// $(".uploader-btn .utip").html('<font color="ff6600">上传失败！</font>');
			}
		});

		// 文件上传失败，现实上传出错。
		uploader.on('uploadError', function(file){
			removeFile(file);
			showErr('上传失败！');
      $('.input_file').show();
			// $(".uploader-btn .utip").html('<font color="ff6600">上传失败！</font>');
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
			var thumbnail = $('.thumbnail');
			errmsg(thumbnail,txt);
			// $(".uploader-btn .utip").html('<font color="ff6600">'+txt+'</font>');
		});
		// 错误提示
		function errmsg(obj,str){
			var o = $(".error");
			o.html('<p>'+str+'</p>').show();
			if(obj.is('textarea') || (obj.is('input') && obj.is(':visible') && obj.attr('readonly') != "true")){
				obj.focus();
			}else{
				$('html,body').animate({
				},10);
			}

			obj.closest('label').addClass('haserror');
			setTimeout(function(){o.hide()},1000);
		}
	    //--选择封面图
	    $(".input_file").click(function () {
	        $(".sel_modal").css("display", "block");
	    });
	    $("#close").click(function () {
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
	        //$(".default_tip").html('');

	        if($(".thumbnail").length > 0) {
			    //元素存在时执行的代码
			    var li = $(".cancel").closest("li");
				var file = [];
				file['id'] = li.attr("id");
				removeFile(file);
				updateStatus();
			}
	        $('#litpic').attr('value',backgrounds[$(this).val()]);
	        $(".live_banner").css({
	            'background': 'url(' + backgrounds[$(this).val()] + ') no-repeat center',
	            'background-size': 'cover'
	        });
	        $(".sel_modal").css("display", "none");
	    });


    //推流地址
    $("#myform").submit(function(e){
        e.preventDefault();
    })
    $('.btn_create').click(function(){
        var type = $(".live_sel .active").attr("data-id");
        $("#show").val(type);
        var litpic = $('#litpic');
        var btn = $('.btn_create');
		if(litpic.val() == ''){
			errmsg(litpic,'请上传直播封面');
			$(window).scrollTop(0);
			return false;
		}
		var imglist = [], imgli = $("#fileList li.thumbnail");
		var val = imgli.find("img").attr("data-val");
		if(val != ''){
			imglist.push(val);
		}
	    /*imgli.each(function(index){
	      var t = $(this), val = t.find("img").attr("data-val");
	      if(val != ''){
	        var val = $(this).find("img").attr("data-val");
	        if(val != ""){
	          imglist.push(val+"|");
	        }
	      }
	    })*/
		var title = $('#title');
		if($('#title').val() == ''){
			errmsg(title,'请填写直播标题');
			$(window).scrollTop(0);
			return false;
		}
		var live_class = $('#live_class');
		if($('#live_class').val() == 0){
			errmsg(live_class,'请选择直播分类');
			$(window).scrollTop(0);
			return false;
		}
		var style = $('#live_style').val();
		var live_style = $('#live_style');
		if(style == 0){
			//errmsg(litpic,'请选择直播类型');
			//$(window).scrollTop(0);
			//return false;
		}else if(style == 2){
			if($('#password').val() == ''){
				errmsg(live_style,'请填写密码');
				$(window).scrollTop(0);
				return false;
			}
		}else if(style == 3){
			if($('#start_collect').val() ==0 || $('#start_collect').val() == ''){
				errmsg(live_style,'请填写开始收费');
				$(window).scrollTop(0);
				return false;
			}
			if($('#end_collect').val() ==0 || $('#end_collect').val() == ''){
				errmsg(live_style,'请填写结束收费');
				$(window).scrollTop(0);
				return false;
			}
		}
    if($('#live_pulltype').val() == 0){
		  var live_liuchang = $('#live_liuchang');
  		if($('#live_liuchang').val() == 0){
	 		  errmsg(live_liuchang,'请选择直播流畅度');
	 	   	$(window).scrollTop(0);
	   		return false;
      }
		}else{
      var pullurl_pc = $('#pullurl_pc');
      var pullurl_touch = $('#pullurl_touch');
      if(pullurl_pc == ''){
        errmsg(pullurl_pc, '请输入第三方拉流地址');
        return false;
      }
      if(pullurl_touch == ''){
        errmsg(pullurl_pc, '请输入第三方拉流地址');
        return false;
      }
    }
		var mydata = $("#myform").serialize()
		if(imglist){
		      //mydata += "&litpic="+imglist.join(",");
		}
    btn.prop('disabled', true);
    var form = $("#myform"), action = form.attr("action");console.log(mydata);
        $.ajax({
            url: masterDomain + action,
            type: 'post',
            dataType: 'json',
            async : false,   //注意：此处是同步，不是异步
            data:mydata,
            success: function (data) {
                if(data && data.state == 100){
                    //getAddress();
                    window.location.href = (action.indexOf('edit') > -1 ? detailUrl : userDomain) +'?id='+data.info.id;
                }else{
                    btn.prop('disabled', false);
                    alert(data.info)
                }
            },
            error: function(){
                btn.prop('disabled', false);
                alert("请重新提交表单");
            }
        })

    });
});
//发布直播生成推流地址
function getAddress(){
    $.ajax({
        url: masterDomain + "/include/ajax.php?service=live&action=getPushSteam",
        type: "GET",
        dataType : "json",
        success: function(data){
            if (data && data.state != 200) {
                var url=data.info.pushurl;
                return true;
            }
        }
    });
}
//直播详情--点击屏幕显示与隐藏
$(function(){
    $('.empty_box').on('click',function(){
        $('.vPer_box').toggle();
        $('.chat_box').toggle();
        $('.live_like').toggle();
    });
});

$(function(){
  // 切换推流地址类型
  $('#live_pulltype').change(function(){
    var v = $(this).val();
    $('#pushtype0, .pulltypeCon').hide();
    if(v == 0){
      $('#pushtype0').show();
    }else{
      $('.pulltypeCon').show();
    }
  })
})