$(function () {

    //有无立柱切换
    $('.user_column .active').bind('click',function(){
        $(this).addClass('chose_btn').siblings('.active').removeClass('chose_btn');
        $('#column').val($(this).find('a').data('id'));
    });

    //场地形状选择
    $('.user_shape .active').bind('click',function(){
        $(this).addClass('chose_btn').siblings('.active').removeClass('chose_btn');
        $('#shape').val($(this).find('a').data('id'));
    });

    // 表单验证

    $('.fabu_btn .btn').click(function () {
        console.log(0);
        if(!$('#comname').val()){
            showErr(''+langData['marry'][4][9]+'');//请输入公司名称！
        }else if(!$('#roumun').val()){
            showErr(''+langData['marry'][4][19]+'');//请输入容纳桌数！
        }else if(!$('#beatnum').val()){
            showErr(''+langData['marry'][4][20]+'');//请输入最佳桌数！
        }else if(!$('#hegh').val()){
            showErr(''+langData['marry'][4][21]+'');//请输入层高！
        }else if(!$('#area').val()){
            showErr(''+langData['marry'][4][22]+'');//请输入面积！
        }else if(!$('#column').val()){
            showErr(''+langData['marry'][4][23]+'');//请选择有无立柱！
        }else if(!$('#shape').val()){
            showErr(''+langData['marry'][4][24]+'');//请选择场地形状！
        } else if($('.store-imgs .imgshow_box').length == 0){
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