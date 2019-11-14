$(function(){

  $('.moneyList .item').click(function(){
    var a = $(this);
    if(!a.hasClass('active')){
      a.addClass('active');
      a.siblings().removeClass('active');
    }
  });

  // 购买金币
  $(".moneyList .money_m").click(function(){
    var t = $(this), count = parseInt(t.siblings('.money_time').text());
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=buyGold', 'check=1&count='+count, function(data){
      if(data){
        if(data.state == 100){
          location.href = masterDomain + '/include/ajax.php?service=dating&action=buyGold&count='+count;
        }else if(data.state == 101){
          showMsg.confirm(data.info, {
            ok: function(){
              location.href = masterDomain + '/include/ajax.php?service=dating&action=buyGold&count='+count;
            }
          })
        }else{
          showMsg.alert(data.info, 1000);
        }
      }
    })
  })

});
