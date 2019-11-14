//zepto
if(!window.jQuery){var jQuery=Zepto;(function($){['width','height'].forEach(function(dimension){$.fn[dimension]=function(value){var offset,body=document.body,html=document.documentElement,Dimension=dimension.replace(/./,function(m){return m[0].toUpperCase()});if(value===undefined){return this[0]==window?html['client'+Dimension]:this[0]==document?Math.max(body['scroll'+Dimension],body['offset'+Dimension],html['client'+Dimension],html['scroll'+Dimension],html['offset'+Dimension]):(offset=this.offset())&&offset[dimension]}else{return this.each(function(idx){$(this).css(dimension,value)})}}});['width','height'].forEach(function(dimension){var offset,Dimension=dimension.replace(/./,function(m){return m[0].toUpperCase()});$.fn['outer'+Dimension]=function(margin){var elem=this;if(elem){var size=elem[0]['offset'+Dimension],sides={'width':['left','right'],'height':['top','bottom']};sides[dimension].forEach(function(side){if(margin){size+=parseInt(elem.css('margin-'+side),10)}});return size}else{return null}}});['width','height'].forEach(function(dimension){var offset,Dimension=dimension.replace(/./,function(m){return m[0].toUpperCase()});$.fn['inner'+Dimension]=function(){var elem=this;if(elem[0]['inner'+Dimension]){return elem[0]['inner'+Dimension]}else{var size=elem[0]['offset'+Dimension],sides={'width':['left','right'],'height':['top','bottom']};sides[dimension].forEach(function(side){size-=parseInt(elem.css('border-'+side+'-width'),10)});return size}}});["Left","Top"].forEach(function(name,i){var method="scroll"+name;function isWindow(obj){return obj&&typeof obj==="object"&&"setInterval"in obj}function getWindow(elem){return isWindow(elem)?elem:elem.nodeType===9?elem.defaultView||elem.parentWindow:false}$.fn[method]=function(val){var elem,win;if(val===undefined){elem=this[0];if(!elem){return null}win=getWindow(elem);return win?("pageXOffset"in win)?win[i?"pageYOffset":"pageXOffset"]:win.document.documentElement[method]||win.document.body[method]:elem[method]}this.each(function(){win=getWindow(this);if(win){var xCoord=!i?val:$(win).scrollLeft(),yCoord=i?val:$(win).scrollTop();win.scrollTo(xCoord,yCoord)}else{this[method]=val}})}});$.fn.prevUntil=function(selector){var n=this,array=[];while(n.length&&!$(n).filter(selector).length){array.push(n[0]);n=n.prev()}return $(array)};$.fn.nextUntil=function(selector){var n=this,array=[];while(n.length&&!n.filter(selector).length){array.push(n[0]);n=n.next()}return $(array)};$._extend=$.extend;$.extend=function(){arguments[0]=arguments[0]||{};return $._extend.apply(this,arguments)}})(jQuery)}


//core
/*!
 * Mobiscroll v2.12.0
 * http://mobiscroll.com
 *
 * Copyright 2010-2014, Acid Media
 * Licensed under the MIT license.
 *
 */
(function($,undefined){function testProps(props){var i;for(i in props){if(mod[props[i]]!==undefined){return true}}return false}function testPrefix(){var prefixes=['Webkit','Moz','O','ms'],p;for(p in prefixes){if(testProps([prefixes[p]+'Transform'])){return'-'+prefixes[p].toLowerCase()+'-'}}return''}function getCoord(e,c){var ev=e.originalEvent||e;return ev.changedTouches?ev.changedTouches[0]['page'+c]:e['page'+c]}function constrain(val,min,max){return Math.max(min,Math.min(val,max))}function init(that,options,args){var ret=that;if(typeof options==='object'){return that.each(function(){if(!this.id){this.id='mobiscroll'+(++id)}if(instances[this.id]){instances[this.id].destroy()}new $.mobiscroll.classes[options.component||'Scroller'](this,options)})}if(typeof options==='string'){that.each(function(){var r,inst=instances[this.id];if(inst&&inst[options]){r=inst[options].apply(this,Array.prototype.slice.call(args,1));if(r!==undefined){ret=r;return false}}})}return ret}function testTouch(e){if(e.type=='touchstart'){touches[e.target]=true}else if(touches[e.target]){delete touches[e.target];return false}return true}var id=+new Date(),touches={},instances={},extend=$.extend,mod=document.createElement('modernizr').style,has3d=testProps(['perspectiveProperty','WebkitPerspective','MozPerspective','OPerspective','msPerspective']),hasFlex=testProps(['flex','msFlex','WebkitBoxDirection']),prefix=testPrefix(),pr=prefix.replace(/^\-/,'').replace(/\-$/,'').replace('moz','Moz');$.fn.mobiscroll=function(method){extend(this,$.mobiscroll.components);return init(this,method,arguments)};$.mobiscroll=$.mobiscroll||{version:'2.12.0',util:{prefix:prefix,jsPrefix:pr,has3d:has3d,hasFlex:hasFlex,getCoord:getCoord,testTouch:testTouch,constrain:constrain},tapped:false,presets:{scroller:{},numpad:{}},themes:{listview:{}},i18n:{},instances:instances,classes:{},components:{},defaults:{theme:'mobiscroll',context:'body'},userdef:{},setDefaults:function(o){extend(this.userdef,o)},presetShort:function(name,c,p){this.components[name]=function(s){return init(this,extend(s,{component:c,preset:p===false?undefined:name}),arguments)}}};$.scroller=$.scroller||$.mobiscroll;$.fn.scroller=$.fn.scroller||$.fn.mobiscroll})(jQuery);


