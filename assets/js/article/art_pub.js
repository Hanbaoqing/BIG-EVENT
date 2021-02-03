$(function() {
	var layer = layui.layer


	// 调用加载文章分类
	initCate()

	// 初始化富文本编辑区
	initEditor()


	//  初始化图片裁剪器
	var $image = $('#image')

	// 裁剪选项
	var options = {
		aspectRatio: 400 / 280,
		preview: '.img-preview'
	}

	//  初始化裁剪区域
	$image.cropper(options)

	// 为选择封面按钮绑定点击事件
	$('#btnChoose').on('click', function() {
		$('#coverFile').click()
	})
	// 把选择的图片放到裁剪框
	$('#coverFile').on('change', function(e) {
		// e.target.files 返回一个数组 里面有我们选择的文件
		var fileList = e.target.files
		if (fileList.length === 0) {
			return layer.msg('请选择文件')
		}
		// 拿到选择的文件
		var file = fileList[0]

		// 根据选择的文件创建一个对应的URL地址
		var imgURL = URL.createObjectURL(file)

		// 摧毁旧的裁剪区  设置新的地址 创建新的裁剪区
		$image.cropper('destroy').attr('src', imgURL).cropper(options)
	})



	// 定义加载文章分类的方法
	function initCate() {
		$.ajax({
			type: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				console.log(res)
				var htmlStr = template('tpl-cate', res)
				$('#cates').html(htmlStr)

				// 调用layui提供的render方法 渲染分类列表渲染
				layui.form.render()
			}
		})
	}

	// 发布文章   数据格式要求 FormData格式
	// (1) 获取state  根据按了哪个按钮来判断
	var art_state = '已发布' //默认是已发布的状态

	// 为存为草稿绑定注册事件
	$('#btnSave2').on('click', function() {
		art_state = '草稿'
	})

	$image.cropper()


	// 为表单绑定submit事件
	$("#form-pub").on('submit', function(e) {
		e.preventDefault()
		// 基于form表单创建一个FormDate对象
		var fd = new FormData($(this)[0])
		fd.append('state', art_state)

		// 处理cove_img数据
		// (1) 将裁剪后的图片输出为文件
		$image.cropper('getCroppedCanvas', { //创建了一张画布
			width: 400,
			height: 280
		}).toBlob(function(blob) { // 将画布上的内容，转化为文件对象

			// 将文件对象追加到fd中
			fd.append('cover_img', blob)
			
			// 将处理好的FormData数据通过请求发送到服务器
			publishArticle(fd)
			
		})
	})
	
	// 定义一个发布文章的方法
	function publishArticle(formdata){
		$.ajax({
			type:'POST',
			url:'/my/article/add',
			data:formdata,
			// 如果向故武器提交的是FormData格式的数据需要添加如下两个属性
			contentType:false,
			processData:false,
			
			success:function(res){
				if(res.status !== 0){
					return layer.msg(res.message)
				}
				layer.msg('发布成功')
				
				// 发布成功后跳转到文章列表页面
				// location.href = 'art_list.html'
			window.parent.$('#art_list').click()
			}
			
		})
	}
})
