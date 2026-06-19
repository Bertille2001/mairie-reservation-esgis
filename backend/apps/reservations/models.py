from django.db import models
from django.conf import settings


class TypeDemandeur(models.TextChoices):
    PARTICULIER  = "particulier",  "Particulier"
    ORGANISATION = "organisation", "Organisation"


class StatutDemande(models.TextChoices):
    EN_ATTENTE = "en_attente", "En attente"
    ACCEPTEE   = "acceptee",   "Acceptée"
    REFUSEE    = "refusee",    "Refusée"


class StatutMateriel(models.TextChoices):
    CONFIRME = "confirme", "Confirmé"
    ANNULE   = "annule",   "Annulé"


class DemandeReservation(models.Model):
    salle             = models.ForeignKey("salles.Salle", on_delete=models.PROTECT, related_name="demandes")

    # Demandeur (visiteur public)
    demandeur_nom     = models.CharField(max_length=150)
    demandeur_email   = models.EmailField()
    type_demandeur    = models.CharField(max_length=20, choices=TypeDemandeur.choices)

    # Détails réservation
    nom_manifestation = models.CharField(max_length=200)
    nb_personnes      = models.PositiveIntegerField()
    date_debut        = models.DateTimeField()
    date_fin          = models.DateTimeField()

    # Traitement
    statut            = models.CharField(max_length=20, choices=StatutDemande.choices, default=StatutDemande.EN_ATTENTE)
    raison_refus      = models.TextField(blank=True, null=True)
    traite_par        = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="demandes_traitees"
    )
    date_traitement   = models.DateTimeField(null=True, blank=True)
    prix_total        = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    date_soumission   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom_manifestation} — {self.salle} ({self.statut})"

    class Meta:
        verbose_name = "Demande de réservation"
        ordering     = ["-date_soumission"]


class ReservationMateriel(models.Model):
    demande  = models.ForeignKey(DemandeReservation, on_delete=models.CASCADE, related_name="materiels")
    appareil = models.ForeignKey("salles.Appareil",  on_delete=models.PROTECT,  related_name="reservations")
    statut   = models.CharField(max_length=20, choices=StatutMateriel.choices, default=StatutMateriel.CONFIRME)

    class Meta:
        unique_together = ("demande", "appareil")
        verbose_name    = "Matériel réservé"


class SuiviCles(models.Model):
    demande                 = models.OneToOneField(DemandeReservation, on_delete=models.CASCADE, related_name="suivi")

    date_remise_prevue      = models.DateTimeField(null=True, blank=True)
    date_remise_reelle      = models.DateTimeField(null=True, blank=True)
    paiement_effectue       = models.BooleanField(default=False)
    montant_paye            = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    date_restitution_prevue = models.DateTimeField(null=True, blank=True)
    date_restitution_reelle = models.DateTimeField(null=True, blank=True)
    cles_rendues            = models.BooleanField(null=True, blank=True)
    rappel_envoye           = models.BooleanField(default=False)

    enregistre_par          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="suivis"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Suivi des clés"
