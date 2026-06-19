from rest_framework import generics, permissions
from .models import Utilisateur
from .serializers import UtilisateurSerializer, MeSerializer


class RegisterView(generics.CreateAPIView):
    """Créer un compte employé ou gardien"""
    queryset           = Utilisateur.objects.all()
    serializer_class   = UtilisateurSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    """Infos de l'utilisateur connecté"""
    serializer_class   = MeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
