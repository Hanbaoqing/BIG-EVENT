$(function () {
    // 注册登录按需切换
    $('#toReg').on('click', function () {
        $('#reg').show().siblings('#logoin').hide()
    })

    $('#toLogoin').on('click', function () {
        $('#logoin').show().siblings('#reg').hide()
    })

    // 表单自定义验证格式
    // 1.从 layui 中提取form元素
    var form = layui.form
    var layer = layui.layer

    form.verify({
        // 自定义了一个验证规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            if (value !== $('#pwd').val()) {
                return '两次密码不一致'
            }
        }

    });


    // 注册功能  需调用注册接口http://ajax.frontend.itheima.net/api/reguser  POST
    //(1) 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.post("/api/reguser", {
            username: $('#ipt_reg_uname').val(),
            password: $('#pwd').val()
        },
            function (res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('注册成功')
                // 注册成功后自动跳转到登录
                $('.to-logoin').click()
            },
        );
    })


    // 登录功能   http://ajax.frontend.itheima.net/api/login POST
    $('#login_form').on('submit', function (e) {
        e.preventDefault()
        $.post("/api/login", $(this).serialize(), function (res) {
            if (res.status !== 0) return layer.msg(res.message)
            layer.msg('登录成功')

            // 将登录成功后得到的 token 字符串保存在localStrage中
            localStorage.setItem('token', res.token)

            console.log(res)
            // 跳转到后台主页
            location.href ='index.html'
        })



    })
})


