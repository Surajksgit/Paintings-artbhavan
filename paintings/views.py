# views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
from .models import UserSignup 
from .models import UserProfile
from .forms import UserProfileForm
import re
import datetime
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from .models import Artwork
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Cart, CartItem, Order
import random
# from .models import Wishlist






# Home page------------------------------------>
def home(request):
    return render(request, 'arthome.html')


# Signup page------------------------------------>
def signup(request):
    if request.method == 'POST':
        identifier = request.POST.get('identifier')
        email = request.POST.get('email')
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
            messages.error(request, 'Username already taken. Please choose another.')
            return redirect('signup')
        
        if UserSignup.objects.filter(email=email).exists():
            messages.error(request, 'This email is already registered. Please login.')
            return redirect('signup')

        try:
            # Create new user
            user = UserSignup(
                phoneorusername=identifier,
                email=email,
                password=make_password(password)  # Hash the password
            )
            user.save()

            # Send professional welcome email
            send_mail(
                subject=" Welcome to ArtBhavan – Your Art Journey Begins Here!",
                message=(
                    f"Dear {identifier},\n\n"
                    "Thank you for signing up with ArtBhavan!\n\n"
                    "We’re thrilled to have you join our creative community. "
                    "Your account has been successfully created.\n\n"
                    "Login now and start exploring a wide range of beautiful artworks, curated just for you.\n\n"
                    "Explore. Discover. Collect.\n\n"
                    "Warm regards,\n"
                    "Team ArtBhavan\n"
                    "Website: www.artbhavan.in\n"
                    "Email: support@artbhavan.in"
                ),
                from_email='artbhavan@gmail.com',
                recipient_list=[email],
                fail_silently=False,
            )

            
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
            # Try to find user by phoneorusername OR email
            if '@' in identifier:
                user = UserSignup.objects.get(email=identifier)
            else:
                user = UserSignup.objects.get(phoneorusername=identifier)

            if check_password(password, user.password):
                # Set session
                request.session['user_id'] = user.id
                request.session['user_identifier'] = user.phoneorusername
                
                messages.success(request, 'Login successful!')
                return redirect('userdashboard') 
            else:
                messages.error(request, 'Invalid password. Please try again.')

        except UserSignup.DoesNotExist:
            messages.error(request, 'No account found with this username or email.')

    return render(request, 'login.html')


# Dashboard page------------------------------------>
def user_dashboard(request):
    if 'user_id' not in request.session:
        return redirect('login')
    
    user_name = request.session.get('user_identifier', 'User')

    # Get filters from query params
    category = request.GET.get('category')
    sort_by = request.GET.get('sort_by')

    artworks = Artwork.objects.all()

    if category:
        artworks = artworks.filter(category=category)

    if sort_by == 'low_to_high':
        artworks = artworks.order_by('price')
    elif sort_by == 'high_to_low':
        artworks = artworks.order_by('-price')

    return render(request, 'userdashboard.html', {
        'user_name': user_name,
        'artworks': artworks,
        'selected_category': category,
        'selected_sort': sort_by

        })


# My Profile page------------------------------------>


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
            print("Form Errors:", form.errors)  # Debugging

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




# forgot password page------------------------------------>
def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = UserSignup.objects.get(email=email)

            # Create reset link
            reset_link = request.build_absolute_uri(f"/reset_password/{user.id}/")

            # Render email templates
            html_content = render_to_string('emails/reset_password_email.html', {
                'user': user,
                'reset_link': reset_link,
            })
            text_content = strip_tags(html_content)

            subject = "Reset your ArtBhavan password"
            from_email = settings.EMAIL_HOST_USER
            to = [email]

            # Compose email
            email_message = EmailMultiAlternatives(subject, text_content, from_email, to)
            email_message.attach_alternative(html_content, "text/html")
            email_message.send()

            messages.success(request, "A reset link has been sent to your email.")
            return redirect('forgot_password')

        except UserSignup.DoesNotExist:
            messages.error(request, "No account found with that email.")

    return render(request, 'forgot_password.html')

# Reset password page------------------------------------>
def reset_password(request, uid):
    try:
        user = UserSignup.objects.get(id=uid)
    except UserSignup.DoesNotExist:
        messages.error(request, "Invalid reset link.")
        return redirect('login')

    if request.method == 'POST':
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if new_password != confirm_password:
            messages.error(request, "Passwords do not match.")
        elif len(new_password) < 6:
            messages.error(request, "Password should be at least 6 characters.")
        else:
            user.password = make_password(new_password)
            user.save()
            messages.success(request, "Password reset successfully! Please login.")
            return redirect('login')

    return render(request, 'reset_password.html')




# Collection page------------------------------------>
def collection_view(request):
    artworks = Artwork.objects.all()
    query = request.GET.get('q')
    category = request.GET.get('category')
    sort = request.GET.get('sort')

    if query:
        artworks = artworks.filter(title__icontains=query)

    if category:
        artworks = artworks.filter(category=category)
    if sort == 'low':
        artworks = artworks.order_by('price')
    elif sort == 'high':
        artworks = artworks.order_by('-price')

    return render(request, 'collection.html', {'artworks': artworks})



# Artwork detail page------------------------------------>
def artwork_detail(request, artwork_id):
    artwork = get_object_or_404(Artwork, id=artwork_id)
    return render(request, 'artwork_detail.html', {'artwork': artwork})


