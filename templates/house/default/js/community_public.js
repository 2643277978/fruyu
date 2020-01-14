
   $(function(){
    $(".mobile_kf #qrcode").qrcode({
        render: window.applicationCache ? "canvas" : "table",
        width: 84,
        height: 84,
        text: huoniao.toUtf8(window.location.href)
    });
    //收藏
    $(".btnSc").bind("click", function(){
        var t = $(this), type = "add", oper = "+1", txt = "已收藏";

        var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            huoniao.login();
            return false;
        }

        if(!t.hasClass("btnYsc")){
            t.addClass("btnYsc");
        }else{
            type = "del";
            t.removeClass("btnYsc");
            oper = "-1";
            txt = "收藏";
        }

        var $i = $("<b>").text(oper);
        var x = t.offset().left, y = t.offset().top;
        $i.css({top: y - 10, left: x + 17, position: "absolute", "z-index": "10000", color: "#f1370b"});
        $("body").append($i);
        $i.animate({top: y - 50, opacity: 0, "font-size": "2em"}, 800, function(){
            $i.remove();
        });

        t.html("<i></i>"+txt);

        $.post("/include/ajax.php?service=member&action=collect&module=house&temp=community_detail&type="+type+"&id="+pageData.id);

    });

    //增加浏览历史
    var house_community_history = $.cookie(cookiePre+'house_community_history');
    if (house_community_history == null) house_community_history = "";
    if (house_community_history.indexOf(pageData.id) == -1) {
        if (house_community_history.length > 0) {
            house_community_history += ':'+pageData.id;
        } else {
            house_community_history += pageData.id;
        }
        if (house_community_history.length > 128) {
            var pos = house_community_history.indexOf(':');
            house_community_history = house_community_history.substr(pos + 1);
        }
        $.cookie(cookiePre+'house_community_history', house_community_history, {expires: 365, domain: masterDomain.replace("http://", "").replace("https://", "").replace("https://", ""), path: '/'});
    }
})

//百度分享代码
var staticPath = (u=window.staticPath||window.cfg_staticPath)?u:((window.masterDomain?window.masterDomain:document.location.origin)+'/static/');
var shareApiUrl = staticPath.indexOf('https://')>-1?staticPath+'api/baidu_share/js/share.js':'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5);
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"1","bdMiniList":["tsina","tqq","qzone","weixin","sqq","renren"],"bdSize":"16"},"share":{"bdSize":0}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=shareApiUrl];
