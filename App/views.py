from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from App.models import User


def index(request):
    user = request.COOKIES.get('username')
    return render(request,'index.html',context={'username':user})


def cart(request):
    return render(request,'cart.html')


def detail(request):
    return render(request,'detail.html')


def entry(request):
    if request.method == 'GET':
        return render(request,'entry.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        users = User.objects.filter(username=username).filter(password=password)
        if users.count():
            user = users.first()
            response = redirect('App:index')
            response.set_cookie('username', user.username)
            return response
        else:
            return HttpResponse('用户名或密码错误!')


def logout(request):
    response = redirect('App:index')
    response.delete_cookie('username')
    return response


def register(request):
    if request.method == 'GET':
        return render(request,'register.html')
    elif request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User()
        user.username = username
        user.password = password
        user.save()
        response = redirect('App:entry')
        response.set_cookie('username',username)
        return response

