$(function () {
    $.ajax({
        url:remote_domain + "/include/ajax.php?service=member&action=getWxShareVisitor",
        type:"GET",
        dataType: "jsonp",
        success:function (data) {
            if(data ){
                console.log(data);
                if(data.state == 100){
                    var list = data.info;
                    var html = [];
                    console.log(list);
                    if(list.length>0){
                        for (var i=0;i<list.length;i++){
                            html.push('<li>');
                            html.push('<a href="">');
                            var imgurl=list[i].headimg;
                            var ll=list[i].nickname;
                            console.log(ll);
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
        }
    })

});