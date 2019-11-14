$(function(){
	var c = 0, e = 0, f = 0, g = false;

	var hasyue = [], haspass = [];
	getHasyue("meet","out");
	haspass = remembPassId('get');



	$('.index-pic').bind("touchstart", function() {
        c = event.touches[0].pageX;
    });

    $('.index-pic').bind( "touchmove", function() {
        event.preventDefault();
        e = event.targetTouches[0].pageX;
        f = e - c;
        g = true
    });

    $('.index-pic').bind("touchend", function() {
        g && (0 > f ? doLikeOrNotLike("toLeft") : doLikeOrNotLike("toRight"), g = !1)
    });

    //喜欢&不喜欢
    $(".netbox .btn").bind("click", function(){
    	doLikeOrNotLike($(this).hasClass("not") ? "toLeft" : "toRight");
    });
    $('.yes').click(function(){
    	var x = $(this);
	  	x.addClass('yy');
	  	setTimeout(function() {
        x.removeClass("yy")}, 250)
    })

    function doLikeOrNotLike(a){
    	var userid = $.cookie(cookiePre+"login_user");
        if(userid == null || userid == ""){
            location.href = '/login.html';
            return false;
        }

        var load =  $('.index-pic .load:eq(0)'), next = load.prev(), img = next.children('img');
		$('.index-pic .load').removeClass('load');
		next.addClass('load');
		img.attr('src',img.attr('data-src'));

        var b = this, c = $(".index-pic a").length, d = $(".index-pic a:last");
        if (c > 2) {
            var f = d.attr("userid");
            "toRight" == a ? flyToRight(f, 1) : "toLeft" == a && flyToLeft(f);
        } else {
			var f = d.attr("userid");
			"toRight" == a ? flyToRight(f, 1) : "toLeft" == a && flyToLeft(f);
			atpage++;
			getList();
        }
    }

    function flyToLeft(a) {
        var b = this, c = $('.index-pic a[userid="'+a+'"]');
        remembPassId('add', a);
        return c.addClass("toleft"), c.fadeOut(300, function() {
            c.remove()
        });
    }

    function flyToRight (a, b) {
        var c = this;
        if (1 == b) {
            var d = c.$('.index-pic a[userid="'+a+'"]');
            d.addClass("toright"), d.fadeOut(300, function() {
                d.remove()
            })

            $.post("/include/ajax.php?service=dating&action=visitOper&type=3&id="+a);
    	}
    }

    var isload = false;
	getList(1);


		function getList(tr){
			if(isload) return;
			isload = true;

			//如果进行了筛选或排序，需要从第一页开始加载
			if(tr){
				atpage = 1;
				// $(".list-box ul").html("");
			}

			if($('.index-pic .item').length == 0 && $('.loading').length == 0){
				$('.index-pic').append('<a href="javascript:;" class="loading"><div></div><div></div><div></div><div></div><div></div></a>');
			}

			$.ajax({
				url: masterDomain+"/include/ajax.php?service=dating&action=memberList&page="+atpage+"&pageSize=10",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data.state == 100){

						var list = [], data = data.info.list, has = 0;
						for(var i = 0; i < data.length; i++){
							// 已打过招呼或pass的用户不显示
							if(hasyue.in_array(data[i].id) || haspass.in_array(data[i].id)){
								has++;
								continue;
							}

							var  educationName = data[i].educationName, incomeName = data[i].incomeName, age = data[i].age;
							var src = staticPath + '/images/blank.gif';

							list.push('<a href="'+data[i].url+'" userid="'+data[i].id+'" class="item">');
							list.push('<img src="'+src+'" data-src="'+data[i].photo+'" class="pp">');
							list.push('<div style="background: #fff; width: 4.6rem; margin: 0 auto; line-height: 0.5rem;">');
							list.push('<span><strong>'+data[i].nickname+'</strong></span>');
							list.push('<p>');
							if (age) {
								list.push('<i>'+data[i].age+'岁</i>');
							}
							list.push('<i>'+data[i].height+'cm</i>');
							if (educationName) {
								list.push('<i>'+data[i].educationName+'</i>');
							}
							if (incomeName) {
								list.push('<i>'+data[i].incomeName+'元</i>');
							}
							list.push('</p>');
							list.push('<b></b><em></em>');
							list.push('</div>');
							list.push('</a>');
						}

						isload = false;

						if(has == data.length){
							atpage++;
							getList();
						}else{
							$(".index-pic").prepend(list.join(""));
							var last = $(".index-pic .item").slice(-2);
							last.each(function(m){
								var a = $(this), img = a.children('img');
								img.attr('src',img.attr('data-src'));
								if(m == 0){
									a.addClass('load');
								}
							})
							if($(".index-pic .item").length < 2){
								atpage++;
								getList();
							}

							if($('.loading').length > 0){
								$('.loading').fadeOut(500,function(){
									$('.loading').remove();
								});
							}
						}

					}
				}
			});


		}

		// 获取已打招呼的会员
		function getHasyue(oper,act){
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=dating&action=visit&oper="+oper+"&act="+act+"&page=1&pageSize=9999",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state != 200){
						if(data.state == 100){
							var list = data.info.list;
							if(list.length > 0){
								for(var i = 0; i < list.length; i++){
									hasyue.push(list[i].member.id);
								}
							}
						}
					}
				}
			})
		}

		// 跳过的会员id存入cookie;
		function remembPassId(type, id){
			var dating_pass = $.cookie(cookiePre+'dating_pass'), list = [];
			if(dating_pass){
				dating_pass = dating_pass + ','+id;
				list = dating_pass.split(',');
			}else{
				dating_pass = id;
			}
			if(type == 'get') return list;

			$.cookie(cookiePre + 'dating_pass', dating_pass, {expires: 999999, domain: masterDomain.replace("http://", ""), path: '/'});
		}


})

Array.prototype.in_array = function(e){
	for(i=0;i<this.length && this[i]!=e;i++);
	return !(i==this.length);
}
