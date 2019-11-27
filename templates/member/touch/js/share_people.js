$(function () {
    $.ajax({
        url:"/include/ajax.php?service=member&action=getWxShareVisitor",
        type:"GET",
        dataType: "jsonp",
        success:function (data) {
            if(data ){
                console.log(data);
                if(data.state == 100){
                    var list = data.info;
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
                    }
                }

            }
            else {
                $(".share").append('<div class="loading">暂无相关信息</div>');
            }
        }
    })

});