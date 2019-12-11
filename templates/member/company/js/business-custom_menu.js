$(function(){

    //删除
    $('.container').delegate('.del', 'click', function(){
        var t = $(this), id = t.closest('.item').data('id');
        $.dialog.confirm('确定要删除吗？', function(){
            $.ajax({
                url: masterDomain + '/include/ajax.php?service=business&action=updateStoreCustomMenu&del=1&id='+id,
                type: 'get',
                dataType: 'jsonp',
                success: function(data){
                    if(data && data.state == 100) {
                        location.reload();
                    }else{
                        $.dialog.alert(data.info);
                    }
                },
                error: function(){
                    $.dialog.alert('网络错误，请重试');
                }
            })
        })
    });

})