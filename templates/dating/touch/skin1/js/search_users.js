$(function(){

  var container = $("#container"), page = 1, pageSize = 10, isload = false, tofoot = $('.tofoot');

  container.delegate(".btns", "click", function(){
    var b = $(this), id = b.closest("li").attr("data-id");
    if(b.hasClass('follow_no')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_no');
          b.addClass('follow_yes');
          b.text('已关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }else if(b.hasClass('follow_yes')){
      operaJson(masterDomain + '/include/ajax.php?service=dating&action=cancelFollow', 'type=2&id='+id, function(data){
        if(data && data.state == 100){
          b.removeClass('follow_yes');
          b.addClass('follow_no');
          b.text('关注');
        }else{
          showMsg.alert(data.info);
        }
      })
    }
  })

  function getList(){
    if(isload) return;
    isload = true;
    showMsg.loading();
    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=memberList&page='+page+'&pageSize='+pageSize,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        if(data && data.state == 100){
          var list = data.info.list, len = list.length;
          var html = [];
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<li class="fn-clear" data-id="'+d.id+'">');
            html.push('  <div class="fans_img"><a href="'+d.url+'"><img src="'+d.photo+'"></a></div>');
            html.push('  <div class="fans_txt">');
            html.push('    <p>'+d.nickname+'</p>');
            html.push('    <p>'+d.profile+'</p>');
            html.push('  </div>');
            if(d.follow && d.followby){
              html.push('  <span class="btns follow_all">互相关注</span>');
            }else if(d.follow){
              html.push('  <span class="btns follow_yes">已关注</span>');
            }else{
              html.push('  <span class="btns follow_no">关注</span>');
            }
            html.push('</li>');
          }
          container.append(html.join(""));
          showMsg.close();
          if(data.info.pageInfo.totalPage > page){
            tofoot.show();
            isload = false;
          }else{
            tofoot.text('已加载完全部数据').show();
          }
        }
      },
      error: function(){
        showMsg.alert('网络错误，请重试', 1000);
      }
    })
  }

  getList();

})