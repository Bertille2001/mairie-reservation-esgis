from rest_framework import serializers
from .models import DemandeReservation, ReservationMateriel, SuiviCles, StatutDemande


class DemandeCreateSerializer(serializers.ModelSerializer):
    appareil_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False, default=[]
    )

    class Meta:
        model  = DemandeReservation
        fields = [
            "salle", "demandeur_nom", "demandeur_email", "type_demandeur",
            "nom_manifestation", "nb_personnes", "date_debut", "date_fin",
            "appareil_ids"
        ]

    def validate(self, data):
        salle = data["salle"]
        # Vérifier capacité
        if not (salle.capacite_min <= data["nb_personnes"] <= salle.capacite_max):
            raise serializers.ValidationError(
                f"Le nombre de personnes doit être entre {salle.capacite_min} et {salle.capacite_max}."
            )
        # Vérifier créneau libre
        conflit = DemandeReservation.objects.filter(
            salle=salle,
            statut=StatutDemande.ACCEPTEE,
            date_debut__lt=data["date_fin"],
            date_fin__gt=data["date_debut"],
        ).exists()
        if conflit:
            raise serializers.ValidationError("Ce créneau est déjà réservé pour cette salle.")
        if data["date_fin"] <= data["date_debut"]:
            raise serializers.ValidationError("La date de fin doit être après la date de début.")
        return data


class DemandeOutSerializer(serializers.ModelSerializer):
    salle_nom = serializers.CharField(source="salle.nom", read_only=True)

    class Meta:
        model  = DemandeReservation
        fields = [
            "id", "salle", "salle_nom", "demandeur_nom", "demandeur_email",
            "type_demandeur", "nom_manifestation", "nb_personnes",
            "date_debut", "date_fin", "statut", "raison_refus",
            "prix_total", "date_soumission"
        ]
        read_only_fields = ["id", "statut", "prix_total", "date_soumission"]


class TraitementSerializer(serializers.Serializer):
    """Accepter ou refuser une demande"""
    statut       = serializers.ChoiceField(choices=["acceptee", "refusee"])
    raison_refus = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data["statut"] == "refusee" and not data.get("raison_refus"):
            raise serializers.ValidationError("La raison du refus est obligatoire.")
        return data


class SuiviClesSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SuiviCles
        fields = [
            "id", "demande", "date_remise_prevue", "date_remise_reelle",
            "paiement_effectue", "montant_paye",
            "date_restitution_prevue", "date_restitution_reelle",
            "cles_rendues", "rappel_envoye"
        ]
        read_only_fields = ["id", "demande", "rappel_envoye"]
