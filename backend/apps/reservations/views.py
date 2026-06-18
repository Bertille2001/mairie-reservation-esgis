from datetime import datetime
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from .models import DemandeReservation, ReservationMateriel, SuiviCles, StatutDemande, StatutMateriel
from .serializers import DemandeCreateSerializer, DemandeOutSerializer, TraitementSerializer, SuiviClesSerializer
from .emails import envoyer_email_decision, envoyer_rappel_cles
from apps.salles.models import AppareilSalle


def _calculer_prix(salle, date_debut, date_fin, type_demandeur, appareils):
    prix = 0.0
    if salle.est_payante and type_demandeur == "particulier" and salle.prix_heure:
        duree_heures = (date_fin - date_debut).total_seconds() / 3600
        prix += float(salle.prix_heure) * duree_heures
    for a in appareils:
        if a.prix_location:
            prix += float(a.prix_location)
    return round(prix, 2)


class DemandeCreateView(APIView):
    """Portail public — déposer une demande de réservation"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DemandeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data         = serializer.validated_data
        appareil_ids = data.pop("appareil_ids", [])
        salle        = data["salle"]

        # Appareils louables valides pour cette salle
        appareils_valides = []
        for app_id in appareil_ids:
            liaison = AppareilSalle.objects.filter(
                salle=salle, appareil_id=app_id, est_louable=True
            ).select_related("appareil").first()
            if liaison:
                appareils_valides.append(liaison.appareil)

        prix = _calculer_prix(
            salle, data["date_debut"], data["date_fin"],
            data["type_demandeur"], appareils_valides
        )

        demande = DemandeReservation.objects.create(**data, prix_total=prix)

        for appareil in appareils_valides:
            ReservationMateriel.objects.create(demande=demande, appareil=appareil)

        return Response(DemandeOutSerializer(demande).data, status=status.HTTP_201_CREATED)


class DemandeListView(generics.ListAPIView):
    """Espace staff — liste des demandes"""
    serializer_class = DemandeOutSerializer

    def get_queryset(self):
        user   = self.request.user
        qs     = DemandeReservation.objects.select_related("salle").all()
        statut = self.request.query_params.get("statut")

        # Gardien : seulement sa salle
        if user.role == "gardien":
            qs = qs.filter(salle=user.salle)

        if statut:
            qs = qs.filter(statut=statut)

        return qs


class TraiterDemandeView(APIView):
    """Espace employé — accepter ou refuser"""

    def patch(self, request, pk):
        if request.user.role != "employe_municipal":
            raise PermissionDenied("Réservé aux employés municipaux.")

        demande = get_object_or_404(DemandeReservation, pk=pk)
        if demande.statut != StatutDemande.EN_ATTENTE:
            raise ValidationError("Cette demande a déjà été traitée.")

        serializer = TraitementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        demande.statut          = data["statut"]
        demande.raison_refus    = data.get("raison_refus", "")
        demande.traite_par      = request.user
        demande.date_traitement = datetime.now()

        if data["statut"] == "refusee":
            # Annuler tout le matériel
            demande.materiels.update(statut=StatutMateriel.ANNULE)
        else:
            # Créer le suivi des clés
            SuiviCles.objects.create(
                demande=demande,
                date_remise_prevue=demande.date_debut,
                date_restitution_prevue=demande.date_fin,
                enregistre_par=request.user
            )

        demande.save()
        envoyer_email_decision(demande)

        return Response(DemandeOutSerializer(demande).data)


class SuiviClesView(APIView):
    """Voir et mettre à jour le suivi des clés"""

    def get(self, request, pk):
        demande = get_object_or_404(DemandeReservation, pk=pk)
        suivi   = get_object_or_404(SuiviCles, demande=demande)
        return Response(SuiviClesSerializer(suivi).data)

    def patch(self, request, pk):
        demande = get_object_or_404(DemandeReservation, pk=pk)
        suivi   = get_object_or_404(SuiviCles, demande=demande)

        serializer = SuiviClesSerializer(suivi, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        suivi = serializer.save(enregistre_par=request.user)

        # Rappel si clés non rendues
        if suivi.cles_rendues is False and not suivi.rappel_envoye:
            envoyer_rappel_cles(demande)
            suivi.rappel_envoye = True
            suivi.save()

        return Response(SuiviClesSerializer(suivi).data)
