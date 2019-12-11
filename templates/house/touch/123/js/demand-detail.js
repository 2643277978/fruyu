$(function() {

    //获取信息详细信息
    $.ajax({
        url: masterDomain + '/include/ajax.php?service=house&action=demandDetail&id=' + aid,
        dataType: "jsonp",
        success: function (data) {
            $('.editBtn').show();
            if(data && data.state == 100){
                var info = data.info;

                $('#title').val(info.title);
                $('#note').val(info.note);
                $('.facility[data-type=act]').find('li[data-id="'+info.action+'"]').addClass('on');
                $('.facility[data-type=type]').find('li[data-id="'+info.type+'"]').addClass('on');
                $('.facility[data-type=manage]').find('li:eq(0)').addClass('on');
                $('.gz-addr-seladdr').attr('data-ids', info.addrIds.join(' ')).attr('data-id', info.addrid).find('p').html(info.addrName.join(' '));
                $('#person').val(info.person);
                $('#contact').val(info.contact);
            }else{
                alert(data.info);
            }
        }
    });

    $('.editBtn').bind('click', function(){
        $('.popup-fabu .tit').html('修改求租求购信息<s></s>');
        $('#submit').html('提交修改');
        $('.popup-fabu .edit').show();
        $('.container').addClass('fn-hide');
        $('.gz-address').addClass('show');
        $('html').addClass('nos');
    });

    //关闭
    $('.popup-fabu').delegate('.tit s', 'click', function(){
        $('html').removeClass('nos');
        $('.container').removeClass('fn-hide');
        $('.gz-address').removeClass('show');
    });


    // 选择特色
    $('.facility li').click(function(){
        var t = $(this);
        if (!t.hasClass('on')) {
            $(this).addClass('on').siblings('li').removeClass('on');
        }
    })

    //提交
    $('#submit').bind('click', function(){
        var t = $(this);
        var ids = $('.gz-addr-seladdr').attr('data-ids');
        var idsArr = ids.split(' ');
        var title = $.trim($('#title').val()),
            note = $.trim($('#note').val()),
            act = $('.facility[data-type=act] .on').data('id'),
            type = $('.facility[data-type=type] .on').data('id'),
            manage = $('.facility[data-type=manage] .on').data('id'),
            cityid = idsArr[0],
            addr = idsArr[idsArr.length-1],
            person = $.trim($('#person').val()),
            contact = $.trim($('#contact').val()),
            password = $.trim($('#password').val());

        if(title == ''){
            alert('请输入标题！');
            return false;
        }

        if(note == ''){
            alert('请输入需求描述！');
            return false;
        }

        if(act == '' || act == 0 || act == undefined){
            alert('请选择类别！');
            return false;
        }

        if(type == '' || type == undefined){
            alert('请选择供求！');
            return false;
        }

        if(addr == '' || addr == 0){
            alert('请选择位置！');
            return false;
        }

        if(person == ''){
            alert('请输入联系人！');
            return false;
        }

        if(contact == ''){
            alert('请输入联系电话！');
            return false;
        }

        if(password == ''){
            alert('请输入管理密码！');
            return false;
        }

        t.attr('disabled', true);

        var action = aid ? 'edit' : 'put';

        //删除
        if(manage == '2'){
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=house&action=del&type=demand&password=' + password + '&id=' + aid,
                dataType: "jsonp",
                success: function (data) {
                    if(data && data.state == 100){
                        alert('删除成功！');
                        if(device.indexOf('huoniao') > -1) {
                            setupWebViewJavascriptBridge(function (bridge) {
                                bridge.callHandler("pageRefresh", {}, function (responseData) {
                                });
                            });
                        }else {
                            location.reload();
                        }
                    }else{
                        alert(data.info);
                        t.removeAttr('disabled');
                    }
                },
                error: function(){
                    alert(langData['siteConfig'][20][183]);
                    t.removeAttr('disabled');
                }
            });
            return false;
        }

        $.ajax({
            url: masterDomain + '/include/ajax.php?service=house&action='+action+'&type=demand',
            data: {
                'id': aid,
                'title': title,
                'note': note,
                'category': type,
                'lei': act,
                'cityid': cityid,
                'addrid': addr,
                'person': person,
                'contact': contact,
                'password': password
            },
            dataType: "jsonp",
            success: function (data) {
                if(data && data.state == 100){

                    var info = data.info.split('|');
                    if(info[1] == 1){
                        alert(aid ? '修改成功' : '发布成功！');
                    }else{
                        alert(aid ? '提交成功，请等待管理员审核！' : '发布成功，请等待管理员审核！');
                    }

                    if(device.indexOf('huoniao') > -1) {
                        setupWebViewJavascriptBridge(function (bridge) {
                            bridge.callHandler("pageRefresh", {}, function (responseData) {
                            });
                        });
                    }else {
                        location.reload();
                    }

                }else{
                    alert(data.info);
                    t.removeAttr('disabled');
                }
            },
            error: function(){
                alert(langData['siteConfig'][20][183]);
                t.removeAttr('disabled');
            }
        });

    });


})
