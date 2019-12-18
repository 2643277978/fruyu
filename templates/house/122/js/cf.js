$(function () {
    //获取url的参数（区域）
    var currUrl=window.location.href;
    currUrl = currUrl.substring(currUrl.indexOf("?"),currUrl.length);
    var canshu=currUrl=currUrl.replace('?', ' ');
    var addEare=currUrl%100000;//二级区域
    var add=parseInt(currUrl)-parseInt(addEare);
    add=add/100000;//一级区域 end
    function checkCs() {
        var html=[];
        var id =add,
            t = $(' .pos-item').find('a[data-id='+id+']'),
            i = t.index(),
            txt=t.text();
        if(t.hasClass('disabled')) return;
        t.addClass('curr').siblings().removeClass('curr');
        $('.area .pos-sub-item').html('<a href="javascript:;" class="all curr">不限</a>');
        if (t.hasClass("all")) {
            $('.area').hide();
        }else{
            $.ajax({
                url: "/include/ajax.php?service=house&action=addr&type=" + id,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data && data.state == 100) {
                        var list = [],
                            info = data.info;
                        list.push('<a href="javascript:;"  data-area="' + id +
                            '" data-business="0" class="">不限</a>');
                        for (var i = 0; i < info.length; i++) {
                            var cla=info[i].id==addEare?"curr":"";
                            list.push('<a href="javascript:;" data-area="' + add + '" data-business="' + info[i].id + '"  class='+cla+'>' +
                                info[i].typename + '</a>');
                        }
                        $('.area .pos-sub-item').html(list.join(""));
                        $('.area').show();
                    }
                }
            });
        }
    }
    if(addEare){
        checkCs()
    }else {
        checkFilter()
    }
    $("img").scrollLoading();

    $('.lplist').delegate('.codebox', 'hover', function (event) {
        var type = event.type;
        var url = $(this).parent().find('a').attr('href');
        if (type == "mouseenter") {
            $(this).find('.qrcode').css("display", "block");
            $(this).find('#qrcode').qrcode({
                render: window.applicationCache ? "canvas" : "table",
                width: 74,
                height: 74,
                text: huoniao.toUtf8(url)
            });
        } else {
            $(this).find('.qrcode').css("display", "none");
            $(this).find('#qrcode').html('');
        }
    });
    $('.lplist').delegate('.btn_sc', 'click', function (event) {
        var t = $(this),
            type = t.hasClass("btn_ysc") ? "del" : "add";
        var userid = $.cookie(cookiePre + "login_user");
        if (userid == null || userid == "") {
            huoniao.login();
            return false;
        }
        if (type == "add") {
            t.addClass("btn_ysc").html("<i></i>已收藏");
        } else {
            t.removeClass("btn_ysc").html("<i></i>收藏");
        }
        $.post("/include/ajax.php?service=member&action=collect&module=house&temp=cf_detail&type=" + type + "&id=" + id);
    });

    /**
     * 筛选变量
     */

    // 判断条件
    function checkFilter(){

      var html = [], curr, index, txt, id;
      var pagetype = $('.filtertab .on').attr('data-action');

      $('.filterlist dl').each(function(g){
        var box = $(this);
        var title = box.children('dt').text();
        // 区域
        if(g == 0){
            curr = $('.pos-item .curr');
            index = curr.index();
            if(index > 0){
              txt = curr.text();
              id = curr.attr("data-id");
              html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-level="1" data-type="addrid" data-id="'+id+'"><span>'+txt+'</span><i class="idel"></i></a>');

              curr = $('.pos-sub-item .curr');
              index = curr.index();
                if(addEare){
                    html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-level="2" data-type="addrid" data-id="'+addEare+'"><span></span><i class="idel"></i></a>');
                }
              if(index > 0){
                txt = curr.text();
                id = curr.attr("data-business");
                html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-level="2" data-type="addrid" data-id="'+id+'"><span>'+txt+'</span><i class="idel"></i></a>');
              }
            }
        // 面积
        }else if(g == 1){
          curr = box.find('.curr');
          index = curr.index();
          id = curr.attr('data-id');
          if(index > -1){
            // 自定义面积
            if(curr.hasClass('inpbox')){
              var min = box.find(".inpbox .p1").val();
              var max = box.find(".inpbox .p2").val();
              if(min != '' || max != ''){
                if(min && max && parseInt(min) > parseInt(max)) {
                  box.find('dd a:eq(0)').addClass('curr');
                  $(".inpbox").removeClass('active').children('input[type="input"]').val('');
                }else{
                  html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-type="area" data-id="'+min+','+max+'"><span>'+min+'-'+max+'㎡</span><i class="idel"></i></a>');
                }
              }
            }else{
              if(index > 0){
                txt = curr.text();
                html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-type="area" data-id="'+id+'"><span>'+txt+'</span><i class="idel"></i></a>');
              }
            }
          }

        // 价格
        }else if(g == 2 || g == 3){
            if( (pagetype == 'cf_sale' && g == 2) || (pagetype == 'cf_zu' && g == 3) || pagetype == 'cf_zr' ){
                return;
            }
            curr = box.find('.zshow .curr');
            index = curr.index();
            id = curr.attr('data-id');

            var hasprice = false;

            // 自定义价格
            if(curr.hasClass('inp_price')){
              var min = curr.find(".p1").val();
              var max = curr.find(".p2").val();
              if(min != '' || max != ''){
                if(min && max && parseInt(min) > parseInt(max)) {
                  box.find('dd a:eq(0)').addClass('curr');
                  curr.removeClass('curr').children('input[type="input"]').val('');
                }else{
                    hasprice = true;
                  html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-type="price" data-id="'+min+','+max+'"><span>'+min+'-'+max+'</span><i class="idel"></i></a>');
                }
              }
            }else{
              if(index > 0){
                curr = box.find('.zshow .curr');
                id = curr.attr('data-id');
                txt = curr.text();
                hasprice = true;
                html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-type="price" data-id="'+id+'"><span>'+txt+'</span><i class="idel"></i></a>');
              }
            }
            if(hasprice){
                id = box.find('.filprice .on').index() + 1;
                html.push('<a href="javascript:;" title="'+title+'" class="selected-info fn-hide" data-group="'+g+'" data-type="pricetype" data-id="'+id+'"><span>'+id+'</span><i class="idel"></i></a>');
            }
          

        }else {
          curr = box.find('.curr');
          index = curr.index();
          txt = curr.text();
          id = curr.attr('data-id');
          type = box.attr("data-type");
          if(index > 0){
            html.push('<a href="javascript:;" title="'+title+'" class="selected-info" data-group="'+g+'" data-type="'+type+'" data-id="'+id+'"><span>'+txt+'</span><i class="idel"></i></a>');
          }
        }
      })

      if(keywords){
          html.push('<a href="javascript:;" title="关键词" class="selected-info" data-group="keywords" data-type="keywords" data-id="'+keywords+'"><span>'+keywords+'</span><i class="idel"></i></a>');
      }

      if(html.length){
        $(".fi-state").show().children("dd").html(html.join(""));
      }else{
        $(".fi-state").hide().children("dd").html("");
      }
      atpage = 1;
      getList();
    }

    // 筛选区域的点击事件 切换位置筛选类型 curr 价格是否为自定义
    $('.filterlist').delegate('a', 'click', function(){
      var t = $(this), par = t.closest('dl'), con = t.parent(), index = par.index();
      if(con.hasClass('area') || con.hasClass('subway') || con.hasClass('pos-item')) return;    // 区域和更多条件区域单独处理

      t.addClass('curr').siblings().removeClass('curr');
      if(index == 0){
        
      }else if(index == 1 || index == 2){
        $('.filterlist .inpbox').removeClass('curr');
      }
      checkFilter();
    })

    // 一级区域
    $('.t-fi .pos-item').delegate('a', 'click', function(event) {
        var t = $(this),index = t.index(),id = t.attr("data-id");
        t.addClass('curr').siblings().removeClass('curr');
        addEare="";add="";
        $('.area .pos-sub-item').html('<a href="javascript:;" class="all curr">不限</a>');
        if ($(this).hasClass("all")) {
            $('.area').hide();
        } else{
            $.ajax({
                url: "/include/ajax.php?service=house&action=addr&type="+id,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(data && data.state == 100){
                        var list = [], info = data.info;
                        list.push('<a href="javascript:;"  data-area="'+id+'" data-business="0" class="all curr">不限</a>');
                        for(var i = 0; i < info.length; i++){
                            list.push('<a href="javascript:;" data-area="'+id+'" data-business="'+info[i].id+'">'+info[i].typename+'</a>');
                        }
                        $('.area .pos-sub-item').html(list.join(""));
                        $('.area').show();
                    }
                }
            });
        }
        checkFilter();
    });

    // 单个删除
    $(".fi-state").delegate(".idel", "click", function () {
        var par = $(this).parent(), group = par.attr('data-group'), level = par.attr("data-level"), id = par.attr("data-id");
        if(group == 0 && level == 1){
            par.siblings('[data-group="0"]').remove();
        }
        par.remove();
        if($(".selected-info").length == 0){
          $(".fi-state").hide();
        }
        clearFilter(group, level, id);
        getList();
    });

    // 清空条件
    $(".btn_clear").on("click", function () {
        $(".fi-state").hide().children('dd').html('');
        clearFilter();
        $(".fi-state").hide();
        getList();
    });

    function clearFilter(obj, level, id){
      var group = obj ? obj : 'all';
      if(group == 'all' || group == 'keywords') keywords = '';
      $('.filterlist dl').each(function(g){
        if(group == 'all' || group == g){
            var box = $(this);
            if(group == 'all' || g != 0 || (g == 0 && level == 1)){
              box.find('.curr').removeClass('curr');
              box.find('.cur').removeClass('cur');
              box.find('.active').removeClass('active');
            }
            if(g == 0){

              // 清除二级
              $('.pos-sub-item a:eq(0)').addClass('curr').siblings().removeClass('curr');

              if(level == 1 || level == undefined){
                $('.area').hide();
                $('.pos-item a').eq(0).addClass('curr');
              }

            }else{
              box.find('dd a:eq(0)').addClass('curr');
              if(g == 1 || g == 2){
                box.find('.inpbox input[type="input"]').val('');
                box.find('.zjbox').each(function(){
                    $(this).children('a:eq(0)').addClass('curr');
                })
              }
            }
          }
        })
    }


    //排序
    $(".m-t li").bind("click", function () {
        var t = $(this),
            i = t.index(),
            id = t.attr('data-id');
        orderby = id;

        if (!t.hasClass("curr")) {
            t.addClass("curr").siblings("li").removeClass("curr");
        }
        checkFilter();
    });

    $(".m-o a").bind("click", function () {
        var t = $(this),
            i = t.index(),
            id = t.attr('data-id');
        if (i == 1) {
            pantime = id;
        } else if (i == 2) {
            price = id;
        }

        if (!t.hasClass("curr")) {
            t.addClass("curr").siblings("a").removeClass("curr");
        } else {
            if (t.hasClass("curr") && t.hasClass("ob")) {
                t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
            }
        }
        checkFilter();

    });

    // 切换类别
    $('.filtertab').delegate('li', 'click', function() {
        var t = $(this),i = t.index(),action = t.attr('data-action');
        if(!t.hasClass('on')){
            t.addClass('on').siblings().removeClass('on');
            $('.lplist').eq(i).addClass('show').siblings('.lplist').removeClass('show');
        }

        $('.m-l a').show();
        
        if (action == 'cf_zu') {
            $('.rentbox').show()
            $('.pricebox').hide();
        } else if (action == 'cf_sale') {
            $('.rentbox').hide()
            $('.pricebox').show();
        } else {
            $('.rentbox').hide()
            $('.pricebox').hide();
            $('.m-l a:eq(2), .m-l a:eq(3)').next().hide();
            var idx = $('.m-l .curr').index();
            if(idx == 2 || idx == 3){
                $('.m-l a:eq(0)').addClass('curr').siblings().removeClass('curr');
            }
        }

        checkFilter();
    });

     // 单价/总价
    $('.filprice').delegate('span', 'click', function(event) {
        var t = $(this),i = t.index(),par = t.closest('dl');
        if (!t.hasClass('on')) {
            t.addClass('on').siblings().removeClass('on');
            if (par.hasClass('rentbox')) {
                par.find('.zjbox').eq(i).addClass('zshow').siblings().removeClass('zshow');
            } else {
                par.find('.zjbox').eq(i).addClass('zshow').siblings().removeClass('zshow');
            }
            checkFilter();
        }
    });


    //自定义面积
    $('.btn_area').click(function(){
        var t = $(this);
        var areaLow = t.siblings(".p1").val();
        var areaTop = t.siblings(".p2").val()
        area = areaLow + ',' + areaTop +'m²';
        if (!areaLow && !areaTop) {
            alert('请输入面积');
            return false; 
        }else{
            $(this).closest('.inpbox').addClass('curr').closest("dl").find('a').removeClass('curr');
            checkFilter();
        }
    })

    //价格自定义
    $('.inp_price').delegate('.btn', 'click', function(event) {
        var t = $(this);
        var zdpriceLow = t.siblings(".p1").val();
        var zdpriceTop = t.siblings(".p2").val();
        zdprice = zdpriceLow + '-' + zdpriceTop +'元';
        if (!zdpriceLow && !zdpriceTop) {
            alert('请输入价格');
            return false; 
        }else{
            t.closest('.inpbox').addClass('curr').closest("dl").find('a').removeClass('curr');
            checkFilter();
        }
    });

    checkFilter();

    function getList() {

        $(".lplist ul").html('<li class="empty">正在获取，请稍后</li>');
        $(".pagination").html('').hide();

        var data = [];
        data.push('page='+atpage);
        data.push('pageSize='+pageSize);

        var pagetype = $('.filtertab .on').index();
        pagetype = pagetype == 2 ? 1 : pagetype == 1 ? 2 : 0;
        data.push('type='+pagetype);

        $('.fi-state dd a').each(function(){
            var t = $(this), type = t.attr('data-type'), id = t.attr('data-id');
            data.push(type+'='+id);
        })

        var curr = $('.m-t li.curr'), index = curr.index();
        if(index == 1){
            data.push("usertype=1");
        }else if(index == 2){
            data.push("usertype=0");
        }else if(index == 3){
            data.push("qj=1");
        }else if(index == 4){
            data.push("video=1");
        }

        var orderby = "";
        curr = $('.m-l a.curr'), index = curr.index();
        if(index == 1){
            if(curr.hasClass("up")){
                orderby = 3;
            }else{
                orderby = 2;
            }
        }else if(index == 2){
            if(curr.hasClass("up")){
                orderby = 4;
            }else{
                orderby = 5;
            }
        }else if(index == 3){
            if(curr.hasClass("up")){
                orderby = 6;
            }else{
                orderby = 7;
            }
        }else if(index == 4){
            orderby = 1;
        }
        data.push("orderby="+orderby);

        var url = masterDomain + "/include/ajax.php?service=house&action=cfList";

        $.ajax({
            url: url,
            type: "get",
            data: data.join("&"),
            dataType: "jsonp",
            success: function (data) {
                if (data.state == 100) {
                    var list = data.info.list,
                        html = [],
                        pageInfo = data.info.pageInfo;
                    $(".totalCount b").html(pageInfo.totalCount);
                    totalCount = pageInfo.totalCount;
                    var tpage = Math.ceil(totalCount / pageSize);

                    for (var i = 0; i < list.length; i++) {
                        var d = list[i];

                        html.push('<li class="fn-clear">');
                        html.push('<div class="imgbox fn-left">');
                        var litpic = d.litpic != "" && d.litpic != undefined ? huoniao.changeFileSize(d.litpic, "small") :
                            "/static/images/404.jpg";
                        html.push('<a href="' + d.url + '" target="_blank"><img src="' + litpic + '" alt="">');
                        if (d.video) {
                            html.push('<i class="ivplay"></i>');
                        }
                        if (d.qj) {
                            html.push('<i class="ivr"></i>');
                        }
                        html.push('</a>');
                        html.push('<div class="markbox"><span class="m_mark m_zj"></span></div>');
                        html.push('</div>');
                        html.push('<div class="infobox fn-left">');
                        html.push('<div class="lptit fn-clear"> ');
                        html.push('<a href="' + d.url + '" target="_blank"><h2>'+d.title+'</h2>' + (d.isbid == "1" ?
                            '<i class="mtop"></i>' : '') + '</a>');
                        html.push('<span class="lpprice">' + (d.price > 0 ? '<b>' + d.price + '</b>' + (d.type == '2' ? '万元' : '元/月') : '<b>价格面议</b>') +
                            '</span>');
                        html.push('</div>');
                        html.push('<div class="lpinf fn-clear">');
                        html.push('<div class="sp_l fn-left">');
                        html.push('<span>' + d.area + '㎡</span>');
                        html.push('<em>|</em>');
                        if (d.bno && d.floor) {
                            html.push('<span>' + d.bno + '/' + d.floor + '层</span>');
                            html.push('<em>|</em>');
                        }
                        if(d.paytype){
                            html.push('<span>' + d.paytype + '</span>');
                            html.push('<em>|</em>');
                        }
                        if(d.cenggao){
                            html.push('<span>' + d.cenggao + 'm</span>');
                            html.push('<em>|</em>');
                        }
                        html.push('<span>' + d.protype + '</span>');

                        html.push('</div>');

                        var dprice = '';
                        if(d.type == 0 || d.type == 2){
                            if(d.price > 0){
                                var dpr = d.price / d.area;
                                if(dpr>=1){
                                    dprice = dpr.toFixed(0);
                                }else{
                                    dprice = dpr.toFixed(1);
                                }
                                html.push('<div class="sp_r fn-right">' + dprice + (d.type == '2' ? '万元' : '元/月')+'·平方</div>');
                            }
                        }else if (d.type == "1") {
                            html.push('<div class="sp_r fn-right">转让费：' + d.transfer + ' 万</div>');
                        }
                        html.push('</div>');
                        html.push('<p class="lpinf">[' + d.addr[d.addr.length - 1] + ']  ' + d.address + '</p>');
                        html.push('<div class="lpinf hinf fn-clear">');
                        /*html.push('<div class="hilef fn-left">');
                        if (d.usertype == 1) {
                            html.push('<span><i class="iname"></i> ' + d.nickname + '</span>');
                            html.push('<span><i class="itel"></i> ' + d.userPhone + '</span>');
                        } else {
                            html.push('<span><i class="iname"></i> ' + d.username + '</span>');
                            html.push('<span><i class="itel"></i> ' + d.contact + '</span>');
                        }
                        html.push('</div>');*/
                        html.push('<div class="hirig fn-right">');
                        html.push('<a href="' + d.url + '" target="_blank" class="btn_sc"><i class="isc"></i> 收藏</a>');
                        html.push('<a href="javascript:;" data-title="' + d.title +
                            '" class="btn_share" data-url="' + d.url + '" data-pic="' + d.litpic +
                            '"><i class="ishare"></i> 分享</a>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</li>');


                    }

                    $('.lplist ul').html(html.join(""));
                    showPageInfo();
                } else {
                    $(".totalCount b").html(0);
                    $(".lplist ul").html('<div class="empty">抱歉！ 未找到相关房源</div>');
                }
            },
            error: function(){
                $(".totalCount b").html(0);
                $(".lplist ul").html('<div class="empty">网络错误，请刷新重试</div>');
            }
        })
    }

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
                prev.onclick = function () {
                    atpage = nowPageNum - 1;
                    getList();
                }
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
});
