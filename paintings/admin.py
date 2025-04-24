from django.contrib import admin

# Register your models here.

from .models import UserSignup,UserProfile,Artwork,Order


admin.site.register(UserSignup)
admin.site.register(UserProfile)
admin.site.register(Artwork)
admin.site.register(Order)