// 每次调用$.post $.get $.ajax的时候  
// 都会先调用  ajaxPrefilter 这个函数
// 在这个函数中我们可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求前完成拼接字符串的操作
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})