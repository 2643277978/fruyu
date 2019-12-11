$(function(){
  $("#submit").click(function(){
    $("#tj").submit();
  })
  $("#tj").submit(function(event){
    event.preventDefault();
    var t = $("#submit");
    if(t.hasClass("disabled")) return;
    t.addClass("disabled");
    var body = $("#body").val(), people = $("#people").val(), phone = $("#phone").val();
    var data = [];
    data.push("body="+encodeURIComponent(body));
    data.push("people="+encodeURIComponent(people));
    data.push("phone="+encodeURIComponent(phone));

    $.ajax({
      url: "/include/ajax.php?service=house&action=fabuFaq&"+data.join("&"),
      type: "POST",
      dataType: "json",
      success: function (data) {
        if(data.state == 100){
            alert('提交成功！');
            if(device.indexOf('huoniao') > -1) {
                setupWebViewJavascriptBridge(function (bridge) {
                    bridge.callHandler("pageRefresh", {}, function (responseData) {
                    });
                });
            }else {
                location.href = backUrl;
            }
        }else{
          t.removeClass("disabled");
          alert(data.info);
        }
      },
      error: function(){
        t.removeClass("disabled");
        alert('网络错误，提交失败！');
      }
    });

  })

})