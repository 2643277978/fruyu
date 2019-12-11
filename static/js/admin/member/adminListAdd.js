$(function () {

	var thisURL   = window.location.pathname;
		tmpUPage  = thisURL.split( "/" );
		thisUPage = tmpUPage[ tmpUPage.length-1 ];
		thisPath  = thisURL.split(thisUPage)[0];

	$(".chosen-select").chosen();


	//管理员类型切换
	$("input[name='mtype']").bind('click', function(){
		var t = $(this), val = t.val();
		if(val == '3'){
			$('#mtype0').hide();
			$('#mtype3').show();
			$('#purviews').show();
		}else{
			$('#mtype3').hide();
			$('#mtype0').show();
			$('#purviews').hide();
		}
	});

	//选择所有权限
	$('#selectAll').bind('click', function(){
		var type = $(this).attr('data-type');
		if(type == 1){
			$(this).attr('data-type', 0);
			$('.purviews input').attr('checked', true);
		}else{
			$(this).attr('data-type', 1);
			$('.purviews input').attr('checked', false);
		}
	});

	//全选
	$('.purviews h3 a').bind('click', function(){
		var type = $(this).attr('data-type');
		if(type == 1){
			$(this).attr('data-type', 0);
			$(this).closest('.item').find('input').attr('checked', true);
		}else{
			$(this).attr('data-type', 1);
			$(this).closest('.item').find('input').attr('checked', false);
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

	//提交表单
	$("#btnSubmit").bind("click", function(event){
		event.preventDefault();
		var t            = $(this),
			id           = $("#id").val(),
			username     = $("#username"),
			password     = $("#password"),
			nickname     = $("#nickname"),
			mtype        = $("input[name=mtype]:checked").val(),
			mgroupid     = $("#mgroupid").val(),
			mcityid      = $("#mcityid").val();

		//用户名
		if(!huoniao.regex(username)){
			huoniao.goTop();
			return false;
		};

		//密码
		if($("#dopost").val() != "edit" && !huoniao.regex(password)){
			huoniao.goTop();
			return false;
		};

		//真实姓名
		if(!huoniao.regex(nickname)){
			huoniao.goTop();
			return false;
		};

		//管理组
		if(mtype == '0'){
			if(mgroupid == "" || mgroupid == "0"){
				$.dialog.alert('请选择管理组！');
				return false;
			}
		}else{
			if(mcityid == "" || mcityid == "0"){
				$.dialog.alert('请选择管辖城市！');
				return false;
			}
		}

		t.attr("disabled", true);

		$.ajax({
			type: "POST",
			url: "adminListAdd.php?dopost="+$("#dopost").val(),
			data: $(this).parents("form").serialize() + "&submit=" + encodeURI("提交"),
			dataType: "json",
			success: function(data){
				if(data.state == 100){
					if($("#dopost").val() == "add"){
						huoniao.goTop();
						$.dialog({
							fixed: true,
							title: "添加成功",
							icon: 'success.png',
							content: "添加成功！",
							ok: function(){
								location.reload();
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
									$("body",parent.document).find("#nav-adminListphp").click();
									parent.reloadPage($("body",parent.document).find("#body-adminListphp"));
									$("body",parent.document).find("#nav-adminListEdit"+id+" s").click();
								}catch(e){
									location.href = thisPath + "adminList.php";
								}
							},
							cancel: false
						});
					}
				}else{
					$.dialog.alert(data.info);
					t.attr("disabled", false);
				};
			},
			error: function(msg){
				$.dialog.alert("网络错误，请刷新页面重试！");
				t.attr("disabled", false);
			}
		});
	});

});
