import hashlib
import json
import random
import time
import uuid

from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from App.models import User, Index_Img, detail_json


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
        return render(request,'index.html',context={'lunbo': lunbo,'lunbo_goods': lunbo_goods,'hit': hit,'hit_today': hit_today,'recommend': recommend,'recommend_goods': recommend_goods,'F1_left0': F1_left0,'F1_left1': F1_left1,'F1_right': F1_right,'F2_left0': F2_left0,'F2_left1': F2_left1,'F2_right': F2_right,'F3_left0': F3_left0,'F3_left1': F3_left1,'F3_right': F3_right,'F4_left0': F4_left0,'F4_left1': F4_left1,'F4_right': F4_right,'bannerAds': bannerAds,'username':user.username})
    else:
        return render(request,'index.html',context=data)

# 购物车
def cart(request):
    return render(request,'cart.html')

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
    print(in1)
    return render(request,'detail.html',context={'det':det,'path1':path1,'path2':path2,'path3':path3,'yh1':yh1,'yh2':yh2,'in1':in1,'in2':in2,'in3':in3,'in4':in4,'in5':in5})

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

