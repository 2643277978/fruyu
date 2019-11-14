$(function () {
    $('.fabu_btn .btn').click(function () {
        if(!$('#comname').val()){
            showErr(''+langData['marry'][4][30]+'');//请输入名称！
        }else if(!$('#price').val()){
            showErr(''+langData['marry'][4][14]+'');//请输入价格！
        }else if(!$('#long').val() || !$('#time').val()){
            showErr(''+langData['marry'][4][31]+'');//请输入时长！
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