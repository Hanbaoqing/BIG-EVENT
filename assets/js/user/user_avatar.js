$(function() {
	var layer = layui.layer
	//1 实现基本裁剪效果
	// 1.1 获取裁剪区域的 DOM 元素
	var $image = $('#image')
	// 1.2 配置选项
	const options = {
		// 纵横比
		aspectRatio: 1,
		// 指定预览区域
		preview: '.img-preview'
	}

	// 1.3 创建裁剪区域
	$image.cropper(options)

	// 2.实现图片文件的选择
	$('#btnChooseImg').on('click', function() {
		$('#file').click()
	})

	// 3.实现裁剪区域图片的更换
	// 3.1为文件选择框绑定change事件 只要选择文件发生了变化就会触发change事件
	$('#file').on('change', function(e) {
		// 通过时间对象e 可以拿到用户选择的文件
		console.log(e)
		// e.target.files  得到一个为数组 第一个元素就是选择的文件
		var filelist = e.target.files
		if (filelist.length === 0) {
			console.log(1)
			return layer.msg('请选择文件')
		}

		// 拿到选取的文件
		var file = e.target.files[0]

		// 根据文件创建一个对应的URL地址   利用URL的createObjectURL()方法
		var imgURL = URL.createObjectURL(file)

		// 销毁旧的裁剪区，设置新的图片路径，创建新的裁剪区
		$image.cropper('destroy').attr('src', imgURL).cropper(options)
	})




	//实现头像上传的功能 
	$('#isSure').on('click', function() {
		// 将裁剪后的图片输出为base64格式的字符串
		var dataURL = $image.cropper('getCroppedCanvas', { //创建一个canvas画布
			width: 100,
			height: 100
		}).toDataURL('image/png') //将canvas画布上的内容转化为 base64格式的字符串
		
		$.ajax({
			type: 'POST',
			url: '/my/update/avatar',
			data: {
				avatar: dataURL //base64格式字符串
			},
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				layer.msg('更换成功')

				// 调用父页面的方法获取用户信息 渲染头像
				window.parent.getUserInfo()
			}

		})
	})


})
