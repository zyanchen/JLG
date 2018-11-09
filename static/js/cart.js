$(function(){
	//是否有用户名登录或者有用户名自动登录
	var $entry = $.cookie("entry") ? JSON.parse($.cookie("entry")) : [];//自动登录的用户名或刚刚登录并勾选了自动登录的用户名
	var $entry2 = $.cookie("entry2") ? JSON.parse($.cookie("entry2")) : [];//刚刚登录但没有勾选自动登录的用户名
	var cartName = "noUser";  //给cartName一个初始值，防止当没有登录用户名时cartName的值为空，下面用cartName查找cookie时出错，这个初始值可以随便给
	if($entry.length != 0){
		entry($entry.name);
		cartName = "cart_"+$entry.name;
	}else if($entry2.length != 0){
		entry($entry2.name);
		cartName = "cart_"+$entry2.name;
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
//获取cookie创建商品行
	var goodsList = $.cookie(cartName) ? JSON.parse($.cookie(cartName)) : [];
	//判断是否有商品加入购物车
	if(goodsList.length){
		$(".cart_yes").show();
		$(".cart_no").hide();
		var $table = $(".cart_yes table tbody");
		for(var i=0 ; i<goodsList.length ; i++){
			var $trNode = $("<tr/>").appendTo($table);
			//商品列前面的勾和图片
			var $tdNode1 = $("<td/>").addClass("td1").appendTo($trNode);
			$("<span>√</span>").addClass("check").appendTo($tdNode1);
			$("<img/>").attr({
				"src":goodsList[i].img,
				"id":goodsList[i].id
			}).css("cursor","pointer").appendTo($tdNode1);
			//商品详情
			var $tdNode2 = $("<td/>").addClass("td1").appendTo($trNode);
			var $aNode = $("<a/>").attr("href","detail.html?"+goodsList[i].id).appendTo($tdNode2)
			$("<h5/>").html(goodsList[i].name).appendTo($aNode);
			$("<span/>").html("货号："+goodsList[i].code).appendTo($tdNode2);
			if(goodsList[i].youHui){ //是否有优惠
				$("<span/>").addClass("youHui").html("减").appendTo($tdNode2);
			}
			if(goodsList[i].TV){ //是否为TV商品
				$("<span/>").addClass("TV").html("TV").appendTo($tdNode2);
			}
			$("<p/>").html("颜色/尺码："+goodsList[i].color+"/"+goodsList[i].size).appendTo($tdNode2);
			if(goodsList[i].youHui){ //是否有优惠
				$("<p/>").css("color","#eb1656").html(goodsList[i].youHui).appendTo($tdNode2);
			}
			//商品价格
			$("<td/>").html("¥"+goodsList[i].price).addClass("td2").appendTo($trNode);
			//商品数量
			var $tdNode3 = $("<td/>").addClass("td2").addClass("num").appendTo($trNode);
			$("<div>-</div>").addClass("minus").appendTo($tdNode3);
			$("<input type='text' />").attr("readonly","readonly").val(goodsList[i].num).appendTo($tdNode3);
			$("<div>+</div>").addClass("plus").appendTo($tdNode3);
			//嘉丽价
			if(goodsList[i].youHui){ //是否有优惠
				$("<td/>").html("¥"+(goodsList[i].price-10).toFixed(2)).addClass("td2").addClass("cart_price").appendTo($trNode);
			}else{
				$("<td/>").html("¥"+goodsList[i].price).addClass("td2").addClass("cart_price").appendTo($trNode);
			}
			//加入收藏夹/删除
			var $tdNode4 = $("<td/>").addClass("td2").appendTo($trNode);
			$("<p><a href='#'>加入收藏夹</a></p>").appendTo($tdNode4);
			$("<p><a href='#' class='del'>删除</a></p>").appendTo($tdNode4);
		}
		//点击商品图片进入商品详情
		$table.find("img").click(function(){
			location.href = "detail.html?"+$(this).attr("id");
		});
		
		//选择商品
		$(".td1 .check").click(function(){
			if($(this).hasClass("noCheck")){
				$(this).removeClass("noCheck");
				money();
				Check();
			}else{
				$(this).addClass("noCheck");
				money();
				Check();
			}
		});
		//判断是否全选
		Check();
		function Check(){
			var $check = $(".td1 .check");
			var flag = true;
			for(var i=0 ; i<$check.length ; i++){
				if($check.eq(i).hasClass("noCheck")){
					flag = false;
				}
			}
			if(flag){
				$(".settlement_left input").prop("checked",true);
			}else{
				$(".settlement_left input").prop("checked",false);
			}
		}
		//全选
		$(".settlement_left input").click(function(){
			if($(this)[0].checked){
				$(".td1 .check").removeClass("noCheck");
			}else{
				$(".td1 .check").addClass("noCheck");
			}
			money();
		});
		//减少商品数量
		$(".cart_yes .num").find(".minus").click(function(){
			var count = parseInt($(this).parent().find("input").val());
			if(count > 1){
				var goodsList = JSON.parse($.cookie(cartName));
				goodsList[$(this).parents('tr').index()].num--;
				$.cookie(cartName, JSON.stringify(goodsList), {expires:7, path:"/"});
				$(this).parent().find("input").val(--count);
				money();
			}else{
				alert("数量不能小于1")
			}
		});
		//增加商品数量
		$(".cart_yes .num").find(".plus").click(function(){
			var count = parseInt($(this).parent().find("input").val());
			var goodsList = JSON.parse($.cookie(cartName));
			goodsList[$(this).parents('tr').index()].num++;
			$.cookie(cartName, JSON.stringify(goodsList), {expires:7, path:"/"});
			$(this).parent().find("input").val(++count);
			money();
		});
		//删除商品
		$(".del").click(function(){
			Del($(this).parents("tr"));
		});
		function Del(obj){
			var goodsList = JSON.parse($.cookie(cartName));
			goodsList.splice(obj.index(),1); //删除该行商品的cookie
			$.cookie(cartName, JSON.stringify(goodsList), {expires:7, path:"/"});
			obj.remove();
			money();
			if(goodsList.length == 0){
				$(".cart_no").show();
				$(".cart_yes").hide();
			}
		}
		//删除选中的商品
		$(".delGoods").click(function(){
			var $trNode = $(".cart_yes tbody tr");
			for(var i=0 ; i<$trNode.length ; i++){
				if(!$trNode.eq(i).find(".check").hasClass("noCheck")){
					Del($trNode.eq(i));
				}
			}
		});
		//清除购物车
		$(".delCart").click(function(){
			$.cookie(cartName, "", {expires:0, path:"/"});
			$(".cart_yes tbody tr").remove();
			$(".cart_no").show();
			$(".cart_yes").hide();
		});
		//商品金额、可返积分以及总金额运算
		money();
		function money(){
			var $cart_price = $(".cart_price");
			var jinE = 0;
			//商品金额
			for(var i=0 ; i<$cart_price.length ; i++){
				//商品金额等于嘉丽价乘上商品数量
				if(!$(".td1 .check").eq(i).hasClass("noCheck")){
					jinE += parseInt($cart_price.eq(i).html().replace("¥","")) * parseInt($cart_price.eq(i).parent().find(".num input").val());
				}	
			}
			$(".jinE").html(jinE.toFixed(2));
			//可返积分
			var goodsList = JSON.parse($.cookie(cartName));
			var jiFen = 0;
			$(".settlement_center .jiFen").html(0);//赋初始值为0
			for(var i=0 ; i<goodsList.length ; i++){
				if(!$(".cart_yes tbody tr").eq(i).find(".check").hasClass("noCheck")){//商品是否被选中
					var tmp = goodsList[i].jiFen.split("*");
					//jiFen等于积分乘数量
					jiFen += parseInt(tmp[0])*parseInt(tmp[1])*parseInt($(".cart_yes .num input").eq(i).val());
					$(".settlement_center .jiFen").html((jiFen/2)+"*2="+jiFen);
				}
			}
			
			//总金额
			$(".zje").html(jinE.toFixed(2));
			//如果金额为0的话（即没有选择商品）则不能结算
			if(jinE == 0){
				$(".settlement_right input").addClass("noJieSuan");
			}else{
				$(".settlement_right input").removeClass("noJieSuan");
			}
		}
		//去结算
		$(".settlement_right input").click(function(){
			if(!$(this).hasClass("noJieSuan")){
				alert("应付金额："+$(".zje").html()+"元");
			}
		});
	}else{ //没有商品，商品列表隐藏
		$(".cart_no").show();
		$(".cart_yes").hide();
	}
	
	//点击猜你喜欢商品进入商品详情
	$GYLike_all.find("img").click(function(){
		if($(this).attr("id")){
			location.href = "detail.html?"+$(this).attr("id");
		}
	});
});