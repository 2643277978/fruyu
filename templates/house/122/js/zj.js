$(function(){
	// 判断浏览器是否是ie8、ie9
    if($.browser.msie && parseInt($.browser.version) >= 8){
        $('.estatecon .esbox:last-child').css('margin-right','0');
    }

	var addr;
	var orderby;
    $('.filter').delegate('a', 'click', function(event) {
		var t = $(this), i = t.index(),val = t.text(),cla = t.parent().attr("class"),id = t.attr("data-id"),par = t.closest('dl');
		if(par.hasClass('fi-state')){return false;}

		if(cla == "pos-item fn-clear"){
			if(i == 0){
				$(".pos-item a").removeClass('curr');
				t.addClass('curr');
				$(".business").remove();
				$(".addrid").remove();
				$('.area').hide();
			}
			if(i != 0 && !t.hasClass('curr')){
				$(".pos-item a").removeClass('curr');
				t.addClass('curr');
				$('.area').show();
				if(id != ''){
					$('.fi-state').show();
					$(".addrid").remove();
					$(".business").remove();
					$('.fi-state dd').prepend('<a class="addrid" href="javascript:;" data-id="'+id+'">'+val+'<i class="idel"></i></a>');
				}else{
					$('.fi-state').hide();
				}
			}
			addr = $(this).data("id");
			getArea(addr);
		}else{
			if(i == 0){
				$(".pos-sub-item a").removeClass('curr');
				$(".business").remove();
				var itemt = $(".pos-item .curr").text();
				var itemid = $(".pos-item .curr").attr("data-id");
				if($(".addrid").length==0){
					$('.fi-state dd').prepend('<a class="addrid" href="javascript:;" data-id="'+itemid+'">'+itemt+'<i class="idel"></i></a>');
				}
				addr = t.data("id");
				t.addClass('curr');
			}
			if(i != 0 && !t.hasClass('curr')){
				t.addClass('curr').siblings('a').removeClass('curr');
				$('.fi-state').show();
				if(id != ''){
					$('.fi-state').show();
					$(".addrid").remove();
					$(".business").remove();
					addr = t.data("id");
					$('.fi-state dd').prepend('<a class="business" href="javascript:;" data-id="'+id+'">'+val+'<i class="idel"></i></a>');
				}else{
					$('.fi-state').hide();
				}
			}
		}
		atpage = 1;
		getList();
		delState(id);
	});

	//获取子地区
	function getArea(addrid){
		addrid = addrid=='' || addrid=="undefinde" ? 0 : addrid;
		$.ajax({
            url: masterDomain+"/include/ajax.php?service=house&action=addr",
            type: "POST",
            data: {
            	"type": addrid
            },
            dataType: "json",
			success: function(data){
				if(data.state == 100){
					var list = data.info, html = [];
					html.push('<a data-type="business" data-id="'+addrid+'" href="javascript:;" class="curr">不限</a>');
					for(var i = 0; i < list.length; i++){
						html.push('<a data-type="business" data-id="'+list[i].id+'" href="javascript:;">'+list[i].typename+'</a>');
					}
					$(".pos-sub-item").html(html.join(""));
				}
			}
		});
	}


	//排序
	$(".m-t li").bind("click", function(){
		var t = $(this),i = t.index(),id = t.attr('data-id'),type = t.attr('data-type');

		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
			if(type=="time"){
				id = t.hasClass("up") ? 2 : 1;
				t.attr('data-id',id);
			}else if(type=="nums"){
				id = t.hasClass("up") ? 4 : 3;
				t.attr('data-id',id);
			}
		}else{
			if(t.hasClass("curr") && t.hasClass("ob")){
				t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
				if(type=="time"){
					id = t.hasClass("up") ? 2 : 1;
					t.attr('data-id',id);
				}else if(type=="nums"){
					id = t.hasClass("up") ? 4 : 3;
					t.attr('data-id',id);
				}
			}
		}

		orderby = id;
		atpage = 1;
		getList();

	});



	function delState(num){
		// 条件删除
		$('.fi-state').delegate('.idel', 'click', function(event) {
			var t = $(this), par = t.closest('a');
			if(par.attr('data-id')==num){
				var className = t.parent("a").attr("class");
				if(className=="addrid"){
					$(".pos-item a").eq(0).addClass('curr').siblings('a').removeClass('curr');
					$(".area").hide();
					addr = 0;
				}else if(className=="business"){
					$(".pos-sub-item a").eq(0).addClass('curr').siblings('a').removeClass('curr');
					var itemt = $(".pos-item .curr").text();
					var itemid = $(".pos-item .curr").attr("data-id");
					if($(".addrid").length==0){
						$('.fi-state dd').prepend('<a class="addrid" href="javascript:;" data-id="'+itemid+'">'+itemt+'<i class="idel"></i></a>');
					}
					addr = $(".pos-item .curr").attr("data-id");
				}
				par.remove();
				atpage = 1;
				getList();
			}
		});

	}

	var keywords = '';
	$('.submit').click(function(e){
		e.preventDefault();
		keywords = $('#keywords').val();
		if(keywords!=''){
			atpage = 1;
			getList();
		}
	})



	// 清空条件
	$('.fi-state').delegate('.btn_clear', 'click', function(event) {
		$(this).closest('.fi-state').find('dd').html('');
		$(".pos-item a").eq(0).addClass('curr').siblings('a').removeClass('curr');
		$(".area").hide();
		$(".pos-sub-item a").eq(0).addClass('curr').siblings('a').removeClass('curr');
		$(".m-t li").eq(0).addClass("curr").siblings("li").removeClass("curr");
		$(".ob").eq(0).attr("data-id",1);
		$(".ob").eq(1).attr("data-id",3);
		$(".ob").removeClass("up");
		addr=0;
		orderby='';
		$('#keywords').val('');
		keywords = '';
		atpage = 1;
		getList();
	});

	getList(1)

	function getList(){

		$(".lplist").html("");

		$.ajax({
	            url: masterDomain+"/include/ajax.php?service=house&action=zjComList",
	            type: "POST",
	            data: {
	            	"addrid": addr,
	            	"orderby": orderby,
	            	"page": atpage,
	            	"keywords":keywords,
	            	"pageSize" : pageSize
	            },
	            dataType: "json",
				success: function(data){
					if(data.state == 100){
						var list = data.info.list, html = [], pageInfo = data.info.pageInfo;

                    	$(".totalCount b").html(pageInfo.totalCount);
                    	totalCount = pageInfo.totalCount;
                    	var tpage = Math.ceil(totalCount/pageSize);

						for(var i = 0; i < list.length; i++){


							html.push('<li class="fn-clear">');
							html.push('<div class="lImgbox fn-left">');
							html.push('<a href="'+list[i].url+'">');
                          	var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
							html.push('<img src="'+litpic+'" alt="">');
							html.push('</a>');
							html.push('</div>');
							html.push('<div class="rInbox fn-left">');
							html.push('<div class="lptit fn-clear">');
							//if(list[i].isbid==1){
								//html.push('<a href="'+list[i].url+'"><h2>'+list[i].title+'</h2><i class="mtop"></i></a>');
							//}else{
								//html.push('<a href="'+list[i].url+'"><h2>'+list[i].title+'</h2></a>');
							//}
							html.push('<a href="'+list[i].url+'"><h2>'+list[i].title+'</h2></a>');
							html.push('<a href="'+list[i].url+'" class="btn_enter">进入店铺</a>');
							html.push('</div>');
							html.push('<div class="lpinf fn-clear">');
							html.push('<span class="sp_l fn-left">['+list[i].addrName[3]+']  '+list[i].address+'</span>');
							html.push('<span class="sp_r fn-right"><i class="ilptel"></i>'+list[i].tel+'</span>');
							html.push('</div>');
							html.push('<div class="lpinf fn-clear">');
							html.push('<span>出租 <b>'+list[i].countZu+'</b></span><em>|</em><span>出售 <b>'+list[i].countSale+'</b></span><em>|</em><span>团队 <b>'+list[i].countTeam+'</b></span>');
							html.push('</div>');
							html.push('<div class="estatecon fn-clear estatecon'+list[i].id+'">');
							getZulist(list[i].id);
							html.push('</div>');
							html.push('</div>');
							html.push('</li>');
						}
						$(".lplist").html(html.join(""));

						showPageInfo();
					}else{
						$(".totalCount b").html(0);
						$(".lplist").html('<div class="empty">抱歉！ 未找到相关中介公司</div>');
					}
				}
			})
	}

	function getZulist(uid){
		$.ajax({
	            url: masterDomain+"/include/ajax.php?service=house&action=getSaleRent",
	            type: "POST",
	            data: {
	            	"zjcom": uid,
	            	"page": 1,
	            	"pageSize" : 3
	            },
	            dataType: "json",
				success: function(data){
					if(data.state == 100){
						var list = data.info, html = [];
						for(var i = 0; i < list.length; i++){

							html.push('<div class="esbox">');
							html.push('<div class="imgbox">');
							html.push('<a href="'+list[i].url+'">');
                          	var litpic = list[i].litpic != "" && list[i].litpic != undefined ? huoniao.changeFileSize(list[i].litpic, "small") : "/static/images/404.jpg";
							html.push('<img src="'+litpic+'" alt="">');
							html.push('</a>');
							html.push('<div class="markbox">');
							if(list[i].type==0){
								html.push('<span class="m_mark m_cz">出租</span>');
							}else{
								html.push('<span class="m_mark m_cs">出售</span>');
							}
							html.push('</div>');
							html.push('</div>');
							html.push('<div class="infobox">');
							html.push('<div class="headimg">');
							html.push('<a href="javascript:;"><img src="'+list[i].userPhoto+'" alt=""></a>');
							html.push('</div>');
							html.push('<div class="txtbox">');
							html.push('<a href="javascript:;"><h4>'+list[i].title+'</h4></a>');
							var pricetext = '';
							if(list[i].price>0){
								pricetext = list[i].type==1? '<b>' + list[i].price + '</b> 万' : '<b>' + list[i].price + '</b> 元/月';
							}else{
								pricetext = '<b>面议</b>';
							}
							html.push('<p class="pprice fn-clear"><span>'+pricetext+'</span></p>');
							html.push('<p class="parea"><span>'+list[i].room+'</span><em>|</em><span>'+list[i].area+'㎡</span></p>');
							html.push('</div>');
							html.push('</div>');
							html.push('</div>');
						}
						$(".estatecon"+uid).html(html.join(''));
					}
				}
		});
	}


	//打印分页
	function showPageInfo() {
	    var info = $(".pagination");
	    var nowPageNum = atpage;
	    var allPageNum = Math.ceil(totalCount/pageSize);
	    var pageArr = [];

	    info.html("").hide();

	    //输入跳转
	    var redirect = document.createElement("div");
	    redirect.className = "pagination-gotopage";
	    redirect.innerHTML = '<label for="">跳转</label><input type="text" class="inp" maxlength="4" /><input type="button" class="btn" value="GO" />';
	    info.append(redirect);

	    //分页跳转
	    info.find(".btn").bind("click", function(){
	        var pageNum = info.find(".inp").val();
	        if (pageNum != "" && pageNum >= 1 && pageNum <= Number(allPageNum)) {
	            atpage = pageNum;
	            getList();
	        } else {
	            info.find(".inp").focus();
	        }
	    });

	    var pages = document.createElement("div");
	    pages.className = "pagination-pages";
	    info.append(pages);

	    //拼接所有分页
	    if (allPageNum > 1) {

	        //上一页
	        if (nowPageNum > 1) {
	            var prev = document.createElement("a");
	            prev.className = "prev";
	            prev.innerHTML = '上一页';
                    prev.setAttribute('href','#');
	            prev.onclick = function () {
	                atpage = nowPageNum - 1;
	                getList();
	            }
	        } else {
	            var prev = document.createElement("span");
	            prev.className = "prev disabled";
	            prev.innerHTML = '上一页';
	        }
	        info.find(".pagination-pages").append(prev);

	        //分页列表
	        if (allPageNum - 2 < 1) {
	            for (var i = 1; i <= allPageNum; i++) {
	                if (nowPageNum == i) {
	                    var page = document.createElement("span");
	                    page.className = "curr";
	                    page.innerHTML = i;
	                } else {
	                    var page = document.createElement("a");
	                    page.innerHTML = i;
                            page.setAttribute('href','#');
	                    page.onclick = function () {
	                        atpage = Number($(this).text());
	                        getList();
	                    }
	                }
	                info.find(".pagination-pages").append(page);
	            }
	        } else {
	            for (var i = 1; i <= 2; i++) {
	                if (nowPageNum == i) {
	                    var page = document.createElement("span");
	                    page.className = "curr";
	                    page.innerHTML = i;
	                }
	                else {
	                    var page = document.createElement("a");
	                    page.innerHTML = i;
                            page.setAttribute('href','#');
	                    page.onclick = function () {
	                        atpage = Number($(this).text());
	                        getList();
	                    }
	                }
	                info.find(".pagination-pages").append(page);
	            }
	            var addNum = nowPageNum - 4;
	            if (addNum > 0) {
	                var em = document.createElement("span");
	                em.className = "interim";
	                em.innerHTML = "...";
	                info.find(".pagination-pages").append(em);
	            }
	            for (var i = nowPageNum - 1; i <= nowPageNum + 1; i++) {
	                if (i > allPageNum) {
	                    break;
	                }
	                else {
	                    if (i <= 2) {
	                        continue;
	                    }
	                    else {
	                        if (nowPageNum == i) {
	                            var page = document.createElement("span");
	                            page.className = "curr";
	                            page.innerHTML = i;
	                        }
	                        else {
	                            var page = document.createElement("a");
	                            page.innerHTML = i;
                                    page.setAttribute('href','#');
	                            page.onclick = function () {
	                                atpage = Number($(this).text());
	                                getList();
	                            }
	                        }
	                        info.find(".pagination-pages").append(page);
	                    }
	                }
	            }
	            var addNum = nowPageNum + 2;
	            if (addNum < allPageNum - 1) {
	                var em = document.createElement("span");
	                em.className = "interim";
	                em.innerHTML = "...";
	                info.find(".pagination-pages").append(em);
	            }
	            for (var i = allPageNum - 1; i <= allPageNum; i++) {
	                if (i <= nowPageNum + 1) {
	                    continue;
	                }
	                else {
	                    var page = document.createElement("a");
	                    page.innerHTML = i;
                            page.setAttribute('href','#');
	                    page.onclick = function () {
	                        atpage = Number($(this).text());
	                        getList();
	                    }
	                    info.find(".pagination-pages").append(page);
	                }
	            }
	        }

	        //下一页
	        if (nowPageNum < allPageNum) {
	            var next = document.createElement("a");
	            next.className = "next";
	            next.innerHTML = '下一页';
                    next.setAttribute('href','#');
	            next.onclick = function () {
	                atpage = nowPageNum + 1;
	                getList();
	            }
	        } else {
	            var next = document.createElement("span");
	            next.className = "next disabled";
	            next.innerHTML = '下一页';
	        }
	        info.find(".pagination-pages").append(next);

	        info.show();

	    }else{
	        info.hide();
	    }
	}
})