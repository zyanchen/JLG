$(function () {
    $('#account .form-control').blur(function () {
        if ($(this).val() == '') return
        var tel = /^1[3,4,5,7,8]\d{9}$/
        if (tel.test($(this).val())) {
            $('#account b').html('')
        } else {
            $('#account b').html('账号不符合')
        }
    })

    $('#passwd .form-control').blur(function () {
        if ($(this).val() == '') return
        var pas = /^[A-Za-z0-9]{6,12}$/
        if (pas.test($(this).val())) {
            $('#passwd b').html('')
        } else {
            $('#passwd b').html('长度为6~12个字符')
        }
    })

    $('#ispasswd .form-control').blur(function () {
        if ($(this).val() == '') return
        if ($(this).val() == $('#passwd .form-control').val()) {
            $('#ispasswd b').html('')
        } else {
            $('#ispasswd b').html('两次输入的密码一致')
        }
    })
})