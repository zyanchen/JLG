$(function () {


    $('.goods').each(function () {
        var $that = $(this).find('.td2.cart_price')
        var jl_price = $that.attr('jl_price')
        jl_price = jl_price - 10
        $that.html('¥' + jl_price)
    })

    total()

    $('.plus').click(function () {
        var goodsid = $(this).attr('goodsid')
        var $that = $(this)
        $.get('/cartadd/', {'goodsid': goodsid}, function (response) {
            $that.prev().val(response.number)
            window.open('/cart/',target='_self')
        })

    })


    $('.minus').click(function () {
        var goodsid = $(this).attr('goodsid')
        var $that = $(this)
        $.get('/cartsub/', {'goodsid': goodsid}, function (response) {
            if (response.number > 1) {
                $that.next().val(response.number)
                window.open('/cart/',target='_self')
            } else {
                $that.next().val(1)
                window.open('/cart/',target='_self')
            }
        })
    })


    $('.ok').click(function () {
        var cartid = $(this).attr('cartid')
        var $that = $(this)
        $.get('/changecartstatus/', {'cartid': cartid}, function (response) {
            if (response.status == 1) {
                var isselect = response.isselect
                $that.attr('isselect', isselect)
                if (isselect) {
                    $that.removeClass("noCheck").addClass("check");
                } else {
                    $that.removeClass("check").addClass("noCheck");
                }
                total()
            }
        })

    })



    $('#checked').click(function () {
        var isselect = $(this).attr('isselect')
        isselect = (isselect == 'false') ? true : false
        $(this).attr('isselect', isselect)
        $that = $(this)
        $.get('/changecartselect/', {'isselect': isselect}, function (response) {
            if (response.status == 1) {
                $('.td1').each(function () {
                    isselect = response.isselect
                    if (isselect) {
                        $('.td1 .ok').removeClass("noCheck").addClass("check");
                    } else {
                        $('.td1 .ok').removeClass("check").addClass("noCheck");
                    }
                })
                total()
            }
        })
    })


    $('.del').click(function () {
        var goodsid = $(this).attr('goodsid')
        var $that = $(this)
        $.get('/delgoods/', {'goodsid': goodsid}, function (response) {
            if (response.status == 1) {
                alert('删除成功')
                total()
                window.open('/cart/', target = '_self')
            }
        })
    })


    function total() {
        var sum = 0
        $('.goods').each(function () {
            var $td1 = $(this).find('.td1')
            var $td2 = $(this).find('.td2')
            var $td3 = $(this).find('.td2.num .goodnum')
            if ($td1.find('.check').length) {
                var price = $td2.attr('price')
                var num = $td3.attr('value')
                sum += price * num
            }
        })
        $('.settlement_center .jinE').html(parseInt(sum))
        $('.settlement_center .zje').html(parseInt(sum))
    }


    $('.settlement_right').click(function () {
        $.get('/generateorder/', function (response) {
            console.log(response)
            if (response.status == 1){
                window.open('/orderinfo/'+response.identifier +
                '/', target='_self')
                console.log('/orderinfo/'+response.identifier +
                '/')
            }
        })
    })


})