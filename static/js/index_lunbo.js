$(function () {
    // 轮播图
    new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        autoplay:2500,
        loop: true
    });

    // 浮动栏消失
	$(".colseAD").click(function(){
		$("#footrAD").animate({"opacity":0},300,function(){
			$(this).css("display","none");
		});
	});
})
