$(function(){

	$("#typeObj span").bind("click", function(){
		var t = $(this), id = t.data("id");
		$("#type0, #type1").hide();
		$("#type"+id).show();
	});

	//提交发布
	$("#submit").bind("click", function(event){

		event.preventDefault();

		var t        = $(this),
				designer = $("#designer").val(),
				title    = $("#title"),
				litpic   = $("#litpic").val();

		if(t.hasClass("disabled")) return;

		var offsetTop = 0;

		if(designer == "" || designer == 0){
			var hline = $("#selTeam").find(".tip-inline"), tips = $("#designer").data("title");
			hline.removeClass().addClass("tip-inline error").html("<s></s>"+tips);
			offsetTop = $("#selTeam").position().top;
		}else{
			$("#selTeam").find(".tip-inline").removeClass().addClass("tip-inline success").html("<s></s>");
		}

		if($.trim(title.val()) == ""){
			var hline = title.next(".tip-inline"), tips = title.data("title");
			hline.removeClass().addClass("tip-inline error").html("<s></s>"+tips);
			offsetTop = $("#selTeam").position().top;
		}else{
			title.next(".tip-inline").removeClass().addClass("tip-inline success").html("<s></s>");
		}

		if(litpic == "" && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][27][78]);
			offsetTop = $("#license").position().top;
		}

		//图集
		var imgli = $("#listSection2 li");
		if(imgli.length <= 0 && offsetTop <= 0){
			$.dialog.alert(langData['siteConfig'][20][436]);
			offsetTop = $(".list-holder").position().top;
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
						content: tip,
						ok: function(){
							location.href = url;
						}
					});

				}else{
					$.dialog.alert(data.info);
					t.removeClass("disabled").html(langData['shop'][1][7]);
					$("#verifycode").click();
				}
			},
			error: function(){
				$.dialog.alert(langData['siteConfig'][20][183]);
				t.removeClass("disabled").html(langData['shop'][1][7]);
				$("#verifycode").click();
			}
		});

	});

});
