$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];

	//初始加载
	if($("#dopost").val() == "edit"){
		getCars($("#cCar"), "Car");
		getColor();
	}

	var isClick = 0; //是否点击跳转至锚点，如果是则不监听滚动
	//左侧导航点击
	$("#left-nav a").bind("click", function(){
		isClick = 1; //关闭滚动监听
		var t = $(this), parent = t.parent(), index = parent.index(), theadTop = $("#editform .thead:eq("+index+")").offset().top - 15;
		$("#left-nav li").removeClass("current");
		parent.addClass("current");
		$('html, body').animate({
         	scrollTop: theadTop - parent.position().top
     	}, 300, function(){
     		isClick = 0; //开启滚动监听
     	});
	});

	//滚动监听
	$(window).scroll(function(){
		if(isClick) return false;  //判断是否点击中转中...
		var scroH = $(this).scrollTop();
		var theadLength = $("#editform .thead").length;
		$("#left-nav li").removeClass("current");

		$("#editform .thead").each(function(index, element){
			var offsetTop = $(this).offset().top;
			if(index != theadLength-1){
				var offsetNavTop = $("#left-nav li:eq("+(index+1)+")").position().top+30;
				var offsetNextTop = $("#editform .thead:eq("+(index+1)+")").offset().top;
				if(scroH >= offsetTop-offsetNavTop && scroH < offsetNextTop-offsetNavTop){
					$("#left-nav li:eq("+index+")").addClass("current");
					return false;
				}
			}else{
				$("#left-nav li:last").addClass("current");
				return false;
			}
		});
	});

	//选择品牌
	$("#cBrand, #cCar").bind("click", function(){
		var t = $(this), top = t.offset().top + t.height() + 11, left = t.offset().left, 
			obj = t.attr("id"), type = t.attr("data-type"), id = t.attr("data-id");
		if(obj == "cCar" && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
			return false;
		}

		//选择品牌
		if(obj == "cBrand" && $("#Mast_"+type).html() == undefined){
			getBrand(t);
		}

		if($("#Mast_"+type).html() != undefined){
			if($("#Mast_"+type).is(":visible") == false){
				$("#Mast_"+type).css({
					top: top,
					left: left
				}).show();
			}else{
				$("#Mast_"+type).hide();
			}
		}
	});

	//字母检索
	$("#carBtn").delegate(".pinpzm a", "click", function(e){
		$(this).closest(".pinpzm").find(".on").removeClass("on");
        $(this).parent().addClass("on");

        var obj = $(this).closest(".zcfcbox").attr("id");
        if($("#"+obj + $(this).html()).html() != undefined){
	        $(this).closest(".zcfcbox").find(".pinp_main").get(0).scrollTop = $("#" + obj + $(this).html()).get(0).offsetTop;
	    }
        e.stopPropagation();
	});

	//选择结果
	$("#carBtn").delegate(".pinp_main a", "click", function(e){
		$(this).closest(".pinp_main").find(".on").removeClass("on");
        $(this).addClass("on");

        var text = $(this).html().substring(2), brand = 0;
        //车系
        if($(this).closest(".zcfcbox").attr("id") == "Mast_Car"){
        	text = $(this).html();
        }else{
        	brand = 1;
        }

		var id = $(this).attr("data"), obj = $(this).closest(".zcfcbox").attr("id").replace("Mast_", "");
		$("#c"+obj)
			.attr("data-id", id)
			.html(text + "<span class=\"caret\"></span>");

		if(brand){
			//初始化车系信息
			$("#cCar")
				.attr("data-id", 0)
				.html('请选择车系<span class="caret"></span>');
			$("#cid").val(0);
			$("#divColor").html("<span style=\"line-height:60px;\">请先选择车型！</span>");

			//获取车系
            var t = $("#cCar"), type = "Car";
            $("#Mast_"+type).remove();
            getCars(t, type);
            $("#cCar").click();
		}else{
			$("#cid").val(id);
			getColor();
		}
	});

	$(document).click(function (e) {
		var s = e.target;
		if ($(".zcfcbox").html() != undefined) {
			if (!jQuery.contains($(".btn").get(0), s)) {
				if (jQuery.inArray(s, $(".btn")) < 0) {
					$(".zcfcbox").hide();
				}
			}
		}
	});

	//年款
	$("#year").datetimepicker({format: 'yyyy', startView: 4, minView: 4, autoclose: true, language: 'ch'});

	//上市时间
	$("#listedDate").datetimepicker({format: 'yyyy-mm-dd', minView: 2, autoclose: true, language: 'ch'});
	

	//选择车身颜色
	$("#divColor").delegate("li", "click", function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}else{
			$(this).addClass("on");
		}
		var text = [];
		$("#divColor").find(".on").each(function(){
			text.push($(this).text()+"||"+$(this).attr("data"));
		});
		$("#color").val(text.join(","));
	});

	//全选颜色
	$("#selectAllColor").bind("click", function(){
		if($("#divColor li").length > 0){
			$("#divColor li").addClass("on");
		}
		var text = [];
		$("#divColor").find(".on").each(function(){
			text.push($(this).text()+"||"+$(this).attr("data"));
		});
		$("#color").val(text.join(","));
	});


	var inputObj = "";
	//选择内容
	$("#editform").delegate("input[type=text]", "click", function(){
		var itemList = $(this).siblings(".popup_key");
		if(itemList.html()){
			$(".popup_key").hide();
			inputObj = $(this).attr("id");
			if(itemList.html() != undefined){
				itemList
					.css({"width": $(this).width() + 12})
					.show();;
			}
			return false;
		}
	});

	//选择完成关闭浮动层
	$(".popup_key").delegate("li", "click", function(){
		var val = $(this).attr("title"), parent = $(this).parent().parent();
		if(val){
			parent.siblings("input[type=text]").val(val);
		}
		parent.siblings(".input-tips").removeClass().addClass("input-tips input-ok");
		parent.hide();
	});
	
	$(document).click(function (e) {
        var s = e.target;
		if(inputObj != ""){
			if (!jQuery.contains($("#"+inputObj).siblings(".popup_key").get(0), s)) {
				if (jQuery.inArray(s.id, inputObj) < 0) {
					$(".popup_key").hide();
					$("#"+inputObj).siblings(".popup_key").find("li").show();
				}
			}
		}
    });

	//表单验证
	$("#editform").delegate("input,textarea", "focus", function(){
		var tip = $(this).siblings(".input-tips");
		if(tip.html() != undefined){
			tip.removeClass().addClass("input-tips input-focus").attr("style", "display:inline-block");
		}
	});
	
	$("#editform").delegate("input,textarea", "blur", function(){
		var obj = $(this);
		huoniao.regex(obj);
	});
	
	$("#editform").delegate("select", "change", function(){
		if($(this).parent().siblings(".input-tips").html() != undefined){
			if($(this).val() == 0){
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			}else{
				$(this).parent().siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
			}
		}
	});

	$("#year").change(function(){
		huoniao.regex($("#year"));
	});
	
	//搜索回车提交
    $("#editform input").keyup(function (e) {
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
            $("#btnSubmit").click();
        }
    });
	
	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
			id           = $("#id").val(),
			cid          = $("#cid").val(),
			year         = $("#year"),
			title        = $("#title"),
			displacement = $("#displacement").val(),
			listedDate   = $("#listedDate").val(),
			gearbox      = $("#gearbox");
		
		if(cid == 0 || cid == ""){
			huoniao.goTop();
			alert("请先选择车型！");
			return false;
		}

		if(!huoniao.regex(year)){
			huoniao.goInput(year);
			return false;
		}

		if(!huoniao.regex(title)){
			huoniao.goInput(title);
			return false;
		}
		
		if($.trim(displacement) == ""){
			huoniao.goInput($("#displacement"));
			$.dialog.alert("请输入排量信息！");
			return false;
		}
		
		if($.trim(listedDate) == ""){
			huoniao.goInput($("#listedDate"));
			$.dialog.alert("请选择上市时间！");
			return false;
		}

		if(gearbox.val() == "" || gearbox.val() == 0){
			huoniao.goInput(gearbox);
			$("#gearboxList").siblings(".input-tips").removeClass().addClass("input-tips input-error").attr("style", "display:inline-block");
			return false;
		}else{
			$("#gearboxList").siblings(".input-tips").removeClass().addClass("input-tips input-ok").attr("style", "display:inline-block");
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carParam.php", $("#editform").serialize()+"&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				if($("#dopost").val() == "Add"){
					$.dialog({
						fixed: true,
						title: "添加成功",
						icon: 'success.png',
						content: "添加成功！",
						ok: function(){
							huoniao.goTop();
							window.location.reload();
						},
						cancel: false
					});
					
				}else{
					$.dialog({
						fixed: true,
						title: "修改成功",
						icon: 'success.png',
						content: "修改成功！",
						ok: function(){
							try{
								$("body",parent.document).find("#nav-carParamphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carParamphp"));
								$("body",parent.document).find("#nav-carParamEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carParam.php";
							}
						},
						cancel: false
					});
				}
			}else{
				$.dialog.alert(data.info);
				t.attr("disabled", false);
			};
		});
	});
	
});

