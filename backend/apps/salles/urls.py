from django.urls import path
from .views import SalleListView, SalleDetailView, SalleCreateView, PlanningView

urlpatterns = [
    path("",              SalleListView.as_view(),   name="salles-list"),
    path("create/",       SalleCreateView.as_view(), name="salle-create"),
    path("planning/",     PlanningView.as_view(),    name="planning"),
    path("<int:pk>/",     SalleDetailView.as_view(), name="salle-detail"),
]
