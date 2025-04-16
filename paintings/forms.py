from django import forms
from .models import UserProfile
from django_countries.widgets import CountrySelectWidget




class UserProfileForm(forms.ModelForm):
    
    class Meta:
        model = UserProfile
        fields = [ 'profile_picture','email','phone', 'country', 'address', 'city', 'state', 'pincode']
        
        widgets = {
            
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'country': CountrySelectWidget(attrs={'class': 'form-select'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'city': forms.TextInput(attrs={'class': 'form-control'}),
            'state': forms.TextInput(attrs={'class': 'form-control'}),
            'pincode': forms.TextInput(attrs={'class': 'form-control'}),
                                      
        }

