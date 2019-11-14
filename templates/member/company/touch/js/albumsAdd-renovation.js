$(function(){
  
  //APP端取消下拉刷新
  toggleDragRefresh('off');

  //发布商品选择品牌
  $('.demo-select-opt').scroller(
    $.extend({
      preset: 'select',
      // group: true
    })
  );

  $("#typeObj span").bind("click", function(){
    var t = $(this), id = t.data("id");
    $("#type0, #type1").hide();
    t.addClass('curr').siblings().removeClass('curr');
    $("#type"+id).show();
    $("#type").val(id);
  });

  $('.radio span').click(function(){
    var t = $(this), id = t.data("id");
    t.addClass('curr').siblings('span').removeClass('curr').siblings("input").val(id);
  })

  // 表单提交
  $(".tjBtn").bind("click", function(event){

    event.preventDefault();

    var t        = $(this),
        designer = $("#designer"),
        title    = $("#title");

    if(t.hasClass("disabled")) return;

    //设计师
    if($.trim(designer.val()) == '' || designer.val() == 0){
        alert(langData['siteConfig'][27][0]);
        return;
    }

    //名称
    if($.trim(title.val()) == ''){
        alert(langData['siteConfig'][27][1]);
        return;
    }

    //photo
    var litpic = "", imglist = [];
    $("#fileList1 li").each(function(i){
      var x = $(this), val = x.find('img').attr("data-val");
      if(i == 1){
        litpic = val;
      }else if(i > 0){
        imglist.push(val);
      }
    })
    $("#litpic").val(litpic);
    $("#imglist").val(imglist.join(','));

    if(litpic == ""){
      alert(langData['siteConfig'][27][78]);
      return;
    }
    if(imglist.length == 0){
      alert('最少上传两张图片！');
      return;
    }

    var form = $("#fabuForm"), action = form.attr("action");

    $.ajax({  
      url: action,
      data: form.serialize(),
      type: "POST",
      dataType: "json",
      success: function (data) {
        if(data && data.state == 100){
          alert(langData['siteConfig'][6][39])
          location.href = form.attr('data-url');
        }else{
          alert(data.info)
        }
      },
      error: function(){
        alert(langData['siteConfig'][20][183]);
      }
    });


  });

  $('#fabuForm').submit(function(e){
    e.preventDefault();
    $(".tjBtn").click();
  })
})