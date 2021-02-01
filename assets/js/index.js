$(function() {
	// 登陆成功或者通过URL地址跳转到首页后 会先获取用户信息
	getUserInfo()



	var layer = layui.layer
	// 实现退出功能
	$('#btnLogout').on('click', function() {
		layer.confirm('确定退出登录吗?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			// 用户点击确定后行为
			// 1.清除本地存储中的token
			localStorage.removeItem('token')
			// 2.跳转页面
			location.href = 'login.html'

			// 关闭询问框
			layer.close(index);
		});
	})
})

// 获取用户的基本信息
function getUserInfo() {
	$.ajax({
		type: "GET",
		url: "/my/userinfo",

		success: function(res) {
			// 通过返回内容的状态属性 可以判断用户是否登录
			if (res.status !== 0) return console.log(res.message)
			console.log(res)

			// 调用方法渲染用户信息
			renderAvatar(res.data)
		},
	});
}

// 渲染用户信息
function renderAvatar(user) {
	// 用户信息中有两个昵称nickname 和 username nickname渲染优先级较高
	// 采用或逻辑中断
	var name = user.nickname || user.username
	console.log(name)
	$('#welcome').html('欢迎&nbsp;&nbsp;' + name + '')

	// 按需渲染用户头像 
	if (user.user_pic !== null) {
		// 渲染图片头像
		$('.layui-nav-img').attr('src', user.user_pic).show()
		$('.text-avatar').hide()
	} else {
		// 渲染文本头像
		$('.layui-nav-img').hide()
		var firstWord = name[0].toUpperCase()
		$('.text-avatar').html(firstWord).show()

	}
}

// 有权限的接口非常多 可以统一设置 headers 请求头
