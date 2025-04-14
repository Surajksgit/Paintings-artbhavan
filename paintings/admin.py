from django.contrib import admin

# Register your models here.

from .models import UserSignup,UserProfile


admin.site.register(UserSignup)
admin.site.register(UserProfile)