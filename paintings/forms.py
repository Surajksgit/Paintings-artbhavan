from django import forms
from .models import UserProfile
from django_countries.widgets import CountrySelectWidget




class UserProfileForm(forms.ModelForm):
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        
        widgets = {
            'country': CountrySelectWidget(attrs={'class': 'form-select'}),
                                      
        }

