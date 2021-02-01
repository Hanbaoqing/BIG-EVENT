// 每次调用$.post $.get $.ajax的时候  
// 都会先调用  ajaxPrefilter 这个函数
// 在这个函数中我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
	// 在发起真正的ajax请求前完成拼接字符串的操作
	options.url = 'http://ajax.frontend.itheima.net' + options.url

// 判断请求地址是否包含my 
	if (options.url.indexOf('/my/') !== -1) {
		// 统一为有权限的接口 设置请求头
		options.headers = {
			Authorization: localStorage.getItem('token')
		}
		
	}
	
	
	// 挂在complete 回调函数
	options.complete = function(res){
		if(res.responseJSON.status ===1 && res.responseJSON.message ==="身份认证失败！"){
			localStorage.removeItem('token')
			location.href = 'login.html'
		}
	}

})


