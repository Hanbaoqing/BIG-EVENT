$(function() {
	var layer = layui.layer
	var form = layui.form
	var laypage = layui.laypage //分页
	//定义一个查询的参数对象 后面请求数据的时候 需要将请求参数对象提交到服务器
	var q = {
		pagenum: 1, //页码值  默认请求第一页的数据
		pagesize: 2, //每页显示几条数据 默认显示两条
		cate_id: '', //文章分类的id
		state: '' //文章发布的状态
	}

	// 定义美化时间的过滤器
	template.defaults.imports.dataFormat = function(value) {
		const dt = new Date(value)

		var y = dt.getFullYear()
		var m = padZero(dt.getMonth() + 1)
		var d = padZero(dt.getDate())

		var hh = padZero(dt.getHours())
		var mm = padZero(dt.getMinutes())
		var ss = padZero(dt.getSeconds())

		return y + '-' + m + '-' + d + ' ' + hh + '' + mm + '' + ss
	}

	// 补零函数
	function padZero(num) {
		return num < 10 ? '0' + num : num
	}


	initTable()
	// 获取文章列表数据的方法
	function initTable() {
		$.ajax({
			type: 'GET',
			url: '/my/article/list',
			data: q,
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				console.log(res)
				var htmlStr = template('tpl-table', res)
				$('#art_list').html(htmlStr)

				// 表格渲染完成以后 渲染底部页码值
				renderPage(res.total)
			}

		})
	}


	// 初始化文章分类
	function initCate() {
		$.ajax({
			type: 'GET',
			url: '/my/article/cates',
			success: function(res) {
				if (res.status !== 0) {
					return layer.msg(res.message)
				}
				console.log(1)
				console.log(res)
				var htmlStr = template('ipt-option', res)
				$('#cate').html(htmlStr)
				// 需要调用 layui提供的render方法 让layui重新渲染表单结构
				form.render()
			}

		})
	}

	initCate()


	// 提交筛选功能
	$('#select').on('submit', function(e) {
		e.preventDefault()
		// 向q中填充配置数据
		q.cate_id = $('[name=cate_id]').val()
		q.state = $('[name=state]').val()
		initTable()
	})


	// 定义渲染分页的方法
	function renderPage(total) {
		laypage.render({
			elem: 'page',
			count: total,
			limit: q.pagesize, //每页显示几条数据
			limits: [2, 3, 4, 5, 6], //每页显示的条数
			curr: q.pagenum, //设置默认被选中的分页
			layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
			// jump触发方式
			// 1.点击页码时会触发 jump回调
			// 2.只要调用了laypage方法就会触发jump
			jump: function(obj, first) {
				// obj包含了当前页所有参数
				// 通过laypage.render 触发jump first为true
				// 通过 点击页码 first 为false

				// 最新的页码值
				q.pagenum = obj.curr
				// 最新的每页显示条数
				q.pagesize = obj.limit
				// 不能直接调用initTable() 否则jump会死循环



				//判断是否通过点击触发 是就调用 initTable方法
				if (!first) {
					initTable()
				}
			}
		})
	}

	// 删除
	$('#art_list').on('click', '.btnDELETE', function() {
		// 获取该页删除按钮个数
		var num = $('.btnDELETE').length

		// 当前对应的ID
		var id = $(this).attr('data-id')
		// 询问用户是否删除
		layer.confirm('确认删除?', {
			icon: 3,
			title: '提示'
		}, function(index) {
			$.ajax({
				type: 'GET',
				url: '/my/article/delete/' + id,
				success: function(res) {
					if (res.status !== 0) {
						return layer.msg(res.message)
					}
					layer.msg('删除成功')
					// 删除成功后判断该页是否还有数据
					// 如果没有 页码值减一 再渲染数据
					if (num === 1) {
						// 如果num=1 证明删除之后就没有数据了

						// 页码值最小为1
						q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
					}
					initTable()
				}
			})
			layer.close(index)
		})
	})






})
