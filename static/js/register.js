$(function(){
	var $tishi = $(".tishi"); //提示
	var $tel = $(".tel");
	var $E_mail = $(".E_mail");
	var flag1 = flag2 = flag3 = false;
	//获取已经注册过的信息
	var $msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : [];
	//可以注册的信息
	var msgName;
	var msgPassword;
	//手机号码验证
	$tel.find("input[type='text']").blur(function(){
		var pattern = /^\d{11}$/;
		if(!pattern.test($(this).val())){
			$(".tishi").html("手机号码不符合规范");
			flag1 = false;
		}else{
			var self = true;//是否没有被注册
			for(var i=0 ; i<$msgList.length ; i++){
				if($(this).val() == $msgList[i].name){
					self = false;
					break;
				}
			}
			if(self){
				$(".tishi").html("");
				msgName = $(this).val();
				flag1 = true;
			}else{
				$(".tishi").html("该用户名已被注册");
				flag1 = false;
			}
		}
	});
	//邮箱地址验证
	$E_mail.find("input[type='text']").blur(function(){
		var pattern = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!pattern.test($(this).val())){
			$(".tishi").html("邮箱地址不符合规范");
			flag1 = false;
		}else{
			var self = true;//是否没有被注册
			for(var i=0 ; i<$msgList.length ; i++){
				if($(this).val() == $msgList[i].name){
					self = false;
					break;
				}
			}
			if(self){
				$(".tishi").html("");
				msgName = $(this).val();
				flag1 = true;
			}else{
				$(".tishi").html("该用户名已被注册");
				flag1 = false;
			}
		}
	});
	//密码验证
	$tel.find("input[type='password']").first().blur(function(){
		password($(this).val());
	});
	$E_mail.find("input[type='password']").first().blur(function(){
		password($(this).val());
	});
	function password(Text){
		var pattern = /\s/;
		if(pattern.test(Text)){
			$(".tishi").html("密码不能有空格");
			flag2 = false;
		}else if(Text.length < 8){
			$(".tishi").html("密码长度不能小于八位");
			flag2 = false;
		}else if(Text.length > 16){
			$(".tishi").html("密码长度不能大于十六位");
			flag2 = false;
		}else{
			$(".tishi").html("");
			msgPassword = Text;
			flag2 = true;
		}
	}
	//确认密码
	$tel.find("input[type='password']").last().blur(function(){
		confirmPassword($(this).val(),$tel);
	});
	$E_mail.find("input[type='password']").last().blur(function(){
		confirmPassword($(this).val(),$E_mail);
	});
	function confirmPassword(Text,obj){
		if(obj.find("input[type='password']").first().val() != Text){
			$(".tishi").html("输入密码不一致");
			flag3 = false;
		}else{
			$(".tishi").html("");
			flag3 = true;
		}
	}
	//服务条款
	$("input[type='checkbox']").click(function(){
		if($(this).prop("checked")){
			$(this).parent().next().attr("id",null);
		}else{
			$(this).parent().next().attr("id","noclick");
		}
	});
	//切换注册方式
	$tel.find(".change a").click(function(){
		$(".tishi").html("");
		$tel.hide();
		$E_mail.show();
	});
	$E_mail.find(".change a").click(function(){
		$(".tishi").html("");
		$tel.show();
		$E_mail.hide();
	});
	//注册
	$("form").find("input[type='submit']").click(function(e){
		//阻止默认事件
		e.preventDefault();
		if($(this).attr("id") != "noclick"){ //是否同意了服务条款
			if(flag1 && flag2 && flag3){
				var newMsg = {
					"name": msgName,
					"password": msgPassword
				};
				$msgList.push(newMsg);
				$.cookie("msg",JSON.stringify($msgList),{expires:10, path:"/"});
				//重新获取一下,更新用户名库
				$msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : [];
				//清空信息框
				$("form").find("input[type='text']").val(null);
				$("form").find("input[type='password']").val(null);
				console.log($.cookie("msg"));
				alert("注册成功!");
				location.href = "entry.html?index";
			}else{
				alert("有信息不符合规范请重新输入");
			}
		}
	});
});