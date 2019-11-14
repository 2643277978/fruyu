$(function(){
	var toolbar = [["bold","italic","underline","inserttable","redo","undo","preview"]];
	//实例化编辑器
	var cycle = UE.getEditor('cycle', {"term": toolbar});
	var price = UE.getEditor('price', {"term": toolbar});

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" ); 
		thisUPage = tmpUPage[ tmpUPage.length-1 ]; 
		thisPath  = thisURL.split(thisUPage)[0];
	var dopost    = $("#dopost").val();
	
	//选择品牌
	$("#cBrand, #cCar, #cParam").bind("click", function(){
		var t = $(this), top = t.offset().top + t.height() + 11, left = t.offset().left, 
			obj = t.attr("id"), type = t.attr("data-type"), id = t.attr("data-id");
		if(obj == "cCar" && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
			return false;
		}

		if(obj == "cParam" && $("#cCar").attr("data-id") == 0 && $("#cBrand").attr("data-id") == 0) {
			$("#cBrand").click(); 
			return false;
		}

		if(obj == "cParam" && $("#cCar").attr("data-id") == 0) {
			$("#cCar").click(); 
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

        var id = $(this).attr("data"), text = $(this).html().substring(2), brand = 0, car = 1, obj = $(this).closest(".zcfcbox").attr("id").replace("Mast_", "");

        //车系
        if(obj == "Car" || obj == "Param"){
        	text = $(this).html();
        	if(obj == "Param"){
        		car = 0;
        	}
        }else{
        	brand = 1;
        }

        $("#pid").val(0);
		$("#c"+obj)
			.attr("data-id", id)
			.html(text + "<span class=\"caret\"></span>");

		if(brand){
			//初始化车系信息
			$("#cCar")
				.attr("data-id", 0)
				.html('请选择车系<span class="caret"></span>');

			$("#cParam")
				.attr("data-id", 0)
				.html('请选择车型<span class="caret"></span>');

			//获取车系
            var t = $("#cCar"), type = "Car";
            $("#Mast_"+type).remove();
            getCars(t, type);
            $("#cCar").click();
		}else{
			if(car){
				$("#cid").val(id);
				//初始化车系信息
				$("#cParam")
					.attr("data-id", 0)
					.html('请选择车型<span class="caret"></span>');

				var t = $("#cParam"), type = "Param";
				getParam(t, type);
			}else{
				$("#pid").val(id);
				$("#Mast_Param").hide();
				return false;
			}
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

	//初始加载
	if($("#dopost").val() == "edit"){
		getCars($("#cCar"), "Car");
		getParam($("#cParam"), "Param");
	}

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
	
	//表单提交
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t               = $(this),
			id              = $("#id").val(),
			cid             = $("#cid").val(),
			shoubao         = $("#shoubao").val(),
			baoyang         = $("#baoyang").val();

		cycle.sync();
		price.sync();

		if(cid == "" || cid == 0){
			huoniao.goTop();
			$.dialog.alert("请选择车系！");
			return false;
		}

		if(shoubao == "" || shoubao == 0){
			alert("请输入首保里程");
			huoniao.goInput($("#shoubao"));
			return false;
		}

		if(baoyang == "" || baoyang == 0){
			alert("请输入保养周期");
			huoniao.goInput($("#baoyang"));
			return false;
		}
		
		t.attr("disabled", true);
		
		//异步提交
		huoniao.operaJson("carBaoyang.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			cycle.execCommand('cleardoc');
			price.execCommand('cleardoc');
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
								$("body",parent.document).find("#nav-carBaoyangphp").click();
								parent.reloadPage($("body",parent.document).find("#body-carBaoyangphp"));
								$("body",parent.document).find("#nav-carBaoyangEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "carBaoyang.php";
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
            var cid = $("#cCar").attr("data-id");
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

//获取车型
function getParam(t, type){
	huoniao.operaJson("carParam.php", "dopost=getParam&cid="+$("#cCar").attr("data-id"), function(data){
		if(data){
			var strSerial = "<div class=\"zcfcbox\" id=\"Mast_"+type+"\"><div class=\"cxtit\">" + $("#cCar").text() + "</div><div class=\"pinp_main\" style=\"height:auto;\">";
            var len = data.length;
            var groupName = "";
            var pid = $("#cParam").attr("data-id");
            for (var i = 0; i < len; i++) {
            	var on = "";
                if (groupName != data[i].GroupName) {
                    if (groupName == "") {
                        strSerial += "<div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    } else {
                        strSerial += "</div><div class=\"pinp_main_zm\"><p><i>" + data[i].GroupName + "</i></p>";
                    }
                }
                if(pid != 0 && data[i].Value == pid){
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