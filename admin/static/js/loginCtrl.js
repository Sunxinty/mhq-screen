$(function () {
	
	window.localStorage.setItem("username","");
	
    getValiCode();
    
    $('#username').focus();
    
    /* 登陆 */
	$("#loginBtn").click(function(){
		login();
	});
}());

// 获取验证码图片
function getValiCode(){
    $.ajax({
		type:'get',
		url: HTTP.url+'rest/mhq/login/ValidateCode',
		contentType:'application/json',
		dataType:'json',
		success: function (res) {
			var url = res.data.codeUrl;
			$("#ValidateCode").attr("src",url)
		},
		error: function (res) {
			$.Huimodalalert(res.data.msg,1000)
		}
	})
}

// 登陆
function login(){
	if($('#username').val()==""){
		$.Huimodalalert('请输入账号！',1000)
		$('#username').focus();
	}
	else if($('#password').val()==""){
		$.Huimodalalert('请输入密码！',1000)
		$('#password').focus();
	}
	else if($("input[name=userCode]:eq(0)").val()==""){
		$.Huimodalalert('请输入验证码！',1000)
		$("input[name=userCode]:eq(0)").focus();
	}
	else{
		var userData = {
			username: $('#username').val(),
			password: $('#password').val(),
			code: $("input[name=userCode]:eq(0)").val()
		}
		userData = JSON.stringify(userData);
		$.ajax({
			type:'post',
			url: HTTP.url+'allocation/login',
			contentType:'application/json',
			dataType:'json',
			data:userData,
			success: function (res) {
				if(res.code=="00"){
					window.localStorage.setItem("username",userData.username);
					$.Huimodalalert("登陆成功！",1000)
					setTimeout(function(){
						window.location.href = "index.html";
					},1000)
				}
				else{
					$.Huimodalalert(res.msg,1000)
				}
			},
			error: function (res) {
				console.error(res.statusText)
				$.Huimodalalert(res.statusText,1000)
			}
		})
	}
}