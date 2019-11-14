$(function () {
    $('.tab-box .tab span').click(function () {
        $(this).toggleClass('active');
        var ids = [];
        $('.tab-box .tab span').each(function(){
            if($(this).hasClass('active')){
                ids.push($(this).data('id'));
            }
        })
        $('#tabbox').val(ids.join(","));
    });

    $('.fabu_btn .btn').click(function () {
        if(!$('#comname').val()){
            showErr(''+langData['marry'][4][16]+'');//请输入标题！
        }else if(!$('#price').val()){
            showErr(''+langData['marry'][4][14]+'');//请输入价格！
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