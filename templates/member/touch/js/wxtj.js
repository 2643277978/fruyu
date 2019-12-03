
$(function () {
    $.ajax({
        url:"/include/ajax.php?service=member&action=getWxShareData",
        type:"GET",
        dataType: "jsonp",
        success:function (data) {
            if(data.state == 100){
                var info =data.info;
                var today =info[0][0].totalTimes;
                var threeDay = info[0][1].totalTimes;
                var sevenDay = info[0][2].totalTimes;
               $(".today").html(today);
               $(".tDay").html(threeDay);
               $(".sDay").html(sevenDay);
               var all= parseInt(today) + parseInt(threeDay)+parseInt(sevenDay);
               $(".fksall").html(all);
              //数据概览
                var sl;
                function getlist(a,b,c) {
                    if(info[a]==undefined){
                        sl=0;
                        b.append(
                            "<th>"+sl+"</th>"
                            +"<th>"+sl+"</th>"
                            +"<th>"+sl+"</th>"
                            +"<th>"+sl+"</th>"
                        )
                    }else {
                        for (var i=0;i<4;i++) {
                            if (info[a][i]==undefined) {
                                sl = 0;
                            } else {
                                sl = info[a][i].totalTimes;
                            }
                            b.append(
                                "<th>"+sl+"</th>"
                            )
                        }

                    }
                }
                getlist(6,$("#shop"));
                getlist(7,$("#housing"));
                getlist(8,$("#article"));
                getlist(9,$("#poster"));
                getlist(10,$("#businessCard"));
                //分享总数
                function shareALll() {
                    var sp=$("#shop th:eq(1)").html();
                    var fy=$("#housing th:eq(1)").html();
                    var wz=$("#article th:eq(1)").html();
                    var  hb=$("#poster th:eq(1)").html();
                    var  mp=$("#businessCard th:eq(1)").html();
                    var shareAll=parseInt(sp)+parseInt(fy)+parseInt(hb)+parseInt(wz)+parseInt(mp);
                    $(".shareALll").html(shareAll);
                }
                shareALll();
                //浏览
                function zf() {
                    var sp=$("#shop th:eq(2)").html();
                    var fy=$("#housing th:eq(2)").html();
                    var wz=$("#article th:eq(2)").html();
                    var  hb=$("#poster th:eq(2)").html();
                    var  mp=$("#businessCard th:eq(2)").html();
                    var shareAll=parseInt(sp)+parseInt(fy)+parseInt(hb)+parseInt(wz)+parseInt(mp);
                    $(".ylALll").html(shareAll);
                }
                zf();
                //访客
                function ll() {
                    var  sp=$("#shop th:eq(3)").html();
                    var fy=$("#housing th:eq(3)").html();
                    var wz=$("#article th:eq(3)").html();
                    var  hb=$("#poster th:eq(3)").html();
                    var  mp=$("#businessCard th:eq(3)").html();
                    var shareAll=parseInt(sp)+parseInt(fy)+parseInt(hb)+parseInt(wz)+parseInt(mp);
                    $(".visitALll").html(shareAll);
                }
                ll();
                //转发
                function fk() {
                    var  sp=$("#shop th:eq(4)").html();
                    var fy=$("#housing th:eq(4)").html();
                    var wz=$("#article th:eq(4)").html();
                    var  hb=$("#poster th:eq(4)").html();
                    var  mp=$("#businessCard th:eq(4)").html();
                    var shareAll=parseInt(sp)+parseInt(fy)+parseInt(hb)+parseInt(wz)+parseInt(mp);
                    $(".reALll").html(shareAll);
                }
                fk();
                $(".inday").css("width",today+"%");
                $(".inthree").css("width",threeDay+"%");
                $(".inseven").css("width",sevenDay+"%");
            }else {
                alert("你还不是会员或已过期！请先开通会员");
                window.history.back(-1);
            }
        }
    });
})

