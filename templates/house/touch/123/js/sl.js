// $.ajax({
//     url: "/include/ajax.php?service=house&action="+action,
//     data: data.join("&"),
//     type: "GET",
//     dataType: "jsonp",
//     success: function (data) {
//         $('.choose-box').removeClass('choose-top');
//         if(data){
//             if(data.state == 100){
//                 $(".house-list .loading").remove();
//                 var list = data.info.list, html = [];
//                 if(list.length > 0){
//                     for(var i = 0; i < list.length; i++){
//                         var addrlength = list[i].addr.length;
//                         var pic = list[i].litpic == false || list[i].litpic == '' ? '/static/images/blank.gif' : huoniao.changeFileSize(list[i].litpic, "small");
//
//                         html.push('<div class="house-box">');
//                         html.push('<a href="javascript:;" data-url="'+list[i].url+'">');
//                         html.push('<div class="house-item">');
//                         // html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'"><i class="play_img"></i><i class="VR_img"></i></div>');
//                         var video = list[i].video==1 ? '<i class="play_img"></i>' : '';
//                         var vr    = list[i].qj==1 ? '<i class="VR_img"></i>' : '';
//                         var typestate = list[i].usertype==1 ? '' : '<em class="geren">个人</em>';
//                         html.push('<div class="house-img l"><i class="house_disk"></i><img src="'+pic+'">'+video+vr+typestate+'</div>');
//                         html.push('<dl class="l">');
//                         var top = list[i].isbid==1 ? '<i class="set_top"></i>' : '';
//                         html.push('<dt>'+top+'<em class="sp_title">'+list[i].title+'</em></dt>');
//
//                         html.push('<dd class="item-area sp_item-area">');
//
//                         html.push('<em>'+list[i].area+'㎡|'+list[i].loupan+'|'+list[i].zhuangxiu+'</em>');
//
//                         //价格
//                         html.push('<span class="price r">');
//                         if(list[i].price != 0){
//                             var ptype = echoCurrency('short')+"/月";
//                             if(list[i].type == 1){
//                                 ptype = "万";
//                             }
//                             html.push('<strong>'+list[i].price+'</strong><span class="price_unit">'+ptype+'</span>');
//                         }else{
//                             html.push('<span>待定</span>');
//                         }
//                         html.push('</span>');
//
//                         html.push('</dd>');
//
//                         var elevatortxt = '';
//                         if(list[i].type==1){
//                             if(list[i].price>0){
//                                 elevatortxt = (list[i].price / list[i].area).toFixed(0) + '万/m²';
//                             }
//                         }else if(list[i].type==2){
//                             if(list[i].transfer>0){
//                                 elevatortxt = '转让费： ' + parseInt(list[i].transfer).toFixed(0) + '万';
//                             }
//                         }else if(list[i].type==0){
//                             if(list[i].price>0){
//                                 elevatortxt = (list[i].price / list[i].area).toFixed(0) + '元/m²•月';
//                             }
//                         }
//
//                         html.push('<dd class="item-type-1 sp-item-type-1 fn-clear"><em>'+list[i].address+'</em><em class="r">'+elevatortxt+'</em></dd>');
//                         html.push('</dl>')
//                         html.push('</div>')
//                         html.push('<div class="clear"></div>')
//                         html.push('</a>')
//                         html.push('</div>')
//                     }
//
//                     $(".house-list").append(html.join(""));
//                     isload = false;
//
//                     //最后一页
//                     if(atpage >= data.info.pageInfo.totalPage){
//                         isload = true;
//                         $(".house-list").append('<div class="loading">已经到最后一页了</div>');
//                     }
//
//                     //没有数据
//                 }else{
//                     isload = true;
//                     $(".house-list").append('<div class="loading">暂无相关信息</div>');
//                 }
//
//                 //请求失败
//             }else{
//                 $(".house-list .loading").html(data.info);
//             }
//
//             //加载失败
//         }else{
//             $(".house-list .loading").html('加载失败');
//         }
//     },
//     error: function(){
//         isload = false;
//         $(".house-list .loading").html('网络错误，加载失败！');
//         $('.choose-box').removeClass('choose-top');
//     }
// });
$(document).ready(function(){
    // 改为鼠标移上的事件只需把click改为mousemove
    $(".sl").click(function(){
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });
});