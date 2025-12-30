from django.urls import path
from .views import home, contact_view, services_view, about_view, portfolio_view, stickers_view, apparel_view, vehicle_wraps_view, promo_printing_view,decals_view, banner_view, poster_view, window_graphics_view, menus_view, digitalmenus_view, patches_view, embroidery_view, dtf_view, stationary_view, souvenirs_view, bestsellers_view


urlpatterns = [
    path("", home, name="home"),
    path("services/", services_view, name="services"),
    path("contact/", contact_view, name="contact"),
    path("about/", about_view, name="about"),
    path("portfolio/", portfolio_view, name="portfolio"),
    path("stickers/", stickers_view, name="stickers"),
    path("apparel/", apparel_view, name="apparel"),
    path("vehicle-wraps/", vehicle_wraps_view, name="vehicle_wraps"),
    path("promo-printing/", promo_printing_view, name="promo_printing"),
    path("decals/", decals_view, name="decals"),
    path("banners/", banner_view, name="banners"),
    path("posters/", poster_view, name="posters"),      
    path("window-graphics/", window_graphics_view, name="window_graphics"),
    path("menus/", menus_view, name="menus"),
    path("digital-menus/", digitalmenus_view, name="digital_menus"),    
    path("patches/", patches_view, name="patches"),
    path("embroidery/", embroidery_view, name="embroidery"),
    path("dtf/", dtf_view, name="dtf"),
    path("stationary/", stationary_view, name="stationary"),
    path("souvenirs/", souvenirs_view, name="souvenirs"),
    path("bestsellers/", bestsellers_view, name="bestsellers"),
    
]