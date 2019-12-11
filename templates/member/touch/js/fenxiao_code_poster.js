$(function () {

    //成功案例
    new Swiper('.topSwiper .swiper-container', {
        pagination: {el: '.topSwiper .pagination'} ,
        slideClass:'swiper-slide',
        loop: true,
        grabCursor: true,
        paginationClickable: true,
        slidesPerView :1.4,
        spaceBetween : 35,
        centeredSlides : true,

    });



    //如果没有菜单内容，则隐藏APP端右上角菜单
    if (device.indexOf('huoniao') > -1 && ($('.dropnav').size() == 0 || $('#navlist').size() == 0)) {
        setTimeout(function(){
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('hideAppMenu', {}, function(){});
            });
        }, 500);
    }


    var i=1
    for(i=1;i<=5;i++){
        getCavas(i);
    }
    function getCavas(i){
        //生成图片
        html2canvas(document.querySelector(".imgBox"+i+""), {
            'backgroundColor':null,
            'useCORS':true,

        }).then(canvas => {
            var a = canvasToImage(canvas);
            $('.drawImg'+i+'').delay(1000).html(a);
            $('.imgBox'+i+'').hide();
            // console.log(imgw)
        });
        function canvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");  //把canvas转换成base64图像保存
            return image;
        }
    }
    $(".swiper-slide-active .drawImg").click(function () {
        console.log(11);
    });

    //长按
    var flag=1  //设置长按标识符
    var timeOutEvent=0;
    $(".drawImg").on({
        touchstart: function(e){
            if(flag){
                clearTimeout(timeOutEvent);
                timeOutEvent = setTimeout("longPress()",800);
            }
            // e.preventDefault();
        },
        touchmove:function () {
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
        },
        touchend:function () {
            flag=1;
        }

    });

});


//长按执行的方法
function longPress(){
    var imgsrc = $(".swiper-slide-active .drawImg").find('img').attr('src');
    if(imgsrc==''||imgsrc==undefined){
        alert('下载失败，请重试');
        return 0
    }
    flag=0;
    setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler(
            'saveImage',
            {value: imgsrc},
            function(responseData){
                if(responseData == "success"){
                    setTimeout(function(){
                        flag=1;
                    }, 200)
                }

            },

        );
    });
}

