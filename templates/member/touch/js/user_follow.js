$(function(){
  var objId = $('.list');

  // 关注按钮
  $('body').delegate('.nofollow', 'click', function(){
    var x = $(this);
    if (x.hasClass('follow')) {
			follow(x, function(){
				x.removeClass('follow').text(langData['siteConfig'][19][846]);
			});
    }else{
			follow(x, function(){
				x.addClass('follow').text(langData['siteConfig'][19][845]);
			});
    }
  })

  var follow = function(t, func){
    var userid = $.cookie(cookiePre+"login_user");
    if(userid == null || userid == ""){
      location.href = masterDomain + '/login.html';
      return false;
    }

    if(t.hasClass("disabled")) return false;
    t.addClass("disabled");
    $.post("/include/ajax.php?service=member&action=followMember&id="+t.attr("data-id"), function(){
      t.removeClass("disabled");
      func();
    });
  }


    // 下拉加载
    var isload = false;
    $(window).scroll(function() {
        var h = $('.item').height();
        var allh = $('body').height();
        var w = $(window).height();
        var scroll = allh - w - h;
        if ($(window).scrollTop() > scroll && !isload) {
            atpage++;
            getList();
        };
    });


  getList();

  function getList(is){
    isload = true;
  	if(is != 1){
  		// $('html, body').animate({scrollTop: $(".main-tab").offset().top}, 300);
  	}

  	objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

  	$.ajax({
  		url: masterDomain+"/include/ajax.php?service=member&action=follow&type=follow&uid="+uid+"&page="+atpage+"&pageSize="+pageSize,
  		type: "GET",
  		dataType: "jsonp",
  		success: function (data) {
  			if(data && data.state != 200){
  				if(data.state == 101){
  					objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
  				}else{
  					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

            var msg = totalCount == 0 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][185];

  					//拼接列表
  					if(list.length > 0){
  						for(var i = 0; i < list.length; i++){
  							var isfollow = list[i].isfollow, state = list[i].state, uid = list[i].uid,
                    url = state == 1 ? 'javascript:;' : masterDomain + '/user/' + uid;


  							html.push('<div class="item fn-clear">');
  							html.push('<a href="'+url+'" class="imgbox fn-left"><img src="'+list[i].photo+'" alt="" onerror="javascript:this.src=\''+masterDomain+'/static/images/noPhoto_100.jpg\';" /></a>');

                if (!state) {
    							html.push('<div class="fn-left txtbox">');
    							html.push('<p><a href="#">'+list[i].nickname+'</a></p><p class="gray">'+list[i].addrName+'</p>');
    							html.push('</div>');

                  if (isfollow) {
                    html.push('<div class="fn-right"><a href="javascript:;" class="nofollow follow" data-id="'+uid+'">'+langData['siteConfig'][19][845]+'</a></div>');
                  }else {
                    html.push('<div class="fn-right"><a href="javascript:;" class="nofollow" data-id="'+uid+'">'+langData['siteConfig'][19][846]+'</a></div>');
                  }
                }else {
                  html.push('<div class="fn-left txtbox">'+langData['siteConfig'][19][850]+'</div>')
                }
  							html.push('</div>');

  						}

              objId.append(html.join(""));
              $('.loading').remove();
              isload = false;

  					}else{
              $('.loading').remove();
  						objId.append("<p class='loading'>"+msg+"</p>");
  					}

  				}
  			}else{
  				objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
  			}
  		}
  	});
  }




})