//获取品牌
function getBrand(t){
	huoniao.operaJson("carParam.php", "dopost=getBrand", function(data){
		if(data){
			var top = t.offset().top + t.height() + 11, left = t.offset().left, type = t.attr("data-type")
			var str = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\" style=\"display:block; top:"+top+"; left:"+left+"\">";
            var strChar = "<div class=\"pinpzm\">";
            var strBrand = " <div class=\"pinp_rit\"><div class=\"pinp_main\">";
            var Chr = "";
            var bid = $("#cBrand").attr("data-id");
            for (var i = 0, len = data.length; i < len; i++) {
                var letter = data[i].letter;
                var on = "";
                if (Chr != letter) {
                    if (Chr == "") {
                        strChar += "<div class=\"on\"><a href=\"javascript:;\">" + letter + "</a></div>";
                        strBrand += "<div class=\"pinp_main_zm\" id=\"Mast_" + type + letter + "\">";
                    } else {
                        strChar += "<div><a href=\"javascript:;\">" + letter + "</a></div>";
                        strBrand += "</div><div class=\"pinp_main_zm\" id=\"Mast_" + type + letter + "\">";
                    }
                }
                if(bid != 0 && data[i].id == bid){
                	on = " class='on'";
                }
                strBrand += "<p><a href=\"javascript:;\" data=\"" + data[i].id + "\""+on+">" + letter + " " + data[i].typename + "</a></p>";
                Chr = letter;
            }
            strChar += "</div>"
            strBrand += "</div></div></div>";
            str += strChar + strBrand + "</div>";

            t.after(str);
		}
	});
}