//widget
(function($,window,document,undefined){var $activeElm,preventShow,extend=$.extend,ms=$.mobiscroll,instances=ms.instances,userdef=ms.userdef,util=ms.util,pr=util.jsPrefix,has3d=util.has3d,getCoord=util.getCoord,constrain=util.constrain,isOldAndroid=/android [1-3]/i.test(navigator.userAgent),animEnd='webkitAnimationEnd animationend',empty=function(){},prevdef=function(ev){ev.preventDefault()};ms.classes.Widget=function(el,settings,inherit){var $doc,$header,$markup,$overlay,$persp,$popup,$wnd,buttons,btn,doAnim,hasButtons,isModal,lang,modalWidth,modalHeight,posEvents,preset,preventPos,s,scrollLock,theme,wasReadOnly,wndWidth,wndHeight,that=this,$elm=$(el),elmList=[],posDebounce={};function onBtnStart(ev){if(btn){btn.removeClass('dwb-a')}btn=$(this);if(!btn.hasClass('dwb-d')&&!btn.hasClass('dwb-nhl')){btn.addClass('dwb-a')}if(ev.type==='mousedown'){$(document).on('mouseup',onBtnEnd)}}function onBtnEnd(ev){if(btn){btn.removeClass('dwb-a');btn=null}if(ev.type==='mouseup'){$(document).off('mousedown',onBtnEnd)}}function onHide(prevAnim){var activeEl,value,type,focus=s.focusOnClose;$markup.remove();if($activeElm&&!prevAnim){setTimeout(function(){if(focus===undefined){preventShow=true;activeEl=$activeElm[0];type=activeEl.type;value=activeEl.value;try{activeEl.type='button'}catch(ex){}$activeElm.focus();activeEl.type=type;activeEl.value=value}else if(focus){if(instances[$(focus).attr('id')]){ms.tapped=false}$(focus).focus()}},200)}that._isVisible=false;event('onHide',[])}function onPosition(ev){clearTimeout(posDebounce[ev.type]);posDebounce[ev.type]=setTimeout(function(){var isScroll=ev.type=='scroll';if(isScroll&&!scrollLock){return}that.position(!isScroll)},200)}function event(name,args){var ret;args.push(that);$.each([userdef,theme,preset,settings],function(i,v){if(v&&v[name]){ret=v[name].apply(el,args)}});return ret}that.position=function(check){var nw=$persp.width(),nh=$wnd[0].innerHeight||$wnd.innerHeight();if(!(wndWidth===nw&&wndHeight===nh&&check)&&!preventPos&&(event('onPosition',[$markup,nw,nh])!==false)&&isModal){var w,l,t,aw,ah,ap,at,al,arr,arrw,arrl,dh,scroll,totalw=0,minw=0,sl=$wnd.scrollLeft(),st=$wnd.scrollTop(),wr=$('.dwwr',$markup),d=$('.dw',$markup),css={},anchor=s.anchor===undefined?$elm:s.anchor;if(that._isLiquid&&s.layout!=='liquid'){if(nw<400){$markup.addClass('dw-liq')}else{$markup.removeClass('dw-liq')}}if(/modal|bubble/.test(s.display)){wr.width('');$('.mbsc-w-p',$markup).each(function(){w=$(this).outerWidth(true);totalw+=w;minw=(w>minw)?w:minw});w=totalw>nw?minw:totalw;wr.width(w).css('white-space',totalw>nw?'':'nowrap')}modalWidth=d.outerWidth();modalHeight=d.outerHeight(true);scrollLock=modalHeight<=nh&&modalWidth<=nw;that.scrollLock=scrollLock;if(s.display=='modal'){l=Math.max(0,(nw-modalWidth)/2);t=st+(nh-modalHeight)/2}else if(s.display=='bubble'){scroll=true;arr=$('.dw-arrw-i',$markup);ap=anchor.offset();at=Math.abs($(s.context).offset().top-ap.top);al=Math.abs($(s.context).offset().left-ap.left);aw=anchor.outerWidth();ah=anchor.outerHeight();l=constrain(al-(d.outerWidth(true)-aw)/2-sl,3,nw-modalWidth-3);t=at-modalHeight;if((t<st)||(at>st+nh)){d.removeClass('dw-bubble-top').addClass('dw-bubble-bottom');t=at+ah}else{d.removeClass('dw-bubble-bottom').addClass('dw-bubble-top')}arrw=arr.outerWidth();arrl=constrain(al+aw/2-(l+(modalWidth-arrw)/2)-sl,0,arrw);$('.dw-arr',$markup).css({left:arrl})}else{if(s.display=='top'){t=st}else if(s.display=='bottom'){t=st+nh-modalHeight}}css.top=t<0?0:t;css.left=l;d.css(css);$persp.height(0);dh=Math.max(t+modalHeight,s.context=='body'?$(document).height():$doc.scrollHeight);$persp.css({height:dh,left:sl});if(scroll&&((t+modalHeight>st+nh)||(at>st+nh))){preventPos=true;setTimeout(function(){preventPos=false},300);$wnd.scrollTop(Math.min(t+modalHeight-nh,dh-nh))}}wndWidth=nw;wndHeight=nh};that.attachShow=function($elm,beforeShow){elmList.push($elm);if(s.display!=='inline'){$elm.on('mousedown.dw',prevdef).on((s.showOnFocus?'focus.dw':'')+(s.showOnTap?' click.dw':''),function(ev){if((ev.type!=='focus'||(ev.type==='focus'&&!preventShow))&&!ms.tapped){if(beforeShow){beforeShow()}if($(document.activeElement).is('input,textarea')){$(document.activeElement).blur()}$activeElm=$elm;that.show()}setTimeout(function(){preventShow=false},300)})}};that.select=function(){if(that.hide(false,'set')!==false){that._fillValue();event('onSelect',[that.val])}};that.cancel=function(){if(that.hide(false,'cancel')!==false){event('onCancel',[that.val])}};that.clear=function(){event('onClear',[$markup]);$elm.val('');if(!that.live){that.hide(false,'clear')}};that.show=function(prevAnim,prevFocus){var html;if(s.disabled||that._isVisible){return}if(doAnim!==false){if(s.display=='top'){doAnim='slidedown'}if(s.display=='bottom'){doAnim='slideup'}}that._readValue();event('onBeforeShow',[]);html='<div class="mbsc-'+s.theme+' dw-'+s.display+' '+(s.cssClass||'')+(that._isLiquid?' dw-liq':'')+(hasButtons?'':' dw-nobtn')+'"><div class="dw-persp">'+(isModal?'<div class="dwo"></div>':'')+'<div'+(isModal?' role="dialog" tabindex="-1"':'')+' class="dw'+(s.rtl?' dw-rtl':' dw-ltr')+'">'+(s.display==='bubble'?'<div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div>':'')+'<div class="dwwr"><div aria-live="assertive" class="dwv'+(s.headerText?'':' dw-hidden')+'"></div><div class="dwcc">';html+=that._generateContent();html+='</div>';if(isModal&&hasButtons){html+='<div class="dwbc">';$.each(buttons,function(i,b){b=(typeof b==='string')?that.buttons[b]:b;html+='<div'+(s.btnWidth?' style="width:'+(100/buttons.length)+'%"':'')+' class="dwbw '+b.css+'"><div tabindex="0" role="button" class="dwb dwb'+i+' dwb-e">'+b.text+'</div></div>'});html+='</div>'}html+='</div></div></div></div>';$markup=$(html);$persp=$('.dw-persp',$markup);$overlay=$('.dwo',$markup);$header=$('.dwv',$markup);$popup=$('.dw',$markup);that._markup=$markup;that._header=$header;that._isVisible=true;posEvents='orientationchange resize';that._markupReady();event('onMarkupReady',[$markup]);if(isModal){$(window).on('keydown.dw',function(ev){if(ev.keyCode==13){that.select()}else if(ev.keyCode==27){that.cancel()}});if(s.scrollLock){$markup.on('touchstart touchmove',function(ev){if(scrollLock){ev.preventDefault()}})}if(pr!=='Moz'){$('input,select,button',$doc).each(function(){if(!this.disabled){$(this).addClass('dwtd').prop('disabled',true)}})}posEvents+=' scroll';ms.activeInstance=that;$markup.appendTo(s.context);if(has3d&&doAnim&&!prevAnim){$markup.addClass('dw-in dw-trans').on(animEnd,function(){$markup.removeClass('dw-in dw-trans').find('.dw').removeClass('dw-'+doAnim);if(!prevFocus){$popup.focus()}}).find('.dw').addClass('dw-'+doAnim)}}else if($elm.is('div')){$elm.html($markup)}else{$markup.insertAfter($elm)}event('onMarkupInserted',[$markup]);that.position();$wnd.on(posEvents,onPosition);$markup.on('selectstart mousedown',prevdef).on('click','.dwb-e',prevdef).on('keydown','.dwb-e',function(ev){if(ev.keyCode==32){ev.preventDefault();ev.stopPropagation();$(this).click()}});setTimeout(function(){$.each(buttons,function(i,b){that.tap($('.dwb'+i,$markup),function(ev){b=(typeof b==='string')?that.buttons[b]:b;b.handler.call(this,ev,that)},true)});if(s.closeOnOverlay){that.tap($overlay,function(){that.cancel()})}if(isModal&&!doAnim&&!prevFocus){$popup.focus()}$markup.on('touchstart mousedown','.dwb-e',onBtnStart).on('touchend','.dwb-e',onBtnEnd);that._attachEvents($markup)},300);event('onShow',[$markup,that._valueText])};that.hide=function(prevAnim,btn,force){if(!that._isVisible||(!force&&!that._isValid&&btn=='set')||(!force&&event('onClose',[that._valueText,btn])===false)){return false}if(pr!=='Moz'){$('.dwtd',$doc).each(function(){$(this).prop('disabled',false).removeClass('dwtd')})}if($markup){if(has3d&&isModal&&doAnim&&!prevAnim&&!$markup.hasClass('dw-trans')){$markup.addClass('dw-out dw-trans').find('.dw').addClass('dw-'+doAnim).on(animEnd,function(){onHide(prevAnim)})}else{onHide(prevAnim)}$wnd.off(posEvents,onPosition)}delete ms.activeInstance};that.isVisible=function(){return that._isVisible};that.setValue=empty;that._generateContent=empty;that._attachEvents=empty;that._readValue=empty;that._fillValue=empty;that._markupReady=empty;that._processSettings=empty;that.tap=function(el,handler,prevent){var startX,startY,moved;if(s.tap){el.on('touchstart.dw',function(ev){if(prevent){ev.preventDefault()}startX=getCoord(ev,'X');startY=getCoord(ev,'Y');moved=false}).on('touchmove.dw',function(ev){if(Math.abs(getCoord(ev,'X')-startX)>20||Math.abs(getCoord(ev,'Y')-startY)>20){moved=true}}).on('touchend.dw',function(ev){var that=this;if(!moved){ev.preventDefault();setTimeout(function(){handler.call(that,ev)},isOldAndroid?400:10)}ms.tapped=true;setTimeout(function(){ms.tapped=false},500)})}el.on('click.dw',function(ev){if(!ms.tapped){handler.call(this,ev)}ev.preventDefault()})};that.option=function(opt,value){var obj={};if(typeof opt==='object'){obj=opt}else{obj[opt]=value}that.init(obj)};that.destroy=function(){that.hide(true,false,true);$.each(elmList,function(i,v){v.off('.dw')});if(that._isInput){el.readOnly=wasReadOnly}delete instances[el.id];event('onDestroy',[])};that.getInst=function(){return that};that.trigger=event;that.init=function(ss){that.settings=s={};extend(settings,ss);extend(s,ms.defaults,that._defaults,userdef,settings);theme=ms.themes[s.theme]||ms.themes.mobiscroll;lang=ms.i18n['zh'];event('onThemeLoad',[lang,settings]);extend(s,theme,lang,userdef,settings);preset=ms.presets[that._class][s.preset];s.buttons=s.buttons||['set','cancel'];s.headerText=s.headerText===undefined?(s.display!=='inline'?'{value}':false):s.headerText;if(preset){preset=preset.call(el,that);extend(s,preset,settings)}if(!ms.themes[s.theme]){s.theme='mobiscroll'}that._isLiquid=(s.layout||(/top|bottom/.test(s.display)?'liquid':''))==='liquid';that._processSettings();$elm.off('.dw');doAnim=isOldAndroid?false:s.animate;buttons=s.buttons;isModal=s.display!=='inline';$wnd=$(s.context=='body'?window:s.context);$doc=$(s.context)[0];if(!s.setText){buttons.splice($.inArray('set',buttons),1)}if(!s.cancelText){buttons.splice($.inArray('cancel',buttons),1)}if(s.button3){buttons.splice($.inArray('set',buttons)+1,0,{text:s.button3Text,handler:s.button3})}that.context=$wnd;that.live=!isModal||($.inArray('set',buttons)==-1);that.buttons.set={text:s.setText,css:'dwb-s',handler:that.select};that.buttons.cancel={text:(that.live)?s.closeText:s.cancelText,css:'dwb-c',handler:that.cancel};that.buttons.clear={text:s.clearText,css:'dwb-cl',handler:that.clear};that._isInput=$elm.is('input');hasButtons=buttons.length>0;if(that._isVisible){that.hide(true,false,true)}if(isModal){that._readValue();if(that._isInput){if(wasReadOnly===undefined){wasReadOnly=el.readOnly}el.readOnly=true}that.attachShow($elm)}else{that.show()}if(that._isInput){$elm.on('change.dw',function(){if(!that._preventChange){that.setValue($elm.val(),false,0.2)}that._preventChange=false})}};that.val=null;that.buttons={};that._isValid=true;if(!inherit){instances[el.id]=that;that.init(settings)}};ms.classes.Widget.prototype._defaults={setText:'Set',selectedText:'Selected',closeText:'Close',cancelText:'Cancel',clearText:'Clear',disabled:false,closeOnOverlay:true,showOnFocus:true,showOnTap:true,display:'bottom',scrollLock:true,tap:true,btnWidth:true};ms.themes.mobiscroll={rows:5,showLabel:false,headerText:false,btnWidth:false,selectedLineHeight:true,selectedLineBorder:1,dateOrder:'MMddyy',weekDays:'min',checkIcon:'ion-ios7-checkmark-empty',btnPlusClass:'mbsc-ic mbsc-ic-arrow-down5',btnMinusClass:'mbsc-ic mbsc-ic-arrow-up5',btnCalPrevClass:'mbsc-ic mbsc-ic-arrow-left5',btnCalNextClass:'mbsc-ic mbsc-ic-arrow-right5'};$(window).on('focus',function(){if($activeElm){preventShow=true}});$(document).on('mouseover mouseup mousedown click',function(ev){if(ms.tapped){ev.stopPropagation();ev.preventDefault();return false}})})(jQuery,window,document);