# Cart page------------------------------------>


# Add to cart
def add_to_cart(request, artwork_id):
    # Check if user is logged in
    if 'user_id' not in request.session:
        messages.warning(request, "Please sign up or log in to add items to your cart.")
        return redirect('signup')  # Redirect to signup if not logged in


    # Continue with cart logic if logged in
    artwork = get_object_or_404(Artwork, id=artwork_id)
    user = request.session.get('user_id')
    user_instance = get_object_or_404(UserSignup, id=user)

    cart, _ = Cart.objects.get_or_create(user=user_instance)
    item, created = CartItem.objects.get_or_create(cart=cart, artwork=artwork)

    if not created:
        item.quantity += 1
        item.save()

    messages.success(request, f'"{artwork.title}" has been added to your cart!')   

    return redirect('cart')

# View cart
def cart_view(request):
    user = request.session.get('user_id')
    user_instance = get_object_or_404(UserSignup, id=user)
    cart, _ = Cart.objects.get_or_create(user=user_instance)
    return render(request, 'cart.html', {'cart': cart})

# Remove item
def remove_from_cart(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    item.delete()
    messages.success(request, "Artwork removed from cart successfully!")
    return redirect('cart')

# Checkout
def checkout_view(request):
    user = request.session.get('user_id')
    user_instance = get_object_or_404(UserSignup, id=user)
    profile = get_object_or_404(UserProfile, user=user_instance)
    cart = get_object_or_404(Cart, user=user_instance)
    
    

    return render(request, 'checkout.html', {
        'user': user_instance,
        'cart': cart,
        'user': {
            'username': user_instance.phoneorusername,
            'email': user_instance.email,
            'profile': profile
        }
    })


# Add to wishlist------------------------------------->

# Add to Wishlist
# def add_to_wishlist(request, artwork_id):
#     if 'user_id' not in request.session:
#         return redirect('login')

#     user = UserSignup.objects.get(id=request.session['user_id'])
#     artwork = get_object_or_404(Artwork, id=artwork_id)

#     # Prevent duplicates
#     if Wishlist.objects.filter(user=user, artwork=artwork).exists():
#         messages.info(request, 'This item is already in your wishlist.')
#     else:
#         Wishlist.objects.create(user=user, artwork=artwork)
#         messages.success(request, 'Added to wishlist!')

#     return redirect('wishlist')


# View Wishlist
# def wishlist_view(request):
#     if 'user_id' not in request.session:
#         return redirect('login')

#     user = UserSignup.objects.get(id=request.session['user_id'])
#     wishlist_items = Wishlist.objects.filter(user=user)

#     return render(request, 'wishlist.html', {'wishlist_items': wishlist_items})


# Remove from Wishlist
# def remove_from_wishlist(request, artwork_id):
#     if 'user_id' not in request.session:
#         return redirect('login')

#     user = UserSignup.objects.get(id=request.session['user_id'])
#     Wishlist.objects.filter(user=user, artwork_id=artwork_id).delete()
#     messages.success(request, 'Item removed from wishlist.')

#     return redirect('wishlist')





# write wish list view 
# def wishlist_view(request):
#     return render(request, 'wishlist.html')


    


# About page------------------------------------->
def about(request):
    return render(request, 'about.html')

# Contact page------------------------------------->
def contact(request):
    return render(request, 'contact.html')

def shopnow(request, artwork_id):
    artwork = get_object_or_404(Artwork, id=artwork_id)
    return render(request, 'shopnow.html', {'artwork': artwork})


# Payment processing
def process_payment(request):
    if request.method == 'POST':
        method = request.POST.get('payment_method')

        # Fetch user and cart
        user = get_object_or_404(UserSignup, id=request.session['user_id'])
        cart = Cart.objects.filter(user=user).first()

        if not cart or not cart.items.exists():
            messages.error(request, "Your cart is empty.")
            return redirect('cart')


        # Optional: Validate card/upi details
        if method == 'card':
            if not (request.POST.get('card_number') and request.POST.get('expiry') and request.POST.get('cvv')):
                messages.error(request, "Invalid card details.")
                return redirect('checkout')
            messages.success(request, "Card payment processed successfully.")

        elif method == 'upi':
            if not request.POST.get('upi_id'):
                messages.error(request, "Invalid UPI ID.")
                return redirect('checkout')
            messages.success(request, f"UPI {request.POST.get('upi_id')} verified. Order placed!")

        elif method == 'cod':
            messages.success(request, "Order placed with Cash on Delivery.")
        else:
            messages.error(request, "Invalid payment method.")
            return redirect('checkout')

        # Create Order for each item in cart
        for item in cart.items.all():
            Order.objects.create(
                user=user,
                artwork=item.artwork,
                quantity=item.quantity,
                payment_method=method,
                ordered_at=datetime.datetime.now()
            )

        # Clear the cart
        cart.items.all().delete()

        return redirect('order_success')

    return redirect('checkout')


# My orders
def my_orders(request):
    if 'user_id' not in request.session:
        return redirect('login')

    user = get_object_or_404(UserSignup, id=request.session['user_id'])
    orders = Order.objects.filter(user=user).order_by('-ordered_at')
    return render(request, 'my_orders.html', {'orders': orders})





# Order success
def order_success(request):
    return render(request, 'order_success.html')




