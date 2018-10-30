$(function(){
	//是否有用户名登录或者有用户名自动登录
	var $entry = $.cookie("entry") ? JSON.parse($.cookie("entry")) : [];//自动登录的用户名或刚刚登录并勾选了自动登录的用户名
	var $entry2 = $.cookie("entry2") ? JSON.parse($.cookie("entry2")) : [];//刚刚登录但没有勾选自动登录的用户名
	if($entry.length != 0){
		entry($entry.name); //登录注册处换成已登录的用户名
		var cartName = "cart_"+$entry.name; //每个用户的购物车
		cartNum(cartName); //购物车里商品数量
	}else if($entry2.length != 0){
		entry($entry2.name); //登录注册处换成已登录的用户名
		var cartName = "cart_"+$entry2.name; //每个用户的购物车
		cartNum(cartName); //购物车里商品数量
	}
	function cartNum(cartName){
		var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
		var Number = 0;
		for(var i=0 ; i<goodsList.length ; i++){
			Number += goodsList[i].num;
		}
		$("#logo_right span").first().html(Number);
	}
	function entry(name){
		$("#top_center a").hide();//登录了就不需要登录和注册了
		var $spanNode1 = $("<span/>").html("您好，"+name).appendTo($("#top_center")); //当前登录的账号
		var $spanNode2 = $("<span/>").css({
			"cursor":"pointer",
			"margin-left":"5px"
		}).html("[退出]").appendTo($("#top_center"));
		$spanNode2.hover(function(){
			$(this).css("text-decoration","underline");
		},function(){
			$(this).css("text-decoration","none");
		})
		//退出当前账号
		$spanNode2.click(function(){
			//删除cookie
			$.cookie("entry2","",{expires:0, path:"/"});
			$.cookie("entry","",{expires:0, path:"/"});
			//刷新页面
			history.go(0);
		});
	}
	//进入购物车
	$("#logo_right").click(function(){
		if($entry.length!=0 || $entry2.length!=0){ //是否有用户登录
			location.href = "cart.html";
		}else{
			if(confirm("请登录!")){
				location.href = "entry.html?cart";
			}
		}
	});
	$.get("/static/json/index.json",function(data){
	//轮播图
		var $bigImg_img = $("#bigImg_img");
		var $bigImg_icon = $("#bigImg_icon");
		var lunBo = data.lunbo;
		//插入轮播图片
		for(var i=0 ; i<lunBo.length ; i++){
			var obj = lunBo[i];
			if(i==0){
				$("<img/>").attr("src",obj.img).appendTo($bigImg_img);
				$("<span/>").html(obj.title).addClass("active").appendTo($bigImg_icon);
			}else{
				$("<img/>").attr("src",obj.img).css({"opacity":0}).appendTo($bigImg_img);
				$("<span/>").html(obj.title).appendTo($bigImg_icon);
			}
		}
		//开始轮播
		var i = 0;
		var timer;
		Carousel(i);
		//移入切换
		$bigImg_icon.find("span").on("mouseenter",function(){
			clearInterval(timer);
			if($(this).index() == $bigImg_icon.find("span").length-1){
				i = -1;
			}else{
				i = $(this).index();
			}
			$bigImg_icon.find("span").removeClass("active").eq($(this).index()).addClass("active");
			for(var j=0 ; j<$bigImg_img.find("img").length ; j++){
				if(j==$(this).index()){  //当前序号图片显示，其他序号图片隐藏
					$bigImg_img.find("img").stop().eq(j).animate({"opacity":1},1000);
				}else{
					$bigImg_img.find("img").eq(j).animate({"opacity":0},1000);
				}
			}
		}).on("mouseleave",function(){
			Carousel(i);
		});
		//轮播
		function Carousel(i){
			timer = setInterval(function(){
				i++;
				$bigImg_icon.find("span").removeClass("active").eq(i).addClass("active");
				$bigImg_img.find("img").eq(i).animate({"opacity":1},1000);
				if(i==0){
					$bigImg_img.find("img").last().animate({"opacity":0},1000);
				}else{
					$bigImg_img.find("img").eq(i-1).animate({"opacity":0},1000);
				}
				if(i>=$bigImg_img.find("img").length-1){
					i = -1;
				}
			},3000);
		}
		
	//轮播图中的商品
		var lunBo_goods = data.lunbo_goods[0];
		var $bigImg_right = $("#bigImg_right");
		$("<p/>").html(lunBo_goods.time).addClass("time").appendTo($bigImg_right);
		$("<img/>").attr({
			"src":lunBo_goods.img,
			"id":lunBo_goods.id
		}).appendTo($bigImg_right);
		$("<a/>").attr("href","detail.html?"+lunBo_goods.id).html(lunBo_goods.describe).addClass("describe").appendTo($bigImg_right);
		$("<h3/>").html(lunBo_goods.price).appendTo($bigImg_right);
		
	//轮播图中的商品列表
		var $bigImg_left_li = $("#bigImg_left li");
		var $bigImg_list = $("#bigImg_list")
		var $bigImg_list_div = $("#bigImg_list div");
		var index;
		$bigImg_left_li.on("mouseenter",function(){
			index = $(this).index()-1;
			$bigImg_list.css("display","block");
			$bigImg_list_div.css("display","none").eq($(this).index()-1).css("display","block");
		}).on("mouseleave",function(){
			$bigImg_list.css("display","none");
		});
		$bigImg_list.on("mouseenter",function(){
			$(this).css("display","block");
			$bigImg_left_li.eq(index).addClass("hover");
		}).on("mouseleave",function(){
			$(this).css("display","none");
			$bigImg_left_li.eq(index).removeClass("hover");
		});
		//今日热播
		var $hit_goods_today = $("#hit_goods_today");
		var hit_today = data.hit_today;
		reBo($hit_goods_today,hit_today,data);
		//昨日热播
		var $hit_goods_yestoday = $("#hit_goods_yestoday");
		var hit_yestoday = data.hit_yestoday;
		reBo($hit_goods_yestoday,hit_yestoday,data);
	//今日热播和昨日热播
		function reBo($hit_goods_day,dataObj,data){
			var hit = data.hit[0];
			//左边的图
			var $hit_goods_high = $("<div/>").addClass("hit_goods_high");
			$("<img/>").attr({
				"src":hit.img,
				"id":hit.id
			}).appendTo($hit_goods_high);
			$hit_goods_high.appendTo($hit_goods_day);
			//右边的商品
			for(var i=0 ; i<dataObj.length ; i++){
				var obj = dataObj[i];
				//创建商品列表,每四个商品生成一个列表
				if(i%4==0){
					var $hit_goods_dayChild = $("<div/>").addClass("hit_list");
					$hit_goods_dayChild.appendTo($hit_goods_day);
					if(i!=0){
						$hit_goods_dayChild.css("display","none");
					}
				}
				//创建商品块
				var $hit_goods_directSeeding = $("<div/>").addClass("hit_goods_directSeeding");
				//创建“直播”图标
				$("<div/>").html("直播").addClass("hit_directSeeding").appendTo($hit_goods_directSeeding);
				$hit_goods_directSeeding.appendTo($hit_goods_dayChild);
				//载入直播时间
				$("<p/>").html(obj.time).addClass("hit_time").appendTo($hit_goods_directSeeding);
				//载入商品图片
				$("<img/>").attr({
					"src":obj.img,
					"id":obj.id
				}).appendTo($hit_goods_directSeeding);
				//载入商品描述
				$("<a/>").attr({
					"href":"detail.html?"+obj.id,
					"target":"_blank"
				}).html(obj.describe).addClass("describe").appendTo($hit_goods_directSeeding);
				//载入商品价格
				$("<p/>").html(obj.price).addClass("hit_price").appendTo($hit_goods_directSeeding);
			}
			//如果商品数量大于4则生成切换按钮
			if(dataObj.length > 4){
				$("<div/>").html("<").addClass("flip_left").appendTo($hit_goods_day);
				$("<div/>").html(">").addClass("flip_right").appendTo($hit_goods_day);
			}
			//移入商品区域显示切换按钮，移出商品块隐藏切换按钮
			$(".hit_list").on("mouseenter",function(){
				$(".flip_left").css("display","block");
				$(".flip_right").css("display","block");
				$(".flip_left,.flip_right").on("mouseenter",function(){
					$(".flip_left").css("display","block");
					$(".flip_right").css("display","block");
				}).on("mouseleave",function(){
					$(".flip_left").css("display","none");
					$(".flip_right").css("display","none");
				});
			}).on("mouseleave",function(){
				$(".flip_left").css("display","none");
				$(".flip_right").css("display","none");
			});
			//点击切换按钮切换商品列表
			var $hit_list = $hit_goods_day.find(".hit_list");
			var list = 0;
			$(".flip_left").click(function(){
				if(list==0){
					list = $hit_list.length;
				}
				list--;
				$hit_list.css("display","none");
				$hit_list.eq(list).css("display","block")
			});
			$(".flip_right").click(function(){
				if(list==$hit_list.length-1){
					list = -1;
				}
				list++;
				$hit_list.css("display","none");
				$hit_list.eq(list).css("display","block")
			});
		}
	//今日热播与昨日热播切换
		var $switch = $(".hit_date span");
		$switch.click(function(){
			$switch.css("color","black");
			$(this).css("color","#e91456");
			if($(this).index() == 0){
				$("#hit_goods_yestoday").css("display","none");
				$("#hit_goods_today").css("display","block");
			}else{
				$("#hit_goods_yestoday").css("display","block");
				$("#hit_goods_today").css("display","none");
			}
		});
	//热销推荐
		//左边的图
		var recommend = data.recommend[0];
		var $recommend_goods = $("#recommend_goods");
		var $recommend_goods_left = $("<div/>").addClass("recommend_goods_left").append($("<img/>").attr({
			"src":recommend.img,
			"id":recommend.id
		}));
		$recommend_goods_left.appendTo($recommend_goods);
		//右边的推荐商品
		var recommend_goods = data.recommend_goods;
		for(var i=0 ; i<recommend_goods.length ; i++){
			var obj = recommend_goods[i];
			var $recommend_goods_details = $("<div/>").addClass("recommend_goods_details");
			$("<img/>").attr({
				"src":obj.img,
				"id":obj.id
			}).appendTo($recommend_goods_details);
			$("<a/>").attr("href","detail.html?"+obj.id).html(obj.describe).addClass("describe").appendTo($recommend_goods_details);
			$("<p/>").html(obj.price).addClass("recommend_price").appendTo($recommend_goods_details);
			$("<p/>").html(obj.salesVolume).addClass("recommend_salesVolume").appendTo($recommend_goods_details);
			$recommend_goods_details.appendTo($recommend_goods);
		}
	//F1服装鞋帽
		var F1_left = data.F1_left;
		var $F1_left = $("#F1 .F_left div");
		var F1_right = data.F1_right;
		var $F1_right = $("#F1 .F_right");
		floor(F1_left,F1_right,$F1_left,$F1_right);
	//F2个护美妆
		var F2_left = data.F2_left;
		var $F2_left = $("#F2 .F_left div");
		var F2_right = data.F2_right;
		var $F2_right = $("#F2 .F_right");
		floor(F2_left,F2_right,$F2_left,$F2_right);
	//F3食品酒水 运动保健
		var F3_left = data.F3_left;
		var $F3_left = $("#F3 .F_left div");
		var F3_right = data.F3_right;
		var $F3_right = $("#F3 .F_right");
		floor(F3_left,F3_right,$F3_left,$F3_right);
	//F4家居日用 家用电器
		var F4_left = data.F4_left;
		var $F4_left = $("#F4 .F_left div");
		var F4_right = data.F4_right;
		var $F4_right = $("#F4 .F_right");
		floor(F4_left,F4_right,$F4_left,$F4_right);
		//建立楼层数据
		function floor(F_left,F_right,$F_left,$F_right){
			//左边的商品
			$("<img/>").attr({
				"src":F_left[0].img,
				"id":F_left[0].id
			}).appendTo($F_left.first());
			$("<img/>").attr({
				"src":F_left[1].img,
				"id":F_left[1].id
			}).appendTo($F_left.last());
			//右边的商品
			for(var i=0 ; i<F_right.length ; i++){
				var obj = F_right[i];
				var $liNode = $("<li/>");
				$("<img/>").attr({
					"src":obj.img,
					"id":obj.id
				}).appendTo($liNode);
				$("<a/>").attr("href","detail.html?"+obj.id).html(obj.describe).addClass("describe").appendTo($liNode);
				$("<p/>").html(obj.price).addClass("F_price").appendTo($liNode);
				$liNode.appendTo($F_right);
			}
		}
	//F3下面的横幅广告
		var bannerAds = data.bannerAds[0];
		$("<img/>").attr({
			"src":bannerAds.img,
			"id":bannerAds.id
		}).appendTo($("#BannerAds"));
	//点击商品进入商品详情
		$("img").click(function(){
			if($(this).attr("id")){
				window.open("detail.html?"+$(this).attr("id"));
			}
		});
	});
//关闭底部广告
	var $colseAD = $(".colseAD");
	$colseAD.click(function(){
		$("#footrAD").animate({"opacity":0},300,function(){
			$(this).css("display","none");
		});
	});
//页面左侧楼梯
	var $floor = $("#floor");
	var $floor_td = $("#floor table tr td").not(".top");
	var $F_name = $("[name='Floor']");
	var floor_num; //当前到达的楼层
	//滚动显示相应楼层
	startScroll();
	function startScroll(){
		//先清除所有滚动事件，以免事件叠加
		$(document).off("scroll");
		$(document).scroll(function(){
			var scrollTop = $(document).scrollTop();
			//当scrollTop值大于某个值时显示楼层
			if(scrollTop >= $F_name.first().offset().top-220){
				$floor.css("display","block");
				for(var i=0 ; i<$F_name.length; i++){
					//当在前三楼时
					if(i < $F_name.length-1){
						//当scrollTop值在当前这层楼的offsetTop值和下一层楼的offsetTop值之间时改变该楼层的样式
						if(scrollTop >= $F_name.eq(i).offset().top-220 && scrollTop < $F_name.eq(i+1).offset().top-220){
							floor_num = i;
							//楼层显示
							$floor_td.find('span:first').css("display","block");
							$floor_td.find('span:last').css("display","none");
							//描述显示
							$floor_td.eq(i).find('span:first').css("display","none");
							$floor_td.eq(i).find('span:last').css("display","block");
						}
					}else{
						//因为第四层没有下一层，所以单独判断
						if(scrollTop >= $F_name.eq(i).offset().top-220){
							floor_num = i;
							//楼层显示
							$floor_td.find('span:first').css("display","block");
							$floor_td.find('span:last').css("display","none");
							//描述显示
							$floor_td.eq(i).find('span:first').css("display","none");
							$floor_td.eq(i).find('span:last').css("display","block");
						}
					}
				}
				//当滚动条滚动到页面最下面的时候，所有楼层样式显示为“楼层（F*）”
				if(scrollTop > $F_name.last().offset().top+150){
					$floor_td.find('span:first').css("display","block");
					$floor_td.find('span:last').css("display","none");
				}
			//当scrollTop值小于某个值时隐藏楼层
			}else if(scrollTop < $F_name.first().offset().top-220){
				$floor.css("display","none");
			}
		});
	}
	//鼠标滑过楼层时改变楼层样式
	$floor_td.hover(function(){
		//所有楼层恢复默认样式（F*），除了当前到达的楼层
		$floor_td.not($floor_td.eq(floor_num)).find('span:first').css("display","block");
		$floor_td.not($floor_td.eq(floor_num)).find('span:last').css("display","none");
		$floor_td.find('span:last').removeClass("hover");
		//当前楼层改变样式（F*->文字描述）
		$(this).find('span:first').css("display","none");
		$(this).find('span:last').css("display","block").addClass("hover");
	},function(){
		$floor_td.not($floor_td.eq(floor_num)).find('span:first').css("display","block");
		$floor_td.not($floor_td.eq(floor_num)).find('span:last').css("display","none");
		$floor_td.find('span:last').removeClass("hover");
	});
	//点击到达相应楼层
	$("#floor tr").not(":last").click(function(){
		floor_num = $(this).index();
		$floor_td.find('span:first').css("display","block");
		$floor_td.find('span:last').css("display","none");
		$floor_td.eq($(this).index()).find('span:first').css("display","none");
		$floor_td.eq($(this).index()).find('span:last').css("display","block");
		//清除页面滚动时左侧楼梯样式效果也跟着改变的效果
		$(document).off("scroll");
		//因为scroll的效果都清除了所以要添加一条楼梯隐藏判断
		$(document).scroll(function(){
			var scrollTop = $(document).scrollTop();
			//当scrollTop值大于某个值时显示楼层
			if(scrollTop >= $F_name.first().offset().top-220){
				$floor.css("display","block");
			//当scrollTop值小于某个值时隐藏楼层
			}else if(scrollTop < $F_name.first().offset().top-220){
				$floor.css("display","none");
			}
		});
		var target = $F_name.eq($(this).index()).offset().top - 220;
		startMove(target);
	});
	var timer;
	//开始运动
	function startMove(target){
		clearInterval(timer);
		timer = setInterval(function(){
			var current = $(document).scrollTop();
			var ispeed = (target-current)/8;
			if(target < current){
				ispeed = Math.floor(ispeed);
			}else{
				ispeed = Math.ceil(ispeed);
			}
			if(current == target){
				clearInterval(timer);
				if(target != 0 ){
					startScroll();
				}
				return;
			}
			$(document).scrollTop(ispeed+current);
		},30);
	}
	//回到顶部
	$("#floor td:last").click(function(){
		startMove(0);
	});
});