//scroller
(function($,window,document,undefined){var move,ms=$.mobiscroll,classes=ms.classes,instances=ms.instances,util=ms.util,pr=util.jsPrefix,has3d=util.has3d,hasFlex=util.hasFlex,getCoord=util.getCoord,constrain=util.constrain,testTouch=util.testTouch;function convert(w){var ret={values:[],keys:[]};$.each(w,function(k,v){ret.keys.push(k);ret.values.push(v)});return ret}classes.Scroller=function(el,settings,inherit){var $markup,btn,isScrollable,itemHeight,middle,s,trigger,valueText,click,moved,start,startTime,stop,p,min,max,target,index,lines,timer,that=this,$elm=$(el),iv={},pos={},pixels={},wheels=[];function onStart(ev){if(testTouch(ev)&&!move&&!click&&!btn&&!isReadOnly(this)){ev.preventDefault();ev.stopPropagation();move=true;isScrollable=s.mode!='clickpick';target=$('.dw-ul',this);setGlobals(target);moved=iv[index]!==undefined;p=moved?getCurrentPosition(target):pos[index];start=getCoord(ev,'Y');startTime=new Date();stop=start;scroll(target,index,p,0.001);if(isScrollable){target.closest('.dwwl').addClass('dwa')}if(ev.type==='mousedown'){$(document).on('mousemove',onMove).on('mouseup',onEnd)}}}function onMove(ev){if(move){if(isScrollable){ev.preventDefault();ev.stopPropagation();stop=getCoord(ev,'Y');if(Math.abs(stop-start)>3||moved){scroll(target,index,constrain(p+(start-stop)/itemHeight,min-1,max+1));moved=true}}}}function onEnd(ev){if(move){var time=new Date()-startTime,val=constrain(p+(start-stop)/itemHeight,min-1,max+1),speed,dist,tindex,ttop=target.offset().top;ev.stopPropagation();if(has3d&&time<300){speed=(stop-start)/time;dist=(speed*speed)/s.speedUnit;if(stop-start<0){dist=-dist}}else{dist=stop-start}tindex=Math.round(p-dist/itemHeight);if(!moved){var idx=Math.floor((stop-ttop)/itemHeight),li=$($('.dw-li',target)[idx]),hl=isScrollable;if(trigger('onValueTap',[li])!==false){tindex=idx}else{hl=true}if(hl){li.addClass('dw-hl');setTimeout(function(){li.removeClass('dw-hl')},100)}}if(isScrollable){calc(target,tindex,0,true,Math.round(val))}if(ev.type==='mouseup'){$(document).off('mousemove',onMove).off('mouseup',onEnd)}move=false}}function onBtnStart(ev){btn=$(this);if(btn.hasClass('dwwb')){if(testTouch(ev)){step(ev,btn.closest('.dwwl'),btn.hasClass('dwwbp')?plus:minus)}}if(ev.type==='mousedown'){$(document).on('mouseup',onBtnEnd)}}function onBtnEnd(ev){btn=null;if(click){clearInterval(timer);click=false}if(ev.type==='mouseup'){$(document).off('mouseup',onBtnEnd)}}function onKeyDown(ev){if(ev.keyCode==38){step(ev,$(this),minus)}else if(ev.keyCode==40){step(ev,$(this),plus)}}function onKeyUp(){if(click){clearInterval(timer);click=false}}function onScroll(ev){if(!isReadOnly(this)){ev.preventDefault();ev=ev.originalEvent||ev;var delta=ev.wheelDelta?(ev.wheelDelta/120):(ev.detail?(-ev.detail/3):0),t=$('.dw-ul',this);setGlobals(t);calc(t,Math.round(pos[index]-delta),delta<0?1:2)}}function step(ev,w,func){ev.stopPropagation();ev.preventDefault();if(!click&&!isReadOnly(w)&&!w.hasClass('dwa')){click=true;var t=w.find('.dw-ul');setGlobals(t);clearInterval(timer);timer=setInterval(function(){func(t)},s.delay);func(t)}}function isReadOnly(wh){if($.isArray(s.readonly)){var i=$('.dwwl',$markup).index(wh);return s.readonly[i]}return s.readonly}function generateWheelItems(i){var html='<div class="dw-bf">',ww=wheels[i],w=ww.values?ww:convert(ww),l=1,labels=w.labels||[],values=w.values,keys=w.keys||values;$.each(values,function(j,v){if(l%20===0){html+='</div><div class="dw-bf">'}html+='<div role="option" aria-selected="false" class="dw-li dw-v" data-val="'+keys[j]+'"'+(labels[j]?' aria-label="'+labels[j]+'"':'')+' style="height:'+itemHeight+'px;line-height:'+itemHeight+'px;"><div class="dw-i"'+(lines>1?' style="line-height:'+Math.round(itemHeight/lines)+'px;font-size:'+Math.round(itemHeight/lines*0.8)+'px;"':'')+'>'+v+(s.preset == "date" || s.preset == "datetime" || s.preset == "time" ? w.label : '')+'</div></div>';l++});html+='</div>';return html}function setGlobals(t){min=$('.dw-li',t).index($('.dw-v',t).eq(0));max=$('.dw-li',t).index($('.dw-v',t).eq(-1));index=$('.dw-ul',$markup).index(t)}function formatHeader(v){var t=s.headerText;return t?(typeof t==='function'?t.call(el,v):t.replace(/\{value\}/i,v)):''}function getCurrentPosition(t){var style=window.getComputedStyle?getComputedStyle(t[0]):t[0].style,matrix,px;if(has3d){$.each(['t','webkitT','MozT','OT','msT'],function(i,v){if(style[v+'ransform']!==undefined){matrix=style[v+'ransform'];return false}});matrix=matrix.split(')')[0].split(', ');px=matrix[13]||matrix[5]}else{px=style.top.replace('px','')}return Math.round(middle-(px/itemHeight))}function ready(t,i){clearTimeout(iv[i]);delete iv[i];t.closest('.dwwl').removeClass('dwa')}function scroll(t,index,val,time,active){var px=(middle-val)*itemHeight,style=t[0].style;if(px==pixels[index]&&iv[index]){return}pixels[index]=px;style[pr+'Transition']='all '+(time?time.toFixed(3):0)+'s ease-out';if(has3d){style[pr+'Transform']='translate3d(0,'+px+'px,0)'}else{style.top=px+'px'}if(iv[index]){ready(t,index)}if(time&&active){t.closest('.dwwl').addClass('dwa');iv[index]=setTimeout(function(){ready(t,index)},time*1000)}pos[index]=val}function getValid(val,t,dir){var cell=$('.dw-li[data-val="'+val+'"]',t),cells=$('.dw-li',t),v=cells.index(cell),l=cells.length;if(!cell.hasClass('dw-v')){var cell1=cell,cell2=cell,dist1=0,dist2=0;while(v-dist1>=0&&!cell1.hasClass('dw-v')){dist1++;cell1=cells.eq(v-dist1)}while(v+dist2<l&&!cell2.hasClass('dw-v')){dist2++;cell2=cells.eq(v+dist2)}if(((dist2<dist1&&dist2&&dir!==2)||!dist1||(v-dist1<0)||dir==1)&&cell2.hasClass('dw-v')){cell=cell2;v=v+dist2}else{cell=cell1;v=v-dist1}}return{cell:cell,v:v,val:cell.hasClass('dw-v')?cell.attr('data-val'):null}}function scrollToPos(time,index,manual,dir,active){if(trigger('validate',[$markup,index,time,dir])!==false){$('.dw-ul',$markup).each(function(i){var t=$(this),sc=i==index||index===undefined,res=getValid(that.temp[i],t,dir),cell=res.cell;if(!(cell.hasClass('dw-sel'))||sc){that.temp[i]=res.val;if(!s.multiple){$('.dw-sel',t).removeAttr('aria-selected');cell.attr('aria-selected','true')}$('.dw-sel',t).removeClass('dw-sel');cell.addClass('dw-sel');scroll(t,i,res.v,sc?time:0.1,sc?active:false)}});that._valueText=valueText=s.formatResult(that.temp);if(that.live){setValue(manual,manual,0,true)}that._header.html(formatHeader(valueText));if(manual){trigger('onChange',[valueText])}}}function calc(t,val,dir,anim,orig){val=constrain(val,min,max);var cell=$('.dw-li',t).eq(val),o=orig===undefined?val:orig,active=orig!==undefined,idx=index,dist=Math.abs(val-o),time=anim?(val==o?0.1:dist*s.timeUnit*Math.max(0.5,(100-dist)/100)):0;that.temp[idx]=cell.attr('data-val');scroll(t,idx,val,time,active);setTimeout(function(){scrollToPos(time,idx,true,dir,active)},10)}function plus(t){var val=pos[index]+1;calc(t,val>max?min:val,1,true)}function minus(t){var val=pos[index]-1;calc(t,val<min?max:val,2,true)}function setValue(fill,change,time,noscroll,temp){if(that._isVisible&&!noscroll){scrollToPos(time)}that._valueText=valueText=s.formatResult(that.temp);if(!temp){that.values=that.temp.slice(0);that.val=valueText}if(fill){trigger('onValueFill',[valueText,change]);if(that._isInput){$elm.val(valueText);if(change){that._preventChange=true;$elm.change()}}}}classes.Widget.call(this,el,settings,true);that.setValue=function(values,fill,time,temp,change){that.temp=$.isArray(values)?values.slice(0):s.parseValue.call(el,values+'',that);setValue(fill,change===undefined?fill:change,time,false,temp)};that.getValue=function(){return that.values};that.getValues=function(){var ret=[],i;for(i in that._selectedValues){ret.push(that._selectedValues[i])}return ret};that.changeWheel=function(idx,time,manual){if($markup){var i=0,nr=idx.length;$.each(s.wheels,function(j,wg){$.each(wg,function(k,w){if($.inArray(i,idx)>-1){wheels[i]=w;$('.dw-ul',$markup).eq(i).html(generateWheelItems(i));nr--;if(!nr){that.position();scrollToPos(time,undefined,manual);return false}}i++});if(!nr){return false}})}};that.getValidCell=getValid;that._generateContent=function(){var lbl,html='',l=0;$.each(s.wheels,function(i,wg){html+='<div class="mbsc-w-p dwc'+(s.mode!='scroller'?' dwpm':' dwsc')+(s.showLabel?'':' dwhl')+'"><div class="dwwc"'+(s.maxWidth?'':' style="max-width:600px;"')+'>'+(hasFlex?'':'<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');$.each(wg,function(j,w){wheels[l]=w;lbl=w.label!==undefined?w.label:j;html+='<'+(hasFlex?'div':'td')+' class="dwfl" style="'+(s.fixedWidth?('width:'+(s.fixedWidth[l]||s.fixedWidth)+'px;'):(s.minWidth?('min-width:'+(s.minWidth[l]||s.minWidth)+'px;'):'min-width:'+s.width+'px;')+(s.maxWidth?('max-width:'+(s.maxWidth[l]||s.maxWidth)+'px;'):''))+'"><div class="dwwl dwwl'+l+'">'+(s.mode!='scroller'?'<div class="dwb-e dwwb dwwbp '+(s.btnPlusClass||'')+'" style="height:'+itemHeight+'px;line-height:'+itemHeight+'px;"><span>+</span></div><div class="dwb-e dwwb dwwbm '+(s.btnMinusClass||'')+'" style="height:'+itemHeight+'px;line-height:'+itemHeight+'px;"><span>&ndash;</span></div>':'')+'<div class="dwl">'+lbl+'</div><div tabindex="0" aria-live="off" aria-label="'+lbl+'" role="listbox" class="dwww"><div class="dww" style="height:'+(s.rows*itemHeight)+'px;"><div class="dw-ul">';html+=generateWheelItems(l)+'</div></div><div class="dwwo"></div></div><div class="dwwol"'+(s.selectedLineHeight?' style="height:'+itemHeight+'px;margin-top:-'+(itemHeight/2+(s.selectedLineBorder||0))+'px;"':'')+'></div></div>'+(hasFlex?'</div>':'</td>');l++});html+=(hasFlex?'':'</tr></table>')+'</div></div>'});return html};that._attachEvents=function($markup){$markup.on('DOMMouseScroll mousewheel','.dwwl',onScroll).on('keydown','.dwwl',onKeyDown).on('keyup','.dwwl',onKeyUp).on('touchstart mousedown','.dwwl',onStart).on('touchmove','.dwwl',onMove).on('touchend','.dwwl',onEnd).on('touchstart mousedown','.dwb-e',onBtnStart).on('touchend','.dwb-e',onBtnEnd)};that._markupReady=function(){$markup=that._markup;scrollToPos()};that._fillValue=function(){setValue(true,true,0,true)};that._readValue=function(){that.temp=that.values?that.values.slice(0):s.parseValue($elm.val()||'',that);setValue()};that._processSettings=function(){s=that.settings;trigger=that.trigger;middle=Math.floor(s.rows/2);itemHeight=s.height;lines=s.multiline;that._isLiquid=(s.layout||(/top|bottom/.test(s.display)&&s.wheels.length==1?'liquid':''))==='liquid';that.values=null;that.temp=null;if(lines>1){s.cssClass=(s.cssClass||'')+' dw-ml'}};that._selectedValues={};if(!inherit){instances[el.id]=that;that.init(settings)}};classes.Scroller.prototype._class='scroller';classes.Scroller.prototype._defaults=$.extend({},classes.Widget.prototype._defaults,{minWidth:80,height:40,rows:3,multiline:1,delay:300,readonly:false,showLabel:true,wheels:[],mode:'scroller',preset:'',speedUnit:0.0012,timeUnit:0.08,formatResult:function(d){return d.join(' ')},parseValue:function(value,inst){var val=value.split(' '),ret=[],i=0,keys;$.each(inst.settings.wheels,function(j,wg){$.each(wg,function(k,w){w=w.values?w:convert(w);keys=w.keys||w.values;if($.inArray(val[i],keys)!==-1){ret.push(val[i])}else{ret.push(keys[0])}i++})});return ret}})})(jQuery,window,document);



