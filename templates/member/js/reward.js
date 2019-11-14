/**
 * 会员中心交易明细
 * by guozi at: 20151109
 */

var objId = $("#list");
$(function(){
	getList(1);
});

function getList(is){

	if(is != 1){
		$('html, body').animate({scrollTop: $(".record").offset().top}, 300);
	}

	objId.html('<tr><td colspan="4"><p class="loading"><img src="'+staticPath+'images/ajax-loader.gif" />'+langData['siteConfig'][20][184]+'...</p></td></tr>');//加载中，请稍候

	$.ajax({
		url: masterDomain+"/include/ajax.php?service=member&action=reward&page="+atpage+"&pageSize="+pageSize,
		type: "GET",
		dataType: "jsonp",
		success: function (data) {
			if(data && data.state != 200){
				if(data.state == 101){
					objId.html("<tr><td colspan='4'><p class='loading'>"+langData['siteConfig'][20][126]+"</p></td></tr>");  //暂无相关信息！
				}else{
					var list = data.info.list, pageInfo = data.info.pageInfo, html = [];

					//拼接列表
					if(list.length > 0){
						for(var i = 0; i < list.length; i++){
							var item   = [],
									title  = list[i].title,
									url    = list[i].url,
									user   = list[i].user,
									amount = list[i].amount,
									date   = list[i].date;

							html.push('<tr><td>'+date+'</td><td style="text-align: left;"><a href="'+url+'" target="_blank">'+title+'</a></td><td>'+user+'</td><td>'+amount+'</td></tr>');
						}

						objId.html(html.join(""));

					}else{
						objId.html("<tr><td colspan='4'><p class='loading'>"+langData['siteConfig'][20][126]+"</p></td></tr>");//暂无相关信息！
					}

					totalCount = pageInfo.totalCount;
					showPageInfo();
				}
			}else{
				objId.html("<tr><td colspan='4'><p class='loading'>"+langData['siteConfig'][20][126]+"</p></td></tr>");//暂无相关信息！
			}
		}
	});
}

function addDateInV1_2(strDate){
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var dateArr = strDate.split('-');
	var tmp;
	var monthTmp;
	if(dateArr[2].charAt(0) == '0'){
		tmp = dateArr[2].substr(1);
	}else{
		tmp = dateArr[2];
	}
	if(dateArr[1].charAt(0) == '0'){
		monthTmp = dateArr[1].substr(1);
	}else{
		monthTmp = dateArr[1];
	}
	if(day == tmp && month == monthTmp && year == dateArr[0]){
		return langData['siteConfig'][13][24];   //今天
	}else{
		return dateArr[0] + langData['siteConfig'][13][14] + monthTmp + langData['siteConfig'][13][18] + tmp + langData['siteConfig'][13][25];
		//年--月--日
	}
}
