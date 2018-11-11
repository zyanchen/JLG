import hashlib
import json
import random
import time
import uuid

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

# Create your views here.
from App.models import User, Index_Img, detail_json, Cart, Order, OrderGoods


# 首页
def index(request):
    lunbo = Index_Img.objects.filter(use='lunbo')   # 轮播图
    lunbo_goods = Index_Img.objects.filter(use='lunbo_goods')   # 直播商品
    # 今日热销
    hit = Index_Img.objects.filter(use='hit')
    hit_today = Index_Img.objects.filter(use='hit_today')
    # 热销推荐
    recommend = Index_Img.objects.filter(use='recommend')
    recommend_goods = Index_Img.objects.filter(use='recommend_goods')
    # F1图片
    F1_left0 = Index_Img.objects.filter(use='F1_left')[0]
    F1_left1 = Index_Img.objects.filter(use='F1_left')[1]
    F1_right = Index_Img.objects.filter(use='F1_right')
    # F2图片
    F2_left0 = Index_Img.objects.filter(use='F2_left')[0]
    F2_left1 = Index_Img.objects.filter(use='F2_left')[1]
    F2_right = Index_Img.objects.filter(use='F2_right')
    # F3图片
    F3_left0 = Index_Img.objects.filter(use='F3_left')[0]
    F3_left1 = Index_Img.objects.filter(use='F3_left')[1]
    F3_right = Index_Img.objects.filter(use='F3_right')
    # F4图片
    F4_left0 = Index_Img.objects.filter(use='F4_left')[0]
    F4_left1 = Index_Img.objects.filter(use='F4_left')[1]
    F4_right = Index_Img.objects.filter(use='F4_right')
    bannerAds = Index_Img.objects.filter(use='bannerAds')[0]
    data = {
        'lunbo': lunbo,
        'lunbo_goods': lunbo_goods,
        'hit': hit,
        'hit_today': hit_today,
        'recommend': recommend,
        'recommend_goods': recommend_goods,
        'F1_left0': F1_left0,
        'F1_left1': F1_left1,
        'F1_right': F1_right,
        'F2_left0': F2_left0,
        'F2_left1': F2_left1,
        'F2_right': F2_right,
        'F3_left0': F3_left0,
        'F3_left1': F3_left1,
        'F3_right': F3_right,
        'F4_left0': F4_left0,
        'F4_left1': F4_left1,
        'F4_right': F4_right,
        'bannerAds': bannerAds,
    }
    token = request.COOKIES.get('token')
    users = User.objects.filter(token=token)
    if users.exists():
        user = users.first()
        all_carts = Cart.objects.filter(user=user)
        all_cart = 0
        for i in all_carts:
            all_cart += i.number
        return render(request,'index.html',context={'lunbo': lunbo,'lunbo_goods': lunbo_goods,'hit': hit,'hit_today': hit_today,'recommend': recommend,'recommend_goods': recommend_goods,'F1_left0': F1_left0,'F1_left1': F1_left1,'F1_right': F1_right,'F2_left0': F2_left0,'F2_left1': F2_left1,'F2_right': F2_right,'F3_left0': F3_left0,'F3_left1': F3_left1,'F3_right': F3_right,'F4_left0': F4_left0,'F4_left1': F4_left1,'F4_right': F4_right,'bannerAds': bannerAds,'username':user.username,'token':token,'all_cart':all_cart})
    else:
        return render(request,'index.html',context=data)

# 购物车
def cart(request):
    ind1 = Index_Img.objects.filter(salesVolume=1).first()
    ind2 = Index_Img.objects.filter(salesVolume=2).first()
    ind3 = Index_Img.objects.filter(salesVolume=3).first()
    ind4 = Index_Img.objects.filter(salesVolume=4).first()
    ind5 = Index_Img.objects.filter(salesVolume=5).first()
    token = request.COOKIES.get('token')
    if token:
        user = User.objects.get(token=token)
        carts = Cart.objects.filter(user=user).exclude(number=0)
        return render(request,'cart.html',context={'ind1':ind1,'ind2':ind2,'ind3':ind3,'ind4':ind4,'ind5':ind5,'username':user.username,'carts':carts})
    else:
        return render(request, 'cart.html',context={'ind1': ind1, 'ind2': ind2, 'ind3': ind3, 'ind4': ind4, 'ind5': ind5,})

