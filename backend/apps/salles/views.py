from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils.dateparse import parse_datetime
from .models import Salle
from .serializers import SalleSerializer, PlanningSalleSerializer
from apps.reservations.models import DemandeReservation, StatutDemande


class SalleListView(generics.ListAPIView):
    """Portail public — liste toutes les salles"""
    queryset           = Salle.objects.prefetch_related("appareils__appareil").all()
    serializer_class   = SalleSerializer
    permission_classes = [permissions.AllowAny]


class SalleDetailView(generics.RetrieveAPIView):
    """Portail public — détail d'une salle"""
    queryset           = Salle.objects.prefetch_related("appareils__appareil").all()
    serializer_class   = SalleSerializer
    permission_classes = [permissions.AllowAny]


class SalleCreateView(generics.CreateAPIView):
    """Employé municipal — créer une salle"""
    queryset         = Salle.objects.all()
    serializer_class = SalleSerializer

    def perform_create(self, serializer):
        salle = serializer.validated_data
        if salle["capacite_min"] > salle["capacite_max"]:
            raise ValidationError("capacite_min doit être inférieure à capacite_max")
        serializer.save()


class PlanningView(APIView):
    """Portail public — planning des salles sur un créneau"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        date_debut = parse_datetime(request.query_params.get("date_debut", ""))
        date_fin   = parse_datetime(request.query_params.get("date_fin", ""))

        if not date_debut or not date_fin:
            raise ValidationError("Paramètres date_debut et date_fin requis (format ISO)")

        # IDs des salles occupées sur ce créneau
        salles_occupees = DemandeReservation.objects.filter(
            statut=StatutDemande.ACCEPTEE,
            date_debut__lt=date_fin,
            date_fin__gt=date_debut,
        ).values_list("salle_id", flat=True)

        salles = Salle.objects.all()
        data = [
            {"id": s.id, "nom": s.nom, "est_libre": s.id not in salles_occupees}
            for s in salles
        ]
        return Response(PlanningSalleSerializer(data, many=True).data)
