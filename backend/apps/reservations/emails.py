from django.core.mail import send_mail
from django.conf import settings


def envoyer_email_decision(demande):
    """Envoie un email au demandeur après acceptation ou refus"""
    if demande.statut == "acceptee":
        sujet = f"Réservation confirmée — {demande.nom_manifestation}"
        if demande.salle.a_gardien:
            info_cles = f"Les clés seront remises à l'adresse de la salle : {demande.salle.adresse}"
        else:
            info_cles = "Les clés seront remises à la mairie de Lomé."
        message = (
            f"Bonjour {demande.demandeur_nom},\n\n"
            f"Votre demande de réservation pour '{demande.nom_manifestation}' "
            f"à la salle '{demande.salle.nom}' a été ACCEPTÉE.\n\n"
            f"Date : du {demande.date_debut.strftime('%d/%m/%Y %H:%M')} "
            f"au {demande.date_fin.strftime('%d/%m/%Y %H:%M')}\n"
            f"Prix total : {demande.prix_total} FCFA\n\n"
            f"Remise des clés : {info_cles}\n\n"
            f"Cordialement,\nMairie de Lomé"
        )
    else:
        sujet = f"Réservation refusée — {demande.nom_manifestation}"
        message = (
            f"Bonjour {demande.demandeur_nom},\n\n"
            f"Votre demande de réservation pour '{demande.nom_manifestation}' "
            f"a été REFUSÉE.\n\n"
            f"Raison : {demande.raison_refus}\n\n"
            f"Cordialement,\nMairie de Lomé"
        )

    send_mail(
        subject=sujet,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[demande.demandeur_email],
        fail_silently=True,
    )


def envoyer_rappel_cles(demande):
    """Rappel si les clés n'ont pas été rendues"""
    send_mail(
        subject="Rappel — Restitution des clés",
        message=(
            f"Bonjour {demande.demandeur_nom},\n\n"
            f"Nous n'avons pas encore reçu les clés de la salle '{demande.salle.nom}'.\n"
            f"Merci de les restituer dès que possible.\n\n"
            f"Cordialement,\nMairie de Lomé"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[demande.demandeur_email],
        fail_silently=True,
    )
