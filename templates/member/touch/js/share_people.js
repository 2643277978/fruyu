// 下拉加载
$(document).ready(function() {
    $(window).scroll(function() {
        // var h = $('.footer').height() + $('.house-box').height() * 2;
        var allh = $(document).height();
        var w = $(window).height();
        // var scroll = allh - h - w;
        var scrollTop=$(window).scrollTop();
        if (scrollTop + w == allh) {
            atpage++;
            getList();
        }
    });
});
//隐藏返回顶部
$(window).on("scroll", function(){
    if($(window).scrollTop() > 400) {
        $('.popupRightBottom .fastTop').css("visibility", "visible");
    }else{
        $('.popupRightBottom .fastTop').css("visibility", "hidden");
    }
});

//返回顶部
$('body').delegate('.fastTop', 'tap', function(){
    document.scrollingElement.scrollTop = 0;
});

$(function () {
    var data = [];
    data.push("pageSize="+pageSize);
    data.push("page="+atpage);
    $.ajax({
        url:"/include/ajax.php?service=member&action=getWxShareVisitor",
        type:"GET",
        data: data.join("&"),
        dataType: "jsonp",
        success:function (data) {
            if(data ){
                if(data.state == 100){
                    var list = data.info.list;
                    var html = [];
                    if(list.length>0){
                        for (var i=0;i<list.length;i++){
                            html.push('<li>');
                            html.push('<a href="">');
                            var imgurl=list[i].headimg;
                            var ll=list[i].nickname;
                            html.push('<img src="'+imgurl+'" alt="">');
                            html.push('</a>');
                            html.push('<div class="title">');
                            html.push(' <h3 class="name">'+list[i].nickname+'</h3>');
                            var housename='访问房源:';
                            var visttime='访问时间:';
                            html.push(' <span class="house">'+housename+list[i].houseTitle+'</span>');
                            html.push(' <span class="time">'+visttime+list[i].date+'</span>');
                            html.push('</div>');
                            html.push('</li>');
                        }
                        $(".share").append(html.join(""));
                        //最后一页
                        if(atpage >= data.info.pageInfo.totalPage){
                            isload = true;
                            $(".share").append('<li class="loading">已经到最后一页了</li>');
                        }
                    }else {
                        $(".share").append('<li class="loading">暂无相关信息</li>');
                    }
                    //请求失败
                }else{
                var tip =data.info;
                $(".share").append('<div class="loading">'+tip+'</div>');
            }


                //加载失败
            }else{
                $(".share .loading").html('加载失败');
            }
        }// success
    })

});