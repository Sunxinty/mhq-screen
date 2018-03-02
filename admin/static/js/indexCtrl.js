/*个人信息*/
function myselfinfo(){
	var username = window.localStorage.getItem("username");
	layer.open({
		type: 1,
		area: ['600px','400px'],
		fix: false, //不固定
		maxmin: true,
		shade:0.4,
		title: '个人信息',
		content: '<div style="padding:20px;">当前管理员：'+username+'</div>'
	});
}

/* 退出用户 */
function outLogin(){
	layer.confirm('确认要退出当前账号吗？',function(){
		window.localStorage.setItem("username","");
		window.location.href = "login.html"
	})
}


// $(function(){
// 	var username = window.localStorage.getItem("username");
// 	if(username){
// 		$(".userName").text(username)
// 	}
// 	else{
// 		$.Huimodalalert('请登录！',1500)
// 		setTimeout(function(){
// 			window.location.href = "login.html"
// 		},1500)
// 	}
// }())
