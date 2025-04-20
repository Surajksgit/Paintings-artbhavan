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
    path('cart/', views.cart_view, name='cart'),
    path('add-to-cart/<int:artwork_id>/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('wishlist/', views.wishlist_view, name='wishlist'),
    path('add_to_wishlist/<int:artwork_id>/', views.add_to_wishlist, name='add_to_wishlist'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),




    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)