$(function () {
    $('.add-box .btn_add').click(function () {
        var menuname =$('#menu-name').val();
        if(!menuname){
            showErr(''+langData['marry'][4][27]+'');//菜名不能为空！
        }else {
            var list = `
             <li class="fn-clear">
                <input type="text" placeholder="" value="`+menuname+`">
                <i class="btn-del"></i>
            </li>
            `;
            $('.info').append(list);
            $('#menu-name').val('');
        }
    });

    $('.info').delegate('.btn-del','click',function () {
        $(this).parent().remove();
    });



    $('.container .fabu_btn .btn').click(function () {
        if(!$('#comname').val()){
            showErr(''+langData['marry'][4][28]+'');//请输入套菜名称！
        }else if($('.info li').length <= 1){
            showErr(''+langData['marry'][4][29]+'');//请至少上传一道菜名！
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