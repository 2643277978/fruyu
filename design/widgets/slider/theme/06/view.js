define(function(require){function t(t,i,e){var s=parseInt(t.css("top"),10);if("left"==i){var a="-"+this.image_wrapper_height+"px";t.css("top",this.image_wrapper_height+"px")}else{var a=this.image_wrapper_height+"px";t.css("top","-"+this.image_wrapper_height+"px")}return e&&(e.css("bottom","-"+e[0].offsetHeight+"px"),e.animate({bottom:0},2*this.settings.animation_speed)),this.current_description&&this.current_description.animate({bottom:"-"+this.current_description[0].offsetHeight+"px"},2*this.settings.animation_speed),{old_image:{top:a},new_image:{top:s}}}function i(t,i,e){var s=parseInt(t.css("left"),10);if("left"==i){var a="-"+this.image_wrapper_width+"px";t.css("left",this.image_wrapper_width+"px")}else{var a=this.image_wrapper_width+"px";t.css("left","-"+this.image_wrapper_width+"px")}return e&&(e.css("bottom","-"+e[0].offsetHeight+"px"),e.animate({bottom:0},2*this.settings.animation_speed)),this.current_description&&this.current_description.animate({bottom:"-"+this.current_description[0].offsetHeight+"px"},2*this.settings.animation_speed),{old_image:{left:a},new_image:{left:s}}}function e(t){var i=t.width(),e=t.height(),s=parseInt(t.css("left"),10),a=parseInt(t.css("top"),10);return t.css({width:0,height:0,top:this.image_wrapper_height/2,left:this.image_wrapper_width/2}),{old_image:{width:0,height:0,top:this.image_wrapper_height/2,left:this.image_wrapper_width/2},new_image:{width:i,height:e,top:a,left:s}}}function s(t){return t.css("opacity",0),{old_image:{opacity:0},new_image:{opacity:1}}}function a(t){return t.css("opacity",0),{old_image:{opacity:0},new_image:{opacity:1},speed:0}}function n(t,i){this.init(t,i)}function r(t,i){this.init(t,i)}function h(t,i){var e='<div class="slidesjs"><div class="ad-nav"><div class="ad-thumbs"><ul class="ad-thumb-list"></ul></div></div><div class="ad-image-wrapper"></div><div class="ad-controls" style="display:none;"></div></div>',s=$(e);t.append(s),o(s,i)}function o(t,i){var e=$(".ad-thumb-list",t);$.each(i,function(t,i){var s="image"+t,a=$('<li><a href="'+i.src+'"><img src="'+i.src+'" class="'+s+'" alt="'+(i.alt||"")+'"'+(i.url?' longdesc="'+i.url+'"':"")+(i.target?' data-target="'+i.target+'"':"")+"></a></li>");e.append(a)})}function d(t,i,e){var s,a,r,o;if(t===!0)s=i,a=e;else{var e=[],d=t.find(".ad-thumb-list>li");$.each(d,function(t,i){var s=$(i),a={};a.src=s.find("img").attr("src"),a.alt=s.find("img").attr("alt"),a.url=s.find("a").attr("href"),a.target=s.find("a").attr("target"),e.push(a)}),s=t.find(".slidesjs").parent(),s.empty(),a=e}r=s.attr("data-width"),"100%"==r&&(r=s.innerWidth()),o=parseInt(s.attr("data-height"),10);var p={width:r,height:o,effect:"fade"};h(s,a),new n(s.find(".slidesjs")[0],$.extend(!0,{},l,p))}var $=require("jquery"),l={loader_image:"",start_at_index:0,description_wrapper:!1,thumb_opacity:.7,animate_first_image:!1,animation_speed:400,width:!1,height:!1,display_next_and_prev:!0,display_back_and_forward:!0,scroll_jump:0,slideshow:{enable:!0,autostart:!1,speed:5e3,start_label:"Start",stop_label:"Stop",stop_on_scroll:!0,countdown_prefix:"(",countdown_sufix:")",onStart:!1,onStop:!1},effect:"slide-hori",enable_keyboard_move:!0,cycle:!0,callbacks:{init:!1,afterImageVisible:!1,beforeImageVisible:!1}};return n.prototype={wrapper:!1,image_wrapper:!1,gallery_info:!1,nav:!1,loader:!1,preloads:!1,thumbs_wrapper:!1,scroll_back:!1,scroll_forward:!1,next_link:!1,prev_link:!1,slideshow:!1,image_wrapper_width:0,image_wrapper_height:0,current_index:0,current_image:!1,current_description:!1,nav_display_width:0,settings:!1,images:!1,in_transition:!1,animations:!1,init:function(t,i){var e=this;this.wrapper=$(t),this.settings=i,this.setupElements(),this.setupAnimations(),this.settings.width?(this.image_wrapper_width=this.settings.width,this.image_wrapper.width(this.settings.width),this.wrapper.width(this.settings.width)):this.image_wrapper_width=this.image_wrapper.width(),this.settings.height?(this.image_wrapper_height=this.settings.height,this.image_wrapper.height(this.settings.height)):this.image_wrapper_height=this.image_wrapper.height(),this.nav_display_width=this.nav.width(),this.current_index=0,this.current_image=!1,this.current_description=!1,this.in_transition=!1,this.findImages(),this.settings.display_next_and_prev&&this.initNextAndPrev();var s=function(t){return e.nextImage(t)};this.slideshow=new r(s,this.settings.slideshow),this.controls.append(this.slideshow.create()),this.settings.slideshow.enable?this.slideshow.enable():this.slideshow.disable(),this.settings.display_back_and_forward&&this.initBackAndForward(),this.settings.enable_keyboard_move&&this.initKeyEvents();var a=parseInt(this.settings.start_at_index,10);window.location.hash&&0===window.location.hash.indexOf("#ad-image")&&(a=window.location.hash.replace(/[^0-9]+/g,""),1*a!=a&&(a=this.settings.start_at_index)),this.loading(!0),this.showImage(a,function(){e.settings.slideshow.autostart&&(e.preloadImage(a+1),e.slideshow.start())}),this.fireCallback(this.settings.callbacks.init)},setupAnimations:function(){this.animations={"slide-vert":t,"slide-hori":i,resize:e,fade:s,none:a}},setupElements:function(){this.controls=this.wrapper.find(".ad-controls"),this.gallery_info=$('<p class="ad-info"></p>'),this.controls.append(this.gallery_info),this.image_wrapper=this.wrapper.find(".ad-image-wrapper"),this.image_wrapper.empty(),this.nav=this.wrapper.find(".ad-nav"),this.thumbs_wrapper=this.nav.find(".ad-thumbs"),this.preloads=$('<div class="ad-preloads" style="position: absolute;left: -9000px;top:-9000px;"></div>'),this.loader=$('<img class="ad-loader" src="'+this.settings.loader_image+'">'),this.image_wrapper.append(this.loader),this.loader.hide(),$(document.body).append(this.preloads)},loading:function(t){t?this.loader.show():this.loader.hide()},addAnimation:function(t,i){$.isFunction(i)&&(this.animations[t]=i)},findImages:function(){var t=this;this.images=[];var i=0,e=0,s=this.thumbs_wrapper.find("a"),a=s.length;this.settings.thumb_opacity<1&&s.find("img").css("opacity",this.settings.thumb_opacity),s.each(function(s){var a=$(this),n=a.attr("href"),r=a.find("img");t.isImageLoaded(r[0])?(i+=r[0].parentNode.parentNode.offsetWidth,e++):r.load(function(){i+=this.parentNode.parentNode.offsetWidth,e++}),a.addClass("ad-thumb"+s),a.click(function(){return t.showImage(s),t.slideshow.stop(),!1}).hover(function(){!$(this).is(".ad-active")&&t.settings.thumb_opacity<1&&$(this).find("img").fadeTo(300,1),t.preloadImage(s)},function(){!$(this).is(".ad-active")&&t.settings.thumb_opacity<1&&$(this).find("img").fadeTo(300,t.settings.thumb_opacity)});var a=!1;r.data("ad-link")?a=r.data("ad-link"):r.attr("longdesc")&&r.attr("longdesc").length&&(a=r.attr("longdesc"));var h=r.data("target"),o=!1;r.data("ad-desc")?o=r.data("ad-desc"):r.attr("alt")&&r.attr("alt").length&&(o=r.attr("alt"));var d=!1;r.data("ad-title")?d=r.data("ad-title"):r.attr("title")&&r.attr("title").length&&(d=r.attr("title")),t.images[s]={thumb:r.attr("src"),image:n,error:!1,preloaded:!1,desc:o,title:d,size:!1,link:a,target:h}});var n=setInterval(function(){if(a==e){var s=t.nav.find(".ad-thumb-list");s.css("width",i+"px");for(var r=1,h=s.height();201>r&&(s.css("width",i+r+"px"),h==s.height());)h=s.height(),r++;clearInterval(n)}},100)},initKeyEvents:function(){var t=this;$(document).keydown(function(i){39==i.keyCode?(t.nextImage(),t.slideshow.stop()):37==i.keyCode&&(t.prevImage(),t.slideshow.stop())})},initNextAndPrev:function(){this.next_link=$('<div class="ad-next"><div class="ad-next-image"></div></div>'),this.prev_link=$('<div class="ad-prev"><div class="ad-prev-image"></div></div>'),this.image_wrapper.append(this.next_link),this.image_wrapper.append(this.prev_link);var t=this;this.prev_link.add(this.next_link).mouseover(function(){$(this).css("height",t.image_wrapper_height),$(this).find("div").show()}).mouseout(function(){$(this).find("div").hide()}).click(function(){$(this).is(".ad-next")?(t.nextImage(),t.slideshow.stop()):(t.prevImage(),t.slideshow.stop())}).find("div").css("opacity",.7)},initBackAndForward:function(){var t=this;this.scroll_forward=$('<div class="ad-forward"></div>'),this.scroll_back=$('<div class="ad-back"></div>'),this.nav.append(this.scroll_forward),this.nav.prepend(this.scroll_back);var i=0,e=!1;$(this.scroll_back).add(this.scroll_forward).click(function(){var i=t.nav_display_width-50;if(t.settings.scroll_jump>0)var i=t.settings.scroll_jump;if($(this).is(".ad-forward"))var e=t.thumbs_wrapper.scrollLeft()+i;else var e=t.thumbs_wrapper.scrollLeft()-i;return t.settings.slideshow.stop_on_scroll&&t.slideshow.stop(),t.thumbs_wrapper.animate({scrollLeft:e+"px"}),!1}).css("opacity",.6).hover(function(){var s="left";$(this).is(".ad-forward")&&(s="right"),e=setInterval(function(){i++,i>30&&t.settings.slideshow.stop_on_scroll&&t.slideshow.stop();var e=t.thumbs_wrapper.scrollLeft()+1;"left"==s&&(e=t.thumbs_wrapper.scrollLeft()-1),t.thumbs_wrapper.scrollLeft(e)},10),$(this).css("opacity",1)},function(){i=0,clearInterval(e),$(this).css("opacity",.6)})},_afterShow:function(){this.gallery_info.html(this.current_index+1+" / "+this.images.length),this.settings.cycle||(this.prev_link.show().css("height",this.image_wrapper_height),this.next_link.show().css("height",this.image_wrapper_height),this.current_index==this.images.length-1&&this.next_link.hide(),0==this.current_index&&this.prev_link.hide()),this.fireCallback(this.settings.callbacks.afterImageVisible)},_getContainedImageSize:function(t,i){if(i>this.image_wrapper_height){var e=t/i;i=this.image_wrapper_height,t=this.image_wrapper_height*e}if(t>this.image_wrapper_width){var e=i/t;t=this.image_wrapper_width,i=this.image_wrapper_width*e}return{width:t,height:i}},_centerImage:function(t,i,e){if(t.css("top","0px"),e<this.image_wrapper_height){var s=this.image_wrapper_height-e;t.css("top",s/2+"px")}if(t.css("left","0px"),i<this.image_wrapper_width){var s=this.image_wrapper_width-i;t.css("left",s/2+"px")}},_getDescription:function(t){var i="",e="";return t.desc&&t.desc.length||t.title&&t.title.length?(t.title&&t.title.length&&(i='<strong class="ad-description-title">'+t.title+"</strong>"),t.desc&&t.desc.length&&(e="<span>"+t.desc+"</span>"),$('<p class="ad-image-description">'+i+e+"</p>")):!1},showImage:function(t,i){if(this.images[t]&&!this.in_transition){var e=this,s=this.images[t];this.in_transition=!0,s.preloaded?this._showWhenLoaded(t,i):(this.loading(!0),this.preloadImage(t,function(){e.loading(!1),e._showWhenLoaded(t,i)}))}},_showWhenLoaded:function(t,i){if(this.images[t]){var e=this,s=this.images[t],a=$(document.createElement("div")).addClass("ad-image"),n=$(new Image).attr("src",s.image);if(s.link){var r=$('<a href="'+s.link+'"'+(s.target?' target="'+s.target+'"':"")+"></a>");r.append(n),a.append(r)}else a.append(n);this.image_wrapper.prepend(a);var h=this._getContainedImageSize(s.size.width,s.size.height);n.attr("width",h.width),n.attr("height",h.height),a.css({width:h.width+"px",height:h.height+"px"}),this._centerImage(a,h.width,h.height);var o=this._getDescription(s,a);if(o)if(this.settings.description_wrapper)this.settings.description_wrapper.append(o);else{a.append(o);var d=h.width;o.css("width",d+"px")}this.highLightThumb(this.nav.find(".ad-thumb"+t));var l="right";if(this.current_index<t&&(l="left"),this.fireCallback(this.settings.callbacks.beforeImageVisible),this.current_image||this.settings.animate_first_image){var p=this.settings.animation_speed,c="swing",g=this.animations[this.settings.effect].call(this,a,l,o);if("undefined"!=typeof g.speed&&(p=g.speed),"undefined"!=typeof g.easing&&(c=g.easing),this.current_image){var _=this.current_image,f=this.current_description;_.animate(g.old_image,p,c,function(){_.remove(),f&&f.remove()})}a.animate(g.new_image,p,c,function(){e.current_index=t,e.current_image=a,e.current_description=o,e.in_transition=!1,e._afterShow(),e.fireCallback(i)})}else this.current_index=t,this.current_image=a,e.current_description=o,this.in_transition=!1,e._afterShow(),this.fireCallback(i)}},nextIndex:function(){if(this.current_index==this.images.length-1){if(!this.settings.cycle)return!1;var t=0}else var t=this.current_index+1;return t},nextImage:function(t){var i=this.nextIndex();return i===!1?!1:(this.preloadImage(i+1),this.showImage(i,t),!0)},prevIndex:function(){if(0==this.current_index){if(!this.settings.cycle)return!1;var t=this.images.length-1}else var t=this.current_index-1;return t},prevImage:function(t){var i=this.prevIndex();return i===!1?!1:(this.preloadImage(i-1),this.showImage(i,t),!0)},preloadAll:function(){function t(){e<i.images.length&&(e++,i.preloadImage(e,t))}var i=this,e=0;i.preloadImage(e,t)},preloadImage:function(t,i){if(this.images[t]){var e=this.images[t];if(this.images[t].preloaded)this.fireCallback(i);else{var s=$(new Image);if(s.attr("src",e.image),this.isImageLoaded(s[0]))e.preloaded=!0,e.size={width:s[0].width,height:s[0].height},this.fireCallback(i);else{this.preloads.append(s);var a=this;s.load(function(){e.preloaded=!0,e.size={width:this.width,height:this.height},a.fireCallback(i)}).error(function(){e.error=!0,e.preloaded=!1,e.size=!1})}}}},isImageLoaded:function(t){return"undefined"==typeof t.complete||t.complete?"undefined"!=typeof t.naturalWidth&&0==t.naturalWidth?!1:!0:!1},highLightThumb:function(t){this.thumbs_wrapper.find(".ad-active").removeClass("ad-active"),t.addClass("ad-active"),this.settings.thumb_opacity<1&&(this.thumbs_wrapper.find("a:not(.ad-active) img").fadeTo(300,this.settings.thumb_opacity),t.find("img").fadeTo(300,1));var i=t[0].parentNode.offsetLeft;i-=this.nav_display_width/2-t[0].offsetWidth/2,this.thumbs_wrapper.animate({scrollLeft:i+"px"})},fireCallback:function(t){$.isFunction(t)&&t.call(this)}},r.prototype={start_link:!1,stop_link:!1,countdown:!1,controls:!1,settings:!1,nextimage_callback:!1,enabled:!1,running:!1,countdown_interval:!1,init:function(t,i){this.nextimage_callback=t,this.settings=i},create:function(){this.start_link=$('<span class="ad-slideshow-start">'+this.settings.start_label+"</span>"),this.stop_link=$('<span class="ad-slideshow-stop">'+this.settings.stop_label+"</span>"),this.countdown=$('<span class="ad-slideshow-countdown"></span>'),this.controls=$('<div class="ad-slideshow-controls"></div>'),this.controls.append(this.start_link).append(this.stop_link).append(this.countdown),this.countdown.hide();var t=this;return this.start_link.click(function(){t.start()}),this.stop_link.click(function(){t.stop()}),$(document).keydown(function(i){83==i.keyCode&&(t.running?t.stop():t.start())}),this.controls},disable:function(){this.enabled=!1,this.stop(),this.controls.hide()},enable:function(){this.enabled=!0,this.controls.show()},toggle:function(){this.enabled?this.disable():this.enable()},start:function(){if(this.running||!this.enabled)return!1;return this.running=!0,this.controls.addClass("ad-slideshow-running"),this._next(),this.fireCallback(this.settings.onStart),!0},stop:function(){return this.running?(this.running=!1,this.countdown.hide(),this.controls.removeClass("ad-slideshow-running"),clearInterval(this.countdown_interval),this.fireCallback(this.settings.onStop),!0):!1},_next:function(){var t=this,i=this.settings.countdown_prefix,e=this.settings.countdown_sufix;clearInterval(t.countdown_interval),this.countdown.show().html(i+this.settings.speed/1e3+e);var s=0;this.countdown_interval=setInterval(function(){if(s+=1e3,s>=t.settings.speed){var a=function(){t.running&&t._next(),s=0};t.nextimage_callback(a)||t.stop(),s=0}var n=parseInt(t.countdown.text().replace(/[^0-9]/g,""),10);n--,n>0&&t.countdown.html(i+n+e)},1e3)},fireCallback:function(t){$.isFunction(t)&&t.call(this)}},function(t,i,e){var s=t&&t.jquery?t:i;s.is(":visible")?d(t,i,e):s.on("resize",function(){d(t,i,e)})}});