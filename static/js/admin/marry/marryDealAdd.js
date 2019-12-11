//实例化编辑器
var ue = UE.getEditor('content');

$(function(){
	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	//结束时间
	$("#endate").datetimepicker({format: 'yyyy-mm-dd', minView:3, autoclose: true, language: 'ch'});

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
		ue.sync();

		var t            = $(this),
			id           = $("#id").val(),
			title        = $("#title"),
			litpic       = $("#litpic").val(),
			endate       = $("#endate").val(),
			note         = $("#note").val();

		if(!huoniao.regex(title)){
			huoniao.goTop();
			return false;
		};

		if($.trim(litpic) == ""){
			$.dialog.alert("请上传缩略图");
			return false;
		}

		if($.trim(endate) == ""){
			$.dialog.alert("请选择活动结束时间");
			return false;
		}

		if($.trim(note) == ""){
			$.dialog.alert("请输入活动简介");
			return false;
		}

		if($.trim(ue.getContent()) == ""){
			$.dialog.alert("请输入活动详细");
			return false;
		}
		t.attr("disabled", true);

		//异步提交
		huoniao.operaJson("marryDeal.php", $("#editform").serialize() + "&submit="+encodeURI("提交"), function(data){
			if(data.state == 100){
				ue.execCommand('cleardoc');
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
								$("body",parent.document).find("#nav-marry"+$("#action").val()+"Deal"+$("#cid").val()).click();
								//parent.reloadPage($("body",parent.document).find("#body-loupanListphp")[0].contentWindow);
								parent.reloadPage($("body",parent.document).find("#body-marry"+$("#action").val()+"Deal"+$("#cid").val()));
								$("body",parent.document).find("#nav-marryDealEdit"+id+" s").click();
							}catch(e){
								location.href = thisPath + "marryDeal.php?action="+$("#action").val()+"&cid="+$("#cid").val();
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
