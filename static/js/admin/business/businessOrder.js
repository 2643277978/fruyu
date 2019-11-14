$(function(){

	//开始、结束时间
	$("#stime, #etime").datetimepicker({format: 'yyyy-mm-dd', autoclose: true, minView: 2, language: 'ch'});

	//初始加载
	getList();

	//搜索
	$("#searchBtn").bind("click", function(){
		$("#sKeyword").html($("#keyword").val());
		$("#start").html($("#stime").val());
		$("#end").html($("#etime").val());
		$("#list").attr("data-atpage", 1);
		getList();
	});

	//搜索回车提交
  $("#keyword").keyup(function (e) {
      if (!e) {
          var e = window.event;
      }
      if (e.keyCode) {
          code = e.keyCode;
      }
      else if (e.which) {
          code = e.which;
      }
      if (code === 13) {
          $("#searchBtn").click();
      }
  });

	$("#pageBtn, #paginationBtn").delegate("a", "click", function(){
		var id = $(this).attr("data-id"), title = $(this).html(), obj = $(this).parent().parent().parent();
		obj.attr("data-id", id);
		if(obj.attr("id") == "paginationBtn"){
			var totalPage = $("#list").attr("data-totalpage");
			$("#list").attr("data-atpage", id);
			obj.find("button").html(id+"/"+totalPage+'页<span class="caret"></span>');
			$("#list").attr("data-atpage", id);
		}else{
			obj.find("button").html(title+'<span class="caret"></span>');
			$("#list").attr("data-atpage", 1);
		}
		getList();
	});

	//下拉菜单过长设置滚动条
	$(".dropdown-toggle").bind("click", function(){
		if($(this).parent().attr("id") != "typeBtn" && $(this).parent().attr("id") != "addrBtn"){
			var height = document.documentElement.clientHeight - $(this).offset().top - $(this).height() - 30;
			$(this).next(".dropdown-menu").css({"max-height": height, "overflow-y": "auto"});
		}
	});

	//全选、不选
	$("#selectBtn a").bind("click", function(){
		var id = $(this).attr("data-id");
		if(id == 1){
			$("#selectBtn .check").addClass("checked");
			$("#list tr").removeClass("selected").addClass("selected");

			defaultBtn.css('display', 'inline-block');
			checkedBtn.hide();
		}else{
			$("#selectBtn .check").removeClass("checked");
			$("#list tr").removeClass("selected");

			defaultBtn.hide();
			checkedBtn.css('display', 'inline-block');
		}
	});

});

//获取列表
function getList(){
	huoniao.showTip("loading", "正在操作，请稍候...");
	$("#list table, #pageInfo").hide();
	$("#selectBtn a:eq(1)").click();
	$("#loading").html("加载中，请稍候...").show();
	var sKeyword = encodeURIComponent($("#sKeyword").html()),
		start    = $("#start").html(),
		end      = $("#end").html(),
		pagestep = $("#pageBtn").attr("data-id") ? $("#pageBtn").attr("data-id") : "10",
		page     = $("#list").attr("data-atpage") ? $("#list").attr("data-atpage") : "1";

	var data = [];
		data.push("sKeyword="+sKeyword);
		data.push("start="+start);
		data.push("end="+end);
		data.push("pagestep="+pagestep);
		data.push("page="+page);

	huoniao.operaJson("businessOrder.php?dopost=getList", data.join("&"), function(val){
		var obj = $("#list"), list = [], i = 0, businessList = val.list;
		obj.attr("data-totalpage", val.pageInfo.totalPage);
		$(".totalCount").html(val.pageInfo.totalCount);

		if(val.state == "100"){
			//huoniao.showTip("success", "获取成功！", "auto");
			huoniao.hideTip();

			for(i; i < businessList.length; i++){
				list.push('<tr>');
				list.push('  <td class="row13 left">&nbsp;&nbsp;'+businessList[i].ordernum+'</td>');
				list.push('  <td class="row15 left">'+businessList[i].title+'<br />'+businessList[i].company+'</td>');

				var modules = businessList[i].modules;
				var modulesArr = [];
				for (var m = 0; m < modules.length; m++) {
					modulesArr.push('<code>'+modules[m].name+'</code> <code>'+modules[m].unitprice+'</code> &times; <code>'+modules[m].count+'年</code> <code>'+modules[m].expired+'过期</code>');
				}

				list.push('  <td class="row30 left">'+modulesArr.join("<br />")+'</td>');
				list.push('  <td class="row5 left">'+businessList[i].totalprice+'</td>');
				list.push('  <td class="row5 left">'+businessList[i].offer+'</td>');
				list.push('  <td class="row5 left">'+businessList[i].balance+'</td>');
				list.push('  <td class="row7 left">'+businessList[i].paytype+'</td>');
				list.push('  <td class="row5 left">'+businessList[i].amount+'</td>');
				list.push('  <td class="row15 left">'+businessList[i].date+'</td>');
				list.push('</tr>');
			}

			obj.find("tbody").html(list.join(""));
			$("#loading").hide();
			$("#list table").show();
			huoniao.showPageInfo();
		}else{

			obj.find("tbody").html("");
			huoniao.showTip("warning", val.info, "auto");
			$("#loading").html(val.info).show();
		}
	});

};
