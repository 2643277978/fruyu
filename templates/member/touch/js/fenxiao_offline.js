$(function () {
    //显示下拉框
    $('.nav .filter').bind('click',function () {
        $(this).toggleClass('active');
        $('.choose-box').toggleClass('show');
        $('.mask ').toggleClass('mask-hide');
    });
    $('.choose-box li').bind('click',function () {
        $(this).addClass('curr').siblings('.choose-box li').removeClass('curr');
        $('.nav .filter em').html($(this).html());
        $('.nav .filter').toggleClass('active');
        $('.choose-box').toggleClass('show');
        $('.mask ').toggleClass('mask-hide');
        servepage = 1;
        totalpage = 0;
        isload = false;
        $('.list-box ul').html('');
        getList();
    });
    
    //收起下来框
    $('.choose-box').click(function () {
        $('.choose-box').removeClass('show');
        $('.mask ').addClass('mask-hide');
    });
    
    var servepage = 1;
    var totalpage = 0;
    var isload = false;
    // 获取数据
    getList();
    function  getList(){
        $('.loading').show().children('span').text(langData['siteConfig'][20][409]);
        var orderby = $('.choose-sort .curr').data('id');
        var url ="/include/ajax.php?service=member&action=myRecUser&orderby="+orderby+"&page="+ servepage +"&pageSize=10";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
                var datalist = data.info.list;
                if(data.state == 100){
                    totalpage = data.info.pageInfo.totalPage;
                    $('#totalCount').text(langData['siteConfig'][13][13]+data.info.pageInfo.totalCount+langData['siteConfig'][13][32])
                    for(var i=0;i<datalist.length;i++){
                        list = `
                      <li class="fn-clear">
                            <div class="img-box fn-left"><img src="${datalist[i].user.photo ? datalist[i].user.photo : '/static/images/default_user.jpg'}" alt=""></div>
                            <div class="info">
                                <p class="name">${datalist[i].user.username} <span class="fn-right">${huoniao.transTimes(datalist[i].user.regtime, 2).replace(/-/g, '/')}</span></p>
                                <p class="con"><span>TA的下线 <em>${datalist[i].usercount}人</em></span><i class="line">|</i><span>带来收益<em>${datalist[i].useramount}`+echoCurrency('short')+`</em></span></p>
                            </div>
                        </li>
                    `;
                        $('.list-box ul').append(list)
                        isload = false;
                    }
                    if(servepage == totalpage){
                        $('.loading span').text(''+langData['siteConfig'][20][429]+'');//已加载全部数据
                    }

                }else {
                    $('.loading span').text(''+langData['siteConfig'][20][429]+'');//已加载全部数据
                }
            },
            error: function(){
                $('.loading span').text(''+langData['siteConfig'][20][458]+'');//网络错误，获取失败！
            }
        })
    }

    //滚动底部加载
    $(window).scroll(function() {
        var sh = $('.list-box .loading').height();
        var allh = $('body').height();
        var w = $(window).height();

        var s_scroll = allh - sh - w;

        //服务列表
        if ($(window).scrollTop() > s_scroll && !isload) {
            servepage++;
            isload = true;
            if(servepage <= totalpage){
                getList();
            }

        };

    });



});