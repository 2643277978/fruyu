$(function(){

  if(money < minPutMoney){
    showMsg('抱歉，最低提现金额为'+echoCurrency('symbol')+minPutMoney);
  }

  // 全部提现
  $("#withdrawAll").click(function(){
    $("#money").val(maxPutMoney);
  })

  // 提现
  $("#submit").click(function(){
    var t = $(this);
    // if(t.hasClass('disabled')) return;
    var amount = $.trim($("#money").val());
    if(amount == ''){
      showMsg('请输入提现金额');
      return;
    }
    var regu = "(^[1-9]([0-9]?)+[\.][0-9]{1,2}?$)|(^[1-9]([0-9]+)?$)|(^[0][\.][0-9]{1,2}?$)";
    var re = new RegExp(regu);
    if (!re.test(amount)) {
      showMsg(langData['siteConfig'][20][63]);
      return false;
    }else if(amount > maxPutMoney){
      showMsg(langData['siteConfig'][20][214]);
      return false;
    }else if(amount < minPutMoney){
      showMsg('最低提现金额为：'+minPutMoney);
      return false;
    }

    // t.addClass("disabled");
    var data = [];
    data.push('module='+module);
    data.push('utype='+utype);
    data.push('amount='+amount);
    data.push('type='+type);
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=member&action=putForward&'+data.join('&'),
      // data: 'module='+module+'&utype='+utype+'&amount='+amount+'&type='+type,
      // data: {module:module, utype:utype, amount: amount, type: type},
      type: 'post',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          showMsg(data.info);
          setTimeout(function(){
            location.reload();
          },1000)
        }else{
          showMsg(data.info);
        }
      },
      error: function(){
        showMsg('网络错误，请重试');
      }
    })
  })
});

// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}