# 物品详情页
def detail(request,num):
    det = detail_json.objects.filter(num=num).first()
    # 商品分类
    pathlist = det.path.split(',')
    path1 = pathlist[0]
    path2 = pathlist[1]
    path3 = pathlist[2]
    # 促销优惠
    yhlist = det.youHui.split(',')
    yh1 = yhlist[0]
    yh2 = yhlist[1]
    # 详情图片
    inlist = det.introduce.split(',')
    in1 = inlist[0]
    in2 = inlist[1]
    in3 = inlist[2]
    in4 = inlist[3]
    in5 = inlist[4]
    ind2 = Index_Img.objects.filter(salesVolume=2).first()
    ind3 = Index_Img.objects.filter(salesVolume=3).first()
    ind4 = Index_Img.objects.filter(salesVolume=4).first()
    ind5 = Index_Img.objects.filter(salesVolume=5).first()
    token = request.COOKIES.get('token')
    users = User.objects.filter(token=token)
    if users.exists():
        user = users.first()
        all_carts = Cart.objects.filter(user=user)
        all_cart = 0
        for i in all_carts:
            all_cart += i.number
        return render(request,'detail.html',context={'det':det,'path1':path1,'path2':path2,'path3':path3,'yh1':yh1,'yh2':yh2,'in1':in1,'in2':in2,'in3':in3,'in4':in4,'in5':in5,'ind2':ind2,'ind3':ind3,'ind4':ind4,'ind5':ind5,'username':user.username,'num':num,'all_cart':all_cart})
    else:
        return render(request, 'detail.html',context={'det': det, 'path1': path1, 'path2': path2, 'path3': path3, 'yh1': yh1, 'yh2': yh2,'in1': in1, 'in2': in2, 'in3': in3, 'in4': in4, 'in5': in5, 'ind2': ind2, 'ind3': ind3,'ind4': ind4, 'ind5': ind5})

