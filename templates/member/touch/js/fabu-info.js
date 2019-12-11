$(function(){

    //获取经度 纬度值
    HN_Location.init(function(data){
        $('#longitude').val(data.lng);
        $('#latitude').val(data.lat);
    });

  //年月日
  $('.demo-test-date').scroller(
  	$.extend({preset: 'date', dateFormat: 'yy-mm-dd'})
  );

  //下拉菜单
  $('.demo-test-select').scroller(
  	$.extend({preset: 'select'})
  );


  // 选择多选框
  $('.facility li').click(function(){
   $(this).toggleClass('on');
  })

  // 选择单选框
  $('.radioBox a').click(function(){
    var t = $(this), id = t.attr('data-id');
    t.addClass('active').siblings('a').removeClass('active');
    t.siblings('input').val(id);
  })

  	//价格开关
	$("input[name=price_switch]").bind("click", function(){
		if($(this).is(":checked")){
			$(".priceinfo").hide();
		}else{
			$(".priceinfo").show();
		}
	});

  //提交发布
  $("#submit").bind("click", function(event){

    var form = $("#fabuForm"), action = form.attr("action"), url = form.attr("data-url"), tj = true;

    event.preventDefault();

    var t           = $(this),
        typeid      = $("#typeid").val(),
        title       = $("#title"),
        price       = $("#price"),
        addr        = $("#addr").val(),
        person      = $("#person"),
        valid       = $("#valid"),
        tel         = $("#tel"),
        error       = $(".error"),
        text        = error.find('p');

    if(t.hasClass("disabled")) return;


    if(!typeid){
      showMsg(langData['siteConfig'][20][342]);
      tj = false;
		}
    else if(title.val() == "" || title.val() == 0){
      showMsg(langData['siteConfig'][20][343]);
      tj = false;
    }

    else if(addr == "" || addr == 0){
      showMsg(langData['siteConfig'][20][344]);
      tj = false;
    }
    else if($.trim(person.val()) == "" || $.trim(person.val()) == 0){
      showMsg(langData['siteConfig'][20][345]);
      tj = false;
      return false;
    }
    var personRegex = '[\u4E00-\u9FA5\uF900-\uFA2Da-zA-Z]{2,15}', personErrTip = langData['siteConfig'][20][346];
    var exp = new RegExp("^" + personRegex + "$", "img");
    if(!exp.test($.trim(person.val()))){
      showMsg(langData['siteConfig'][20][347]);
      tj = false;
    }
    else if(tel.val() == "" || tel.val() == 0){
      showMsg(langData['siteConfig'][20][239]);
      tj = false;
    }
    else if(!(/^1[34578]\d{9}$/.test(tel.val()))){
      // showMsg('手机号码有误，请重填');
      // tj = false;
    }
    else if(valid.val() == "" || valid.val() == 0){
      showMsg(langData['siteConfig'][20][348]);
      tj = false;
    }

    // 多选
    form.find('.flag').remove();
    $('.facility li.on').each(function(){
      var a = $(this), id = a.data('id'), name = a.closest('.facility').data('type');
      form.append('<input type="hidden" name="'+name+'" class="flag" value="'+id+'">');
    })

    if(!tj) return;

    var video = "";
    if($("#fileList2 li").length){
      video = $("#fileList2 li").eq(0).children("video").attr("data-val");
    }
    $("#video").val(video);

    data = form.serialize();

    var imglist = [], imgli = $("#fileList1 li.thumbnail");

    var ids = $('.gz-addr-seladdr').attr('data-ids').split(' ');
    cityid = ids[0];
    data += "&cityid="+cityid;

    imgli.each(function(index){
      var t = $(this), val = t.find("img").attr("data-val");
      if(val != ''){
        var val = $(this).find("img").attr("data-val");
        if(val != ""){
          imglist.push(val+"|");
        }
      }
    })

    if(imglist){
      data += "&imglist="+imglist.join(",");
    }


    t.addClass("disabled").html(langData['siteConfig'][6][35]+"...");
    $.ajax({
      url: action,
      data: data,
      type: "POST",
      dataType: "json",
      success: function (data) {
        if(data && data.state == 100){
          if(data.info.aid != undefined && id == 0){
            var urlNew = fabuSuccessUrl.replace("%id%", data.info.aid);
            url = urlNew;
          }
          fabuPay.check(data, url, t);

        }else{
          alert(data.info)
          t.removeClass("disabled").html(langData['siteConfig'][11][19]);
        }
      },
      error: function(){
        alert(langData['siteConfig'][20][183]);
        t.removeClass("disabled").html(langData['siteConfig'][11][19]);
      }
    });

  });


})
