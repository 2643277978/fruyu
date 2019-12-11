$(function(){

  //已报名人数
  $('.hdbbox-right .tabbody .tab-panel').eq(0).fadeIn();
  $('.hdbbox-right .tabhead li').click(function(){
    $(this).addClass('active').siblings().removeClass('active')
    var index = $(this).index();
    $('.hdbbox-right .tabbody .tab-panel').eq(index).fadeIn(300).siblings().hide();
  })

  var sctFixTop = $('.hdbbox').offset().top;
  var paneSct = [];
  $('.hdbbox-left .tab-nav li').each(function(){
    var oid = $(this).children('a').attr('data-link');
    paneSct.push($(oid).offset().top - 54);
  })
  $(window).scroll(function(){
    var sct = $(document).scrollTop();
    if(sct >= sctFixTop) {
      $('.pinned').addClass('fixed_s');
    } else {
      $('.pinned').removeClass('fixed_s');
    }
    var s = 0;
    for(var i in paneSct) {
      if(sct >= paneSct[i]) {
        s = i;
      }
    }
    $('.hdbbox-left .tab-nav li').eq(s).addClass('active').siblings().removeClass('active');
  }).scroll();

  //tab标签切换
  $('.hdbbox-left .tab-nav li a').click(function(){
    var $li = $(this).parent('li');
    var no = $li.index();
    var link = $(this).attr('data-link');
    $('body,html').stop(true,true).animate({
      'scrollTop':paneSct[no]+'px'
    },300)
  })
  //右侧查看地图链接
  $('#linkmap').click(function(){
    $('[data-link="#tab-2"]').click()
  })


  //报名
  $("#joinhd").bind("click", function(){
		var userid = $.cookie(cookiePre+"login_user");
		if(userid == null || userid == ""){
			huoniao.login();
			return false;
		}

    $.dialog.confirm("您确认要报名吗？", function(){
      $.ajax({
        url: masterDomain + "/include/ajax.php?service=dating&action=fabuActivity&id="+id,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          if(data.state == 100){
            $.dialog.tips('报名成功！', 3, 'success.png');
          }else{
            $.dialog.tips(data.info, 3, 'error.png');
          }
        },
        error: function(){
          $.dialog.tips('网络错误，邀请失败！', 3, 'error.png');
        }
      });
    });

  });


})



   //创建和初始化地图函数：
   function initMap(){
       createMap();//创建地图
       setMapEvent();//设置地图事件
       addMapControl();//向地图添加控件
       addMarker();//向地图中添加marker
   }

   //创建地图函数：
   function createMap(){
       var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
       var point = new BMap.Point(lng,lat);//定义一个中心点坐标
       map.centerAndZoom(point,18);//设定地图的中心点和坐标并将地图显示在地图容器中
       window.map = map;//将map变量存储在全局
   }

   //地图事件设置函数：
   function setMapEvent(){
       map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
       map.enableScrollWheelZoom();//启用地图滚轮放大缩小
       map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
       map.enableKeyboard();//启用键盘上下左右键移动地图
   }

   //地图控件添加函数：
   function addMapControl(){
       //向地图中添加缩放控件
var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
map.addControl(ctrl_nav);
       //向地图中添加缩略图控件
var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
map.addControl(ctrl_ove);
       //向地图中添加比例尺控件
var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
map.addControl(ctrl_sca);
   }

   //标注点数组 坐标位置 相关信息
   var markerArr = [{title:"活动地址",content:address,point:lng+"|"+lat,isOpen:1,icon:{w:23,h:25,l:46,t:21,x:9,lb:12}}
  ];
   //创建marker
   function addMarker(){
       for(var i=0;i<markerArr.length;i++){
           var json = markerArr[i];
           var p0 = json.point.split("|")[0];
           var p1 = json.point.split("|")[1];
           var point = new BMap.Point(p0,p1);
  var iconImg = createIcon(json.icon);
           var marker = new BMap.Marker(point,{icon:iconImg});
  var iw = createInfoWindow(i);
  var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
  marker.setLabel(label);
           map.addOverlay(marker);
           label.setStyle({
                       borderColor:"#808080",
                       color:"#333",
                       cursor:"pointer"
           });

  (function(){
   var index = i;
   var _iw = createInfoWindow(i);
   var _marker = marker;
   _marker.addEventListener("click",function(){
       this.openInfoWindow(_iw);
      });
      _iw.addEventListener("open",function(){
       _marker.getLabel().hide();
      })
      _iw.addEventListener("close",function(){
       _marker.getLabel().show();
      })
   label.addEventListener("click",function(){
       _marker.openInfoWindow(_iw);
      })
   if(!!json.isOpen){
    label.hide();
    _marker.openInfoWindow(_iw);
   }
  })()
       }
   }
   //创建InfoWindow
   function createInfoWindow(i){
       var json = markerArr[i];
       var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
       return iw;
   }
   //创建一个Icon
   function createIcon(json){
       var icon = new BMap.Icon("http://map.baidu.com/image/us_cursor.gif", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
       return icon;
   }


//百度地图
if(site_map == "baidu"){
   initMap();//创建和初始化地图

//google地图
}else if(site_map == "google"){

    //加载地图事件
	function initialize() {
		var map = new google.maps.Map(document.getElementById('dituContent'), {
			zoom: 14,
			center: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
			zoomControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		});

		var infowindow = new google.maps.InfoWindow({
          content: '活动地址：' + address
        });

		var marker = new google.maps.Marker({
			position: {lat: parseFloat(lat), lng: parseFloat(lng)},
			map: map,
			title: address
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize);
}
