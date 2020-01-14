$(function() {

    $("img").scrollLoading();

    function sjkf(a){
        a.qrcode({
            render: window.applicationCache ? "canvas" : "table",
            width: 84,
            height: 84,
            text: huoniao.toUtf8(window.location.href)
        });
    }
    sjkf( $(".mobile_kf #qrcode"));
    sjkf($(".mobile_kf_mid #sjkf"));
    sjkf($(".mobile_kf_mid #sj"));

//图片放大
    $(".fdimg").click(function(){
        var _this = $(this);//将当前的pimg元素作为_this传入函数
        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
    });

    function imgShow(outerdiv, innerdiv, bigimg, _this) {
        var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
        $(bigimg).attr("src", src);//设置#bigimg元素的src属性
        /*获取当前点击图片的真实大小，并显示弹出层及大图*/
        $("<img/>").attr("src", src).load(function () {
            var windowW = $(window).width();//获取当前窗口宽度
            var windowH = $(window).height();//获取当前窗口高度
            var realWidth = this.width;//获取图片真实宽度
            var realHeight = this.height;//获取图片真实高度
            var imgWidth, imgHeight;
            var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
            if (realHeight > windowH * scale) {//判断图片高度
                imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
                imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
                if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                    imgWidth = windowW * scale;//再对宽度进行缩放
                }
            } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
                imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
                imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
            } else {//如果图片真实高度和宽度都符合要求，高宽不变
                imgWidth = realWidth;
                imgHeight = realHeight;
            }
            $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放
            var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
            var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
            $(innerdiv).css({"top": h, "left": w});//设置#innerdiv的top和left属性
            $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
        });
        $(outerdiv).click(function () {//再次点击淡出消失弹出层
            $(this).fadeOut("fast");
        });
    }


    //大图切换
    $(".sale_slide").slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: true,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {if (i == 0) {$(".sprev").click()} else if (i % 5 == 0) {$(".snext").click()}}});

    //小图左滚动切换
    $(".sale_slide .thumb").slide({mainCell: "ul",delayTime: 300,vis: 5,scroll: 5,effect: "left",autoPage: true,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});


    //内容导航
    var win = $(window), modList = $(".container"), fixnav = modList.find(".sub-nav");
    $(window).scroll(function() {
        var stop = win.scrollTop();
        stop > modList.offset().top && stop < modList.offset().top + modList.height() - 100 ? fixnav.addClass("fixed") : fixnav.removeClass("fixed");
    });

    var isClick = 0; //是否点击跳转至锚点，如果是则不监听滚动
    //左侧导航点击
    $(".fixnav a").bind("click", function(){
        isClick = 1; //关闭滚动监听
        var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $(".sub-title:eq("+index+")").offset().top - 5;
        parent.addClass("curr").siblings("li").removeClass("curr");
        $('html, body').animate({
            scrollTop: theadTop
        }, 300, function(){
            isClick = 0; //开启滚动监听
        });
    });

    //滚动监听
    $(window).scroll(function(){
        if(isClick) return false;  //判断是否点击中转中...
        var scroH = $(this).scrollTop();
        var theadLength = $(".sub-title").length;
        $(".fixnav li").removeClass("curr");

        $(".sub-title").each(function(index, element){
            var offsetTop = $(this).offset().top;
            if(index != theadLength-1){
                var offsetNextTop = $(".sub-title:eq("+(index+1)+")").offset().top - 30;
                if(scroH < offsetNextTop){
                    $(".fixnav li:eq("+index+")").addClass("curr");
                    return false;
                }
            }else{
                $(".fixnav li:last").addClass("curr");
                return false;
            }
        });
    });


    //分享
    var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
    var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
    window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":["tsina","tqq","qzone","weixin","sqq","renren"],"bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];


    $(".btnJb").bind("click", function(){

        var domainUrl = masterDomain;
        $.dialog({
            fixed: false,
            title: "房源举报",
            content: 'url:'+domainUrl+'/complain-house-sale-'+pageData.id+'.html',
            width: 460,
            height: 300
        });
    });

    // 收藏
    $('.btnSc').click(function(){
        var t = $(this), type = t.hasClass("btnYsc") ? "del" : "add";
        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            huoniao.login();
            return false;
        }
        if(type == "add"){
            t.addClass("btnYsc").html("<i></i>已收藏");
        }else{
            t.removeClass("btnYsc").html("<i></i>收藏");
        }
        $.post("/include/ajax.php?service=member&action=collect&module=house&temp=sale_detail&type="+type+"&id="+pageData.id);
    });

    //增加浏览历史
    var house_sale_history = $.cookie(cookiePre+'house_sale_history');
    if (house_sale_history == null) house_sale_history = "";
    if (house_sale_history.indexOf(pageData.id) == -1) {
        if (house_sale_history.length > 0) {
            house_sale_history += ':'+pageData.id;
        } else {
            house_sale_history += pageData.id;
        }
        if (house_sale_history.length > 128) {
            var pos = house_sale_history.indexOf(':');
            house_sale_history = house_sale_history.substr(pos + 1);
        }
        $.cookie(cookiePre+'house_sale_history', house_sale_history, {expires: 365, domain: masterDomain.replace("http://", "").replace("https://", ""), path: '/'});
    }

});