//获取车系
function getCars(t, type){
	huoniao.operaJson("carParam.php", "dopost=getCars&brand="+$("#cBrand").attr("data-id"), function(data){
		if(data){
			var strSerial = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\"><div class=\"cxtit\">" + $("#cBrand").text() + "</div><div class=\"pinp_main\" style=\"height:auto;\">";
            var len = data.length;
            var groupName = "";
            var cid = $("#cid").val();
            for (var i = 0; i < len; i++) {
            	var on = "";
            	if(data[i].GroupName != null){
                if (groupName != data[i].GroupName) {
                    if (groupName == "") {
                        strSerial += "<div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    } else {
                        strSerial += "</div><div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    }
                }
              }else{
              	if (groupName != null) {
                    strSerial += "<div class=\"pinp_main_zm\">";
                }
              }
                if(cid != 0 && data[i].Value == cid){
                	on = " class='on'";
                }
                strSerial += "<p><a href=\"javascript:;\" data=\"" + data[i].Value + "\""+on+">" + data[i].Text + "</a></p>";
                groupName = data[i].GroupName;
            }

            strSerial += "</div></div></div>";

            t.after(strSerial);

            //$("#cCar").click();
		}
	});
}

//获取车身颜色
function getColor(){
	huoniao.operaJson("carParam.php", "dopost=getColor&carid="+$("#cid").val(), function(data){
		if(data){
			var str = [];
			for(var i = 0; i < data.length; i++){
				var color = $("#color").val(), on = "", text = data[i].text, col = data[i].color;
				if($.trim(color) != ""){
					color = color.split(",");
					if($.inArray(text+"||"+col, color) > -1){
						on = " class='on'";
					}else{
						on = "";
					}
				}
				str.push('<li'+on+' data="'+col+'"><a href="javascript:;"><img src="'+cfg_attachment+data[i].pic+'&type=middle" />'+text+'<em></em></a></li>');
			}
			$("#divColor").html(str.join(""));
		}
	});
}