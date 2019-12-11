var history_search = 'house_history_search';

//提交搜索
function check(){
	var keywords = $.trim($("#keywords").val());

	//记录搜索历史
	var history = utils.getStorage(history_search);
	history = history ? history : [];
	if(history && history.length >= 10 && $.inArray(keywords, history) < 0){
		history = history.slice(1);
	}

	// 判断是否已经搜过
	if($.inArray(keywords, history) > -1){
		for (var i = 0; i < history.length; i++) {
			if (history[i] === keywords) {
				history.splice(i, 1);
				break;
			}
		}
	}
	history.push(keywords);

	utils.setStorage(history_search, JSON.stringify(history));
}

$(function() {

	//提交搜索
	 $('.sobj').submit(function(e){
		 e.preventDefault();

		 var keywords = $.trim($("#keywords").val());

		 if(keywords != ''){

			 check();
			 $('.list label').html(keywords);
			 $('.list').show();

			 //联想搜索
			 var data = ['loupanList', 'saleList', 'zuList', 'xzlList', 'spList', 'cfList'];
			 for (var i = 0; i < data.length; i++) {
				 getData(data[i]);
			 }

		 }else{
			 $('.list').hide();
		 }

		 getHistory();

	 });

	 $('#keywords').on('input', function(){
		 var keywords = $.trim($("#keywords").val());
		 if(keywords != ''){
			 $('.sobj s').show();
		 }else{
			 $('.sobj s').hide();
		 }
	 });

	 //清空搜索框
	 $('.sobj s').bind('click', function(){
		 $("#keywords").val('');
		 $('.list, .sobj s').hide();
	 });

	 //点击跳转
	 $('.list li').bind('click', function(){
		 var href = $(this).attr('data-href'), val = $(this).find('label').text();
		 location.href = href.replace('%%', val);
	 });

	 //获取接口数据
	 function getData(act){
		 var obj = act.replace('List', '');
		 $.ajax({
			url: "/include/ajax.php?service=house&page=1&pageSize=1&action="+act+"&keywords="+$.trim($("#keywords").val()),
			type: "GET",
			dataType: "jsonp",
			success: function (data) {
				if(data.state == 100){
					$('.list .' + obj).find('span').removeClass('loading').html(data.info.pageInfo.totalCount + '个');
				}else{
					$('.list .' + obj).find('span').removeClass('loading').html(0 + '个');
				}
			},
			error: function(){
				$('.list .' + obj).find('span').removeClass('loading').html(0 + '个');
			}
		});
	 }

	getHistory();

	//加载历史记录
	function getHistory(){
	 	var hlist = [];
	 	var history = utils.getStorage(history_search);
	 	if(history){
	 		history.reverse();
	 		for(var i = 0; i < history.length; i++){
	 			hlist.push('<li><a href="javascript:;">'+history[i]+'</a></li>');
	 		}
	 		$('.history ul').html(hlist.join(''));
	 		$('.all_shan, .history').show();
	 	}
	}

 	//点击历史记录
 	$('.history').delegate('a', 'click', function(){
 		var t = $(this), txt = t.text();
 		$('#keywords').val(txt);
 		$('.sobj').submit();
		$('.sobj s').show();
 	});

 	//清空历史记录
 	$('.all_shan').bind('click', function(){
 		utils.removeStorage(history_search);
 		$('.all_shan, .history').hide();
 		$('.history ul').html('');
 	});

})
