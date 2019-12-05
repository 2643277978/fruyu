$(function () {

    function getList() {
        $(".sllist ul").html('<li class="empty">正在获取，请稍后</li>');
        $(".pagination").html('').hide();
        var data = [];
        data.push('page='+atpage);
        data.push('pageSize='+pageSize);
        $.ajax({
            url:"http://test.fangruyu.net/include/ajax.php?service=member&action=getFreeHouseList",
            type: "GET",
            dataType: "jsonp",
            success:function (data) {
                if(data.state==100){
                    var list = data.info.list,
                        html = [],
                        pageInfo = data.info.pageInfo;
                       totalCount = pageInfo.totalCount;
                    var atpage = Math.ceil(totalCount / pageSize);
                }
            }
        })
    }
    getList();
});