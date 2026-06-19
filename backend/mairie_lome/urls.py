from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Documentation API
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

    # Auth JWT
    path("api/auth/login/",   TokenObtainPairView.as_view(),  name="token_obtain"),
    path("api/auth/refresh/", TokenRefreshView.as_view(),     name="token_refresh"),

    # Nos apps
    path("api/utilisateurs/", include("apps.utilisateurs.urls")),
    path("api/salles/",       include("apps.salles.urls")),
    path("api/reservations/", include("apps.reservations.urls")),
]
