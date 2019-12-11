$(function(){

  //APP端取消下拉刷新
  toggleDragRefresh('off');

  // 表单提交
  $(".tjBtn").bind("click", function(event){

    event.preventDefault();

    var t           = $(this),
        name      = $("#name"),
        post      = $("#post");

    if(t.hasClass("disabled")) return;

    //名称
    if($.trim(name.val()) == ''){
        alert(langData['siteConfig'][27][49]);
        return;
    }

    //职位
    if($.trim(post.val()) == ''){
        alert(langData['siteConfig'][27][73]);
        return;
    }

    //photo
    var photo = "";
    $("#fileList1 li").each(function(i){
      if(i == 1){
        var x = $(this);
        photo = x.find('img').attr("data-val");
      }
    })
    $("#photo").val(photo);

    if(photo == ""){
      alert(langData['siteConfig'][27][125]);
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