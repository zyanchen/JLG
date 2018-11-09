$(function () {
    $('#logo_right').click(function () {
        $.get('/islogin/',function (response) {
            if (response.status == 1){
                window.open('/cart/', target='_self')
            } else if (response.status == -1) {
                alert('请登陆')
                window.open('/entry/', target='_self')
            }
        })
    })
})