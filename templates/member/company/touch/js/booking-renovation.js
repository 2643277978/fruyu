$(function(){
  var objId = $('.list'), isload = false;;

  //确认
  objId.delegate(".state0", "click", function(){
    var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
    if(id){
      if(confirm(langData['siteConfig'][27][79])) {
        t.siblings("a").hide();
        t.addClass("load");

        $.ajax({
            url: masterDomain+"/include/ajax.php?service=renovation&action=updateRese&id="+id,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              if(data && data.state == 100){
                t.siblings("a").show();
                setTimeout(function(){getList(1);}, 1000);
              }else{
                $.dialog.alert(data.info);
                t.siblings("a").show();
                t.removeClass("load");
              }
            },
            error: function(){
              $.dialog.alert("网络错误，请稍候重试！");
              t.siblings("a").show();
              t.removeClass("load");
            }
        });
      }
    }
  });


  // 下拉加载
  $(window).scroll(function() {
    var h = $('.item').height();
    var allh = $('body').height();
    var w = $(window).height();
    var scroll = allh - w - h;
    if ($(window).scrollTop() > scroll && !isload) {
      atpage++;
      getList();
    };
  });


  // 初始加载
  getList(1);
  function getList(is){
    if(is){
      atpage = 1;
      objId.html('');
    }
    isload = true;
    objId.append('<p class="loading">加载中，请稍候...</p>');

    $.ajax({
        url: masterDomain+"/include/ajax.php?service=renovation&action=rese&u=1&orderby=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        if(data && data.state != 200){
          if(data.state == 101){
            objId.html("<p class='loading'>暂无相关信息！</p>");
          }else{
            $('.loading').remove();
            var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

            //拼接列表
            if(list.length > 0){

              for(var i = 0; i < list.length; i++){
                var item   = [],
                    id     = list[i].id,
                    people    = list[i].people,
                    contact   = list[i].contact,
                    community = list[i].community,
                    designer  = list[i].designer,
                    state     = list[i].state;

                html.push('<div class="item fn-clear" data-id="'+id+'">');
                html.push('<div class="item-txt">');
                html.push('<p class="name">'+langData['siteConfig'][19][642]+'：'+people+'</em></p>');
                html.push('<p class="name">'+langData['siteConfig'][19][56]+'：'+contact+'</em></p>');
                html.push('<p class="name">'+langData['siteConfig'][26][24]+'：'+community+'</em></p>');
                html.push('<p class="name">'+langData['siteConfig'][26][147]+'：'+designer+'</em></p>');

                if(state == 0){
                    html.push('<a href="javascript:;" class="state state0">'+langData['siteConfig'][6][0]+'</a>');
                }else{
                    html.push('<a href="javascript:;" class="state state1">'+langData['siteConfig'][26][146]+'</a>');
                }
                html.push('</div>');
                html.push('</div>');

              }

              $('.loading').remove();
              objId.append(html.join(""));
              isload = false;

            }else{
              if(atpage == 1){
                objId.html("<p class='loading'>暂无相关信息！</p>");
              }else{
                objId.append("<p class='loading'>已加载全部信息！</p>");               
              }
            }

            totalCount = pageInfo.totalCount;

            switch(state){
              case "0":
                totalCount = pageInfo.gray;
                break;
              case "1":
                totalCount = pageInfo.audit;
                break;
              case "2":
                totalCount = pageInfo.refuse;
                break;
            }


            $("#audit").html(pageInfo.audit);
            $("#gray").html(pageInfo.gray);
            $("#refuse").html(pageInfo.refuse);
          }
        }else{
          objId.html("<p class='loading'>暂无相关信息！</p>");
        }
      }
    });
  }


})
