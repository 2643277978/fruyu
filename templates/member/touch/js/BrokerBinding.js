//获得
function onclikRz(curr) {
    // if( $(curr).html("已入驻")){
    //
    // }
    var type = $(curr).attr('data-type');
    var id = $(curr).attr('data-id');
    $.ajax({
        // url:"/include/ajax.php?service=member&action=getFreeHouseList&id="+id+"&type="+type,
        url:"/include/ajax.php?service=house&action=zjRecordHouse&hid="+id+"&type="+type,
        type:"GET",
        dataType: "jsonp",
        success:function () {
            $(curr).html("已入驻");
            alert("入驻成功");
        },
        error:function () {
            alert("入驻失败");
        }
    })

}
$(function () {
    var data = [];
    data.push("pageSize="+pageSize);
    data.push("page="+atpage);
    $.ajax({
        url:"/include/ajax.php?service=member&action=getFreeHouseList",
        type: "GET",
        dataType: "jsonp",
        success:function (data) {
            if(data.state==100){
                // console.log(data.info.list);
                var list = data.info.list, html = [];
                if(list.length>0){
                        for (var i=0;i<list.length;i++){
                            if(list[i].userid==0) {
                                console.log(list[i].userid);
                                html.push('<li>');
                                html.push('<img src="' + list[i].litpic + '"onerror="javascript:this.src=\'/static/images/404.jpg\';">');
                                html.push(' <h4>' + list[i].title + '</h4>');
                                html.push(' <span class="all">');
                                // var typestate = list[i].usertype==1 ? '':'<em class="geren">个人</em>';
                                html.push('<span class="adder">' + list[i].address + '</span>');
                                html.push('<span>|</span>');
                                var houseType;
                                var hType = list[i].housetype;
                                if (hType == "xzl") {
                                    houseType = "写字楼";
                                } else if (hType == "loupan") {
                                    houseType = "新房";
                                } else if (hType == "sale") {
                                    houseType = "二手房";
                                } else if (hType == "zu") {
                                    houseType = "租房";
                                } else if (hType == "sp") {
                                    houseType = "商铺";
                                } else if (hType == "cf") {
                                    houseType = "厂房";
                                } else {
                                    houseType = "未知";
                                }
                                html.push('<span class="houseType">' + houseType + '</span>');
                                html.push('<span>|</span>');
                                var zhuangxiu;
                                if (list[i].zhuangxiu == "15") {
                                    zhuangxiu = "毛坯";
                                } else if (list[i].zhuangxiu == "16") {
                                    zhuangxiu = "普通装修";
                                } else if (list[i].zhuangxiu == "17") {
                                    zhuangxiu = "精装修";
                                } else if (list[i].zhuangxiu == "18") {
                                    zhuangxiu = "豪华装修";
                                } else if (list[i].zhuangxiu == "19") {
                                    zhuangxiu = "其他";
                                }
                                html.push('<span>' + zhuangxiu + '</span>');
                                html.push(' </span>');
                                var elevatortxt = '';
                                var type;
                                if (list[i].price != 0) {
                                    if (list[i].type == 1) {
                                        type = "出租:";
                                        elevatortxt = list[i].price + '元/m²•月';
                                        // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
                                    } else if (list[i].type == 0) {
                                        type = "出售:";
                                        // elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';
                                        elevatortxt = list[i].price + '万';
                                    }
                                } else {
                                    // html.push('<p class="price">待定</p>')
                                }
                                html.push('<p class="price">' + type + '' + elevatortxt + '</p>');
                                var id = list[i].id;
                                html.push('<a onclick="onclikRz(this)" data-id="' + id + '" data-type="' + hType + '" class="ruzhu" id="ruzhu">一键入驻</a>');
                                html.push('</li>')
                            }
                            }

                               $(".br-list").append(html.join(""));

                            //最后一页
                            if(atpage >= data.info.pageInfo.totalPage){
                                isload = true;
                                $(".br-list").append('<li class="loading">已经到最后一页了</li>');
                            }
                            }
                }else {
                    $(".br-list").append('<li class="loading">暂无相关信息</li>')
                }
        }
    })
})

