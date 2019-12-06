
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



//获得
function onclikRz(curr) {
    // if( $(curr).html("已入驻")){
    //
    // }
    var type = $(curr).attr('data-type');
    var id = $(curr).attr('data-id');
    $.ajax({
        url:"/include/ajax.php?service=house&action=zjRecordHouse&hid="+id+"&type="+type,
        type:"GET",
        dataType: "jsonp",
        success:function (data) {
            if(data.state==100){
                $(curr).html("已入驻");
                alert("入驻成功");
            }
            else {
                alert(data.info);
            }
        },
        error:function () {
            alert("入驻失败");
        }
    })

}
// $(function () {
    function  getList() {
      //请求数据
    var data = [];
    data.push("pageSize="+pageSize);
    data.push("page="+atpage);
    $.ajax({
        url:"/include/ajax.php?service=member&action=getFreeHouseList",
        type: "GET",
        dataType: "jsonp",
        success:function (data) {
            if(data){
                if(data.state==100){
                    var list = data.info.list, html = [];
                    if(list.length>0){
                            for (var i=0;i<list.length;i++){
                                // if(list[i].userid==0) {
                                    html.push('<li>');
                                    html.push('<img src="' + list[i].litpic + '"onerror="javascript:this.src=\'/static/images/404.jpg\';">');
                                    var title;
                                    var maxWidth=19;
                                  if(list[i].title.length>maxWidth){
                                      title=list[i].title.substring(0,maxWidth)+"...";
                                  }else {
                                      title=list[i].title;
                                  }
                                    html.push(' <h4>' + title + '</h4>');
                                    html.push(' <span class="all">');
                                // var typestate = list[i].usertype==1 ? '':'<em class="geren">个人</em>';
                                var addWidth=8;
                                var address;
                                if(list[i].address.length>addWidth){
                                    address=list[i].address.substring(0,maxWidth)+"...";
                                }else {
                                    address=list[i].address;
                                }
                                html.push('<span class="adder">' + address + '</span>');
                                html.push('<span>|</span>');
                                var hosue;
                                if (list[i].housetype == "xzl") {
                                    hosue = "写字楼";
                                } else if (list[i].housetype == "loupan") {
                                    hosue = "新房";
                                } else if (list[i].housetype == "sale") {
                                    hosue = "二手房";
                                } else if (list[i].housetype == "zu") {
                                    hosue = "租房";
                                } else if (list[i].housetype == "sp") {
                                    hosue = "商铺";
                                } else if (list[i].housetype == "cf") {
                                    hosue = "厂房";
                                } else {
                                    hosue = "未知";
                                }
                                html.push('<span class="houseType">' +hosue+ '</span>');
                                html.push('<span>|</span>');
                                var zx;
                                if (list[i].zhuangxiu == "15") {
                                    zx = "毛坯";
                                } else if (list[i].zhuangxiu == "16") {
                                    zx = "普通装修";
                                } else if (list[i].zhuangxiu == "17") {
                                    zx = "精装修";
                                } else if (list[i].zhuangxiu == "18") {
                                    zx = "豪华装修";
                                } else if (list[i].zhuangxiu == "19") {
                                    zx = "其他";
                                }else {
                                    zx="未知"
                                }
                                html.push('<span>' + zx + '</span>');
                                html.push(' </span>');
                                var elevatortxt = '';
                                var type;
                                var jiage;
                                if (list[i].price != 0) {
                                    if(list[i].housetype=="xzl"){
                                        if (list[i].type == 1) {
                                            type = "出租:";
                                            elevatortxt = list[i].price + '元/m²•月';
                                            // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
                                        } else if (list[i].type == 0) {
                                            type = "出售:";
                                            // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';
                                            elevatortxt = list[i].price + '万';
                                        }else if(list[i].type==undefined){
                                            elevatortxt=list[i].price+'万';
                                            type="";
                                        }
                                    }else if(list[i].housetype=="sale"){
                                        elevatortxt=list[i].price+'万';
                                        type="";
                                    }else if(list[i].housetype=="zu"){
                                        elevatortxt=list[i].price+'元/月';
                                        type="";
                                    }else if(list[i].housetype=="sp"){
                                        elevatortxt=list[i].price+'万';
                                        type="";
                                    }else if(list[i].housetype=="cf"){
                                        if (list[i].type == 1) {
                                            type = "装让费:";
                                            elevatortxt = list[i].transfer + '万';
                                            // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
                                        } else if (list[i].type == 0||list[i].type==2) {
                                            type = "价格:";
                                            var dpr = list[i].price / list[i].area;
                                            if(dpr>=1){
                                                jiage = dpr.toFixed(0);
                                            }else{
                                                jiage = dpr.toFixed(1);
                                            }
                                            if(list[i].type==2){
                                                elevatortxt = jiage + '万元'+'·平方';
                                            }else if(list[i].type==0){
                                                elevatortxt = jiage + '月/元'+'·平方';
                                            }
                                            // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';

                                        }else if(list[i].type==undefined){
                                            elevatortxt=list[i].price+'万';
                                            type="";
                                        }
                                    }

                                } else if(list[i].price ==undefined){
                                    elevatortxt="待定";
                                }
                                html.push('<p class="price">' + type + '' + elevatortxt + '</p>');
                                var id = list[i].id;
                                html.push('<a onclick="onclikRz(this)" data-id="' + id + '" data-type="' +list[i].housetype + '" class="ruzhu" id="ruzhu">一键入驻</a>');
                                html.push('</li>')
                            }
                            $(".br-list") .append(html.join(""));
                            //最后一页
                            if(atpage >= data.info.pageInfo.totalPage){
                                isload = true;
                                $(".br-list").append('<li class="loading">已经到最后一页了</li>');
                            }
                            //没有数据
                            }else{
                        $(".br-list").append('<div class="loading">暂无相关信息</div>');
                       }
                //请求失败
                }else{
                $(".br-list .loading").html(data.info);
            }

            //加载失败
        }else{
            $(".house-list .loading").html('加载失败');
    }
        }
    })
    }
    getList();
// })

