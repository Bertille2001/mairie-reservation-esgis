from rest_framework import serializers
from .models import Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = Utilisateur
        fields = ["id", "nom", "prenom", "email", "role", "salle", "actif", "password"]
        read_only_fields = ["id", "actif"]

    def validate(self, data):
        if data.get("role") == "gardien" and not data.get("salle"):
            raise serializers.ValidationError("Un gardien doit avoir une salle assignée.")
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user


class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Utilisateur
        fields = ["id", "nom", "prenom", "email", "role", "salle"]
