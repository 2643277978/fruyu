$(function(){

  var container = $('#container'), tofoot = $('.tofoot'), lng = lat = 0, page = 1, pageSize = 10, isload = false;

  // 幻灯片
  new Swiper('.swiper-container-banner', {pagination: '.pagination', slideClass: 'slideshow-item', paginationClickable: true, loop: true, autoplay:2000, autoplayDisableOnInteraction : false});

  var chooseSct = $('.choose').offset().top;
  $(window).scroll(function(){
    var sct = $(window).scrollTop();
    if(sct >= chooseSct){
      $(".choose-ul").addClass("fixed").css({"top":sct});
    }else{
      $(".choose-ul").removeClass("fixed").css({"top":0});
    }
    if(isload) return;
    if(sct + $(window).height() >= $('.tofoot').offset().top){
      page++;
      getList();
    }
  })

  function addDesk(){
    var li = $(".tp.open"), box = li.children('.choose-box'), top = li.offset().top - $(window).scrollTop(), winh = $(window).height();
    var h1 = parseInt(li.height()), h2 = parseInt(box.height());
    var jtop = top + h1 + h2, jbtm = winh - top - h1 - h2;
    var html = '<div class="js_desk" style="position:fixed;top:'+jtop+'px;left:0;right:0;bottom:0;background:transparent;z-index:10000;"></div>';
    $('body').append(html);
  }

  $("body").delegate(".js_desk", "click", function(){
    $(".js_desk").remove();
    $("html").removeClass("md_fixed");
    $(".tp.open").removeClass("open");
  })

  // 点击筛选按钮
  $(".choose-ul .tit").click(function(){
    var t = $(this), li = t.parent();
    if(li.hasClass("open")){
      li.removeClass("open");
      $('html').removeClass('md_fixed');
    }else{
      $(window).scrollTop(chooseSct);
      li.toggleClass('open').siblings().removeClass('open');
      $('html').addClass('md_fixed');
      addDesk();
    }
  })
  // 关闭筛选条件
  $(".choose-ul .choose-box-btn a").click(function(){
    var t = $(this);
    t.closest(".tp").removeClass("open");
    if(t.hasClass("confirm")){
      isload = false;
      getList(1);
    }else{
      $(".js_desk").remove();
      $('html').removeClass('md_fixed');
    }
  })

  // 会员选项
  $('.dom_kj').click(function(){
    if($(this).hasClass('lock')){
      showMsg.confirm('您还不是会员，请充值会员', {
        btn: {
          ok: '<a href="'+buyMemberUrl+'" class="ok">充值</a>'
        },
        ok: function(){

        }
      })
    }
  })

  // 排序
  $(".choose-ul .choose-box li").click(function(){
    var t = $(this), index = t.index(), text = t.text();
    t.closest(".tp").removeClass("open").children('.tit').html(text+'<em</em>');
    t.addClass('active').siblings().removeClass('active');
    $("#orderby").val(index);
    isload = false;
    getList(1);
  })

  // 居住地
  // var mobileSelect_area = new MobileSelect({
  //   trigger: '#area_select',
  //   title: '居住地选择',
  //   wheels: [
  //       {data : area_data}
  //   ],
  //   keyMap: {
  //     id: 'id',
  //     value: 'name'
  //   },
  //   skin: 'skin_fix_option',
  //   transitionEnd:function(indexArr, data){
  //   },
  //   optionClick: function (theLi, index, sliderIndex) {
  //     $(theLi).addClass("active").siblings().removeClass("active");
  //   },
  //   callback:function(indexArr, data){
  //   }
  // });

  // 年龄
  var mobileSelect_age = new MobileSelect({
    trigger: '#age_select',
    title: '年龄',
    connector: '-',
    name: '岁',
    wheels: [
        {data : returnAge([], 1)},
        {data : returnAge([], 1)},
    ],
    transitionEnd:function(indexArr, data){
        if(indexArr[0] >= indexArr[1]){
          this.locatePostion(1, indexArr[0] + 1);
        }
    },
    callback:function(indexArr, data){
    }
  });

  // 身高
  var mobileSelect_height = new MobileSelect({
    trigger: '#height_select',
    title: '身高',
    connector: '-',
    name: '厘米',
    wheels: [
        {data : returnHeight([], 1)},
        {data : returnHeight([], 1)}
    ],
    transitionEnd:function(indexArr, data){
        if(indexArr[0] >= indexArr[1]){
          this.locatePostion(1, indexArr[0] + 1);
        }
    },
    callback:function(indexArr, data){
    }
  });

  // 婚姻
  var mobileSelect_marriage = new MobileSelect({
    trigger: '#marriage_select',
    title: '婚姻',
    connector: '-',
    name: '',
    skin: 'skin_fix_option',
    wheels: [
        {data : marriage_data},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    transitionEnd:function(indexArr, data){
        
    },
    optionClick: function (theLi, index, sliderIndex) {
      $(theLi).addClass("active").siblings().removeClass("active");
    },
    callback:function(indexArr, data){
    }
  });

  // 学历
  var mobileSelect_edu = new MobileSelect({
    trigger: '#edu_select',
    title: '学历',
    connector: '-',
    name: '',
    skin: 'skin_fix_option',
    wheels: [
        {data : edu_data},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    transitionEnd:function(indexArr, data){
        
    },
    optionClick: function (theLi, index, sliderIndex) {
      $(theLi).addClass("active").siblings().removeClass("active");
    },
    callback:function(indexArr, data){
    }
  });

  // 收入
  var mobileSelect_money = new MobileSelect({
    trigger: '#money_select',
    title: '收入',
    connector: '-',
    name: '',
    skin: 'skin_fix_option',
    wheels: [
        {data : money_data},
    ],
    keyMap: {
      id: 'id',
      value: 'typename',
    },
    transitionEnd:function(indexArr, data){
        
    },
    optionClick: function (theLi, index, sliderIndex) {
      $(theLi).addClass("active").siblings().removeClass("active");
    },
    callback:function(indexArr, data){
    }
  });

  // 高级筛选
  if(uLevel){
    $(".gz-addr-seladdr").removeClass("disabled");
    // 通过select关联数据
    $('.dom_kj.lock').each(function(){
      var t = $(this), id = t.attr('id'), sel = t.siblings('.dom_kj_data'), title = t.siblings('label').text(), select = t.attr("data-select") || '';
      sel.attr("disabled", true);
      if(sel.length > 0){
        var data = [];
        sel.children('option').each(function(i){
          var o = $(this);
          data.push({
            id: o.attr('value'),
            value: o.text()
          })
          if(select != ''){
            if(o.attr("data-id") == select){
              select == i;
            }
          }else{
            select = 0;
          }
        })

        new MobileSelect({
          trigger: '#'+id,
          title: title,
          position: [select],
          wheels: [
              {data : data},
          ]
        })
        
      }
    }).removeClass('lock');
  }

  showMsg.loading();

  function checkLocal(){
    var local = false;
    var localData = utils.getStorage("user_local");
    if(localData){
      var time = Date.parse(new Date());
      time_ = localData.time;
      // 缓存1小时
      if(time - time_ > 3600 * 1000){
        lat = localData.lat;
        lng = localData.lng;
        local = true;
      }

    }

    if(!local){
      HN_Location.init(function(data){
        if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
          lng = lat = -1;
          getList();
        }else{
          lng = data.lng;
          lat = data.lat;

          getList();

          var time = Date.parse(new Date());
          utils.setStorage('user_local', JSON.stringify({'time': time, 'lng': lng, 'lat': lat, 'address': data.address}));

        }
      })
    }else{
      getList();
    }
    
  }
  checkLocal();

  // 关注
  container.delegate(".like", "click", function(){
    var t = $(this), id = t.closest('.item').attr('data-id'), count = parseInt(t.text());
    if(t.hasClass('active')){
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=cancelFollow', 'id='+id, function(data){
        if(data.state == 100){
          t.removeClass('active').text(--count);
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    }else{
      operaJson(masterDomain+'/include/ajax.php?service=dating&action=visitOper', 'type=2&id='+id, function(data){
        if(data.state == 100){
          t.addClass('active').text(++count);
        }else{
          showMsg.alert('操作失败', 1000);
        }
      })
    }
  })

    // 获取信息
  function getList(tr){
    
    $(".desk").removeClass("show");
    if(isload) return;

    if(tr){
      container.html("");
      page = 1;
    }
    isload = true;
    showMsg.loading();

    if(lng != -1 && $("#lng").val() == ''){
      $("#lng").val(lng);
      $("#lat").val(lat);
    }

    var data = $("#searchFrom").serialize();

    $.ajax({
      url: masterDomain + '/include/ajax.php?service=dating&action=memberList&page='+page+'&pageSize='+pageSize+'&'+data,
      type: 'get',
      dataType: 'jsonp',
      success: function(data){
        $('html').removeClass('md_fixed');
        if(data && data.state == 100){
          var html = [], list = data.info.list, len = list.length;
          for(var i = 0; i < len; i++){
            var d = list[i];
            html.push('<div class="item" data-id="'+d.id+'">');
            html.push('  <div class="like'+(d.follow ? ' active' : '')+'">'+d.like+'</div>');
            html.push('  <a href="'+d.url+'">');
            html.push('    <div class="img"><img src="'+d.photo+'" alt=""></div>');
            html.push('    <div class="info">');
            html.push('      <h3 class="name">'+d.nickname);
            if(d.level > 1){
              html.push('      <span class="u_level"><img src="'+d.levelIcon+'" alt=""></span>');
            }
            if(d.phoneCheck){
              html.push('      <span class="phone"></span>');
            }
            html.push('      </h3>');
            html.push('      <p>'+(d.age ? ('<span class="age">'+ d.age + '岁</span>') : '')+(d.height != 0 ? ('<span class="height">' + d.heightName + '</span>') : '')+'<span class="distance">'+d.juli+'</span></p>');
            html.push('    </div>');
            html.push('  </a>');
            html.push('</div>');
          }
          container.append(html.join("")).show();
          showMsg.close();
          
          if(data.info.pageInfo.totalPage > page){
            tofoot.show();
            isload = false;
          }
        }else{
          showMsg.alert('非常抱歉，没有找到你要求的结果', 1000);
        }
      },
      error: function(){
        $('html').removeClass('md_fixed');
        showMsg.alert('网络错误，请重试', 1000);
        isload = false;
      }
    })
  }

})

// 返回年龄
function returnAge(arr, level, min, max){
  var min = min ? min : 18;
  var max = max ? max : 99;
  for(var i = min; i <= max; i++){
    var d = {
      id: i,
      value: i,
    }
    if(!level){
      d.childs = returnAge([], 1, i+1);
    }
    arr.push(d);
  }
  return arr;
}
// 返回身高
function returnHeight(arr, level, min, max){
  var min = min ? min : 140;
  var max = max ? max : 260;
  for(var i = min; i <= max; i++){
    var d = {
      id: i,
      value: i + '厘米',
    }
    if(!level){
      d.childs = returnHeight([], 1, i+1);
    }
    arr.push(d);
  }
  return arr;
}