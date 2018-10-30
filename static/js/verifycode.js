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
	//点击验证码快更换验证码
	$(".verCode").click(function(){
		verCode();
	});
		var pattern = new RegExp($(".input2").val(),"gi");
		if( !pattern.test(str) ){
			alert("验证码错误");
			verCode();
			$(".input2").val(null);
		}
});