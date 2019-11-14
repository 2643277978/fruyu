$(function(){

  var dayList = [];
  function getDayTxt(n){
    var r = n < 8 ? n : n % 7;
    var s = '';
    switch(r){case 1: s = '周一'; break; case 2: s = '周二'; break; case 3: s = '周三'; break; case 4: s = '周四'; break; case 5: s = '周五'; break; case 6: s = '周六'; break; case 7: s = '周日'; break; }
    return s;
  }
  for(var i = 1; i < 8; i++){

    var childs = [];
    // for(var e = i; e < i + 7; e++){
    for(var e = i; e < 8; e++){
      childs.push({
        id: e < 8 ? e : e % 7,
        value: getDayTxt(e),
      })
    }

    var join = [{
      id: 0,
      value: '至',
      childs: childs
    }]

    dayList.push({
      id: i,
      value: getDayTxt(i),
      childs: join
    })
  }
  var chooseWeekDay = new MobileSelect({
   trigger: '#yingyeTxt',
   title: '选择营业日',
     wheels: [
        {data : dayList}
     ],
     transitionEnd:function(indexArr, data){
     },
     callback:function(indexArr, data){
      console.log(data)
      var start = data[0]['id'];
      var end = data[2]['id'];

      var str = start == end ? getDayTxt(start) : getDayTxt(start) + '至' + getDayTxt(end);
      this.trigger.value = str;

      var weeks = [];

      if(start == end){
        weeks.push(start);
      }else{
        if(end < start){
          for(var i = 1; i <= end; i++){
            weeks.push(i);
          }
          for(var i = start; i < 8; i++){
            weeks.push(i);
          }
        }else{
          for(var i = start; i <= end; i++){
            weeks.push(i);
          }
        }
      }
      $("#weeks").val(weeks.join(","));
     }
  });

  var timeList = [];
  for(var i = 0; i < 24; i++){
    var childs = [];
    for(var e = i+1; e <= 24; e++){
      childs.push({
        id: e,
        value: (e < 10 ? ('0' + e) : e) + ':00',
      })
    }

    var join = [{
      id: 0,
      value: '至',
      childs: childs
    }]

    timeList.push({
      id: i,
      value: (i < 10 ? ('0' + i) : i) + ':00',
      childs: join
    })
  }

  var chooseDaytime = new MobileSelect({
   trigger: '#opentime',
   title: '选择营业时间',
     wheels: [
        {data : timeList}
     ],
     transitionEnd:function(indexArr, data){
     },
     callback:function(indexArr, data){
      var start = data[0]['value'];
      var end = data[2]['value'];

      var str = start + ';' + end;
      this.trigger.value = str;

     }
  });


  // 全天24小时营业
  $('.switch').click(function(){
    var t = $(this);
    if(t.hasClass('open')){
      $('#opentimeBox').show();
      if($('#opentime').val() == ''){
        $('#opentime').click();
      }
    }else{
      $('#opentimeBox').hide();
    }
    t.toggleClass('open');
  })
  $(".fabuBtn").click(function(){
    var t = $(this);
    var weeks = $("#weeks").val();
    var opentime = $('.switch').hasClass('open') ? '00:00-24:00' : $('#opentime').val();

    if(weeks == ''){
      alert('请选择营业日');
      return;
    }

    if(opentime == ''){
      alert('请选择营时间');
      return;
    }

    if(t.hasClass('disabled')) return;
    t.addClass('disabled');

    $.ajax({
      url: masterDomain + '/include/ajax.php?service=business&action=updateStoreConfig&weeks='+weeks+'&opentime='+opentime,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
            alert('保存成功');
            if(device.indexOf('huoniao') > -1) {
                setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler("goBack", {}, function (responseData) {
                    });
                });
            }else{
                window.location.href = document.referrer;
            }
        }else{
          t.removeClass('disabled');
          alert(data.info);
        }
      },
      error: function(){
        t.removeClass('disabled');
        alert('网络错误，请重试');
      }
    })

  })
})