# 登陆
def entry(request):
    if request.method == 'GET':
        return render(request,'entry.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        password = generate_password(request.POST.get('password'))
        users = User.objects.filter(username=username).filter(password=password)
        if users.exists():
            user = users.first()
            user.token = generate_token()
            user.save()
            response = redirect('App:index')
            response.set_cookie('token', user.token)
            return response
        else:
            error = '用户名或密码错误!'
            return render(request, 'entry.html',context={'error':error})

# 生成token
def generate_token():
    token = str(time.time()) + str(random.random())
    md5 = hashlib.md5()
    md5.update(token.encode('utf-8'))
    return md5.hexdigest()

# 生成加密密码
def generate_password(password):
    sha = hashlib.sha512()
    sha.update(password.encode('utf-8'))
    return sha.hexdigest()

# 退出
def logout(request):
    response = redirect('App:index')
    response.delete_cookie('token')
    return response

# 注册
def register(request):
    if request.method == 'GET':
        return render(request,'register.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User()
            user.username = username
            user.password = generate_password(password)
            user.token = uuid.uuid5(uuid.uuid4(),'register')
            user.save()
            response = redirect('App:index')
            response.set_cookie('token',user.token)
            return response
        except Exception as e:
            return HttpResponse('注册失败')

# 获取index_json数据
def getjson(request):
    file = '/home/zhuyu/Desktop/JLG/static/json/index.json'
    with open(file, 'r') as nb:
        fileContent = nb.read()
        res = json.loads(fileContent)
    key_list = []
    for key in res:
        key_list.append(key)
    for key,value in res.items():
        for content in value:
            if key == key_list[0]:
                img = Index_Img()
                img.use = key
                img.num = content['title']
                img.src = content['img']
                img.save()
            elif key == key_list[6]:
                img = Index_Img()
                img.use = key
                img.num = content['id']
                img.src = content['img']
                img.describe = content['describe']
                img.price = content['price']
                img.salesVolume = content['salesVolume']
                img.save()
            elif key == key_list[2] or key == key_list[5] or key == key_list[7] or key == key_list[9] or key == key_list[11] or key == key_list[13] or key == key_list[15]:
                img = Index_Img()
                img.use = key
                img.num = content['id']
                img.src = content['img']
                img.save()
            elif key == key_list[8] or key == key_list[10] or key == key_list[12] or key == key_list[14]:
                img = Index_Img()
                img.use = key
                img.num = content['id']
                img.src = content['img']
                img.describe = content['describe']
                img.price = content['price']
                img.save()
            else:
                img = Index_Img()
                img.use = key
                img.num = content['id']
                img.src = content['img']
                img.time = content['time']
                img.describe = content['describe']
                img.price = content['price']
                img.save()
    return HttpResponse('已获取数据')


def addcart(request):
    goodsid = request.GET.get('goodsid')
    token = request.COOKIES.get('token')
    value = request.GET.get('value')
    print(value)
    responseData = {
        'msg': '添加购物车成功',
        'status': 1,
    }
    if token:
        user = User.objects.get(token=token)
        goods = detail_json.objects.get(pk=goodsid)
        carts = Cart.objects.filter(user=user).filter(goods=goods)
        if carts.exists():
            cart = carts.first()
            cart.number = int(cart.number) + int(value)
            cart.save()
            responseData['number'] = cart.number
        else:
            cart = Cart()
            cart.user = user
            cart.goods = goods
            cart.number = int(value)
            cart.save()
            responseData['number'] = cart.number
        return JsonResponse(responseData)
    else:
        responseData['msg'] = '未登录，请登录后操作'
        responseData['status'] = -1
        return JsonResponse(responseData)


def islogin(request):
    token = request.COOKIES.get('token')
    responseData = {
        'msg': '登陆成功',
        'status': 1,
    }
    if token:
        return JsonResponse(responseData)
    else:
        responseData['msg'] = '请登陆'
        responseData['status'] = -1
        return JsonResponse(responseData)


def cartadd(request):
    goodsid = request.GET.get('goodsid')
    token = request.COOKIES.get('token')
    responseData = {
        'msg': '添加购物车成功',
        'status': 1,
    }
    if token:
        user = User.objects.get(token=token)
        goods = detail_json.objects.get(pk=goodsid)
        carts = Cart.objects.filter(user=user).filter(goods=goods)
        if carts.exists():
            cart = carts.first()
            cart.number = cart.number + 1
            cart.save()
            responseData['number'] = cart.number
        else:
            cart = Cart()
            cart.user = user
            cart.goods = goods
            cart.number = 1
            cart.save()
            responseData['number'] = cart.number
        return JsonResponse(responseData)


def cartsub(request):
    goodsid = request.GET.get('goodsid')
    token = request.COOKIES.get('token')
    responseData = {
        'msg': '删减购物车成功',
        'status': 1,
    }
    user = User.objects.get(token=token)
    goods = detail_json.objects.get(pk=goodsid)
    carts = Cart.objects.filter(user=user).filter(goods=goods)
    cart = carts.first()
    cart.number = cart.number - 1
    if cart.number < 1:
        cart.number = 1
    cart.save()
    responseData['number'] = cart.number

    return JsonResponse(responseData)


def delgoods(request):
    goodsid = request.GET.get('goodsid')
    token = request.COOKIES.get('token')
    user = User.objects.get(token=token)
    goods = detail_json.objects.get(pk=goodsid)
    cart = Cart.objects.filter(user=user).filter(goods=goods).first()
    cart.delete()
    responseData = {
        'msg': '删除成功',
        'status': 1,
    }
    return JsonResponse(responseData)


def changecartstatus(request):
    cartid = request.GET.get('cartid')
    cart = Cart.objects.get(pk=cartid)
    cart.isselect = not cart.isselect
    print(cart.isselect)
    cart.save()
    responseData = {
        'msg': '选中状态改变',
        'status': 1,
        'isselect': cart.isselect
    }
    return JsonResponse(responseData)


def changecartselect(request):
    isselect = request.GET.get('isselect')
    if isselect == 'true':
        isselect = True
    else:
        isselect = False
    token = request.COOKIES.get('token')
    user = User.objects.get(token=token)
    carts = Cart.objects.filter(user=user)
    for cart in carts:
        cart.isselect = isselect
        cart.save()
    return JsonResponse({'msg': '反选操作成功', 'status': 1, 'isselect':isselect})


def generateorder(request):
    token = request.COOKIES.get('token')
    user = User.objects.get(token=token)
    order = Order()
    order.user = user
    order.identifier = str(int(time.time())) + str(random.randrange(10000, 100000))
    order.save()
    carts = Cart.objects.filter(user=user).filter(isselect=True)
    for cart in carts:
        orderGoods = OrderGoods()
        orderGoods.order = order
        orderGoods.goods = cart.goods
        orderGoods.number = cart.number
        orderGoods.save()
        cart.delete()
    responseData = {
        'msg': '订单生成成功',
        'status': 1,
        'identifier': order.identifier
    }
    return JsonResponse(responseData)


def orderinfo(request, identifier):
    token = request.COOKIES.get('token')
    users = User.objects.filter(token=token)
    user = users.first()
    order = Order.objects.get(identifier=identifier)
    return render(request, 'orderinfo.html', context={'order':order,'username':user.username,'identifier':identifier})