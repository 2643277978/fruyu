$(function(){

$('.header-m').show();
$(".header-address span").html(''+langData['siteConfig'][27][135]+'');
HN_Location.init(function(data){
  if (data == undefined || data.address == "" || data.name == "" || data.lat == "" || data.lng == "") {
	  $('.header-address span').html(''+langData['siteConfig'][27][136]+'');
	  $('.loading').html(''+langData['siteConfig'][27][137]+'').show();
  }else{
	  var lng = data.lng, lat = data.lat, name = data.name, page = 1;
	  getList(1);
	  $('.header-address span').html(name);
  }

  function getList(page){
  	isload = true;
  	$('.loading').show();
  	$.ajax({
	    url: masterDomain + '/include/ajax.php?service=business&action=blist&pageSize=15&orderby=3&page='+page+'&lng='+lng+'&lat='+lat,
	    dataType: 'jsonp',
	    success: function(data){
        $('.loading').hide();
	      if(data.state == 100){
	      	$(".loading").hide();
	        var list = data.info.list, html = [],totalPage = data.info.pageInfo.totalPage;

	        for(var i = 0; i < list.length; i++){
	        	html.push('<li>');
		        html.push('<a href="'+list[i].url+'" class="fn-clear">');
		        html.push('<div class="like-img"><img src="'+list[i].logo+'"></div>');
		        html.push('<div class="like-txt">');
		        html.push('<h3 class="fn-clear"><span class="shop-name fn-left">'+list[i].title+'</span>');
		        html.push('<div class="icon-tag fn-left">');
		        if (list[i].member.licenseState) {
			        html.push('<i class="zheng">'+langData['siteConfig'][22][2]+'</i>');
		        }
		        if (list[i].member.phoneCheck) {
			        html.push('<i class="jian">'+langData['siteConfig'][22][3]+'</i>');
		        }
		        if (list[i].member.certifyState) {
			        html.push('<i class="jin">'+langData['siteConfig'][22][4]+'</i>');
		        }
		        var auth = list[i].auth;
		        for(var b = 0; b < auth.length; b++){
		        	html.push(' <i class="icon_'+b+'">'+auth[b].jc+'</i>');
		        }
		        html.push('</div>');
		        html.push('</h3>');
		        html.push('<p class="fn-clear phone"><span class="tel fn-left">'+list[i].tel+'</span><span class="juli fn-right">'+list[i].distance+'</span></p>');
		        html.push('<div class="like-msg">');
		        html.push('<span class="type">'+list[i].typename[0]+'</span><em>|</em><span>'+list[i].address+'</span>');
		        html.push('</div>');
		        html.push('</div>');
		        html.push('</a>');
		        html.push('</li>');
	        }
	       	$('.like-list ul').append(html.join(''));
	       	isload = false;
	        if (page >= totalPage) {
	        	$(".loading").html(''+langData['siteConfig'][18][7]+'').show();
	        	isload = true;
	        }
	      }else{
        	isload = true;
			$('.like-list ul').html('<div class="loading">'+data.info+'</div>');
	      }
	    },
	    error: function(){
        $('.loading').show();
			$('.like-list ul').html('<div class="loading">网络错误！</div>');
	    }
	});
  };

  //翻页
  	var isload = false;
	$(document).ready(function() {
		$(window).scroll(function() {
			var allh = $('body').height();
			var w = $(window).height();
			var scroll = allh - w;
			if ($(window).scrollTop() + 50 > scroll && !isload) {
				page++;
				getList(page);
			};
		});
	});

});

})
