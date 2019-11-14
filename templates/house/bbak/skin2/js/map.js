var Bmap,
	list_temp = function(config){
		return '<li id="'+config.id+'"><i class="map-icon icon '+config.icon+'"></i><p class="text"> '+config.title+' <span class="gray"> （'+config.detail+'） </span></p><span class="distance gray"> '+config.distance+' 米</span></li>';
	},
	icon_temp = function(config){
		return '<div id="'+config.id+'" class="mark-icon-box"><i class="map-icon mark-icon '+config.icon+'"></i></div>';
	},
	detail_temp = function(config){
		return '<div id="'+config.id+'" class="mark-tip" style="display:none"><i class="mark-tip-sign"></i><div class="title"><span>'+config.title+'</span><b>'+config.distance+'米</b></div>'+config.detail+'<i class="map-icon icon"></i></div>';
	},
	pan_temp = function(config){
		return '<div class="life-mark"><div class="text yahei">'+config.panName+'</div><i class="map-icon icon"></i></div>';
	};

var d = {
	bus: {icon: "bus"},
	subway: {icon: "met"},
	bank: {icon: "bank"},
	market: {icon: "buy"},
	restaurant: {icon: "bin"},
	hospital: {icon: "hos"},
	school: {icon: "sch"}
};
var e = {
	tra: ["subway", "bus"],
	biz: ["market", "bank", "restaurant"],
	hos: ["hospital"],
	edu: ["school"]
};
var harr = {
	tra: {
		soj: "{from:loupan_index_traffic}",
		type: "2公里内的交通设施",
		subway: "{%num%}条地铁",
		bus: "{%num%}个公交站"
	},
	biz: {
		soj: "{from:loupan_index_commeric}",
		type: "2公里内的商业设施",
		market: "购物{%num%}处",
		bank: "银行{%num%}处",
		restaurant: "餐饮{%num%}处"
	},
	edu: {
		soj: "{from:loupan_index_education}",
		type: "2公里内的教育设施",
		school: "学校{%num%}处"
	},
	hos: {
		soj: "{from:loupan_index_hospital}",
		type: "2公里内的医院设施",
		hospital: "医院{%num%}处"
	}
};
function overlay(l, n) {
	var k = {tab: "tra", type: "subway",	shift: {x: 14, y: 36}, marker: "", done: function() {}};
	var m = $.extend({}, k, n);
	this._point = l;
	this.tab = m.tab;
	this.type = m.type;
	this.shift = m.shift;
	this.marker = m.marker;
	this.done = m.done
}
if(site_map == "baidu"){
	overlay.prototype = new BMap.Overlay();
}
overlay.prototype.initialize = function(k) {
	this.map = k;
	this.marker = $(this.marker);
	k.getPanes().markerPane.appendChild(this.marker[0]);
	return this.marker[0]
};
overlay.prototype.draw = function() {
	var k = this.map.pointToOverlayPixel(this._point);
	this.marker.css({
		left: k.x - this.shift.x + "px",
		top: k.y - this.shift.y + "px"
	});
	this.done()
};
function b(q, m, p, n) {
	var l = {
		distance: 2000,
		keywords: [
			{key: "地铁", property: "subway"},
			{key: "公交",	property: "bus"},
			{key: "购物",	property: "market"},
			{key: "银行",	property: "bank"},
			{key: "餐饮",	property: "restaurant"},
			{key: "学校", property: "school"},
			{key: "医院",	property: "hospital"}
		],
		success: q.success
	};
	var o = $.extend({}, l, p);
	function k(r, y, x) {
		var u = {},	w = [],	v = [];
		for (var s = 0; s < x.keywords.length; s++) {
			w[s] = x.keywords[s].key;
			v[s] = x.keywords[s].property
		}
		var z = {
			onSearchComplete: function(D) {
				if (t.getStatus() == BMAP_STATUS_SUCCESS) {
					for (var B = 0; B < D.length; B++) {
						var A = D[B].keyword;
						var E = [];
						for (var C = 0; C < D[B].getCurrentNumPois(); C++) {
							E.push({
								title: D[B].getPoi(C).title,
								address: D[B].getPoi(C).address,
								distance: q.getDistance(D[B].getPoi(C).point, y).toFixed(0),
								point: D[B].getPoi(C).point,
								type: v[B]
							})
						}
						u[v[B]] = E
					}
				} else {
					u = {
						bank: [],
						bus: [],
						subway: [],
						market: [],
						restaurant: [],
						school: [],
						hospital: []
					}
				}
				n.nearbyData = u;
				x.success(u)
			},
			pageCapacity: 25
		};
		var t = new BMap.LocalSearch(q, z);
		t.searchNearby(w, m, o.distance)
	}
	return k(q, m, o)
}



