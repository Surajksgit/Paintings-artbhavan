from django.urls import path
from . import views  # Ensure views are correctly imported
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name='arthome'),  # Example path
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('userdashboard/', views.user_dashboard, name='userdashboard'),
    path('userdashboard/myprofile/', views.myprofile, name='myprofile'),
    path('logout/', views.user_logout, name='logout'),
    path('forgot_password/', views.forgot_password, name='forgot_password'),
    path('reset_password/<str:uidb64>/<str:token>/', views.reset_password, name='reset_password'),
    path('collection/', views.collection_view, name='collection'),
    path('artwork/<int:artwork_id>/', views.artwork_detail, name='artwork_detail'),



    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)