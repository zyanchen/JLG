from django.conf.urls import url

from App import views

urlpatterns = [
    url(r'^$', views.index,name='index'),
    url(r'^cart/$', views.cart,name='cart'),
    url(r'^entry/$', views.entry,name='entry'),
    url(r'^logout/$', views.logout,name='logout'),
    url(r'^detail.html/$', views.detail,name='detail'),
    url(r'^register/$', views.register,name='register'),

]
