$(function(){

  if (site_map == "baidu") {

    var map = new BMap.Map("map", {enableMapClick: false});
    // map.centerAndZoom(mapCity, 13);
    map.enableScrollWheelZoom(); //启用滚轮放大缩小
    map.disableInertialDragging(); //禁用惯性拖拽

    var points = [];
    $.each(list, function(e, o) {
        var bubbleLabel, r = [];

        var state = "";
        if(o.state == 0){
            state = " closed";
        }

        bubbleLabel = new BMap.Label('<p class="bubble-3 bubble'+state+'"><i class="num">'+o.name+'</i><i class="arrow-up"><i class="arrow"></i><i></p>', {
            position: new BMap.Point(o.lat, o.lng),
            offset: new BMap.Size(-46, -46)
        });

        bubbleLabel.setStyle({
    			color: "#fff",
    			borderWidth: "0",
    			padding: "0",
    			zIndex: "2",
    			backgroundColor: "transparent",
    			textAlign: "center",
    			fontFamily: '"Hiragino Sans GB", "Microsoft Yahei UI", "Microsoft Yahei", "微软雅黑", "Segoe UI", Tahoma, "宋体b8bf53", SimSun, sans-serif'
    		});
        map.addOverlay(bubbleLabel);

        points.push(new BMap.Point(o.lat, o.lng));

    });

    //最佳视野显示所有配送员
    map.setViewport(points);

  // 谷歌地图
  }else if (site_map == "google") {

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: new google.maps.LatLng(30, 120),
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false
    });


    var points = [], LatLngList = [];
    $.each(list, function(e, o) {
        var bubbleLabel, r = [];

        var state = "";
        if(o.state == 0){
            state = " closed";
        }

        var poi = new google.maps.LatLng(o.lng, o.lat);
        var marker = new google.maps.Marker({
          position: poi,
          map: map
        });

        var infoWindow = new google.maps.InfoWindow({
          content: '<p class="cour_google'+state+'">'+o.name+'</p>'
        });
        infoWindow.open(map, marker);

        LatLngList.push(new google.maps.LatLng(o.lng, o.lat))

    });

    // 调整到合适的视野
    var bounds = new google.maps.LatLngBounds ();
    for (var i = 0, LtLgLen = LatLngList.length; i < LtLgLen; i++) {
      bounds.extend (LatLngList[i]);
    }
    map.fitBounds (bounds);

  }

});
