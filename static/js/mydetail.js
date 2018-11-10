$(function () {
    // 加操作
    $('.plus').click(function () {
        var value = parseInt($('.goodnum').attr('value'))
        $('.goodnum').attr('value',value+1)
    })
    // 减操作
    $('.minus').click(function () {
        var value = parseInt($('.goodnum').attr('value'))
        if (value>1) {
            $('.goodnum').attr('value',value-1)
        } else {
            $('.goodnum').attr('value',1)
        }

    })



    $('.btn2').click(function () {
        var goodsid = $(this).attr('goodsid')
        var id = $(this).attr('number')
        var value = $('.goodnum').attr('value')
        var $that = $(this)
        $.get('/addcart/',{'goodsid':goodsid,'value':value},function (response) {
            if (response.status == -1) {
                alert('请登陆')
                window.open('/entry/', target='_self')
            } else if (response.status == 1) {
                $('.goodnum').attr('value',value)
                window.open('/detail.html/'+id, target='_self')
            }
        })
    })

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