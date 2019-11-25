
console.log("a");
    $.ajax({
        url:"include/ajax.php?service=member&action=getWxShareData",
        type:"GET",
        dataType: "jsonp",
        success:function (data) {
            if(data.state == 100){
                var todaySj=data.info.visitorsInDay;
                console.log(todaySj);
            }
        }
    })

