from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # everything inside website/urls.py becomes active
    path("", include("website.urls")),
]
