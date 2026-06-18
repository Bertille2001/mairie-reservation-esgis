from django.urls import path
from .views import DemandeCreateView, DemandeListView, TraiterDemandeView, SuiviClesView

urlpatterns = [
    path("",                         DemandeCreateView.as_view(),  name="demande-create"),
    path("list/",                    DemandeListView.as_view(),    name="demande-list"),
    path("<int:pk>/traiter/",        TraiterDemandeView.as_view(), name="demande-traiter"),
    path("<int:pk>/suivi/",          SuiviClesView.as_view(),      name="suivi-cles"),
]
