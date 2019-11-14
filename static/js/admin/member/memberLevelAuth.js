$(function(){

	//保存
	$("#save").bind("click", function(){
		var data = '[';
		var tj = true;
		$("table tbody:eq(0) tr").each(function(){
			var t = $(this);
			data += '[';
			var priceArr = [];
			t.find("td").each(function(index){
				if($(this).find("input").val() == ''){
					tj = false;
				}
				var id = $(this).attr("data-id"), type = $(this).attr('data-type'), module = $(this).attr("data-module"), val = parseFloat($(this).find("input").val());
				if(id != undefined && type != 'count'){
					if(type == 'amount'){
						var count = parseInt($(this).next('td').find('input').val());
						priceArr.push('{"id": '+id+', "module": "'+module+'", "count": "'+count+'", "amount": "'+val+'"}');
					}else{
						priceArr.push('{"id": '+id+', "module": "'+module+'", "amount": "'+val+'"}');
					}
				}
			});
			data += priceArr.join(",") + '],';
		});
		data = data.substr(0, data.length-1);
		data += ']';

		if(!tj){
			alert('表单不得为空！');
			return false;
		}

		huoniao.operaJson("?dopost=update", "data="+data, function(data){
			if(data.state == 100){
				huoniao.showTip("success", data.info, "auto");
				window.scroll(0, 0);
				setTimeout(function() {
					location.reload();
				}, 800);
			}else{
				huoniao.showTip("error", data.info, "auto");
			}
		});

	});

});
