from django.conf.urls import url

from App import views

urlpatterns = [
    url(r'^$', views.index,name='index'),
    url(r'^cart/$', views.cart,name='cart'),
    url(r'^entry/$', views.entry,name='entry'),
    url(r'^logout/$', views.logout,name='logout'),
    url(r'^detail.html/(\d+)$', views.detail,name='detail'),
    url(r'^register/$', views.register,name='register'),
    url(r'^getjson/$', views.getjson),
    url(r'^addcart/$', views.addcart, name='addcart'),
    url(r'^islogin/$', views.islogin, name='islogin')

]
