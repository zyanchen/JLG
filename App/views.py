import hashlib
import json
import random
import time
import uuid

from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from App.models import User, Index_Img


def index(request):
    token = request.COOKIES.get('token')
    users = User.objects.filter(token=token)
    if users.exists():
        user = users.first()
        return render(request,'index.html',context={'username':user.username})
    else:
        return render(request,'index.html')


def cart(request):
    return render(request,'cart.html')


def detail(request):
    return render(request,'detail.html')


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
            return HttpResponse('用户名或密码错误!')


def generate_token():
    token = str(time.time()) + str(random.random())
    md5 = hashlib.md5()
    md5.update(token.encode('utf-8'))
    return md5.hexdigest()


def generate_password(password):
    sha = hashlib.sha512()
    sha.update(password.encode('utf-8'))
    return sha.hexdigest()


def logout(request):
    response = redirect('App:index')
    response.delete_cookie('token')
    return response


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
            response = redirect('App:entry')
            response.set_cookie('token',user.token)
            return response
        except Exception as e:
            return HttpResponse('注册失败')


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




