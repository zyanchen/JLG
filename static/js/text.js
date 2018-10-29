$(function () {
    $('img').each(function () {
        var imgpath = $(this).attr('src')
        var img_path = imgpath.substring(2,imgpath.length)
        imgpath = "{% static '" + img_path +  "' %}"
        $(this).attr('src', imgpath)
    })

    console.log($('body').html())
})