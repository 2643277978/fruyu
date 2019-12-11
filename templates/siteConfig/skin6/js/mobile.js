$(function(){

  var mySwiper = new Swiper('.swiper-container',{
  	speed:500,
  	mode : 'vertical',
  	resistance:'100%',
  	mousewheelControl : true,
  	grabCursor: true,
  	pagination: '.pagination',
    paginationClickable: true
  })

  $('.next-page').click(function(){
    $('.pagination .swiper-pagination-switch').eq(1).click();
  })

})
