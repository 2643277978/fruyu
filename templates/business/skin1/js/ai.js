var DTPath = "";var SKPath = "";var MEPath = "";var DTEditor = "fckeditor";var CKDomain = "";var CKPath = "/";var CKPrex = "czm_";
$(function(){

	// 图片延迟加载
	$("img").scrollLoading();

	// banner
	$(".focus_inads").slide({mainCell:".bd .slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>", delayTime: 500});
	// 耀变艾灸网
	$(".sy_focus").slide({ mainCell: ".sy_focus_c .slideobj", titCell: ".point", autoPage:"<li></li>", autoPlay: true, delayTime: 500, effect: "left" });

	//站内公告
	$(".PG_paihang").togTab({ disblocknode: "dd",clickparentnode: "dt.STate_pub", clicknode: "a", onclass: "on" });

	// 艾草图库
	$(".slidebox2").slide({mainCell:".slideobj",effect:"leftLoop",autoPlay:true,autoPage:"<li></li>", delayTime: 500});


	// 品牌关注度
    $(".brand_hot").togTab({ disblocknode: "ul", clickparentnode: "div", clicknode: "a", onclass: "on" });
    // 行业聚焦
    $(".SC_newslistjd").togTab({ disblocknode: "div", clickparentnode: "ul.SC_jd", clicknode: "li", onclass: "on" });
    // 行业专访
    $(".news_zf_photo").togTab({ onclass: "on" });
    //  品牌招商推荐
    $(".sy_xjpp_hover").togTab({ disblocknode: "dd", clickparentnode: "dt", clicknode: "span a", onclass: "on" });
    //  集成灶知识
    $("#jczcs").togTab({ disblocknode: ".jczcsli", clicknode: "span a", onclass: "on" });
    // 集成灶供求
    $(".ST_otherleft").togTab({ disblocknode: "ul", clicknode: "span a", onclass: "on" });
    //  热门 / 最新集成灶品牌
    //  推荐企业
    new Marquee("Scroll4", 0, 1, 840, 370, 50, 2000, 2000, 370);
	    //  推荐企业
    new Marquee("Scroll42", 0, 1, 840, 150, 50, 2000, 2000, 150);
    //  最新代理信息
    new Marquee("zxdl", 0, 1, 876, 396, 30, 2000, 2000, 352);
    //  推荐品牌
    new Marquee("thppgd", 0, 1, 295, 363, 30, 2000, 2000, 352);
    //  认证品牌
    new Marquee("rzppgd", 0, 1, 263, 366, 30, 0, 2000, 352);
	    //  加盟信息
    new Marquee("Scroll43", 0, 1, 1200, 80, 50, 2000, 2000, 80);
	    // 推荐招商
    new Marquee("Scroll44", 0, 20, 1200, 450, 50, 2000, 2000, 450);

    //  集成灶ip品牌展示区一
    jQuery(".brand_tj .index_brand_img li").each(function (i) { jQuery(".brand_tj .index_brand_img li").slice(i * 12, i * 12 + 12).wrapAll("<ul></ul>"); });
    jQuery(".brand_tj").slide({ mainCell: ".index_brand_img div", effect: "top", autoPlay: true, delayTime: 400, pnLoop: true, easing: "easeOutCubic" });

    //  集成灶展会
    jQuery("#exhibit").slide({ mainCell: ".exhibit_left", effect: "topLoop", vis: 4, autoPlay: true, delayTime: 800 });
    //  友情链接
    $(".sy_linkmore").bind("click", function () { $(".sy_linkmore").remove(); $(".sy_linkulmore").show(); })

    $("#showendtime6704").SpecialInterval({ nowtime:'2017-02-05 15:40:52', endtime: "2017-02-17 00:00:00",innode:"i" });
    $(function(){
        $('#hm_backtop li').hover(
            function(){
                $(this).find('div.backbox').show();
                $(this).find('s').removeClass("alpha");
            },
            function(){
                $(this).find('div.backbox').hide();
                $(this).find('s').addClass("alpha");
            }
        );
        function goto_top(){
        	$('html,body').animate({
        		"scrollTop":0
        	},300)
        }
        goto_top();
    });

})
