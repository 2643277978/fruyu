$(function() {


    var device = navigator.userAgent, isClick = true;
    $('#cf-list').css('min-height', $(window).height() - $('.footer').height());

    var detailList, getParid;
    detailList = new h5DetailList();
    setTimeout(function(){detailList.removeLocalStorage();}, 800);

    var dataInfo = {
        isBack: true
    };

    $(window).on("scroll", function() {
        var thisa = $(this);
        var st = thisa.scrollTop();
        if (st >= chtop) {
            $(".choose-box").addClass('choose-top');
            if (device.indexOf('huoniao_iOS') > -1) {
                $(".choose-box").addClass('padTop20');
            }
        } else {
            $(".choose-box").removeClass('choose-top padTop20');
        }
    });

    // 下拉加载
    $(document).ready(function() {
        $(window).scroll(function() {
            var h = $('.footer').height() + $('.house-box').height() * 2;
            var allh = $('body').height();
            var w = $(window).height();
            var scroll = allh - h - w;
            if ($(window).scrollTop() > scroll && !isload) {
                atpage++;
                getList();
            };
        });
    });

    // 上滑下滑导航隐藏
    var upflag = 1, downflag = 1, fixFooter = $(".choose-box");
    //scroll滑动,上滑和下滑只执行一次！
    scrollDirect(function (direction) {
        var dom = fixFooter.hasClass('choose-top');
        if (direction == "down" && dom && isClick) {
            if (downflag) {
                fixFooter.hide();
                downflag = 0;
                upflag = 1;
            }
        }
        if (direction == "up" && dom && isClick) {
            if (upflag) {
                fixFooter.show();
                downflag = 1;
                upflag = 0;
            }
        }
    });


    // 搜索
    $('.search-box').submit(function(e){
        e.preventDefault();
        $('#search_button').click();
    })
    $('#search_button').click(function(){
        var keywords = $('#search_keyword').val();
        getList(1);
    })

    //初始加载
    if($.isEmptyObject(detailList.getLocalStorage()['extraData']) || !detailList.isBack()){
        getList();
    }else {
        getData();
        setTimeout(function(){
            detailList.removeLocalStorage();
        }, 500)
    }

    //数据列表
    function getList(tr){

        isload = true;

        //如果进行了筛选或排序，需要从第一页开始加载
        if(tr){
            atpage = 1;
            $(".house-list").html("");
        }



        $(".house-list .loading").remove();
        $(".house-list").append('<div class="loading">加载中...</div>');

        //请求数据
        var data = [];
        data.push("pageSize="+pageSize);

        data.push("page="+atpage);

        var keywords = $('#search_keyword').val();
        data.push("keywords="+keywords);

        $.ajax({
            url: "/include/ajax.php?service=house&action="+action,
            data: data.join("&"),
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                $('.choose-box').removeClass('choose-top');
                if(data){
                    if(data.state == 100){
                        $(".house-list .loading").remove();
                        var list = data.info.list, html = [];
                        if(list.length > 0){
                            for(var i = 0; i < list.length; i++){

                                var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "small");

                                html.push('<div class="house-box">');
                                html.push('<a href="'+list[i].url+'" data-url="'+list[i].url+'">');
                                html.push('<div class="house-item">');
                                var video = list[i].video==1 ? '<i class="play_img"></i>' : '';
                                var vr    = list[i].qj==1 ? '<i class="VR_img"></i>' : '';
                                html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"onerror="javascript:this.src=\'/static/images/404.jpg\';"></div>');
                                html.push('<dl class="l">');
                                var top = list[i].isbid==1 ? '<i class="set_top"></i>' : '';
                                html.push('<dt>'+top+'<em class="sp_title">'+list[i].title+'</em></dt>');

                                html.push('<dd class="item-area cf-item-area"><em>'+list[i].commCount+'个小区</em><em>'+list[i].houseCount+'套在售</em><span class="price sch">'+list[i].minprice+'</span>-<span class="price sch">'+list[i].maxprice+'元/m²</span></dd>');
                                html.push('<dd class="item-type-1 cf-item-type-1">'+list[i].address+'</dd>');
                                html.push('<dd class="item-flag">');
                                if(list[i].flag){
                                    for (var j=0;j<list[i].flag.length;j++){
                                        html.push('<span>'+list[i].flag[j]+'</span>');
                                    }
                                }
                                html.push('</dd>')
                                html.push('</dl>')
                                html.push('</div>')
                                html.push('<div class="clear"></div>')
                                html.push('</a>')
                                html.push('</div>')
                            }

                            $(".house-list").append(html.join(""));
                            isload = false;

                            //最后一页
                            if(atpage >= data.info.pageInfo.totalPage){
                                isload = true;
                                $(".house-list").append('<div class="loading">已经到最后一页了</div>');
                            }

                            //没有数据
                        }else{
                            isload = true;
                            $(".house-list").append('<div class="loading">暂无相关信息</div>');
                        }

                        //请求失败
                    }else{
                        $(".house-list .loading").html(data.info);
                    }

                    //加载失败
                }else{
                    $(".house-list .loading").html('加载失败');
                }
            },
            error: function(){
                isload = false;
                $(".house-list .loading").html('网络错误，加载失败！');
                $('.choose-box').removeClass('choose-top');
            }
        });
    }

    // 本地存储的筛选条件
    function getData() {
        var filter = $.isEmptyObject(detailList.getLocalStorage()['filter']) ? dataInfo : detailList.getLocalStorage()['filter'];
        isload = false;
        atpage = detailList.getLocalStorage()['extraData'].lastIndex;

    }


})
