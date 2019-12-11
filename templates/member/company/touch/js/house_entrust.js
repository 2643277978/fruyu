/**
 * 会员中心——经纪人收到的看房预约
 * by guozi at: 20150627
 */

var objId = $("#list"), isload = false;
$(function(){

  // 项目
  $(".tab .type").bind("click", function(){
    var t = $(this), id = t.attr("data-id"), index = t.index();
    if(!t.hasClass("curr") && !t.hasClass("sel")){
      state = id;
      atpage = 1;
      $('#list').html('');
      t.addClass('curr').siblings().removeClass('curr');
      getList(1);
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

  getList(1);

  objId.delegate(".bj", "click", function(){
    var t = $(this), par = t.closest(".item"), id = par.attr("data-id"), title, newstate;
    if(id){
      if(par.hasClass('state0')){
        title = '确定要该条信息标记为已处理吗？';
        newstate = 1;
      }else{
        return;
        title = '确定要该条信息标记为未处理吗？';
        newstate = 0;
      }
      if(confirm(title)){
        t.siblings("a").hide();
        t.addClass("load");

        $.ajax({
          url: masterDomain+"/include/ajax.php?service=house&action=operaEntrust&iszjcom=1&state="+newstate+"&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data && data.state == 100){

              //删除成功后移除信息层并异步获取最新列表
              par.remove();
              setTimeout(function(){getList(1);}, 200);

            }else{
              $.dialog.alert(data.info);
              t.siblings("a").show();
              t.removeClass("load");
            }
          },
          error: function(){
            $.dialog.alert(langData['siteConfig'][20][183]);
            t.siblings("a").show();
            t.removeClass("load");
          }
        });
      };
    }
  });
  objId.delegate(".del", "click", function(){
    var t = $(this), par = t.closest(".item"), id = par.attr("data-id");
    if(id){
      if(confirm(langData['siteConfig'][20][543])){
        t.siblings("a").hide();
        t.addClass("load");

        $.ajax({
          url: masterDomain+"/include/ajax.php?service=house&action=operaEntrust&iszjcom=1&state=-1&id="+id,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            if(data && data.state == 100){

              //删除成功后移除信息层并异步获取最新列表
              par.remove();
              setTimeout(function(){getList(1);}, 200);

            }else{
              $.dialog.alert(data.info);
              t.siblings("a").show();
              t.removeClass("load");
            }
          },
          error: function(){
            $.dialog.alert(langData['siteConfig'][20][183]);
            t.siblings("a").show();
            t.removeClass("load");
          }
        });
      };
    }
  });


});

function getList(is){

  if(is){
    objId.html('');
  }

  objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

  isload = true;

  $.ajax({
    url: masterDomain+"/include/ajax.php?service=house&action=myEntrust&iszjcom=1&state="+state+"&page="+atpage+"&pageSize="+pageSize,
    type: "GET",
    dataType: "jsonp",
    success: function (data) {
      $('.loading').remove();
      if(data && data.state != 200){
        if(data.state == 101){
          $("#total").html(0);
          $("#state1").html(0);
          $("#state0").html(0);
          objId.append("<p class='loading'>"+langData['siteConfig'][20][184]+"</p>");
        }else{
          var list = data.info.list, pageInfo = data.info.pageInfo, totalPage = 0, html = [];
          if(state == ''){
            totalPage = pageInfo.totalPage;
          }else if(state == '1'){
            totalPage = Math.ceil(pageInfo.state1 / pageSize);
          }else{
            totalPage = Math.ceil(pageInfo.state0 / pageSize);
          }
          //拼接列表
          if(list.length > 0){
            for(var i = 0; i < list.length; i++){
              var item     = [],
                  id         = list[i].id,
                  aid        = list[i].aid,
                  title      = list[i].title,
                  date       = list[i].date,
                  username   = list[i].username,
                  contact    = list[i].contact,
                  sex        = list[i].sex,
                  address    = list[i].address,
                  doornumber = list[i].doornumber,
                  area       = list[i].area,
                  price      = list[i].price,
                  transfer   = list[i].transfer,
                  istate     = list[i].state,
                  type       = list[i].type,
                  note       = list[i].note,
                  detail     = list[i].detail,
                  pubdate    = huoniao.transTimes(list[i].pubdate, 2);

              var typename = '';
              if(type == 0) typename = '出租';
              if(type == 1) typename = '出售';
              if(type == 2) typename = '转让';

              var bj_btn = '', date_btn = '', cls = '';
              if(istate == "0"){
                bj_btn = '<a href="javascript:;" class="bj">标记</a>';
                date_btn = '<span class="date">未处理</span>';
              }else{
                date_btn = '<span class="date">已处理</span>';
              }


              html.push('<div class="item state'+istate+'" data-id="'+id+'">');
              html.push('  <p class="type">委托类型：'+typename+'</p>')
              html.push('  <p class="user fn-clear"><span class="name">'+username+(sex == 1 ? '先生' : (sex == 2 ? '女士' : ''))+'&nbsp;&nbsp; <em>'+contact+'</em></span>'+date_btn+'</p>');
              html.push(' <p class="title">地址：'+address+'</p>');
              html.push(' <p class="title">门牌号：'+(doornumber == '' ? '未填写' : doornumber)+'</p>');
              html.push(' <p class="title">面积：'+(area == 0 ? '未填写' : area)+'㎡</p>');
              if(type == 2){
                html.push(' <p class="title">月租金：'+(price == 0 ? '未填写' : price)+'元/月</p>');
                html.push(' <p class="title">转让费：'+(transfer == 0 ? '未填写' : transfer + '元')+'</p>');
              }else{
                html.push(' <p class="title">报价：'+(price == 0 ? '未填写' : price + (type == 0 ? '元/月' : '万元') )+'</p>');
              }
              html.push('  <div class="o fn-clear">');
              html.push('   <span class="time">'+pubdate+'</span>');
              html.push(bj_btn);
              html.push('   <a href="javascript:;" class="del">删除</a>');
              html.push('  </div>');
              html.push('</div>');
              
            }
            objId.append(html.join(""));
            if(atpage < totalPage){
              isload = false;
            }else{
              objId.append("<p class='loading'>"+langData['siteConfig'][20][185]+"</p>");
            }
          }else{
            objId.append("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
          }

          totalCount = pageInfo.totalCount;

          $("#total").html(pageInfo.totalCount);
          $("#state1").html(pageInfo.state1);
          $("#state0").html(pageInfo.state0);

        }
      }else{
        $("#total").html(0);
        objId.html("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
      }
    }
  });
}
