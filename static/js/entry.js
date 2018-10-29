$(function(){
	//获取验证码
	var str;
	verCode();
	function verCode(){
		str = "";
		var arr = ['a','b','c','d','e','f','g','h','i','g','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
				   'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
				   '0','1','2','3','4','5','6','7','8','9'];
		var i = 0;
		while(i != 4){
			i++;
			str += arr[parseInt(Math.random()*61)];
		}
		$(".verCode").html(str);
	}
	//获取用户名和密码（勾选了自动登录的用户名和密码）
	var $entry = $.cookie("entry") ? JSON.parse($.cookie("entry")) : [];
	if($entry.length != 0){
		$(".input1").first().val($entry.name);
		$(".input1").last().val($entry.password);
		$("form input[type='checkbox']").prop("checked",true);
	}
	//点击验证码快更换验证码
	$(".verCode").click(function(){
		verCode();
	});
	//点击登录验证信息
	var $msgList = $.cookie("msg") ? JSON.parse($.cookie("msg")) : []; //获取可登录的信息
	$("form input[type='submit']").click(function(e){
		//阻止默认事件
		e.preventDefault();
		var pattern = new RegExp($(".input2").val(),"gi");
		if( !pattern.test(str) ){
			alert("验证码错误");
			verCode();
			$(".input2").val(null);
		}else{
			var flag = false;//登录信息是否正确
			for(var i=0 ; i<$msgList.length ; i++){
				if($(".input1").first().val() == $msgList[i].name && $(".input1").last().val() == $msgList[i].password){
					flag = true;
					break;
				}
			}
			if(flag){
				var msg = {
					"name": $(".input1").first().val()
				};
				//自动登录(记住用户名和密码)
				if($("form input[type='checkbox']").prop("checked")){
					$.cookie("entry",JSON.stringify(msg),{expires:10, path:"/"});
				}else{//不记住用户名和密码
					$.cookie("entry","",{expires:0, path:"/"});
					//存储当前登录的用户名密码，但关闭浏览器后该条cookie会被删除
					$.cookie("entry2",JSON.stringify(msg),{expires:null, path:"/"});
				}
				var Return = window.location.search.replace("?",""); //需要跳转到哪个页面
				if(Return == "detail"){
					history.back();  //后退 
				}else{
					location.href = Return+".html";
				}
			}else{
				alert("用户名或密码错误!");
				verCode();
				$(".input2").val(null);
			}
		}
	});
});