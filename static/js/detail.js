$(function(){
	//是否有用户名登录或者有用户名自动登录
	var $entry = $.cookie("entry") ? JSON.parse($.cookie("entry")) : [];//自动登录的用户名或刚刚登录并勾选了自动登录的用户名
	var $entry2 = $.cookie("entry2") ? JSON.parse($.cookie("entry2")) : [];//刚刚登录但没有勾选自动登录的用户名
	if($entry.length != 0){
		entry($entry.name); //登录注册处换成已登录的用户名
		var cartName = "cart_"+$entry.name; //每个用户的购物车
		cartNum(cartName); //购物车里商品数量
		console.log(1);
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
	
	//全部商品分类列表
	var $nav_left = $("#nav_left");
	var $nav_list = $("#nav_list");
	$nav_left.click(function(){
		$nav_list.slideToggle();
	});
	
	//获取商品信息
	$.get("/static/json/detail.json",function(data){
		var id = window.location.search.replace("?","");
		for(var i=0 ; i<data.length ; i++){
			var obj = data[i]
			if(obj.id == id){
				//窗口标题
				document.title = obj.describe;
				//获取路径
				var $goods_path = $("#goods_path");
				for(var j=0 ; j<obj.path.length ; j++){
					$("<a href='#'>").html(obj.path[j]).addClass("path_"+(j+1)).appendTo($goods_path);
					$("<i>&gt;</i>").appendTo($goods_path);
				}
				$("<span/>").html(obj.describe).appendTo($goods_path);
				//获取大图
				$("<img/>").attr("src",obj.img).appendTo($(".details_bigimg"));
				//放大镜图片
				$("<img/>").attr("src",obj.img).addClass("bigArea_bigImg").appendTo($(".bigArea"));
				//下面的阅览小图片
				var $details_smallImg = $(".details_smallImg");
				for(var j=0 ; j<obj.smallImg.length ; j++){
					$("<img/>").attr("src",obj.smallImg[j]).appendTo($details_smallImg);
				}
				//商品标题以及供货号
				var $title = $(".details_information .title");
				if(obj.TV){
					$("<i/>").html(obj.TV).appendTo($title);
				}
				$("<b/>").html(obj.describe).appendTo($title);
				$("<span/>").html(obj.number).appendTo($title);
				//商品价格
				$("<b>¥<span>"+obj.price+"</span></b>").appendTo($(".price .price_top"));
				//促销优惠
				if(obj.youHui){
					for(var j=0 ; j<obj.youHui.length ; j++){
						var $youHui = $("<span/>").html(obj.youHui[j]).appendTo($(".price .price_center"));
						if(j!=0) $youHui.addClass("newline");
					}
				}else{
					$("<span/>").html("暂无优惠活动").appendTo($(".price .price_center"));
				}
				//积分
				$("<span>订购此商品可返回<span style='color: #bf0200;'>"+obj.jiFen+"</span>积分</span>").appendTo($(".price_bottom"));
				//尺寸
				if(obj.size){
					var $tableNode = $("<table/>").appendTo(".standard .size");
					var $trNode = $("<tr/>").appendTo($tableNode);
					for(var j=0 ; j<obj.size.length ; j++){
					 	var $tdNode = $("<td/>").html(obj.size[j]).appendTo($trNode);
					 	if(j == 0) $tdNode.addClass("click");
					}
				}else{
					$("<span/>").html("暂无尺寸").css({
						"font-size": "13px",
						"line-height": "50px"
					}).appendTo(".standard .size");
				}
				//颜色
				if(obj.color){
					var $tableNode = $("<table/>").appendTo(".standard .color");
					var $trNode = $("<tr/>").appendTo($tableNode);
					for(var j=0 ; j<obj.color.length ; j++){
					 	var $tdNode = $("<td/>").html(obj.color[j]).appendTo($trNode);
					 	if(j == 0) $tdNode.addClass("click");
					}
				}else{
					$("<span/>").html("暂无颜色").css({
						"font-size": "13px",
						"line-height": "50px"
					}).appendTo(".standard .color");
				}
				break;
			}
		}
		
	//选择商品尺寸
		$(".standard .size td").click(function(){
			$(".standard .size td").removeClass("click");
			$(this).addClass("click");
		});
		
	//选择商品颜色
		$(".standard .color td").click(function(){
			$(".standard .color td").removeClass("click");
			$(this).addClass("click");
		});
		
	//选择商品数量
		var $number = $(".details_information .number");
		var $count = parseInt($number.find("input").val());
		//如果只有1件则不能再减
		if($count == 1){
			$number.find(".minus").css("color","#BEBEBE");
		}
		//减
		$number.find(".minus").click(function(){
			$count = parseInt($number.find("input").val());
			if($count == 1){
				$(this).css("color","#BEBEBE");
			}else{
				$(this).css("color","#555555");
				$number.find("input").val(--$count);
				$count = parseInt($number.find("input").val());
				if($count == 1) $(this).css("color","#BEBEBE");
			}
		});
		//加
		$number.find(".plus").click(function(){
			$count = parseInt($number.find("input").val());
			$number.find("input").val(++$count);
			$number.find(".minus").css("color","#555555");
		});
		//数量文本框失去焦点
		$number.find("input").blur(function(){
			if($(this).val()<=0){
				alert("数量不能小于1");
				$(this).val(1);
			}else{
				$(this).val(parseInt($(this).val()));
			}
		});
		
	//立即购买
		$(".settlement .btn1").click(function(){
			if($entry.length!=0 || $entry2.length!=0){ //是否有用户登录
				var cartName = "cart_"+($entry.length!=0 ? $entry.name : $entry2.name);
				var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
				var flag = true;//当前页面商品是否没有加入购物车
				for(var i=0 ; i<goodsList.length ; i++){
					if(id == goodsList[i].id){//当前页面商品已经加入购物车
						flag = false;
					}
				}
				if(flag){//如果当前页面商品没有加入购物车，则需把该商品加入购物车
					cart(cartName);
				}
				location.href = "cart.html";
			}else{
				if(confirm("请登录!")){
					location.href = "entry.html?detail";
				}
			}
		});
		
	//加入购物车
		$(".settlement .btn2").click(function(){
			if($entry.length!=0 || $entry2.length!=0){ //是否有用户登录
				var cartName = "cart_"+($entry.length!=0 ? $entry.name : $entry2.name);
				console.log(cartName)
				cart(cartName);
				//商品飞入购物车动画
				var newImg = $("<div/>").appendTo("body");
				newImg.css({
					"backgroundImage":"url("+$(".details_bigimg img").attr("src")+")",
					"position":"absolute",
					"left":$(".details_bigimg").offset().left,
					"top":$(".details_bigimg").offset().top,
					"width":"29.6%",
					"height":"400px",
					"backgroundSize": "cover"
				});
				newImg.animate({
					"left":$("#logo_right").offset().left,
					"top":$("#logo_right").offset().top+$("#logo_right").outerHeight(),
					"width":0,
	            	"height":0
				},500,function(){
					$(this).remove();
					//购物车重新获取商品种数
					cartNum(cartName);
				});
			}else{
				if(confirm("请登录!")){
					location.href = "entry.html?detail";
				}
			}
		});
		function cart(cartName){
			//获取商品信息
			var goodsId = id;
			var goodsImg = "";
			var goodsName ="";
			var goodsPrice = 0;
			var goodsCode = "";
			var goodsJiFen = "";
			var goodsSize = "";
			var goodsColor = "";
			var goodsTV = "";
			var goodsYouHui = "";
			var goodsNum = parseInt($(".number input").val());
			for(var i=0 ; i<data.length ; i++){
				var obj = data[i]
				if(obj.id == id){
					goodsImg = data[i].img;
					goodsName = data[i].describe;
					goodsCode = data[i].number.replace("(供货号:","").replace(")","");
					goodsPrice = data[i].price;
					goodsJiFen = data[i].jiFen;
					if(data[i].TV){
						goodsTV = data[i].TV;
					}
					if(data[i].youHui){
						goodsYouHui = data[i].youHui;
					}
					break;
				}
			}
			var $size = $(".standard .size td");
			for(var i=0 ; i<$size.length ; i++){
				if($size.eq(i).hasClass("click")){
					goodsSize = $size.eq(i).html();
					break;
				}
			}
			var $color = $(".standard .color td");
			for(var i=0 ; i<$color.length ; i++){
				if($color.eq(i).hasClass("click")){
					goodsColor = $color.eq(i).html();
					break;
				}
			}
			
			//添加到购物车
			//如果是第一次加入购物车, 则goodsList=[], 否则获取原来购物车(cookie)中的商品
			var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
			var isExist = false; //不存在
			for (var i=0; i<goodsList.length; i++) {
				var cartGoodsId = goodsList[i].id; //购物车中商品id
				var cartGoodsSize = goodsList[i].size //购物车中商品size
				var cartGoodsColor = goodsList[i].color //购物车中商品color
				if (goodsId == cartGoodsId && goodsSize == cartGoodsSize && goodsColor == cartGoodsColor) {
					//存在相同的商品, 则把num增加
					goodsList[i].num += goodsNum; 
					isExist = true; //表示存在
				}
			}
			//添加新的商品时调用
			if (!isExist) {
				//对象:一个商品
				var goods = {
					id: goodsId,
					img:goodsImg,
					name: goodsName,
					price: goodsPrice,
					code: goodsCode,
					jiFen: goodsJiFen,
					size: goodsSize,
					color: goodsColor,
					TV: goodsTV,
					youHui: goodsYouHui,
					num: goodsNum
				}
				goodsList.unshift(goods);
			}
			
			//添加到cookie
			$.cookie(cartName, JSON.stringify(goodsList), {expires:7, path:"/"});
		}
		
	//放大镜
		var $details_bigimg = $(".details_bigimg");
		var $smallArea = $(".smallArea");
		var $bigImg = $(".bigArea_bigImg");
		var $bigArea = $(".bigArea");
		//放大系数/放大倍数
		var scale = 2;
		//mousemove
		$details_bigimg.mousemove(function(e){
			$smallArea.show(); //显示小区域
			$bigArea.show();//显示大区域
			//clientX: 可视区域的x值
			//pageX: 距离窗口左边的x值
			var x = e.pageX - $details_bigimg.offset().left - $smallArea.width()/2;
			var y = e.pageY - $details_bigimg.offset().top - $smallArea.height()/2; 
			//控制小区域范围在小图内
			if (x <= 0) { //不超出左边
				x = 0;
			}
			else if (x >= $details_bigimg.width()-$smallArea.width()) { //不超出右边
				x = $details_bigimg.width()-$smallArea.width();
			}
			if (y <= 0) { //不超出上边
				y = 0;
			}
			else if (y >= $details_bigimg.height()-$smallArea.height()) { //不超出下边
				y = $details_bigimg.height()-$smallArea.height();
			}
			//移动小区域
			$smallArea.css({left: x, top: y});
			//移动大图
			$bigImg.css({left: -x*scale, top: -y*scale});
		})
		//mouseleave
		$details_bigimg.mouseleave(function(){
			$smallArea.hide(); //隐藏小区域
			$bigArea.hide();//隐藏大区域
		});
		
	//点击小图显示大图
		var $details_smallImg = $(".details_smallImg");
		$details_smallImg.find("img").click(function(){
			$details_bigimg.find("img").attr("src",$(this).attr("src"));
			$bigImg.attr("src",$(this).attr("src"));
		});
		
	//最佳搭配、商品介绍
		var $collocation_all = $(".collocation_all");
		for(var i=0 ; i<data.length; i++){
			if(id == data[i].id){
				//最佳搭配
				if(!data[i].collocation){
					$collocation_all.html("暂无搭配").css({
						"text-align":"center",
						"font-size":"14px",
						"line-height":"50px",
						"height":"50px",
						"color":"#999999"
					});
				}else{
					for(var j=0 ; j<data[i].collocation.length ; j++){
						var obj = data[i].collocation[j]
						var $divNode = $("<div>").addClass("collocation_one").appendTo($collocation_all);
						$("<img/>").attr("src",obj.img).appendTo($divNode);
						$("<p/>").html(obj.name).addClass("collocation_describe").addClass("describe").appendTo($divNode);
						$("<p/>").html(obj.price).addClass("collocation_price").appendTo($divNode);
					}
				}
				//商品介绍
				var $intr_bottom = $(".intr_bottom");
				for(var j=0 ; j<data[i].introduce.length ; j++){
					var obj = data[i].introduce[j];
					var $liNode = $("<li/>").appendTo($intr_bottom);
					if(obj != 0){
						$("<img/>").attr("src",obj).appendTo($liNode);
					}else{
						$liNode.html("暂无内容").css({
							"text-align":"center",
							"font-size":"14px",
							"line-height":"50px",
							"height":"50px",
							"color":"#999999"
						});
					}
					if(j == 0){
						$liNode.show();
					}
				}
				break;
			}
		}
		
	//商品介绍切换
		var $intr_top = $(".intr_top li");
		var $intr_bottom_li = $(".intr_bottom li");
		$intr_top.click(function(){
			$intr_top.find("i").attr("id",null);
			$(this).find("i").attr("id","red");
			$intr_bottom_li.hide();
			$intr_bottom_li.eq($(this).index()).show();
		});
		
	//最近浏览
		var $RBrowse = $("#RBrowse");
		//最近浏览过的商品
		var $browse_list = $.cookie("browse") ? JSON.parse($.cookie("browse")) : [];
		if($browse_list.length != 0){
			for(var i=0 ; i<$browse_list.length ; i++){
				var obj = $browse_list[i];
				var $divNode = $("<div/>").addClass("RBrowse_one").appendTo($RBrowse);
				$("<img/>").attr("src",obj.img).attr("id",obj.id).appendTo($divNode);
				$("<a/>").attr({
					"href":"detail.html?"+obj.id,
					"target":"_blank"
				}).html(obj.describe).addClass("RBrowse_describe").addClass("describe").appendTo($divNode);
				$("<p/>").html("¥"+obj.price).addClass("RBrowse_price").appendTo($divNode);
			}
		}
		//获取最后浏览的商品（当前商品）
		var shop;
		for(var i=0 ; i<data.length ; i++){
			var obj = data[i]
			if(obj.id == id){
				shop = {
					"id":obj.id,
					"img":obj.img,
					"describe":obj.describe,
					"price":obj.price
				}
				break;
			}
		}
		var have = false; //最近浏览的商品中是否有相同的商品
		for(var i=0 ; i<$browse_list.length ; i++){
			//如果当前浏览的商品在最近浏览的五个商品中有记录，则把该商品移到最前面
			if(shop.id == $browse_list[i].id){
				$browse_list.splice(i,1);
				$browse_list.unshift(shop);
				have = true
				break;
			}
		}
		if(!have){ //如果有相同的商品则不需要添加，只要把它移动到最前面就行,没有就添加
			//如果最近浏览过的商品已经等于或大于5个则把最早浏览过的商品删除，再把当前商品插入到最前面
			if($browse_list.length >= 5){
				$browse_list.splice($browse_list.length-1,1); //删除最后一个商品
				$browse_list.unshift(shop); //添加当前商品
			}else{//如果最近浏览过的商品小于5个则直接把当前商品插入到最前面
				$browse_list.unshift(shop); //添加当前商品
			}
		}
		//最新记录存入cookie
		$.cookie("browse",JSON.stringify($browse_list),{expires:7,path:"/"});
	
	//热销排行
		$.get("../json/detail_sell.json",function(sell){
			var $sell = $("#sell");
			for(var i=0 ; i<sell.id.length; i++){
				for(var j=0 ; j<data.length ; j++){
					if(sell.id[i] == data[j].id){
						var $divNode = $("<div/>").addClass("sell_one").appendTo($sell);
						$("<img/>").attr("src",data[j].img).attr("id",data[j].id).appendTo($divNode);
						$("<a/>").attr({
							"href":"detail.html?"+data[j].id,
							"target":"_blank"
						}).html(data[j].describe).addClass("sell_describe").addClass("describe").appendTo($divNode);
						$("<p/>").html("¥"+data[j].price).addClass("sell_price").appendTo($divNode);
						break;
					}
				}
			}
			
			//点击最近浏览商品以及热销排行商品进入商品详情
			$("#parameter_left img").click(function(){
				if($(this).attr("id")){
					window.open("detail.html?"+$(this).attr("id"));
				}
			});
		});
	});
});