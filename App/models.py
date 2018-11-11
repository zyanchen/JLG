from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=80)
    password = models.CharField(max_length=256)
    token = models.CharField(max_length=256,default='')

class Index_Img(models.Model):
    use = models.CharField(max_length=100)
    num = models.CharField(max_length=20,default='')
    src = models.CharField(max_length=256,default='')
    time = models.CharField(max_length=40,default='')
    describe = models.CharField(max_length=256,default='')
    price = models.CharField(max_length=40,default='')
    salesVolume = models.CharField(max_length=100,default='')


class detail_json(models.Model):
    num = models.CharField(max_length=8,default='')
    path = models.CharField(max_length=100,default='')
    TV = models.CharField(max_length=20,default='')
    number = models.CharField(max_length=50,default='')
    youHui = models.CharField(max_length=100,default='')
    jiFen = models.CharField(max_length=50,default='')
    smallimg = models.CharField(max_length=256,default='')
    img = models.CharField(max_length=100,default='')
    descibe = models.CharField(max_length=256,default='')
    price = models.DecimalField(max_digits=7,decimal_places=2,default='')
    introduce = models.TextField(default='')
    collocation = models.TextField(default='')


class Cart(models.Model):
    user = models.ForeignKey(User)
    goods = models.ForeignKey(detail_json)
    number = models.IntegerField()
    isselect = models.BooleanField(default=True)


class Order(models.Model):
    user = models.ForeignKey(User)
    createtime = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=1)
    identifier = models.CharField(max_length=256)


class OrderGoods(models.Model):
    order = models.ForeignKey(Order)
    goods = models.ForeignKey(detail_json)
    number = models.IntegerField(default=1)