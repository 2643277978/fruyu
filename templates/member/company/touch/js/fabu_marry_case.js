$(function () {
    //年月日
    $('.demo-test-date').scroller(
        $.extend({preset: 'date', dateFormat: 'yy-mm-dd'})
    );

    $('.fabu_btn .btn').click(function () {
        if(!$('#comname').val()){
            showErr(''+langData['marry'][4][16]+'');//请输入标题！
        }else if(!$('#card-time').val()){
            showErr(''+langData['marry'][4][17]+'');//请选择日期！
        }else if(!$('#hotel-name').val()){
            showErr(''+langData['marry'][4][18]+'');//请输入酒店名称！
        }else if($('.store-imgs .imgshow_box').length == 0){
            showErr(''+langData['marry'][4][8]+'');//请至少上传一张图片！
        }

    });

    //错误提示框
    var showErrTimer;
    function showErr(txt){
        showErrTimer && clearTimeout(showErrTimer);
        $(".popErr").remove();
        $("body").append('<div class="popErr"><p>'+txt+'</p></div>');
        $(".popErr").css({"visibility": "visible"});
        showErrTimer = setTimeout(function(){
            $(".popErr").fadeOut(300, function(){
                $(this).remove();
            });
        }, 1500);
    }

});