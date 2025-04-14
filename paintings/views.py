# views.py

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
from .models import UserSignup
from .models import UserProfile
from .forms import UserProfileForm
import re
import datetime
from django.contrib.auth import logout as auth_logout





# Home page------------------------------------>
def home(request):
    return render(request, 'arthome.html')


# Signup page------------------------------------>
def signup(request):
    if request.method == 'POST':
        identifier = request.POST.get('identifier')
        password = request.POST.get('password')
        confirm_password = request.POST.get('Confirm Password')

        # Basic validation
        if not identifier or not password or not confirm_password:
            messages.error(request, 'All fields are required')
            return redirect('signup')

        # Check if passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match')
            return redirect('signup')

        # Validate password strength
        if len(password) < 8:
            messages.error(request, 'Password must be at least 8 characters long')
            return redirect('signup')

        # Check if identifier is phone number or username
        is_phone = bool(re.match(r'^\d{10}$', identifier))  # Simple phone validation for 10 digits
        
        # Check if user already exists
        if UserSignup.objects.filter(phoneorusername=identifier).exists():
            messages.error(request, 'User already exists')
            return redirect('signup')

        try:
            # Create new user
            user = UserSignup(
                phoneorusername=identifier,
                password=make_password(password)  # Hash the password
            )
            user.save()
            
            messages.success(request, 'Account created successfully! Please login.')
            return redirect('login')

        except Exception as e:
            messages.error(request, '')
            return redirect('signup')

    return render(request, 'user_signup.html')


# Login page------------------------------------>
def user_login(request):
    if request.method == 'POST':
        identifier = request.POST.get('identifier')
        password = request.POST.get('password')

        try:
            # Find user by phone or username
            user = UserSignup.objects.get(phoneorusername=identifier)

            if check_password(password, user.password):
                # Set session
                request.session['user_id'] = user.id
                request.session['user_identifier'] = user.phoneorusername
                

                messages.success(request, 'Login successful!')
                return redirect('userdashboard')  # 🔁 redirect to dashboard or desired page
            else:
                messages.error(request, 'Invalid password. Please try again.')

        except UserSignup.DoesNotExist:
            messages.error(request, 'No user found with this phone number or username.')

    return render(request, 'login.html')


# Dashboard page------------------------------------>
def user_dashboard(request):
    if 'user_id' not in request.session:
        return redirect('login')
    
    user_name = request.session.get('user_identifier', 'User')
    return render(request, 'userdashboard.html', {'user_name': user_name})


# My Profile page------------------------------------>

# views.py
def myprofile(request):
    user_id = request.session.get('user_id')

    if not user_id:
        return redirect('login')

    try:
        user = UserSignup.objects.get(id=user_id)
    except UserSignup.DoesNotExist:
        return redirect('login')

    # Get or create profile linked to the user
    profile, created = UserProfile.objects.get_or_create(user=user)

    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully.")
            return redirect('myprofile')
    else:
        form = UserProfileForm(instance=profile)

    # For "Member since" and name
    created_at = profile.created_at
    username = user.phoneorusername
    profile_initial = username[0].upper() if username else '?'
    profile_picture_url = profile.profile_picture.url if profile.profile_picture else None

    context = {
        'form': form,
        'user_name': username,
        'member_since': created_at,
        'profile_initial': profile_initial,
        'profile_picture': profile_picture_url,
    }

    return render(request, 'myprofile.html', context)

# Logout option------------------------------------>
def user_logout(request):
    # Clear session
    request.session.flush()
    messages.success(request, "You have been logged out successfully.")
    return redirect('login')