//zh
(function ($) {
    $.mobiscroll.i18n.zh = $.extend($.mobiscroll.i18n.zh, {
        // Core
        setText: '确定',
        cancelText: '取消',
        clearText: '明确',
        selectedText: '选',
        // Datetime component
        dateFormat: 'yy/mm/dd',
        dateOrder: 'yymmdd',
        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        dayText: '日',
        hourText: '时',
        minuteText: '分',
        monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        monthText: '月',
        secText: '秒',
        timeFormat: 'HH:ii',
        timeWheels: 'HHii',
        yearText: '年',
        nowText: '当前',
        pmText: '下午',
        amText: '上午',
        // Calendar component
        dateText: '日',
        timeText: '时间',
        calendarText: '日历',
        closeText: '关闭',
        // Daterange component
        fromText: '开始时间',
        toText: '结束时间',
        // Measurement components
        wholeText: '合计',
        fractionText: '分数',
        unitText: '单位',
        // Time / Timespan component
        labels: ['年', '月', '日', '小时', '分钟', '秒', ''],
        labelsShort: ['年', '月', '日', '点', '分', '秒', ''],
        // Timer component
        startText: '开始',
        stopText: '停止',
        resetText: '重置',
        lapText: '圈',
        hideText: '隐藏'
    });
})(jQuery);
