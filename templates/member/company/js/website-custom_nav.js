$(function(){

    //新增
    var i = 0;
    $('.add').bind('click', function(){
        $('.container tbody').append('<tr data-id="0">\n' +
            '                    <td class="fir"></td>\n' +
            '                    <td>\n' +
            '                        <img class="img" style="height: 40px;">\n' +
            '                        <a href="javascript:;" class="upfile" title="删除">上传图标</a>\n' +
            '                        <input type="file" name="Filedata" class="imglist-hidden Filedata fn-hide" id="Filedata_cus_add_'+i+'">\n' +
            '                        <input type="hidden" class="icon" value="">\n' +
            '                    </td>\n' +
            '                    <td><input type="text" class="tit" value="" placeholder="请输入导航名"></td>\n' +
            '                    <td><input type="text" class="link" value="" placeholder="请输入网址，以http:// 或 https://开头"></td>\n' +
            '                    <td><a href="javascript:;" class="link del">删除</a></td>\n' +
            '                </tr>');
        i++;
    });

    //删除
    $('.container').delegate('.del', 'click', function(){
        var t = $(this);
        $.dialog.confirm('确定要删除吗？', function(){
            t.closest('tr').attr('data-del', 1).hide();
        })
    });

    //保存
    $('#submit').bind('click', function(){
        var t = $(this);

        var data = [];
        var tj  = true;
        $('.container tbody tr').each(function(){
            var t = $(this), icon = t.find('img').attr('data-url'), title = t.find('.tit').val(), url = t.find('.link').val(), id = t.attr("data-id"), del = t.attr("data-del") ? 1 : 0;

            if(icon == ''){
                $.dialog.alert('请上传图片');
                tj = false;
                return false;
            }else if(title == ''){
                $.dialog.alert('请填写标题');
                tj = false;
                return false;
            }else if(url == ''){
                $.dialog.alert('请填写url');
                tj = false;
                return false;
            }else{
                var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
                var objExp = new RegExp(reg);
                if (objExp.test(url) != true) {
                    $.dialog.alert('请填写正确的url');
                    tj = false;
                    return false;
                }
            }

            data.push(id+','+icon+','+title+','+url+','+del);
        });
        if(!tj) return false;

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=website&action=manageTouchNavBatch&custom_nav='+data.join('|'),
            type: 'get',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100) {
                    $.dialog({
                        title: '保存成功',
                        icon: 'success.png',
                        content: '保存成功！',
                        ok: function(){
                            location.reload();
                        }
                    });
                }else{
                    $.dialog.alert(data.info);
                    t.removeAttr('disabled').html('重新保存');
                }
            },
            error: function(){
                $.dialog.alert('网络错误，请重试');
                t.removeAttr('disabled').html('重新保存');
            }
        })

    });

    //上传单张图片
    function mysub(id){
        var t = $("#"+id), p = t.parent(), img = t.parent().children(".img"), uploadHolder = t.siblings('.upfile');

        var data = [];
        data['mod'] = 'siteConfig';
        data['filetype'] = 'image';
        data['type'] = 'logo';

        $.ajaxFileUpload({
            url: "/include/upload.inc.php",
            fileElementId: id,
            dataType: "json",
            data: data,
            success: function(m, l) {
                if (m.state == "SUCCESS") {
                    if(img.length > 0){
                        img.attr('src', m.turl);
                        img.attr('data-url', m.url);

                        delAtlasPic(p.find(".icon").val());
                    }else{
                        p.prepend('<img src="'+m.turl+'" data-url="'+m.url+'" alt="" class="img" style="height:40px;">');
                    }
                    p.find(".icon").val(m.url);

                    uploadHolder.removeClass('disabled').text('重新上传');
                    // saveOpera(1);

                } else {
                    uploadError(m.state, id, uploadHolder);
                }
            },
            error: function() {
                uploadError("网络错误，请重试！", id, uploadHolder);
            }
        });

    }

    function uploadError(info, id, uploadHolder){
        $.dialog.alert(info);
        uploadHolder.removeClass('disabled').text('重新上传');
    }

    //删除已上传图片
    var delAtlasPic = function(picpath){
        var g = {
            mod: "siteConfig",
            type: "delLogo",
            picpath: picpath,
            randoms: Math.random()
        };
        $.ajax({
            type: "POST",
            url: "/include/upload.inc.php",
            data: $.param(g)
        })
    };

    $(".container").delegate(".upfile", "click", function(){
        var t = $(this), inp = t.siblings("input");
        if(t.hasClass("disabled")) return;
        inp.click();
    })

    $(".container").delegate(".Filedata", "change", function(){
        if ($(this).val() == '') return;
        $(this).siblings('.upfile').addClass('disabled').text('正在上传···');
        mysub($(this).attr("id"));
    })

})