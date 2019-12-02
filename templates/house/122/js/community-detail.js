$(function(){
	//小区顾问
	var c_id=pageData.id;
	$.ajax({
		url:  "/include/ajax.php?service=house&action=getCommunityZjList&cid=1",
		type: "get",
		dataType: "jsonp",
		success:function (data) {
			if(data.state==100){
				var html=[];
				var phone="电话：";
				var name="昵称：";
				html.push('<img src="'+data.info[0].photo+'"onerror="javascript:this.src=\'/static/images/noPhoto_100.jpg\';" alt="">');
				html.push('<span class="jjrphone">'+phone+''+data.info[0].phone+'</span>');
				html.push('<span class="jjrname">'+name+''+data.info[0].nickname+'</span>')
				$(".jjr").html(html.join(""));
			}
			else {
				$(".jjr").html('<span>暂无顾问！</span>');
			}
		}
	});

	//大图切换
  $(".com_slide").slide({titCell: ".plist li",mainCell: ".album",effect: "fold",autoPlay: true,delayTime: 500,switchLoad: "_src",pageStateCell:".pageState",startFun: function(i, p) {if (i == 0) {$(".sprev").click()} else if (i % 5 == 0) {$(".snext").click()}}});

  //小图左滚动切换
  $(".com_slide .thumb").slide({mainCell: "ul",delayTime: 300,vis: 5,scroll: 5,effect: "left",autoPage: true,prevCell: ".sprev",nextCell: ".snext",pnLoop: false});


  function getZjuser(page){
  	$('.morelist ul').attr({'data-page': page, 'data-load': 'true'});
  	$('.morelist .more').text('正在获取更多').show();
  	$.ajax({
			url: masterDomain + '/include/ajax.php?service=house&action=communityZjUser&id='+pageData.id+'&page='+page+'&pageSize=5',
			dataType: 'jsonp',
			success: function(data){
				if(data && data.state == 100 && data.info.length){
					var html = [];
					for(var i = 0; i < data.info.length; i++){
						var d = data.info[i];

						html.push('<li class="fn-clear">');
						html.push('	<div class="topbox">');
						html.push('		<div class="l">');
						html.push('			<a href="javascript:;"><img src="'+d.photo+'" alt=""></a>');
						html.push('		</div>');
						html.push('		<div class="r">');
						html.push('			<h4><a href="javascript:;">'+d.nickname+'</a></h4>');
						html.push('			<span class="tip">'+d.zjcom+'</span>');
						html.push('		</div>');
						html.push('	</div>');
						html.push('	');
						html.push('	<div class="telbox">');
						html.push('		<a href="javascript:;"><i></i> 获取电话</a>');
						html.push('		<div class="tel-down">');
						html.push('			<p><b>'+d.phone+'</b></p>');
						html.push('		</div>');
						html.push('	</div>');
						html.push('</li>');
					}
					$('.morelist').removeClass('init');
					$('.morelist ul').append(html.join(""));
					$('.morelist .more').hide();
					$('.morelist ul').attr({'data-load': 'false'});
				}else{
					if(page == 1){
						$('.morelist .more').text('暂无经纪人');
					}else{
						$('.morelist .more').text('没有更多了');
					}
				}
			}
		})
  }
  $('.morelist ul').scroll(function(){
  	var t = $(this), sct = t.scrollTop(), last = t.children('li:last-child');
  	var page = t.attr('data-page'), load = t.attr('data-load');
  	page = page == undefined ? 1 : parseInt(page);
  	if(load != 'true' && last.position().top < $('.morelist ul').height()){
  		page++;
  		getZjuser(page);
  	}
  })

	$('.listmore a').click(function(){
		var t = $(this), page = $('.morelist ul').data('page');
		if(page == undefined){
			getZjuser(1);
		}
		$('.morelist').show();
		$('.mask').show();
	});

	$('.morelist .bt_close,.mask').click(function(){
		$('.morelist').hide();
		$('.mask').hide();
	});


	$(".btnJb").bind("click", function(){
		var domainUrl = masterDomain;
	    $.dialog({
	      fixed: false,
	      title: "房源举报",
	      content: 'url:'+domainUrl+'/complain-house-sale-'+pageData.id+'.html',
	      width: 460,
	      height: 300
	    });
	});
})