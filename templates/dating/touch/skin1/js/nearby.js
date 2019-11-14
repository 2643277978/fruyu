$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), lng = lat = 0, page = 1, pageSize = 10, isload = false;
  var activeUid = 0, activeNickname = '';

  HN_Location.init(function(data){
    if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
      tofoot.html(''+langData['siteConfig'][27][136]+'').show();
    }else{
      lng = data.lng;
      lat = data.lat;
      getList();
    }
  })

  // 互动-----------------
  // 打招呼
  container.delegate('.btns .greet', 'click', function(){
    var t = $(this), p = t.closest('.item'), name = p.find('.name').text(), id = p.attr('data-id');
    if(t.hasClass('active')) return;
    operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=3&id='+id, function(data){
      if(data.state == 100){
        t.addClass('active').text('已打招呼');
        showMsg.alert('已向'+name+'打招呼', 1000);
        t.addClass('active');
      }else{
        showMsg.alert('操作失败', 1000);
      }
    })
  })
  // 关注
  container.delegate('.btns .follow', 'click', function(){
    var t = $(this), p = t.closest('.item'), name = p.find('.name').text(), id = p.attr('data-id');
    if(t.hasClass('active')){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=cancelFollow', 'id='+id, function(data){
        if(data.state == 100){
          t.removeClass('active').text('关注');
          showMsg.alert('已取消关注'+name, 1000);
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    }else{
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
        if(data.state == 100){
          t.addClass('active').text('已关注');
          showMsg.alert('已关注'+name, 1000);
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    }
  })

    
  $('.Matchmaker .cancel, .desk').click(function(){
    $('.Matchmaker, .desk').removeClass('show');
  })

  // 获取信息
  function getList(){
    if(isload) return false;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=memberList&page='+page+'&pageSize='+pageSize+'&lng='+lng+'&lat='+lat,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var html = [];
          var length = data.info.list.length;
          for(var i = 0; i < length; i++){
            var d = data.info.list[i];
            html.push('<li class="item fn-clear" data-id="'+d.id+'" data-company="'+d.company+'">');
            html.push('    <div class="img"><a href="'+d.url+'"><img src="'+d.photo+'" alt="">'+(d.my_video_state ? '<i class="user_video"></i>' : '')+'</a></div>');
            html.push('    <div class="info">');
            html.push('      <a href="'+d.url+'">');
            html.push('      <p class="base fn-clear">');
            html.push('        <span class="name">'+d.nickname+'</span>');
            if(d.level){
              html.push('        <em class="u_level"><img src="'+d.levelIcon+'" alt=""></em>');
            }
            if(d.phoneCheck){
              html.push('        <em class="phone"></em>');
            }
            html.push('        <span class="picnum">'+d.picNum+'</span>');
            html.push('      </p>');
            html.push('      <p class="more">');
            html.push('        <span class="age">'+d.age+'岁</span>');
            html.push('        <span class="height">'+d.heightName+'</span>');
            html.push('        <span class="distance">'+d.juli+'</span>');
            html.push('      </p>');
            html.push('      <p class="tag">');
            if(d.interests.length){
              for(var n = 0; n < d.interests.length; n++){
                html.push('        <span>'+d.interests[n]+'</span>');
              }
            }
            html.push('      </p>');
            html.push('      </a>');
            html.push('    </div>');
            html.push('  <div class="btns">');
            if(d.visit){
              html.push('    <a href="javascript:;" class="greet active">已打招呼</a>');
            }else{
              html.push('    <a href="javascript:;" class="greet">打招呼</a>');
            }
            if(d.follow){
              html.push('    <a href="javascript:;" class="follow active">已关注</a>');
            }else{
              html.push('    <a href="javascript:;" class="follow">关注</a>');
            }

            html.push('  </div>');
            html.push('</li>');
          }
          container.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage == page){
            tofoot.remove();
          }else{
            isload = false;
            tofoot.text('下拉加载更多').show();
          }
        }else{
          showMsg.alert('暂无相关会员！', 1000);
        }
      },
      error: function(){
        isload = false;
        showMsg.alert('网络错误，请重试！', 1000);
      }
    })
  }

})