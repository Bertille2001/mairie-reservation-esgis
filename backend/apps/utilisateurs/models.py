from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class RoleChoices(models.TextChoices):
    EMPLOYE     = "employe_municipal", "Employé municipal"
    GARDIEN     = "gardien",           "Gardien"


class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("L'email est obligatoire")
        email = self.normalize_email(email)
        user  = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("role", RoleChoices.EMPLOYE)
        return self.create_user(email, password, **extra)


class Utilisateur(AbstractBaseUser, PermissionsMixin):
    nom      = models.CharField(max_length=100)
    prenom   = models.CharField(max_length=100, blank=True, null=True)
    email    = models.EmailField(unique=True)
    role     = models.CharField(max_length=20, choices=RoleChoices.choices)
    salle    = models.ForeignKey(
        "salles.Salle",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="gardiens"
    )
    actif      = models.BooleanField(default=True)
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["nom", "role"]

    objects = UtilisateurManager()

    def __str__(self):
        return f"{self.prenom} {self.nom} ({self.role})"

    class Meta:
        verbose_name = "Utilisateur"
