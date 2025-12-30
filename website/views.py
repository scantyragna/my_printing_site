from django.shortcuts import render


def home(request):
    return render(request, "home.html")
def services_view(request):
    return render(request, "services.html")
def about_view(request):
    return render(request, "about.html")
def portfolio_view(request):
    return render(request, "portfolio.html")
def stickers_view(request):
    return render(request, "stickers.html")
def apparel_view(request):
    return render(request, "apparel.html")
def vehicle_wraps_view(request):
    return render(request, "vehicle_wraps.html")
def promo_printing_view(request):
    return render(request, "promo-printing.html")
def decals_view(request):
    return render(request, "decals.html")
def banner_view(request):
    return render(request, "banners.html")
def poster_view(request):
    return render(request, "posters.html")
def window_graphics_view(request):
    return render(request, "windowgraphics.html")
def menus_view(request):
    return render(request, "menus.html")
def digitalmenus_view(request):
    return render(request, "digitalmenus.html")
def patches_view(request):
    return render(request, "patches.html")  
def embroidery_view(request):
    return render(request, "embroidery.html")
def dtf_view(request):
    return render(request, "dtf.html")
def stationary_view(request):
    return render(request, "stationary.html")
def souvenirs_view(request):
    return render(request, "souvenirs.html")
def bestsellers_view(request):
    return render(request, "bestsellers.html")




from django.core.mail import send_mail, BadHeaderError
from django.contrib import messages
from django.shortcuts import render, redirect

def contact_view(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        full_message = f"""
From: {name}
Email: {email}

{message}
        """

        try:
            send_mail(
                subject or "Website Contact Form",
                full_message,
                email,                     # from
                ["yourcompany@email.com"], # <-- change this
                fail_silently=False,
            )
            messages.success(request, "Thank you — your message was sent successfully!")
        except BadHeaderError:
            messages.error(request, "Invalid header — please try again.")
        except Exception:
            messages.error(request, "Something went wrong — please try again later.")

        return redirect("contact")

    return render(request, "contact.html")
