$(function(){
  //开始直播
    $(".live_button").delegate(".btn_start", "click", function() {
        setupWebViewJavascriptBridge(function(bridge) {
            bridge.callHandler("createLive", {
        "title": title,
        "pushurl": pushurl,
        "flowname": flowname,
        "wayname": wayname,
        "pullUrl":pullUrl,
        "litpic":litpic,
        "webUrl":webUrl
            }, function callback(DataInfo){
              //这里需要进行直播状态改变吗？
                if(DataInfo){
                  $.ajax({
                url: masterDomain+"/include/ajax.php?service=live&action=updateState&state=1&id="+id,
                type: "GET",
                dataType: "json",
                success: function (data) {
                  if(data && data.state == 100){
                  }else{
                    alert(data.info);
                  }
                }
              });
                    if(DataInfo.indexOf('http') > -1){
                        location.href = DataInfo;
                    }else{
                        alert(DataInfo);
                    }
                }
            });
        });
    });

    var page=1,isload=false,objId = $(".an_main");
  var range = 100; //距下边界长度/单位px
    var totalheight = 0;
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight && !isload) {
          page++;
            getList();
        }
    });
    getList();
    function getList(){
      isload = true;
    $.ajax({
        url: masterDomain+"/include/ajax.php?service=live&action=alive&type=2&page="+page+"&u=1&uid="+hiddenid+"&pageSize=10",
        type: "GET",
        dataType: "json",
        success: function (data) {
            if(data && data.state != 200){
                if(data.state == 101){
                    objId.html("<p class='loading'>暂无数据</p>");//+langData['siteConfig'][20][126]+
                }else{
                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
                    //拼接列表
                    if(list.length > 0){
                        var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
                        var param = t + "do=edit&id=";
                        for(var i = 0; i < list.length; i++){
                            var item        = [],
                                id          = list[i].id,
                                title       = list[i].title,
                                url         = list[i].url,
                                litpic      = list[i].litpic,
                                photo      = list[i].photo,
                                state      = list[i].state,
                                click       = list[i].click,
                                up        = list[i].up,
                                newurl    = list[i].newurl,
                                arcrank   = list[i].arcrank,
                                ftime   = list[i].ftime;
                            html.push('<li  class="anchor_box item" data-id="'+id+'">');
                            html.push('<a href="'+newurl+'">');
                            var stateText = state==0 ? '未直播' : (state==1 ? '直播中' : '精彩回放');
                            var arcrankStr = '';
                            switch(arcrank){
                              case '0':
                                arcrankStr = '<span class="arcrank arcrank_'+arcrank+'">待审核</span>';
                                break;
                              case '1':
                                arcrankStr = '<span class="arcrank arcrank_'+arcrank+'">已审核</span>';
                                break;
                              case '2':
                                arcrankStr = '<span class="arcrank arcrank_'+arcrank+'">审核失败</span>';
                                break;
                            }
                            html.push('<div class="an_left"><img src="'+litpic+'" alt=""><div class="playback state'+state+'">'+stateText+'</div></div>'+arcrankStr+'</a>');
                            html.push(' <div class="an_right">');
                            html.push('<h5><a href="'+newurl+'">'+title+'</a></h5>');
                            html.push('<p class="an_time"><span><img src="'+templatePath+'images/anchor_time.png" alt="">'+ftime+'</span></p>');
                            var upNum = up>=10000 ? (up/10000).toFixed(2) + '万' : up;
                            html.push('<p class="an_style"><span><img src="'+templatePath+'images/live_people.png" alt="">'+click+' </span><span class="sec_style"><img src="'+templatePath+'images/anchor_like.png" alt="">'+upNum+' </span>');

                            if(list[i].waitpay == '0'){
                                html.push('<a href="'+imgtextUrl+id+'" class="imgtext">图文</a>');
                                // html.push('<a href="'+imgtextUrl.replace('live_imgtext', 'live_comment')+id+'" class="comment">评论</a>');
                            }else{
                                html.push('<span class="delayPay"><a href="javascript:;" class="stick" style="color:#ff6600;"><s></s>支付</a></span>');
                            }
                            html.push('<span data-id="'+id+'" class="dellive"><img src="'+templatePath+'images/anchor_del.png" alt=""></span></p>');
                            html.push('</div></li>');
                        }

                        if(page > 1){
                          objId.append(html.join(""));
                        }else{
                          objId.html(html.join(""));
                        }
                        if(page >= pageInfo.totalPage){
                isload = true;
              }else{
                isload = false;
              }

                    }else{
                        objId.html("<p class='loading'>暂无数据</p>");
                    }
                }
            }else{
                objId.html("<p class='loading'>暂无数据</p>");
            }
        }
    });
  }
  //用户删除直播
  $("body").delegate(".dellive","tap", function(){
    var t = $(this);
    if(t.hasClass('load')) return;
    t.addClass('load');
     if(confirm("是否确认删除？") ){
      var id = t.attr('data-id');
      $.ajax({
          url: masterDomain + "/include/ajax.php?service=live&action=delUserLive",
          data: "id="+id,
          type: "GET",
          dataType: "json",
          success: function (msg) {
            if(msg.state == 100){
              objId.html("<p class='loading'>加载中...</p>");
              page = 1;
              getList();
            }else{
              t.removeClass('load');
              alert(msg.info);
            }
          },
          error: function(){
            t.removeClass('load');
            console.log('网络错误，操作失败！');
          }
        });
     }else{
      setTimeout(function(){
        t.removeClass('load');
      }, 200)
     }
  });
});
