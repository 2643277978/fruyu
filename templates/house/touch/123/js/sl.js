
    $(document).ready(function() {
        $(".sl").click(function() {
            $(".sl").eq($(this).index()).addClass("active").siblings().removeClass('active');
            $(".esf-list").hide().eq($(this).index()).show();
            // 另一种方法:  $(".house-list").eq($(".sl").index(this)).addClass("show").siblings().removeClass('show');
        });
    });
$(function () {

    var device = navigator.userAgent, isClick = true;
    function getSpList(tr,a,b,c){

        isload = true;

        //如果进行了筛选或排序，需要从第一页开始加载
        if(tr){
            atpage = 1;
            a.html("");
        }
        //自定义筛选内容
        var item = [];
        b.remove();

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
        data.push("page="+atpage);

        var keywords = $('#search_keyword').val();
        data.push("keywords="+keywords);

        $.ajax({
            // url: "/include/ajax.php?service=house&action="+action,
            url: "/include/ajax.php?service=house&action=spList&pageSize=20&type="+c+"&page=1&keywords=&callback=jsonp2",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                if(data){
                    if(data.state == 100){
                        b.remove();
                        var list = data.info.list, html = [];
                        if(list.length > 0){
                            for(var i =0; i < list.length; i++){
                                var addrlength = list[i].addr.length;
                                var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "small");

                                html.push('<div class="house-box">');
                                html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
                                html.push('<div class="house-item">');
                                // html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"><i class="play_img"></i><i class="VR_img"></i></div>');
                                var video = list[i].video==1 ? '<i class="play_img"></i>' : '';
                                var vr    = list[i].qj==1 ? '<i class="VR_img"></i>' : '';
                                var typestate = list[i].usertype==1 ? '' : '<em class="geren">个人</em>';
                                html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"onerror="javascript:this.src=\'/static/images/404.jpg\';">'+video+vr+typestate+'</div>');
                                html.push('<dl class="l">');
                                var top = list[i].isbid==1 ? '<i class="set_top"></i>' : '';
                                html.push('<dt>'+top+'<em class="sp_title">'+list[i].title+'</em></dt>');
                                html.push('<dd class="item-area sp_item-area">');

                                html.push('<em>'+list[i].area+'㎡|'+list[i].loupan+'|'+list[i].zhuangxiu+'</em>');

                                //价格
                                html.push('<span class="price r">');
                                if(list[i].price != 0){
                                    var ptype = echoCurrency('short')+"/月";
                                    if(list[i].type == 1){
                                        ptype = "万";
                                    }
                                    html.push('<strong>'+list[i].price+'</strong><span class="price_unit">'+ptype+'</span>');
                                }else{
                                    html.push('<span>待定</span>');
                                }
                                html.push('</span>');

                                html.push('</dd>');

                                var elevatortxt = '';
                                if(list[i].type==1){
                                    if(list[i].price>0){
                                        elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';
                                    }
                                }else if(list[i].type==2){
                                    if(list[i].transfer>0){
                                        elevatortxt = '转让费： ' + parseInt(list[i].transfer).toFixed(0) + '万';
                                    }
                                }else if(list[i].type==0){
                                    if(list[i].price>0){
                                        elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
                                    }
                                }

                                html.push('<dd class="item-type-1 sp-item-type-1 fn-clear"><em>'+list[i].address+'</em><em class="r">'+elevatortxt+'</em></dd>');
                                html.push('</dl>')
                                html.push('</div>')
                                html.push('<div class="clear"></div>')
                                html.push('</a>')
                                html.push('</div>')
                            }

                            a.append(html.join(""));
                            isload = false;

                            //最后一页
                            if(atpage >= data.info.pageInfo.totalPage){
                                isload = true;
                               a.append('<div class="loading">已经到最后一页了</div>');
                            }

                            //没有数据
                        }else{
                            isload = true;
                            a.append('<div class="loading">暂无相关信息</div>');
                        }

                        //请求失败
                    }else{
                        b.html(data.info);
                    }

                    //加载失败
                }else{
                    a.html('加载失败');
                }
            },
            error: function(){
                isload = false;
                b.html('网络错误，加载失败！');
                $('.choose-box').removeClass('choose-top');
            }
        });//end ajax
    }
    getSpList(1,$(".maiSp"),$(".maiSp .loading"),1);//1代表买
    getSpList(1,$(".zuSp"),$(".zuSp .loading"),0);//0代表租

    function getList(tr,a,b,c){

        isload = true;

        //如果进行了筛选或排序，需要从第一页开始加载
        if(tr){
            atpage = 1;
            a.html("");
        }

        //自定义筛选内容
        var item = [];

        b.remove();
        // a.append('<div class="loading">加载中...</div>');

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);
        var areaType,
            addrid = 0, business = 0;
        data.push("addrid="+addrid);

        var price = 0;

        var type=0;
        var genre=0;

        var protype=0;

        data.push("page="+atpage);

        // var keywords = $('#search_keyword').val();
        // data.push("keywords="+keywords);

        $.ajax({
            // url: "/include/ajax.php?service=house&action=xzlList",
            url: "/include/ajax.php?service=house&action=xzlList&pageSize=20&addrid=0&type="+c+"&page=1&keywords=&callback=jsonp4",
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                // console.log(data);
                if(data){
                    if(data.state == 100){
                        b.remove();
                        var list = data.info.list, html = [];
                        if(list.length > 0){
                            for(var i = 0; i < list.length; i++){
                                var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "small");
                                html.push('<div class="house-box">');
                                html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
                                html.push('<div class="house-item">');
                                // html.push('<div class="house-img l"><img src="'+list[i].litpic+'"></div>');
                                var video = list[i].video==1 ? '<i class="play_img"></i>' : '';
                                var vr    = list[i].qj==1 ? '<i class="VR_img"></i>' : '';
                                var typestate = list[i].usertype==1 ? '' : '<em class="geren">个人</em>';
                                html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"onerror="javascript:this.src=\'/static/images/404.jpg\';">'+video+vr+typestate+'</div>');
                                html.push('<dl class="l">');
                                var top = list[i].isbid==1 ? '<i class="set_top"></i>' : '';

                                html.push('<dt>'+top+'<em class="sp_title">'+list[i].title+'</em></dt>');

                                //区域
                                html.push('<dd class="item-area xzl-item-area"><em>'+list[i].area+'㎡|'+list[i].protype+'|'+list[i].zhuangxiu+'</em>');

                                // 价格
                                if(list[i].type == 0)
                                {
                                    var total = list[i].price>0 ? parseInt(list[i].price * list[i].area).toFixed(0) + echoCurrency('short')+'/月' : '面议';
                                    var price = list[i].price>0 ? '<em class="r">' + list[i].price + '元/m²•月</em>' : '';
                                    html.push('<span class="price r">'+total+'</span>');
                                    html.push('</dd>');
                                    html.push('<dd class="item-type-1 xzl-item-type-1">');
                                    html.push('<em>'+list[i].address+'</em>'+price);
                                }else{
                                    var total = list[i].price>0 ? '<em class="r">' + (list[i].price / list[i].area ).toFixed(2) + '万/㎡</em>' : '';
                                    var price = list[i].price>0 ? list[i].price + '万' : '面议';
                                    html.push('<span class="price r">'+price+'</span>');
                                    html.push('</dd>');
                                    html.push('<dd class="item-type-1 xzl-item-type-1">');
                                    html.push('<em>'+list[i].address+'</em>'+total);
                                }
                                html.push('</dd>')
                                html.push('</dl>')
                                html.push('</div>')
                                html.push('<div class="clear"></div>')
                                html.push('</a>')
                                html.push('</div>')
                            }

                            a.append(html.join(""));
                            isload = false;

                            //最后一页
                            if(atpage >= data.info.pageInfo.totalPage){
                                isload = true;
                                a.append('<div class="loading">已经到最后一页了</div>');
                            }

                            //没有数据
                        }else{
                            isload = true;
                            a.append('<div class="loading">暂无相关信息</div>');
                        }

                        //请求失败
                    }else{
                        b.html(data.info);
                    }

                    //加载失败
                }else{
                    b.html('加载失败');
                }
            },
            error: function(){
                isload = false;
                b.html('网络错误，加载失败！');
            }
        });
    }
        getList(1,$(".zuXzl"),$(".zuXzl .loading"),1);//1代表买zu
        getList(1,$(".maiXzl"),$(".maiXzl .loading"),0);//0代表买

});