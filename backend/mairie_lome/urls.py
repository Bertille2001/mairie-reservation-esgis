from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/",    admin.site.urls),

    # Auth JWT
    path("api/auth/login/",   TokenObtainPairView.as_view(),  name="token_obtain"),
    path("api/auth/refresh/", TokenRefreshView.as_view(),     name="token_refresh"),

    # Nos apps
    path("api/utilisateurs/", include("apps.utilisateurs.urls")),
    path("api/salles/",       include("apps.salles.urls")),
    path("api/reservations/", include("apps.reservations.urls")),
]
