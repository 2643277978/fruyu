$(function () {

    // 信息提示框

    $('.maskbg .msg-box .btn-close').click(function () {
        $('.maskbg').hide();
    });
    //表单验证
    function isPhoneNo(p) {
        var pattern = /^1[3456789]\d{9}$/;
        return pattern.test(p);
    }
    $('#submit').on('click',function (e) {
        var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			window.location.href = masterDomain+'/login.html';
			return false;
        }
        e.preventDefault();
        var t = $("#fabuForm"), action = t.attr('data-action');
        t.attr('action', action);
        
        var comname = $('#comname').val();
        var addressdetail = $('#add-detail').val();
        var phone = $('#phone').val();
        var addrid = 0, cityid = 0, r = true;

        if(!comname){
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][4][14]+'');
        }else if(!addressdetail){
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][4][15]+'');
        }else if(!phone){
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][4][16]+'');
        }else if (isPhoneNo($.trim($('#phone').val())) == false) {
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][4][17]+'');
        }else if($('.up dt .pic').length == 0){
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][4][18]+'');
        }

        var ids = $('.gz-addr-seladdr').attr("data-ids");
        if(ids != undefined && ids != ''){
            addrid = $('.gz-addr-seladdr').attr("data-id");
            ids = ids.split(' ');
            cityid = ids[0];
        }else{
            r = false;
            $('.maskbg').show();
            $('.maskbg .msg-box .msg').html(''+langData['car'][6][48]+'');
        }
        $('#addrid').val(addrid);
        $('#cityid').val(cityid);

        if(!r){
            return;
        }

        $.ajax({
			url: action,
			data: t.serialize(),
			type: 'post',
			dataType: 'json',
			success: function(data){
				if(data && data.state == 100){
                    location.href = gourl;
				}else{
                    $('.maskbg').show();
                    $('.maskbg .msg-box .msg').html(data.info);
				}
			},
			error: function(){
                $('.maskbg').show();
                $('.maskbg .msg-box .msg').html(''+langData['siteConfig'][6][203]+'');
			}
		})


    });
});