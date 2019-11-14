$(function(){

  var objId = $('#orderlist'), atpage = 1, pageSize = 3, isload = false;

  getList();

  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(!isload && sct + $(window).height() + 50 >= $('body').height()){
      atpage ++;
      getList();
    }
  })

  function getList(){
    isload = true;
    objId.append('<p class="loading">'+langData['siteConfig'][20][184]+'...</p>');

    $.ajax({
      url: masterDomain+"/include/ajax.php?service=house&action=mymeal&page="+atpage+"&pageSize="+pageSize,
      type: "GET",
      dataType: "jsonp",
      success: function (data) {
        $('.loading').remove();

        if(data && data.state != 200){
          if(data.state == 101){
            objId.append("<p class='loading'>"+langData['siteConfig'][20][126]+"</p>");
          }else{
            
            var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

            //拼接列表
            if(list.length > 0){
              for(var i = 0; i < list.length; i++){
                var item     = [],
                    id       = list[i].id,
                    date     = list[i].date,
                    ordernum = list[i].ordernum,
                    totalprice = list[i].totalprice,
                    config = list[i].config,
                    paytype   = list[i].paytype;

                html.push('<dl class="item" data-id="'+id+'">');
                html.push('  <dt>');
                html.push('    <p class="state">付款成功</p>');
                html.push('    <p class="money">'+echoCurrency('symbol')+'<font>'+totalprice+'</font></p>');
                html.push('    <p class="des">'+config.name+'（房源：'+config.house+',置顶'+config.settop+',刷新'+config.refresh+'）</p>');
                html.push('  </dt>');
                html.push('  <dd><span>编号：</span>'+ordernum+'</dd>');
                html.push('  <dd><span>下单时间：</span>'+huoniao.transTimes(date, 1)+'</dd>');
                html.push('  <dd><span>套餐时长：</span>'+config.time+'个月</dd>');
                html.push('  <dd><span>支付方式：</span>'+paytype+'</dd>');
                html.push('</dl>');

              }

              objId.append(html.join(""));
              if(pageInfo.totalPage > atpage){
                isload = false;
              }else{
                objId.append("<p class='loading'>"+langData['siteConfig'][20][185]+"</p>");
              }
            }else{
              objId.append("<p class='loading'>"+(atpage == 1 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][429])+"</p>");
            }

          }
        }else{
          objId.append("<p class='loading'>"+(atpage == 1 ? langData['siteConfig'][20][126] : langData['siteConfig'][20][429])+"</p>");
        }
      },
      error: function(){
        $('.loading').remove();
        objId.append("<p class='loading'>"+langData['siteConfig'][20][458]+"</p>");
      }
    });
  }

})