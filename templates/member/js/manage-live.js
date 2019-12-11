/**
 * Created by Administrator on 2018/5/8.
 */
var objId = $(".live_main");

$(function(){
    //结束直播
    //$(".live_button").delegate(".btn_end", "click", function() {
    $('.btn-end').click(function(){
        //在页面上弹出对话框
        var con=confirm(langData['siteConfig'][31][133]); //是否确定关闭直播？
        if(con==true) {
            update(2);
            window.location.reload();
        } else {
        }

    });
    function update(state){
        $.ajax({
            url: "/include/ajax.php?service=live&action=updateState&state="+state+"&id="+id,
            type: 'post',
            dataType: 'json',
            async : false,   //注意：此处是同步，不是异步
            data:"id="+id,
            success: function (data) {
                if(data && data.state == 100){
                    data.info=langData['siteConfig'][32][12];   //结束直播
                    // alert(data.info);
                }else{
                    alert(data.info)
                }
            }

        });
    }

    $('.btn-edit').click(function(){
        event.preventDefault();
        var id = $(this).attr('data-id');
        window.location.href = editUrl+'?id='+id;
    });
    showPageInfo();
    getList(1);
    //用户删除直播
    $(".live_main").delegate(".live_del","click", function(){
        if(confirm(langData['siteConfig'][31][134]) ){     //是否确认删除？
            var id = $(this).attr('data-id');
            var par = $(this).closest(".live_box");
            $.ajax({
              url: masterDomain + "/include/ajax.php?service=live&action=delUserLive",
              data: "id="+id,
              type: "GET",
              dataType: "json",
              success: function (msg) {
                if(msg.state == 100){
                    //删除成功后移除信息层并异步获取最新列表
                       par.slideUp(300, function(){
                           par.remove();
                           setTimeout(function(){getList(1);}, 200);
                       });

                }else{
                    $.dialog.alert(msg.info);
                }
              },
              error: function(){
                console.log(langData['siteConfig'][31][134]);//网络错误，操作失败！
              }
            });
        }
    });
    //下载地址
    $(".button-live").delegate(".btn-start","click", function(){
        if(pulltype == 0){
            $(".down_modal").css('display','block');
        }else{
            if(confirm('是否开始直播')){
                update(1);
                window.location.reload();
            }
        }
    });
    $(".m-close").click(function(){
        $(".down_modal").css('display','none');
    });
});
function getList(is){
  $('#list').html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>').show();  //加载中，请稍后

    // objId.html('<p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p>');
    $(".pagination").hide();
    var id=$('#hiddenid').val();
    $.ajax({
        url: masterDomain+"/include/ajax.php?service=live&action=alive&type=2&page="+atpage+"&u=1&uid="+id+"&pageSize="+pageSize,
        type: "GET",
        dataType: "json",
        success: function (data) {
          $('#list').hide();
            if(data && data.state != 200){
                if(data.state == 101){
                    $('#list').html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>").show();  ////暂无相关信息！
                }else{

                    var list = data.info.list, pageInfo = data.info.pageInfo, html = [];
                    //拼接列表
                    if(list.length > 0){
                        var t = window.location.href.indexOf(".html") > -1 ? "?" : "&";
                        var param = t + "do=edit&id=";
                        var urlString = editUrl + param;
                        for(var i = 0; i < list.length; i++){
                            var item        = [],
                                id          = list[i].id,
                                title       = list[i].title,
                                url         = list[i].url,
                                litpic      = list[i].litpic,
                                photo       = list[i].photo,
                                click       = list[i].click,
                                state       = list[i].state,
                                up          = list[i].up,
                                newurl      = list[i].newurl,
                                ftime       = list[i].ftime;
                            html.push('<div class="live_box item" data-id="'+id+'">');
                              html.push('<a href="'+newurl+'">');
                            var stateText = state==0 ? langData['siteConfig'][31][136] : (state==1 ? langData['siteConfig'][15][22] : langData['siteConfig'][31][137]);   //未直播---直播中---精彩回放
                            html.push('<div class="an_left"><img src="'+litpic+'"><div class="playback state'+state+'">'+stateText+'</div></div>');
                            var arcrank = '';
                            switch(list[i].arcrank){
                                case '0':
                                    arcrank = '<span class="arcrank_'+list[i].arcrank+'">待审核</span>';
                                    break;
                                case '1':
                                    arcrank = '<span class="arcrank_'+list[i].arcrank+'">已审核</span>';
                                    break;
                                case '2':
                                    arcrank = '<span class="arcrank_'+list[i].arcrank+'">审核失败</span>';
                                    break;
                            }
                            html.push('<div class="an_right"><h5>'+arcrank+title+'</h5>');
                            html.push('<p class="an_time"><span><i></i>'+ftime+'</span></p></a>');
                            html.push('<p class="an_style">');
                            html.push('<span class="ll_style"><i></i>'+click+' </span>');
                            var upNum = up>=10000 ? (up/10000).toFixed(2) + langData['siteConfig'][13][27] : up; //万
                            html.push('<span class="sec_style"><i></i>'+upNum+' </span>');

                            if(list[i].waitpay == '0'){
                                html.push('<span class="imgtext"><a href="'+imgtextUrl+id+'">图文</a></span>');
                                // html.push('<span class="comment"><a href="'+imgtextUrl.replace('imgtext', 'comment')+id+'">评论</a></span>');
                            }else{
                                html.push('<span class="delayPay"><a href="javascript:;" class="stick" style="color:#ff6600;"><s></s>立即支付</a></span>');
                            }
                            html.push('<span data-id="'+id+'" class="live_del"><i></i> '+langData['siteConfig'][6][8]+' </span>');  //删除
                            html.push('</p></div></div>');
                        }
                        objId.html(html.join(""));

                    }else{
                        objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
                    }
                    totalCount = pageInfo.totalCount;
                    showPageInfo();
                }
            }else{
                objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");//暂无相关信息！
            }
        }
    });
}
