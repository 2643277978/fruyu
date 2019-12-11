$(function(){

	//增加浏览记录
	$.post("/include/ajax.php?service=dating&action=visitOper&type=1&id="+userId);


	uBigPicLoad();
	function uBigPicLoad(){
		$('.loading').show()
		var index = $('.picsmall li.selected').index();
		var u_bigpicurl = $('.picsmall li.selected').attr('data-bigpic');
		$('#tempImg').attr('src',u_bigpicurl);
		$('.bigpic').attr('src',u_bigpicurl);
		$('.bigpic').load(function(){
			$('.loading').hide()
			var imgW = $('.bigpic').width();
			var imgH = $('.bigpic').height();
			var picbdW , picbdH;
			if(imgW > 300 || imgH > 375){
				var bl = imgW > imgH ? imgH/imgW : imgW/imgH;
				if(imgW > imgH){	//imgW >300
					picbdW = 300;
					picbdH = 300 * bl;
				}else if(imgW < imgH){ //imgH > 375 && imgW > 300 ?
					if(375*bl<=300){
						picbdH = 375;
						picbdW = 375 * bl;
					}else{
						picbdW = 300;
						picbdH = 300*bl;
					}
				}else{
					picbdW = 300;
					picbdH = 300;
				}
			}else{
				picbdW = imgW;
				picbdH = imgH;
			}
			var mgleft = picbdW/2 + 'px';
			var mgtop = picbdH > 375 ? 188 : picbdH/2;
			$('.picbd').css({'width':picbdW + 'px','height':picbdH + 'px','left':'50%','top':'50%','margin-left':'-' + mgleft,'margin-top':'-' + mgtop + 'px'})
			$('#praisePhoto li').eq(index).show().siblings().hide();
		})
	}


	// 点击小图
	$('.picsmall li').click(function(){
		if($(this).hasClass('selected')){return;}
		$(this).addClass('selected').siblings().removeClass('selected');
		var index = $(this).index();
		if(index == uPicIndex + 3 && uPicLen > index + 1){
			uPicIndex++;
			$('.picsmall').animate({
				'left' : -uPicIndex * 60 + 'px'
			},500)
			if(uPicIndex + 4 >= uPicLen){
				$('#upicbtn .next').addClass('disable')
			}
			$('#upicbtn .pre').removeClass('disable')

		}else if(index == uPicIndex && index > 0){
			uPicIndex--;
			$('.picsmall').animate({
				'left' : -uPicIndex * 60 + 'px'
			},500)
			if(uPicIndex == 0){
				$('#upicbtn .pre').addClass('disable')
			}
			$('#upicbtn .next').removeClass('disable')
		}
		uBigPicLoad()
	})

	var uPicLen = $('.picsmall li').length;
	if(uPicLen <= 4){
		$('#upicbtn .next').addClass('disable')
	}
	$('.picsmall').css('width',uPicLen*60+'px')
	var uPicIndex = 0;
	//下一组
	$('#upicbtn .next').click(function(){
		if($(this).hasClass('disable')){return;}

		var step = uPicLen - uPicIndex - 4 >= 4 ? 4 : uPicLen - uPicIndex - 4;
		uPicIndex += step;
		$('.picsmall').animate({
			'left' : -uPicIndex * 60 + 'px'
		},500,function(){
			uBigPicLoad()
		})
		$('.picsmall li').eq(uPicIndex).addClass('selected').siblings().removeClass('selected')
		if(uPicIndex + 4 >= uPicLen){
			$(this).addClass('disable')
		}
		$('#upicbtn .pre').removeClass('disable')

	})
	//上一组
	$('#upicbtn .pre').click(function(){
		if($(this).hasClass('disable')){return;}

		var step = uPicIndex > 4 ? 4 : uPicIndex;
		uPicIndex -= step
		$('.picsmall').animate({
			'left' : -uPicIndex * 60 + 'px'
		},500,function(){
			uBigPicLoad()
		})
		$('.picsmall li').eq(uPicIndex).addClass('selected').siblings().removeClass('selected')
		if(uPicIndex == 0){
			$(this).addClass('disable')
		}
		$('#upicbtn .next').removeClass('disable')
	})


	//scroll 显示头部用户 fixed信息
  var topUInfoShow = true;
  $(window).scroll(function(){
  	var scrollTop = $(document).scrollTop();
    var topUInfo_min = $('.u-main-pt02').offset().top;
    var topUInfo_max = $('.user-info-main').offset().top + $('.user-info-main').height();
  	if(topUInfoShow){
    	if(scrollTop > topUInfo_min && scrollTop < topUInfo_max){
    		$('.mod-top-ceiling').css({'height':'auto','padding':'20px 40px'});
    	}else{
    		$('.mod-top-ceiling').css({'height':0,'padding':'0 40px'});
    	}
  	}
  })


	//打招呼
	$('a.greet').click(function(){
		if($(this).hasClass('disabled')) {return;}

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}
		$('a.greet').addClass('disabled').children('span').text('已打招呼');

		var $i = $("<b>").text('已打招呼');
		var x = $(this).offset().left, y = $(this).offset().top;
		$i.css({top: y - 10, left: x + 30, position: "absolute", "z-index": "10000", color: "#666", background: "#fff", border: "2px solid #ccc", padding: "3px 8px"});
		$("body").append($i);
		$i.animate({top: y - 30, opacity: 0}, 600, function(){
			$i.remove();
		});

		$.post("/include/ajax.php?service=dating&action=visitOper&type=3&id="+userId);
	})
	//加关注
	$('a.attention').click(function(){
		if($(this).hasClass('disabled')) {return;}

		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}
		$('a.attention').addClass('disabled').children('span').text('已加关注');

		var $i = $("<b>").text('已加关注');
		var x = $(this).offset().left, y = $(this).offset().top;
		$i.css({top: y - 10, left: x + 30, position: "absolute", "z-index": "10000", color: "#666", background: "#fff", border: "2px solid #ccc", padding: "3px 8px"});
		$("body").append($i);
		$i.animate({top: y - 30, opacity: 0}, 600, function(){
			$i.remove();
		});

		$.post("/include/ajax.php?service=dating&action=visitOper&type=2&id="+userId);
	})


	//发私信
	$(".sendgift").bind("click", function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    dataInfo = $.dialog({
			id: "dataInfo",
			fixed: true,
			title: "发私信给 "+username,
			content: '<div class="sx fn-clear"><textarea></textarea></div>',
			width: 450,
			height: 120,
			ok: function(){
        var note = $(".sx textarea").val();
        if(note == ""){
          $.dialog.tips("请输入私信内容！", 3, 'error.png');
          return false;
        }else{

          $.ajax({
            url: masterDomain + "/include/ajax.php?service=dating&action=fabuReview&id="+userId+"&note="+note,
            type: "GET",
            dataType: "jsonp",
            success: function (data) {
              if(data.state == 100){
                $.dialog.tips('发送成功！', 3, 'success.png');
              }else{
                $.dialog.tips(data.info, 3, 'error.png');
              }
            },
            error: function(){
              $.dialog.tips('网络错误，发送失败！', 3, 'error.png');
            }
          });

        }
      }
		});

	});

})
