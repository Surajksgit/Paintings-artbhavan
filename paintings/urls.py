from django.urls import path
from . import views  # Ensure views are correctly imported

urlpatterns = [
    path('', views.home, name='arthome'),  # Example path
    path('signup/', views.signup, name='signup'),
    path('login/', views.user_login, name='login'),
    path('userdashboard/', views.user_dashboard, name='userdashboard'),
    path('myprofile/', views.myprofile, name='myprofile'),
    path('logout/', views.user_logout, name='logout'),



    
]
