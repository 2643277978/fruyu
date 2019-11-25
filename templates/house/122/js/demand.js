$(function(){

	//数量显示
	$('.totalCount b').html(totalCount);

	 var addr;
	 var act;
	 var orderby = 1;
	 var typeid;
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
					$(".business").remove();
					$(".addrid").remove();
					$('.fi-state dd').prepend('<a class="addrid" href="javascript:;" data-id="'+id+'">'+val+'<i class="idel"></i></a>');
				}else{
					$('.fi-state').hide();
				}
			}
			addr = $(this).data("id");
			getArea(addr);
		}else{
			if(i == 0){
				if(t.data("type")=='business'){
					$(".pos-sub-item a").removeClass('curr');
					$(".business").remove();
					var itemt = $(".pos-item .curr").text();
					var itemid = $(".pos-item .curr").attr("data-id");
					if($(".addrid").length==0){
						$('.fi-state dd').prepend('<a class="addrid" href="javascript:;" data-id="'+itemid+'">'+itemt+'<i class="idel"></i></a>');
					}
					addr = t.data("id");
				}else{
					$(".pos-sub-type a").removeClass('curr');
					$(".act").remove();
					act = '';
				}
				t.addClass('curr');
			}
			if(i != 0 && !t.hasClass('curr')){
				t.addClass('curr').siblings('a').removeClass('curr');
				$('.fi-state').show();
				if(id != ''){
					$('.fi-state').show();
					if(t.data("type")=='business'){
						$(".addrid").remove();
						$(".business").remove();
						addr = t.data("id");
						$('.fi-state dd').prepend('<a class="business" href="javascript:;" data-id="'+id+'">'+val+'<i class="idel"></i></a>');
					}else{
					    $(".act").remove();
					    act = t.data("id");
						$('.fi-state dd').prepend('<a class="act" href="javascript:;" data-id="'+id+'">'+val+'<i class="idel"></i></a>');
					}

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
		var t = $(this),i = t.index(),id = t.attr('data-id');

		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("li").removeClass("curr");
		}else{
			if(t.hasClass("curr") && t.hasClass("ob")){
				t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
			}
		}

		typeid = id;
		atpage = 1;
		getList();

	});

	$(".m-o a").bind("click", function(){
		var t = $(this),i = t.index(),id = t.attr('data-id');
		if(i==1){
			pantime = id;
		}else if(i==2){
			price = id;
		}

		if(!t.hasClass("curr")){
			t.addClass("curr").siblings("a").removeClass("curr");
		}else{
			if(t.hasClass("curr") && t.hasClass("ob")){
				t.hasClass("up") ? t.removeClass("up") : t.addClass("up");
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
				}else if(className=="act"){
					$(".pos-sub-type a").eq(0).addClass('curr').siblings('a').removeClass('curr');
					act = '';
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
		$(".pos-sub-type a").eq(0).addClass('curr').siblings('a').removeClass('curr');
		$(".m-t li").eq(0).addClass("curr").siblings("li").removeClass("curr");
		$(".m-l a").eq(0).addClass("curr").siblings("a").removeClass("curr");
		addr=0;
		orderby=1;
		act = '';
		typeid='';
		$('#keywords').val('');
		keywords = '';
		atpage = 1;
		getList();
	});

	getList(1)

	function getList(tr){
		//if(tr){
			//atpage = 1;
			$(".lplist").html("");
			$(".pagination").html('').hide();
		//}
		$.ajax({
	            url: masterDomain+"/include/ajax.php?service=house&action=demand",
	            type: "POST",
	            data: {
	            	"addrid": addr,
	            	"act": act,
	            	"page": atpage,
	            	"orderby": orderby,
	            	"typeid": typeid,
	            	"title" : keywords,
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
							html.push('<div class="markbox">');
							var typetext = list[i].type==1 ? "<span class='m_mark m_qg'></span>" : "<span class='m_mark m_qz'></span>";
							html.push(typetext);
							html.push('</div>');
							html.push('<div class="infbox fn-left">');
							html.push('<div class="lptit fn-clear">');
							html.push('<h2>'+list[i].title+'</h2>');
							html.push('<a href="javascript:;" class="manage" data-id="'+list[i].id+'">管理</a>');
							html.push('</div>');
							html.push('<p class="lpinf">'+list[i].note+'</p>');
							html.push('<div class="lpinf fn-clear">');
							html.push('<div class="sp_l fn-left"><span class="priCo">'+list[i].action+'</span><em>|</em><span>'+list[i].addr[0]+'-'+list[i].addr[1]+'</span><em>|</em><span>'+list[i].pubdate+'</span></div>');
							html.push('</div>');
							html.push('</div>');
							html.push('<div class="perbox fn-left">');
							html.push('<p class="pname"><i class="iname"></i>'+list[i].person+'</p>');
							html.push('<p class="ptel"><i class="itel"></i>'+list[i].contact+'</p>');
							html.push('</div>');
							html.push('</li>');
						}
						$(".lplist").html(html.join(""));

						showPageInfo();
					}else{
						$(".totalCount b").html(0);
						$(".lplist").html('<div class="empty">抱歉！ 未找到相关房源</div>');
					}
				}
			})
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





	var aid = 0;
	//管理按钮
	$('.main_con').delegate('.manage', 'click', function(){
		var t = $(this), id = t.attr('data-id');
		$('.popup-fabu .fabu-form').show();
		$('.popup-fabu').show();

		if(t.hasClass('disabled')) return false;

		if(id && id != undefined){
			aid = id;

			t.addClass('disabled');

			//获取信息详细信息
			$.ajax({
				url: masterDomain + '/include/ajax.php?service=house&action=demandDetail&id=' + aid,
				dataType: "jsonp",
				success: function (data) {
					t.removeClass('disabled');
					if(data && data.state == 100){
						var info = data.info;

						$('#title').val(info.title);
						$('#note').val(info.note);
						$('input[name=act][value='+info.action+']').attr('checked', true);
						$('input[name=type][value='+info.type+']').attr('checked', true);
						$('.popup-fabu .addrBtn').attr('data-ids', info.addrIds.join(' ')).attr('data-id', info.addrid).html(info.addrName.join('/'));
						$('#person').val(info.person);
						$('#contact').val(info.contact);

						$('.popup-fabu .tit').html('修改求租求购信息<s></s>');
						$('#tj').html('提交修改');
						$('.popup-fabu .edit').show();
						$('html').addClass('nos');
						$('.popup-fabu').show();
					}else{
						alert(data.info);
					}
				},
				error: function(){
					t.removeClass('disabled');
					alert(langData['siteConfig'][20][183]);
				}
			});
		}
	});

	//发布
	$('#put').bind('click', function(){
		$('.popup-fabu .tit').html('快速发布求租求购<s></s>');
		$('#tj').html('立即发布');
		$('.popup-fabu .edit').hide();
		$('html').addClass('nos');
		$('.popup-fabu').show();
		$('.popup-fabu input[type=text], .popup-fabu textarea').val('');
		$('.addrBtn').attr('data-ids', '').attr('data-id', '').html('请选择');
	});

	//关闭
	$('.popup-fabu').delegate('.tit s', 'click', function(){
		$('html').removeClass('nos');
		$('.popup-fabu').hide();
	});

	//回车提交
  $('.popup-fabu input').keyup(function (e) {
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
      $('#tj').click();
    }
  });

  //验证提示弹出层
  function showMsg(msg){
    $('.fabu-form .con').append('<p class="ptip">'+msg+'</p>')
    setTimeout(function(){
    $('.ptip').remove();
    },2000);
  }

	//提交
	$('#tj').bind('click', function(){
		var t = $(this);
		var ids = $('.popup-fabu .addrBtn').attr('data-ids');
		var idsArr = ids.split(' ');
		var title = $.trim($('#title').val()),
				note = $.trim($('#note').val()),
				act = $('input[name=act]:checked').val(),
				type = $('input[name=type]:checked').val(),
				manage = $('input[name=manage]:checked').val(),
				cityid = idsArr[0],
				addr = idsArr[idsArr.length-1],
				person = $.trim($('#person').val()),
				contact = $.trim($('#contact').val()),
				password = $.trim($('#password').val());

		if(title == ''){
			errMsg = "请输入标题！";
			showMsg(errMsg);
			return false;
		}

		if(note == ''){
			errMsg = "请输入需求描述！";
			showMsg(errMsg);
			return false;
		}

		if(act == '' || act == 0 || act == undefined){
			errMsg = "请选择类别！";
			showMsg(errMsg);
			return false;
		}

		if(type == '' || type == undefined){
			errMsg = "请选择供求！";
			showMsg(errMsg);
			return false;
		}

		if(addr == '' || addr == 0){
			errMsg = "请选择位置！";
			showMsg(errMsg);
			return false;
		}

		if(person == ''){
			errMsg = "请输入联系人！";
			showMsg(errMsg);
			return false;
		}

		if(contact == ''){
			errMsg = "请输入联系电话！";
			showMsg(errMsg);
			return false;
		}

		if(password == ''){
			errMsg = "请输入管理密码！";
			showMsg(errMsg);
			return false;
		}

		t.attr('disabled', true);

		var action = aid ? 'edit' : 'put';

		//删除
		if(manage == '2'){
			$.ajax({
				url: masterDomain + '/include/ajax.php?service=house&action=del&type=demand&password=' + password + '&id=' + aid,
				dataType: "jsonp",
				success: function (data) {
					if(data && data.state == 100){
						delMsg = "删除成功！";
						showMsg(delMsg);
						location.reload();
					}else{
						showMsg(data.info);
						t.removeAttr('disabled');
					}
				},
				error: function(){
					showMsg(langData['siteConfig'][20][183]);
					t.removeAttr('disabled');
				}
			});
			return false;
		}

		$.ajax({
			url: masterDomain + '/include/ajax.php?service=house&action='+action+'&type=demand',
			data: {
				'id': aid,
				'title': title,
				'note': note,
				'category': type,
				'lei': act,
				'cityid': cityid,
				'addrid': addr,
				'person': person,
				'contact': contact,
				'password': password
			},
			type: "POST",
			dataType: "jsonp",
			success: function (data) {
				if(data && data.state == 100){

					var info = data.info.split('|');
					if(info[1] == 1){
						showMsg(aid ? '修改成功' : '发布成功！');
					}else{
						showMsg(aid ? '提交成功，请等待管理员审核！' : '发布成功，请等待管理员审核！');
					}
					location.reload();

				}else{
					showMsg(data.info);
					t.removeAttr('disabled');
				}
			},
			error: function(){
				showMsg(langData['siteConfig'][20][183]);
				t.removeAttr('disabled');
			}
		});

	});

});
