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
