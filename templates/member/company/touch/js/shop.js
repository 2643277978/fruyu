var huoniao = {
  operaJson: function(url, action, callback){
		$.ajax({
			url: url,
			data: action,
			type: "POST",
			dataType: "json",
			success: function (data) {
				typeof callback == "function" && callback(data);
			},
			error: function(){

				$.post("../login.php", "action=checkLogin", function(data){
					if(data == "0"){
						huoniao.showTip("error", "登录超时，请重新登录！");
						setTimeout(function(){
							location.reload();
						}, 500);
					}else{
						huoniao.showTip("error", "网络错误，请重试！");
					}
				});

			}
		});
	}
}

$(function(){


  //APP端取消下拉刷新
  toggleDragRefresh('off');

  //初始加载分类
  getTypeList(0, 0, 0);

	// var typeid = parseInt($("#typeid").val());

  if(typeid){
    huoniao.operaJson("/include/ajax.php?service=shop&action=typeParent", "typeid="+typeid, function(data){
      if(data.info){
        data = data.info;

        $(".fchoose:eq(0)").find("li").each(function(index, element) {
          var id = $(this).attr("data-id");
          if(id == data[0]){
            $(this).addClass("selected");
            return false;
          }
        });
        $(".fchoose:eq(1)").find("li").each(function(index, element) {
          alert(id);
          var id = $(this).attr("data-id");
          if(id == data[1]){
            $(this).addClass("selected");
            return false;
          }
        });
        for(var i = 0; i < data.length-1; i++){
          getTypeList(data[i], i, data[i+1]);
        }

        // getCurrTypeName();
      }
    });
  }

	//点击分类验证是否有子级
	$("#tlist").delegate("li", "click", function(){
		var t = $(this), selected = t.attr("class"), id = t.attr("data-id"), pClass = t.parent().parent().attr("class"), ite = 0,
        lower = t.attr('data-lower');
    t.closest('.fchoose').nextAll('.fchoose').remove();
		if(pClass != undefined && pClass.indexOf("exp") > -1){
			t.parent().parent().parent().parent().find("li").removeClass("selected");
		}else{
			ite = t.parent().parent().parent().index();
			t.siblings("li").removeClass("selected");
		}
		t.addClass("selected");

    if (lower != 'undefined') {
      $('.fchoose').removeClass('active');
      getTypeList(id, ite, 0);
    }else {
			var url = fabuUrl.replace("%typeid%", id);
			if(id != 0){
				if(url.indexOf("?") > -1){
					url += "&id="+id;
				}else{
					// url += "?id="+id;
				}
			}
			location.href = url;
    }

	});


	//获取分类列表
	function getTypeList(tid, ite, cid){
		huoniao.operaJson("/include/ajax.php?service=shop&action=getTypeList", "tid="+tid, function(data){
			if(data.info){
				var list = [];
        list.push('<div class="fchoose fn-left active" id="choose'+tid+'">');
        list.push('<ul>');
				//第一级
				if(tid == 0){
					for(var i = 0; i < data.info.length; i++){
            var parentArr = [];

            if (data.info[i].typeid == parentArr[0]) {
              selected = " class='selected'"
            }
						list.push('<li data-id="'+data.info[i].typeid+'" data-lower="1"'+selected+'>'+data.info[i].typename+'</li>');
					}
				}else{
					for(var i = 0; i < data.info.length; i++){
						var lower, selected = "", subnav = data.info[i].subnav;
						if(data.info[i].id == typeid || data.info[i].id == cid){
							selected = " class='selected'"
						}
            if(data.info[i].type == 1){
							lower = 1;
            }else {
              lower = undefined;
            }
            list.push('<li data-id="'+data.info[i].id+'"'+selected+' data-lower="'+lower+'">'+data.info[i].typename+'</li>');

					}
				}
        list.push('</ul>');
				list.push('</div>');
				$("#tlist").append(list.join(""));
        var flength = $('.fchoose').length;
        if (flength > 0 && flength < 4) {
          $('.fchoose').css('width', 100 / flength + '%');
          $('#tlist').css({'position':'absolute', 'left': 0});
        }else {
          var left = (flength - 3) * 33.3;
          $('.fchoose').css('width', '33.3%');
          $('.fchoose:last').css({'position':'absolute', 'right': (-left) + '%'});
          $('#tlist').css({'position':'absolute', 'left': (-left) + '%'});
        }

			}
		});
	}

  $('.top .prev').click(function(){
    var active = $('.fchoose.active'), id = active.attr('id');
    if (id != 'choose0') {
      active.removeClass('active').prev().show().addClass('active');
    }
  })

});



// 扩展zepto
$.fn.prevAll = function(selector){
    var prevEls = [];
    var el = this[0];
    if(!el) return $([]);
    while (el.previousElementSibling) {
        var prev = el.previousElementSibling;
        if (selector) {
            if($(prev).is(selector)) prevEls.push(prev);
        }
        else prevEls.push(prev);
        el = prev;
    }
    return $(prevEls);
};

$.fn.nextAll = function (selector) {
    var nextEls = [];
    var el = this[0];
    if (!el) return $([]);
    while (el.nextElementSibling) {
        var next = el.nextElementSibling;
        if (selector) {
            if($(next).is(selector)) nextEls.push(next);
        }
        else nextEls.push(next);
        el = next;
    }
    return $(nextEls);
};
