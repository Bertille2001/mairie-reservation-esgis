from rest_framework import serializers
from .models import Salle, Appareil, AppareilSalle


class AppareilSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Appareil
        fields = ["id", "nom", "reference", "prix_location"]


class SalleSerializer(serializers.ModelSerializer):
    # Noms des appareils fixes (visibles sur le portail public)
    appareils_fixes = serializers.SerializerMethodField()
    # Appareils louables (avec prix) pour la réservation
    appareils_louables = serializers.SerializerMethodField()

    class Meta:
        model  = Salle
        fields = [
            "id", "nom", "adresse", "surface_m2",
            "capacite_min", "capacite_max",
            "est_payante", "a_gardien", "prix_heure",
            "appareils_fixes", "appareils_louables"
        ]

    def get_appareils_fixes(self, obj):
        return [
            as_.appareil.nom
            for as_ in obj.appareils.filter(est_louable=False).select_related("appareil")
        ]

    def get_appareils_louables(self, obj):
        return [
            {
                "id":   as_.appareil.id,
                "nom":  as_.appareil.nom,
                "prix": as_.appareil.prix_location
            }
            for as_ in obj.appareils.filter(est_louable=True).select_related("appareil")
        ]


class PlanningSalleSerializer(serializers.Serializer):
    """Vue planning public — salle libre ou occupée"""
    id       = serializers.IntegerField()
    nom      = serializers.CharField()
    est_libre = serializers.BooleanField()
