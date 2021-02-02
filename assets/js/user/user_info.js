$(function() {
	// 创建用户昵称的修改规则
	var form = layui.form
	var layer = layui.layer
	form.verify({
		nickname: function(value) {
			if (value.length > 6) {
				return '昵称必须在1-6个字符之间'
			}
		}
	})

	initUserInfo()

	// 初始化用户的基本信息
	function initUserInfo() {
		$.get('/my/userinfo', function(res) {
			if (res.status !== 0) {
				return layer.msg(res.message)
			}
			// $('#username').val(res.data.username)
			// $('#email').val(res.data.email)
			// $('#nickname').val(res.data.nickname)

			// 快速为表单元素赋值 可以使用layui 提供的 form.val()方法
			form.val('userInfo', res.data)
		})
	}

	// 重置功能
	$('#btnReset').on('click', function(e) {
		// 阻止重置按钮默认重置行为
		e.preventDefault()
		initUserInfo()
	})

	// 提交修改
	$('.layui-form').on('submit',function(e){
		// 阻止表单默认提交行为
		e.preventDefault()
		// layui提供的快速获取表单数据
		var data = form.val('userInfo')
		$.ajax({
			type:'POST',
			url:'/my/userinfo',
			// data:data,
			data:$(this).serialize(), //jquey提供的快速获取表单数据的方法
			success:function(res){
				if(res.status !== 0){
					return layer.msg(res.message)
				}
				initUserInfo()
				layer.msg('修改成功')
				
				// 调用父页面的方法 重新渲染用户的头像和用户信息
				// useruser_info是写在index页面的 iframe标签中的相当于index的子页面
				window.parent.getUserInfo()
				// window 相当于 iframe这个窗口
			}
		})
	})


})
