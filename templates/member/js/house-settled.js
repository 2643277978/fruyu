// $(function () {
    //入驻
    function onclikRz(curr) {
        // if( $(curr).html("已入驻")){
        //
        // }
        console.log(curr);
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

    function getList() {
        // $(".sllist ul").html('<li class="empty">正在获取，请稍后</li>');
        $(".pagination").html('').hide();
        var data = [];
        data.push('page='+atpage);
        data.push('pageSize='+pageSize);
        $.ajax({
            url:"/include/ajax.php?service=member&action=getFreeHouseList",
            type: "GET",
            dataType: "jsonp",
            success:function (data) {
                if(data.state==100){
                    var list = data.info.list,
                        html = [],
                        pageInfo = data.info.pageInfo;
                       totalCount = pageInfo.totalCount;
                    var atpage = Math.ceil(totalCount / pageSize);
                    for (var i = 0; i < list.length; i++) {
                        var d = list[i];
                        html.push('<li class="fn-clear" data-id="' + d.id + '">');
                        html.push('<div class="imgbox fn-left">');
                        var litpic = d.litpic != "" && d.litpic != undefined ? huoniao.changeFileSize(d.litpic, "small") :
                            "/static/images/404.jpg";
                        html.push('<a  target="_blank"><img src="' + litpic + '"onerror="javascript:this.src=\'/static/images/404.jpg\';" alt=""></a>');

                        html.push('<div class="markbox">');
                        if (d.usertype == 0) {
                            html.push('<span class="m_mark m_gr"></span>');
                        } else {
                            html.push('<span class="m_mark m_zj"></span>');
                        }
                        html.push('</div>');
                        html.push('</div>');
                        html.push('<div class="infobox fn-left">');
                        html.push('<div class="lptit fn-clear">');
                        html.push('<a target="_blank"><h2>' + d.title + '</h2>' + (d.isbid == "1" ?
                            '<i class="mtop"></i>' : '') + '</a>');
                        var price;
                        if(d.housetype == "zu"){
                            price=d.price+"元/月";
                        }else if(d.housetype == "sale"){
                            price=d.price+"万";
                        }else if(d.housetype == "sp"){
                            if (d.type == 0 || d.type == 2) {
                                if(d.price>0){
                                    price=d.price+'元/月';
                                }else {
                                    price="价格面议";
                                }
                            } else {
                                if(d.price>0){
                                    price=d.price+'万';
                                }else {
                                    price="价格面议";
                                }
                            }
                        }else {
                            price="待定";
                        }
                        if(list[i].price==undefined||list[i].price==""){
                            price="待定";
                        }
                        html.push('<span class="lpprice">' + (d.price > 0 ? '<b>' + price + '</b>' : '<b>价格面议</b>') +
                            '</span>');
                        html.push('</div>');
                        html.push('<div class="lpinf fn-clear">');

                        html.push('<div class="sp_l fn-left">');
                        var house;
                        if (list[i].housetype == "xzl") {
                            house = "写字楼";
                        } else if (list[i].housetype == "loupan") {
                            house = "新房";
                        } else if (list[i].housetype == "sale") {
                            house = "二手房";
                        } else if (list[i].housetype == "zu") {
                            house = "租房";
                        } else if (list[i].housetype == "sp") {
                            house = "商铺";
                        } else if (list[i].housetype == "cf") {
                            house = "厂房";
                        } else {
                            house = "未知";
                        }
                        html.push('<span>' + house + '</span><em>|</em><span>' + d.area + '㎡</span>');
                        html.push('<em>|</em>');
                        if (d.buildage > 0) {
                            html.push('<span>' + d.buildage + '年' + (d.buildage < 100 ? '代' : '') + '</span>');
                            html.push('<em>|</em>');
                        }

                        if (d.direction) {
                            html.push('<span>' + d.direction + '</span>');
                            html.push('<em>|</em>');
                        }
                        if (d.bno > 0 && d.floor > 0) {
                            html.push('<span>' + d.bno + '/' + d.floor + '层</span>');
                            html.push('<em>|</em>');
                        }
                        if (d.elevator == 1) {
                            html.push('<span>有电梯</span>');
                            html.push('<em>|</em>');
                        }
                        html.pop();

                        html.push('</div>');
                        var unitprice;
                        if(d.unitprice==undefined||d.unitprice==""){
                            unitprice="";
                        }else {
                            unitprice=d.unitprice + ' 元/㎡';
                        }
                        html.push('<div class="sp_r fn-right">' + unitprice + '</div>');
                        html.push('</div>');
                        html.push('<p class="lpinf">' + d.address + '</p>');
                        html.push('<div class="lpbottom">');
                        html.push('<div class="lpmark">');
                        var rz="一键入驻";
                        html.push('<a onclick="onclikRz(this)" data-id="'+list[i].id+'" data-type="' +list[i].housetype + '" class="ruzhu" id="ruzhu">一键入驻</a>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</li>');
                    }
                    $(".sllist ul").html(html.join(""));
                    showPageInfo();
                }else{
                    var tip=data.info;
                    $(".sllist ul").html('<li class="empty">'+tip+'</li>');
                }
            }
        })
    }
    getList();

//打印分页

function showPageInfo() {
    var info = $(".pagination");
    var nowPageNum = atpage;
    var allPageNum = Math.ceil(totalCount / pageSize);
    var pageArr = [];

    info.html("").hide();

    //输入跳转
    var redirect = document.createElement("div");
    redirect.className = "pagination-gotopage";
    redirect.innerHTML =
        '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
    info.append(redirect);

    //分页跳转
    info.find(".btn").bind("click", function () {
        var pageNum = info.find(".inp").val();
        if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
            atpage = pageNum;
            getList();
        } else {
            info.find(".inp").focus();
        }
    });

    var pages = document.createElement("div");
    pages.className = "pagination-pages";
    info.append(pages);

    //拼接所有分页
    if (allPageNum > 1) {

        //上一页
        if (nowPageNum > 1) {
            var prev = document.createElement("a");
            prev.className = "prev";
            prev.innerHTML = '上一页';
            prev.setAttribute('href','#');
            prev.click(function () {
                atpage = nowPageNum - 1;
                getList();
            })
        } else {
            var prev = document.createElement("span");
            prev.className = "prev disabled";
            prev.innerHTML = '上一页';
        }
        info.find(".pagination-pages").append(prev);

        //分页列表
        if (allPageNum - 2 < 1) {
            for (var i = 1; i <= allPageNum; i++) {
                if (nowPageNum == i) {
                    var page = document.createElement("span");
                    page.className = "curr";
                    page.innerHTML = i;
                } else {
                    var page = document.createElement("a");
                    page.innerHTML = i;
                    page.setAttribute('href','#');
                    page.onclick = function () {
                        atpage = Number($(this).text());
                        getList();
                    }
                }
                info.find(".pagination-pages").append(page);
            }
        } else {
            for (var i = 1; i <= 2; i++) {
                if (nowPageNum == i) {
                    var page = document.createElement("span");
                    page.className = "curr";
                    page.innerHTML = i;
                } else {
                    var page = document.createElement("a");
                    page.innerHTML = i;
                    page.setAttribute('href','#');
                    page.onclick = function () {
                        atpage = Number($(this).text());
                        getList();
                    }
                }
                info.find(".pagination-pages").append(page);
            }
            var addNum = nowPageNum - 4;
            if (addNum > 0) {
                var em = document.createElement("span");
                em.className = "interim";
                em.innerHTML = "...";
                info.find(".pagination-pages").append(em);
            }
            for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
                if (i > allPageNum) {
                    break;
                } else {
                    if (i <= 2) {
                        continue;
                    } else {
                        if (nowPageNum == i) {
                            var page = document.createElement("span");
                            page.className = "curr";
                            page.innerHTML = i;
                        } else {
                            var page = document.createElement("a");
                            page.innerHTML = i;
                            page.setAttribute('href','#');
                            page.onclick = function () {
                                atpage = Number($(this).text());
                                getList();
                            }
                        }
                        info.find(".pagination-pages").append(page);
                    }
                }
            }
            var addNum = nowPageNum + 2;
            if (addNum < allPageNum - 1) {
                var em = document.createElement("span");
                em.className = "interim";
                em.innerHTML = "...";
                info.find(".pagination-pages").append(em);
            }
            for (var i = allPageNum - 1; i <= allPageNum; i++) {
                if (i <= nowPageNum + 1) {
                    continue;
                } else {
                    var page = document.createElement("a");
                    page.innerHTML = i;
                    page.setAttribute('href','#');
                    page.onclick = function () {
                        atpage = Number($(this).text());
                        getList();
                    }
                    // info.find(".pagination-pages").append(page);
                }
            }
        }

        //下一页
        if (nowPageNum < allPageNum) {
            var next = document.createElement("a");
            next.className = "next";
            next.innerHTML = '下一页';
            next.setAttribute('href','#');
            next.onclick = function () {
                atpage = nowPageNum + 1;
                getList();
            }
        } else {
            var next = document.createElement("span");
            next.className = "next disabled";
            next.innerHTML = '下一页';
        }
        info.find(".pagination-pages").append(next);

        info.show();

    } else {
        info.hide();
    }
}
// });