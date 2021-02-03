$(function() {
	var layer = layui.layer


	// 获取文章分类
	function initArtCateList() {
		$.ajax({
			type: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				// 使用模板引擎渲染页面
				var htmlStr = template('tpl-table', res)
				$('tbody').html(htmlStr)
			}
		})
	}

	initArtCateList()
	var index = null;
	// 点击添加按钮弹出 弹出层
	$('#btnAdd').on('click', function() {
		// 调用layui提供的 layer.open方法 有返回值 返回值为该弹出层索引
		index = layer.open({
			type: 1,
			area: ['500px', '250px'],
			title: '添加文章分类',

			// 在弹出层中渲染  可以通过类似模板引擎的方式在html中定义书写结构 在获取内容
			content: $('#dialog-add').html(),
		})
	})

	// 添加类别
	// 该form表单是通过js的方式动态渲染的 需要使用 委托的方式绑定事件
	$('body').on('submit', '#form-add', function(e) {
		e.preventDefault()
		$.ajax({
			type: 'POST',
			url: '/my/article/addcates',
			data: $(this).serialize(),
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				layer.msg('添加成功')
				// 添加成功后渲染到页面 清空表单 并自动关闭弹出层
				initArtCateList()
				$('#form-add')[0].reset()
				// layui提供关闭弹出层方法  index为要关闭的弹出层的索引
				layer.close(index)
			}
		})
	})

})
