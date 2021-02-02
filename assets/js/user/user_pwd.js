$(function(){
	// 定义校验规则
	// 1.从 layui 中提取form元素
	var form = layui.form
	var layer = layui.layer
	
	form.verify({
	    // 自定义了一个验证规则
	    pwd: [
	        /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
	    ],
		// 新密码不能和旧密码相同
		samepwd:function(value){
			if(value === $('#oldpwd').val()){
				return '新密码不能与旧密码相同'
			}
		},
	    repwd: function (value) {
	        if (value !== $('#newpwd').val()) {
	            return '两次密码不一致'
	        }
	    }
	})
	
	// 修改密码功能
	$('.layui-form').on('submit',function(e){
		e.preventDefault()
		$.ajax({
			type:'POST',
			url:'/my/updatepwd',
			data:$(this).serialize(),
			success:function(res){
				if(res.status !== 0){
					return layer.msg(res.message)
				}
				layer.msg('修改成功，请重新登录')
				
				// 重置表单
				$('.layui-form')[0].reset()
				// reset原生js的方法 可以清空指定form表单的内容
				
				
				// 实现修改密码后重新登录
				// window.parent.location.href = '../index.html'
				// localStorage.removeItem('token')
			}
		})
	})
})