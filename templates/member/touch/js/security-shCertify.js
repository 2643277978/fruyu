$(function(){

	  //实名认证
		$("#submit").bind("click", function(){
			var realname = $("#realname"), idcard = $("#idcard"), front = '', back = '', license = '', btn = $(this);
			if(realname.val() == ""){
				showMsg(langData['siteConfig'][20][248]);
				realname.focus();
				return "false";
			}
			if(idcard.val() == ""){
				showMsg(langData['siteConfig'][20][106]);
				idcard.focus();
				return "false";
			}
			// if(!checkIdcard(idcard.val())){
			// 	showMsg("请输入正确的身份证号码");
			// 	idcard.focus();
			// 	return "false";
			// }

			var imglist = [], imgli = $("#fileList li.thumbnail");
			// console.log(imgli.length)
			// if(imgli.length != 2){
			// 	showMsg(langData['siteConfig'][20][249]);
			// 	return false;
			// }

			/*imgli.each(function(i){
				var t = $(this),val = t.find("img").attr("data-val");
				if(val != ''){
					if(userType == 2){
						if(i == 0) license = val;
						if(i == 1) back = val;
						if(i == 2) front = val;
					}else{
						if(i == 0) back = val;
						if(i == 1) front = val;
					}
				}
			})*/
			front = $('#idcardFront').val();
			back  = $('#idcardBack').val();
			if(userType==2){
				license = $('#licenseCom').val();
			}


			var param = "realname="+realname.val()+"&idcard="+idcard.val()+"&front="+front+"&back="+back+"&license="+license;
    		modifyFun(btn,langData['siteConfig'][6][128],'certify',param);

		});

		//查看实名认证资料

		waiting && getdata();

		function getdata(){
			$.ajax({
				url: masterDomain+"/include/ajax.php?service=member&action=updateAccount&do=getCerfityData",
				type: "GET",
				dataType: "jsonp",
				success: function (data) {
					//获取成功
					if(data && data.state != 200){
						bindCertifyData(data.info);
					//获取失败
					}else{
						alert(langData['siteConfig'][20][250]);
					}
				}
			});
		}

		//填充认证数据
		function bindCertifyData(data){
			if(data){
				$("#realname").text(data.realname);
				$("#idcard").text(data.idcard);
				var picCon = $('#imgCard');
				picCon.append(' <div class="card-file webuploader">'+
	                '<img src="'+data.front+'" id="idcardFimg">'+
	                '<div class="input-img" id="idcardF"></div>'+
	                '<input type="hidden" name="idcardFront" value="" id="idcardFront">'+
	           		'</div>');
				picCon.append('<div class="file-side webuploader">'+
	                '<img src="'+data.back+'" id="idcardBimg">'+
	                '<div class="input-img" id="idcardB"></div>'+
	                '<input type="hidden" name="idcardBack" value="" id="idcardBack">'+
            		'</div>')
				if(userType == 2){
					picCon.append('<li class="item" id="item_2"><img src="'+data.license+'" alt="" /></li>')
				}
			}else{
				alert(langData['siteConfig'][20][250]);
			}
		}

		 // 上传身份证正面
		  var upPhoto = new Upload({
		    btn: '#idcardF',
		    bindBtn: '',
		    title: 'Images',
		    mod: 'siteConfig',
		    params: 'type=atlas',
		    atlasMax: 1,
		    deltype: 'delAtlas',
		    replace: true,
		    fileQueued: function(file){

		    },
		    uploadSuccess: function(file, response){
		      if(response.state == "SUCCESS"){
		        var img = $("#idcardFimg");
		        if(img.length){
		          var old = img.attr('data-url');
		          upPhoto.del(old);
		        }
		        $("#idcardFimg").attr('src',response.turl);
		        $("#idcardFimg").attr('data-url',response.url);
		        $("#idcardFront").val(response.url);
		      }
		    },
		    showErr: function(info){
		      showMsg(info);
		    }
		  });

		  //上传身份证反面
		  var upPhoto = new Upload({
		    btn: '#idcardB',
		    bindBtn: '',
		    title: 'Images',
		    mod: 'siteConfig',
		    params: 'type=atlas',
		    atlasMax: 1,
		    deltype: 'delAtlas',
		    replace: true,
		    fileQueued: function(file){

		    },
		    uploadSuccess: function(file, response){
		      if(response.state == "SUCCESS"){
		        var img = $("#idcardBimg");
		        if(img.length){
		          var old = img.attr('data-url');
		          upPhoto.del(old);
		        }
		        $("#idcardBimg").attr('src',response.turl);
		        $("#idcardBimg").attr('data-url',response.url);
		        $("#idcardBack").val(response.url);
		      }
		    },
		    showErr: function(info){
		      showMsg(info);
		    }
			});
			
			//上传身份证反面
		  var upPhoto = new Upload({
		    btn: '#licenseC',
		    bindBtn: '',
		    title: 'Images',
		    mod: 'siteConfig',
		    params: 'type=atlas',
		    atlasMax: 1,
		    deltype: 'delAtlas',
		    replace: true,
		    fileQueued: function(file){

		    },
		    uploadSuccess: function(file, response){
		      if(response.state == "SUCCESS"){
		        var img = $("#licenseCimg");
		        if(img.length){
		          var old = img.attr('data-url');
		          upPhoto.del(old);
		        }
		        $("#licenseCimg").attr('src',response.turl);
		        $("#licenseCimg").attr('data-url',response.url);
		        $("#licenseCom").val(response.url);
		      }
		    },
		    showErr: function(info){
		      showMsg(info);
		    }
		  });



})



//判断身份证信息
function checkIdcard(sId) {
	var tj = true;
	var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
	var iSum = 0
	var info = ""
	if (!/^\d{17}(\d|x)$/i.test(sId)) {
		tj = false;
	}
	sId = sId.replace(/x$/i, "a");
	if (aCity[parseInt(sId.substr(0, 2))] == null) {
		tj = false;
	}
	sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
	var d = new Date(sBirthday.replace(/-/g, "/"))
	if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
		tj = false;
	}
	for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
	if (iSum % 11 != 1) {
		tj = false;
	}
	return tj;
}

// 错误提示
function showMsg(str){
  var o = $(".error");
  o.html('<p>'+str+'</p>').show();
  setTimeout(function(){o.hide()},1000);
}

function modifyFun(btn, btnstr, type, param, func){
  var data = param == undefined ? '' : param;
  btn.addClass('disabled').text(langData['siteConfig'][6][35]+'...');
  $.ajax({
    url: masterDomain+"/include/ajax.php?service=member&action=updateAccount&do="+type,
    data: data,
    type: "POST",
    dataType: "jsonp",
    success: function (data) {
      if(data && data.state == 100){
        alert(data.info);
        location.href = pageUrl;
      }else{
        alert(data.info);
        btn.removeClass('disabled').text(btnstr);
      }
    },
    error: function(){
      alert(langData['siteConfig'][20][183]);
      btn.removeClass('disbaled').text(btnstr);
    }
  })
}

//上传成功接收
function uploadSuccess(obj, file, filetype, path){
	console.log('aaaaa')
}