function Bmap(n) {
	var k = {
		panName: "北京天安门",
		lng: 116.403963,
		lat: 39.915112,
		mapId: "map",
		initList: {
			type: "tra",
			include: ["subway", "bus"]
		}
	};
	var m = $.extend({}, k, n);
	var l = this;
	l.op = m;
	l.point = new BMap.Point(pageData.lng, pageData.lat);
	l.map = new BMap.Map("map");
	l.map.centerAndZoom(l.point, 14);
	l.map.disableScrollWheelZoom();
	l.map.addControl(new BMap.NavigationControl());
	l.success = function() {
		l.drawPan();
		l.drawList(l.nearbyData, l.op.initList);
		l.drawDetail();
		l.drawPoint();
		l.addHover();
		l.addControl();
	};
	b(l.map, l.point, {success: l.success},	l);
};
Bmap.prototype.drawPan = function() {
	var m = pan_temp({panName: pageData.panName});
	var n = {
		shift: {x: 0,	y: 38},
		marker: m,
		done: function() {
			var o = this;
			var p = o.marker.outerWidth();
			o.marker.css("marginLeft", Math.floor(0 - p / 2) + "px")
		}
	};
	var k = new overlay(this.point, n);
	var l = new BMap.Circle(this.point, 2000, {
		strokeColor: "#62ab00",
		strokeWeight: 1,
		strokeOpacity: 0.4
	});
	this.map.addOverlay(k);
	this.map.addOverlay(l);
};
Bmap.prototype.drawPoint = function() {
	for (var l = 0; l < this.listData.length; l++) {
		var m = this.listData[l].point;
		var o = "icon-" + l;
		var n = {
			tab: this.tab,
			type: this.listData[l].type,
			shift: {x: 14, y: 36},
			marker: icon_temp({icon: d[this.listData[l].type].icon,	id: o}),
			done: function() {}
		};
		var k = new overlay(m, n);
		this.map.addOverlay(k)
	}
};
Bmap.prototype.drawList = function(l, m) {
	var n = [];
	var q = "";
	var r = $("#map-ul");
	var p = $("#map-count");
	var u = $("#map-type");
	var t = [];
	this.tab = m.type;
	for (var k = 0; k < m.include.length; k++) {
		n = n.concat(l[m.include[k]]);
		var o = l[m.include[k]].length;
		var s = harr[m.type][m.include[k]];
		if (o > 0) {
			t.push(s.replace("{%num%}", o));
		}
	}
	this.listData = n.sort(function(w, x) {
		return w.distance - x.distance
	});
	if (n.length == 0) {
		u.html(harr[m.type].type);
		p.html("暂无数据")
	} else {
		if (n.length > 0) {
			u.html(harr[m.type].type);
			p.html(t.join("、"))
		}
	}
	for (var k = 0; k < n.length; k++) {
		var v = {
			id: "list-" + k,
			icon: d[n[k].type].icon,
			title: n[k].title,
			detail: n[k].address,
			distance: n[k].distance
		};
		q += list_temp(v);
	}
	r.html(q)
};
Bmap.prototype.drawDetail = function() {
	for (var l = 0; l < this.listData.length; l++) {
		var m = this.listData[l].point;
		var n = {
			tab: this.tab,
			type: this.listData[l].type,
			shift: {
				x: -120,
				y: 49
			},
			marker: detail_temp({
				id: "detail-" + l,
				title: this.listData[l].title,
				distance: this.listData[l].distance,
				detail: '<div class="content">' + this.listData[l].address + "</div>"
			}),
			done: function() {
				var o = this;
				var p = o.marker.outerWidth();
				var q = o.marker.outerHeight();
				o.marker.css({
					marginLeft: 0 - p / 2 - 18,
					marginTop: 0 - q
				})
			}
		};
		var k = new overlay(m, n);
		this.map.addOverlay(k);
	}
};
Bmap.prototype.addHover = function() {
	var k = this;
	$("#map").off("mouseover mouseout", ".mark-icon-box");
	$("#map-ul").off("mouseover mouseout", "li");
	$("#map").on("mouseover mouseout", ".mark-icon-box", function(n) {
		var l = $("#" + $(this).attr("id").replace(/icon/, "detail"));
		var m = $("#" + $(this).attr("id").replace(/icon/, "list"));
		if (n.type == "mouseover") {
			l.show();
			m.addClass("active");
			m.find(".text").css("color", "#ff6500");
		} else {
			l.hide();
			m.removeClass("active");
			m.find(".text").css("color", "#333");
		}
	});
	$("#map-ul").on("mouseover mouseout", "li", function(n) {
		var m = $("#" + $(this).attr("id").replace(/list/, "detail"));
		var l = $("#" + $(this).attr("id").replace(/list/, "icon"));
		if (n.type == "mouseover") {
			$(this).find(".text").css("color", "#ff6500");
			$(this).addClass("active");
			l.addClass("life-map-active");
			m.show();
		} else {
			$(this).find(".text").css("color", "#333");
			$(this).removeClass("active");
			l.removeClass("life-map-active");
			m.hide();
		}
	});
};
Bmap.prototype.addControl = function() {
	var k = this;
	$("#map-tab").on("click", "li", function(m) {
		if (!$(this).hasClass("active")) {
			var l = $(this).attr("id").replace(/map-tab-/, "");
			var n = $("#map-tab li.active");
			n.removeClass("active");
			$(this).addClass("active");
			k.map.clearOverlays();
			k.drawPan();
			k.drawList(k.nearbyData, {
				type: l,
				include: e[l]
			});
			k.drawDetail();
			k.drawPoint();
			k.addHover();
		}
	});
}


//百度地图
if(site_map == "baidu"){
	new Bmap(pageData);

//google 地图
}else if(site_map == "google"){

	//加载地图事件
	function initialize() {
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 14,
			center: new google.maps.LatLng(parseFloat(pageData.lat), parseFloat(pageData.lng)),
			zoomControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			}
		});

		var infowindow = new google.maps.InfoWindow({
          content: '<div style="font-weight: 700; font-size: 16px;">' + pageData.panName + '</div>' + '<p style="line-height: 3em;">详细地址：' + pageData.address + '</p>'
        });

		var marker = new google.maps.Marker({
			position: {lat: parseFloat(pageData.lat), lng: parseFloat(pageData.lng)},
			map: map,
			title: pageData.panName
		});
		marker.addListener('click', function() {
			infowindow.open(map, marker);
		});
	}

	google.maps.event.addDomListener(window, 'load', initialize);

}

//地图结果面板滚动条事件
$('#map-ul').scrollUnique();
