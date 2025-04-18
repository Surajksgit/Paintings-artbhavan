


# Create your models here.
from django.db import models
from django_countries.fields import CountryField
from django.contrib.auth.models import User


# User signup------------------------------------>
class UserSignup(models.Model):
  
    phoneorusername = models.CharField(max_length=15)
    email = models.EmailField(max_length=254, blank=True, null=True)
    password = models.CharField(max_length=15)
    
    
    
    
    def __str__(self):
        return self.phoneorusername


# My profile------------------------------------>

class UserProfile(models.Model):
    user = models.OneToOneField(UserSignup, on_delete=models.CASCADE)
    email = models.EmailField( max_length=254, blank=True, null=True)
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

# Artworks------------------------------------>
class Artwork(models.Model):
    CATEGORY_CHOICES = [
        ('Sketches', 'Sketches'),
        ('Portraits', 'Portraits'),
        ('Oil Paintings', 'Oil Paintings'),
        ('Digital Art', 'Digital Art'),
    ]

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='artworks/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    height = models.PositiveIntegerField(help_text="Height in cm")
    width = models.PositiveIntegerField(help_text="Width in cm")
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title