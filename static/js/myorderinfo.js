$(function () {

    function total() {
        var sum = 0
        $('.goods').each(function () {
            var price = $(this).find('#price').attr('price')
            var number = $(this).find('#number').attr('number')
            sum += price * number
        })
        $('.settlement_right .zje').html(parseInt(sum))
    }

    total()

    $('.settlement_right input').click(function () {
        alert('付款成功')
    })
})