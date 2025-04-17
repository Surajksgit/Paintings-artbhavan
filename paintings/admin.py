from django.contrib import admin

# Register your models here.

from .models import UserSignup,UserProfile,Artwork


admin.site.register(UserSignup)
admin.site.register(UserProfile)
admin.site.register(Artwork)