$(function(){

  var inputObj = "";
	//商品属性选择或输入：点击
	$("#fabuForm").delegate("input[type=text]", "click", function(){
		$(".popup_key").hide();
		var itemList = $(this).siblings(".popup_key");
		inputObj = $(this).attr("id");
		if(itemList.html() != undefined){
			itemList.show();;
		}
		return false;
	});

	//商品属性选择或输入：输入
	$("#fabuForm").delegate("input[type=text]", "input", function(){
		var itemList = $(this).siblings(".popup_key"), val = $(this).val(), sLength = 0;
		itemList.find("li").hide();
		itemList.hide();
		itemList.find("li").each(function(index, element) {
			var txt = $(this).attr("title");
			if(txt.indexOf(val) > -1){
				sLength++;
				$(this).show();
			}
		});
		if(sLength > 0){
			itemList.show();
		}
	});

	//商品属性选择完成关闭浮动层
	$(".popup_key").delegate("li", "click", function(){
		var id = $(this).attr("data-id"), val = $(this).attr("title"), parent = $(this).parent().parent();
		if(id && val){
			parent.siblings("input[type=text]").val(val);
		}
		parent.siblings(".tip-inline").removeClass().addClass("tip-inline success");
		parent.hide();
	});

	$(document).click(function (e) {
		$(".popup_key").hide();
  });


  //获取运费模板详细
	function getLogisticDetail(id){
		$.ajax({
			type: "GET",
			url: "/include/ajax.php?service=shop&action=logisticTemplate&sid="+$("#store").val()+"&id="+id,
			dataType: "jsonp",
			success: function(a) {
        if(a.state == 100){
  				$("#logisticDetail small").html('<br />'+a.info);
  				$("#logisticDetail").show();
        }
			}
		});
	}

	var logistic = $("#logistic").val();
	if(logistic != 0){
		getLogisticDetail(logistic);
	}

	$("#logistic").change(function(){
		var id = $(this).val();
		if(id == 0){
			$("#logisticDetail small").html("");
			$("#logisticDetail").hide();
		}else{
			getLogisticDetail(id);
		}
	});


  //选择规格
	var fth;
	$("#specification").delegate("input[type=checkbox]", "click", function(){
		createSpecifi();
	});

	if(specifiVal.length > 0){
		createSpecifi();
	}

	//规格选择触发
	function createSpecifi(){
		var checked = $("#specification input[type=checkbox]:checked");
		if(checked.length > 0){

			$("#inventory").val("0").attr("disabled", true);

			//thead
			var thid = [], thtitle = [], th1 = [],
				th2 = '<th>'+langData['waimai'][5][23]+' <font color="#f00">*</font></th><th>'+langData['siteConfig'][26][159]+' <font color="#f00">*</font></th><th>'+langData['siteConfig'][19][525]+' <font color="#f00">*</font></th>';
			for(var i = 0; i < checked.length; i++){
				var t = checked.eq(i),
					title = t.parent().parent().parent().attr("data-title"),
					id = t.parent().parent().parent().attr("data-id");

				if(!thid.in_array(id)){
					thid.push(id);
					thtitle.push(title);
				}
			}
			for(var i = 0; i < thid.length; i++){
				th1.push('<th>'+thtitle[i]+'</th>');
			}
			$("#speList thead").html(th1+th2);

			//tbody 笛卡尔集
			var th = new Array(), dl = $("#specification dl");
			for(var i = 0; i < dl.length - 1; i++){
				var tid = [];

				//取得已选规格
				dl.eq(i).find("input[type=checkbox]:checked").each(function(index, element) {
                    var id = $(this).val(), val = $(this).attr("title");
					tid.push(id+"###"+val);
                });

				//已选规格分组
				if(tid.length > 0){
					th.push(tid);
				}
			}

			if(th.length > 0){
				fth = th[0];
				for (var i = 1; i < th.length; i++) {
					descartes(th[i]);
				}

				//输出
				createTbody(fth);
			}

		}else{
			$("#inventory").val("").attr("disabled", false);
			$("#speList thead, #speList tbody").html("");
			$("#speList").hide();
		}
	}

	//输出规格内容
	function createTbody(fth){
		if(fth.length > 0){

			var tr = [], inventory = 0;
			for(var i = 0; i < fth.length; i++){
				var fthItem = fth[i].split("***"), id = [], val = [];
				for(var k = 0; k < fthItem.length; k++){
					var items = fthItem[k].split("###");
					id.push(items[0]);
					val.push(items[1]);
				}
				if(id.length > 0){
					tr.push('<tr>');

					var name = [];
					for(var k = 0; k < id.length; k++){
						tr.push('<td>'+val[k]+'</td>');
						name.push(id[k]);
					}

					var price = $("#price").val();
					var mprice = $("#mprice").val();
					var f_inventory = "";
					if(specifiVal.length > 0 && specifiVal.length > i){
						value = specifiVal[i].split("#");
						mprice = value[0];
						price = value[1];
						f_inventory = value[2];
						inventory = inventory + Number(f_inventory);
					}
					tr.push('<td><input class="inp" type="text" id="f_mprice_'+name.join("-")+'" name="f_mprice_'+name.join("-")+'" data-type="mprice" value="'+mprice+'" /></td>');
					tr.push('<td><input class="inp" type="text" id="f_price_'+name.join("-")+'" name="f_price_'+name.join("-")+'" data-type="price" value="'+price+'" /></td>');
					tr.push('<td><input class="inp" type="text" id="f_inventory_'+name.join("-")+'" name="f_inventory_'+name.join("-")+'" data-type="inventory" value="'+f_inventory+'" /></td>');
					tr.push('</tr>');
				}
			}

			if(specifiVal.length > 0){
				$("#inventory").val(inventory);
			}
			$("#speList tbody").html(tr.join(""));
			$("#speList").show();

			//合并相同单元格
			var th = $("#speList thead th");
			for (var i = 0; i < th.length-3; i++) {
				huoniao.rowspan($("#speList"), i);
			};
		}
	}

	//笛卡尔集
	function descartes(array) {
    var ar = fth;
    fth = new Array();
    for (var i = 0; i < ar.length; i++) {
      for (var j = 0; j < array.length; j++) {
        var v = fth.push(ar[i] + "***" + array[j]);
      }
    }
  }

	//计算库存
	$("#speList").delegate("input", "blur", function(){
		var inventory = 0;
		$("#speList").find("input").each(function(index, element) {
      var val = Number($(this).val()), type = $(this).attr("data-type");
			if(type == "inventory" && val){
				inventory = Number(inventory + val);
			}
    });
		$("#inventory").val(parseInt(inventory));
	});



	getEditor("body");


	//表单验证
	var regex = {

		regexp: function(t, reg, err){
			var val = $.trim(t.val()), dl = t.closest("dl"), name = t.attr("name"),
					tip = t.data("title"), etip = tip, hline = dl.find(".tip-inline"), check = true;

			if(val != ""){
				var exp = new RegExp("^" + reg + "$", "img");
				if(!exp.test(val)){
					etip = err;
					check = false;
				}
			}else{
				check = false;
			}

			if(dl.attr("data-required") == 1){
				if(val == "" || !check){
					hline.removeClass().addClass("tip-inline error").html("<s></s>"+etip);
				}else{
					hline.removeClass().addClass("tip-inline success").html("<s></s>"+tip);
				}
				return check;
			}
		}

		//名称
		,title: function(){
			return this.regexp($("#title"), ".{5,100}", langData['siteConfig'][27][90]);
		}

		//市场价
		,mprice: function(){
			return this.regexp($("#mprice"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
		}

		//一口价
		,price: function(){
			return this.regexp($("#price"), "(?!0+(?:.0+)?$)(?:[1-9]\\d*|0)(?:.\\d{1,2})?", langData['siteConfig'][27][91]);
		}

    //运费
    ,logistic: function(){
      var t = $("#logistic"), val = t.val(), dl = t.closest("dl"), tip = dl.data("title"), etip = tip, hline = dl.find(".tip-inline");
      if(val == 0){
        hline.removeClass().addClass("tip-inline error").html("<s></s>"+etip);
        return false;
      }else{
        hline.removeClass().addClass("tip-inline success").html("<s></s>"+tip);
        return true;
      }
    }

		//库存
		,inventory: function(){
			return this.regexp($("#inventory"), "[0-9]\\d*", langData['siteConfig'][27][92]);
		}

		//购买限制
		,limit: function(){
			return this.regexp($("#limit"), "[0-9]\\d*", langData['siteConfig'][27][92]);
		}


	}


	//提交发布
	$("#submit").bind("click", function(event){

		event.preventDefault();

		var t        = $(this),
				litpic   = $("#litpic").val();

    $("#typeid").val(typeid);
    $("#id").val(id);

		if(t.hasClass("disabled")) return;

		var offsetTop = 0;

		//自定义字段验证
		$("#proItem").find("dl").each(function(){
			var t = $(this), type = t.data("type"), required = parseInt(t.data("required")), tipTit = t.data("title"), tip = t.find(".tip-inline"), input = t.find("input").val();

			if(required == 1){
				//单选
				if(type == "radio" && offsetTop <= 0){
					if(input == ""){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}

				//多选
				if(type == "checkbox" && offsetTop <= 0){
					if(t.find("input:checked").val() == "" || t.find("input:checked").val() == undefined){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}

				//下拉菜单
				if(type == "select" && offsetTop <= 0){
					if(input == ""){
						tip.removeClass().addClass("tip-inline error").html("<s></s>"+tipTit);
						offsetTop = t.position().top;
					}
				}
			}

		});

		if(!regex.title() && offsetTop <= 0){
			offsetTop = $("#title").position().top;
		}

		if(!regex.mprice() && offsetTop <= 0){
			offsetTop = $("#mprice").position().top;
		}

		if(!regex.price() && offsetTop <= 0){
			offsetTop = $("#price").position().top;
		}

		if(!regex.logistic() && offsetTop <= 0){
			offsetTop = $("#logistic").position().top;
		}

    //规格表值验证
    if(offsetTop <= 0){
  		$("#speList").find("input").each(function(index, element) {
        var val = $(this).val();
  			if(!/^0|\d*\.?\d+$/.test(val)){
  				$(document).scrollTop(Number($("#speList").offset().top)-8);
  				$("#speList").find(".tip-inline").removeClass().addClass("tip-inline error");
  				$("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][93]);

  				offsetTop = $("#speList").position().top;
  			}else{
  				$("#speList").find(".tip-inline").removeClass().addClass("tip-inline success");
  				$("#speList").find(".tip-inline").html('<s></s>'+langData['siteConfig'][27][94]);
  			}
      });
    }

		if(!regex.inventory() && offsetTop <= 0){
			offsetTop = $("#inventory").position().top;
		}

		if(!regex.limit() && offsetTop <= 0){
			offsetTop = $("#limit").position().top;
		}

		if(litpic == "" && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][27][78]);
			offsetTop = $("#listSection1").position().top;
		}

		//图集
		var imgli = $("#listSection2 li");
		if(imgli.length <= 0 && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][20][436]);
			offsetTop = $(".list-holder").position().top;
		}

		ue.sync();

		if(!ue.hasContents() && offsetTop <= 0){
			$.dialog.alert(langData['shop'][4][66]);
			offsetTop = $("#body").position().top;
		}

		if(offsetTop){
			$('.main').animate({scrollTop: offsetTop + 10}, 300);
			return false;
		}

		var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url");
		data = form.serialize();

		t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");

		$.ajax({
			url: action,
			data: data,
			type: "POST",
			dataType: "json",
			success: function (data) {
				if(data && data.state == 100){
					var tip = langData['siteConfig'][20][341];
					if(id != undefined && id != "" && id != 0){
						tip = langData['siteConfig'][20][229];
					}

					$.dialog({
						title: langData['siteConfig'][19][287],
						icon: 'success.png',
						content: tip + "，"+langData['siteConfig'][20][404],
						ok: function(){
							location.href = url;
						}
					});

				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['siteConfig'][11][19]);
					$("#verifycode").click();
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['siteConfig'][11][19]);
				$("#verifycode").click();
			}
		});

	});

});
