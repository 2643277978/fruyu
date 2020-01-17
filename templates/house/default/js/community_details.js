$(function(){

    //小区顾问
    var c_id=pageData.id;
    $.ajax({
        url:  "/include/ajax.php?service=house&action=getCommunityZjList&cid="+c_id,
        type: "get",
        dataType: "jsonp",
        success:function (data) {
            if(data.state==100){
                var html=[];
                var phone="电话：";
                var name="昵称：";
                html.push('<img src="'+data.info[0].photo+'"onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';" alt="">');
                html.push('<span class="jjrphone">'+phone+''+data.info[0].phone+'</span>');
                html.push('<span class="jjrname">'+name+''+data.info[0].nickname+'</span>');
                $(".jjr").html(html.join(""));
            }
            else {
                $(".jjr").html('<span>暂无顾问！</span>');
            }
        }
    });

    //大图切换
    $(".com_slide").slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: true,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {if (i == 0) {$(".sprev").click()} else if (i % 5 == 0) {$(".snext").click()}}});

    //小图左滚动切换
    $(".com_slide .thumb").slide({mainCell: "ul",delayTime: 300,vis: 5,scroll: 5,effect: "left",autoPage: true,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});


    function getZjuser(page){
        $('.morelist ul').attr({'data-page': page, 'data-load': 'true'});
        $('.morelist .more').text('正在获取更多').show();
        $.ajax({
            url: masterDomain + '/include/ajax.php?service=house&action=communityZjUser&id='+pageData.id+'&page='+page+'&pageSize=5',
            dataType: 'jsonp',
            success: function(data){
                if(data && data.state == 100 && data.info.length){
                    var html = [];
                    for(var i = 0; i < data.info.length; i++){
                        var d = data.info[i];

                        html.push('<li class="fn-clear">');
                        html.push('	<div class="topbox">');
                        html.push('		<div class="l">');
                        html.push('			<a href="javascript:;"><img src="'+d.photo+'" alt=""></a>');
                        html.push('		</div>');
                        html.push('		<div class="r">');
                        html.push('			<h4><a href="javascript:;">'+d.nickname+'</a></h4>');
                        html.push('			<span class="tip">'+d.zjcom+'</span>');
                        html.push('		</div>');
                        html.push('	</div>');
                        html.push('	');
                        html.push('	<div class="telbox">');
                        html.push('		<a href="javascript:;"><i></i> 获取电话</a>');
                        html.push('		<div class="tel-down">');
                        html.push('			<p><b>'+d.phone+'</b></p>');
                        html.push('		</div>');
                        html.push('	</div>');
                        html.push('</li>');
                    }
                    $('.morelist').removeClass('init');
                    $('.morelist ul').append(html.join(""));
                    $('.morelist .more').hide();
                    $('.morelist ul').attr({'data-load': 'false'});
                }else{
                    if(page == 1){
                        $('.morelist .more').text('暂无经纪人');
                    }else{
                        $('.morelist .more').text('没有更多了');
                    }
                }
            }
        })
    }
    $('.morelist ul').scroll(function(){
        var t = $(this), sct = t.scrollTop(), last = t.children('li:last-child');
        var page = t.attr('data-page'), load = t.attr('data-load');
        page = page == undefined ? 1 : parseInt(page);
        if(load != 'true' && last.position().top < $('.morelist ul').height()){
            page++;
            getZjuser(page);
        }
    })

    $('.listmore a').click(function(){
        var t = $(this), page = $('.morelist ul').data('page');
        if(page == undefined){
            getZjuser(1);
        }
        $('.morelist').show();
        $('.mask').show();
    });

    $('.morelist .bt_close,.mask').click(function(){
        $('.morelist').hide();
        $('.mask').hide();
    });


    $(".btnJb").bind("click", function(){
        var domainUrl = masterDomain;
        $.dialog({
            fixed: false,
            title: "房源举报",
            content: 'url:'+domainUrl+'/complain-house-sale-'+pageData.id+'.html',
            width: 460,
            height: 300
        });
    });
    //价格走势

    let chushou=data.出售;
    let sale=data.出租;
    let sq=data.商圈出租;
    //出售
    var arr = [];
    for (let i in chushou) {
        // var o = {};
        // o[i] = chushou[i];
        // arr.push(o)
        arr.push(chushou[i]);
    }
    let name=[];
    for (let i in chushou) {
        var o = {};
        var t={i};
        o[i] = chushou[i];
        name.push(t)

    }
    //出租
    var arr2 = [];
    for (let i in sale) {
        // var o = {};
        // o[i] = chushou[i];
        // arr.push(o)
        arr2.push(sale[i]);
    }
    let name2=[];
    for (let i in sale) {
        var o = {};
        var t={i};
        o[i] = sale[i];
        name2.push(t);
    }
    //商圈出租
    var arr1 = [];
    for (let i in sq) {
        // var o = {};
        // o[i] = chushou[i];
        // arr.push(o)
        arr1.push(sq[i]);
    }
    let name1=[];
    for (let i in sq) {
        var o = {};
        var t={i};
        o[i] = sq[i];
        name1.push(t);
    }

    function datasta(bdata,a){
        let aData=[];
        var obj = eval(a);
        for(var i=0;i<obj.length;i++){
            aData.push(obj[i][1]);
        }
        bdata=aData;
        return bdata;
    }
    let rData;
    $(document).ready(function(){
        //价格走势
        var ctx = document.getElementById('myChart').getContext('2d');
        var ctx1 = document.getElementById('saleChart').getContext('2d');
        var ctx2 = document.getElementById('sqChart').getContext('2d');
        function tubiao(a,rName,rData,tName,tData,sName,sData,fName,fData) {
            var myChart = new Chart(a, {
                type: 'line',
                data: {
                    labels: ['1月', '2月', '3月', '4月', '5月', '6月','7月','8月','9月','10月','11月','12月'],
                    datasets: [
                        {
                            label: rName,
                            data: rData,
                            borderColor:'blue',
                            backgroundColor:'skyBlue',
                            borderWidth: 1,
                            fill: false,
                            scaleLabel : "<%=value/100000000%>元",
                        },
                        {
                            label: tName,
                            data: tData,
                            borderColor:'red',
                            backgroundColor:'pink',
                            borderWidth: 1,
                            fill: false,
                        },
                        {
                            label: sName,
                            data: sData,
                            borderColor:'green',
                            backgroundColor:'green',
                            borderWidth: 1,
                            fill: false,
                        },
                        {
                            label: fName,
                            data: fData,
                            borderColor: "orange",
                            backgroundColor: "grey",
                            borderWidth: 1,
                            fill: false,
                        },
                    ]
                },
                option:{
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                }

            });
        }
        tubiao(ctx,name[0].i,datasta(rData,arr[0]),name[1].i,datasta(rData,arr[1]),name[2].i,datasta(rData,arr[2]),name[3].i,datasta(rData,arr[3]));
        tubiao(ctx1,name1[0].i,datasta(rData,arr1[0]),name1[1].i,datasta(rData,arr1[1]),name1[2].i,datasta(rData,arr1[2]),name1[3].i,datasta(rData,arr1[3]));
        tubiao(ctx2,name2[0].i,datasta(rData,arr2[0]),name2[1].i,datasta(rData,arr2[1]),name2[2].i,datasta(rData,arr2[2]),name2[3].i,datasta(rData,arr2[3]));
    });
})