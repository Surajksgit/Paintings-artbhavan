


# Create your models here.
from django.db import models
from django_countries.fields import CountryField
from django.contrib.auth.models import User


# User signup------------------------------------>
class UserSignup(models.Model):
  
    phoneorusername = models.CharField(max_length=15)
    password = models.CharField(max_length=15)
    
    
    
    
    def __str__(self):
        return self.phoneorusername


# My profile------------------------------------>

class UserProfile(models.Model):
    user = models.OneToOneField(UserSignup, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True)
    phoneorusername = models.CharField(max_length=15)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    country = CountryField(blank_label='(Select country)', blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    
    def __str__(self):
        return f"{self.user.phoneorusername}'s Profile"
