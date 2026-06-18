from django.db import models


class Salle(models.Model):
    nom          = models.CharField(max_length=100)
    adresse      = models.CharField(max_length=255)
    surface_m2   = models.DecimalField(max_digits=8, decimal_places=2)
    capacite_min = models.PositiveIntegerField()
    capacite_max = models.PositiveIntegerField()
    est_payante  = models.BooleanField(default=False)
    a_gardien    = models.BooleanField(default=False)
    prix_heure   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom

    class Meta:
        verbose_name = "Salle"
        ordering     = ["nom"]


class Appareil(models.Model):
    nom           = models.CharField(max_length=100)
    reference     = models.CharField(max_length=50, unique=True)
    prix_location = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} ({self.reference})"

    @property
    def est_louable(self):
        return self.prix_location is not None

    class Meta:
        verbose_name = "Appareil"
        ordering     = ["nom"]


class AppareilSalle(models.Model):
    """Liaison N-N entre Appareil et Salle"""
    salle       = models.ForeignKey(Salle,    on_delete=models.CASCADE, related_name="appareils")
    appareil    = models.ForeignKey(Appareil, on_delete=models.CASCADE, related_name="salles")
    est_louable = models.BooleanField(default=False)

    class Meta:
        unique_together = ("salle", "appareil")
        verbose_name    = "Appareil en salle"
