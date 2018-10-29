from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request,'index.html')


def cart(request):
    return render(request,'cart.html')


def entry(request):
    return render(request,'entry.html')


def detail(request):
    return render(request,'detail.html')


def register(request):
    return render(request,'register.html')