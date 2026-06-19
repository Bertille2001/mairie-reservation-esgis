import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

fake = Faker("fr_FR")


class Command(BaseCommand):
    help = "Remplit la base de données avec des données de test réalistes"

    def handle(self, *args, **kwargs):
        from apps.salles.models import Salle, Appareil, AppareilSalle
        from apps.utilisateurs.models import Utilisateur
        from apps.reservations.models import DemandeReservation, ReservationMateriel, SuiviCles

        self.stdout.write("🗑️  Nettoyage des données existantes...")
        SuiviCles.objects.all().delete()
        ReservationMateriel.objects.all().delete()
        DemandeReservation.objects.all().delete()
        AppareilSalle.objects.all().delete()
        Appareil.objects.all().delete()
        Utilisateur.objects.filter(is_superuser=False).delete()
        Salle.objects.all().delete()

        # ── SALLES ──────────────────────────────────────
        self.stdout.write("🏛️  Création des salles...")
        noms_salles = [
            "Salle des Fêtes de Tokoin", "Salle Municipale de Bè",
            "Centre Culturel d'Adidogomé", "Salle de Conférence Agbalépédogan",
            "Espace Communautaire de Djidjolé", "Salle Polyvalente de Nyékonakpoè",
            "Salle des Mariages de Kégué", "Centre de Réunion de Agoè",
            "Salle Omnisports de Cacavéli", "Espace Civique de Hédzranawoé",
        ]
        adresses_lome = [
            "Rue des Palmiers, Tokoin", "Avenue du 13 Janvier, Bè",
            "Carrefour Agbalépédogan", "Boulevard du Mono, Adidogomé",
            "Rue de la Paix, Djidjolé", "Avenue de la Libération, Nyékonakpoè",
            "Rue des Flamboyants, Kégué", "Boulevard Circulaire, Agoè",
            "Rue du Lac, Cacavéli", "Avenue Sarakawa, Hédzranawoé",
        ]
        salles = []
        for i in range(50):
            cap_min = random.randint(10, 50)
            cap_max = random.randint(cap_min + 20, cap_min + 450)
            payante = random.random() < 0.6
            salle = Salle.objects.create(
                nom          = noms_salles[i % len(noms_salles)] + (f" {i+1}" if i >= len(noms_salles) else ""),
                adresse      = adresses_lome[i % len(adresses_lome)],
                surface_m2   = round(random.uniform(50, 800), 2),
                capacite_min = cap_min,
                capacite_max = cap_max,
                est_payante  = payante,
                a_gardien    = random.random() < 0.4,
                prix_heure   = round(random.uniform(5000, 50000), 0) if payante else None,
            )
            salles.append(salle)
        self.stdout.write(f"   ✅ {len(salles)} salles créées")

        # ── APPAREILS ───────────────────────────────────
        self.stdout.write("📦  Création des appareils...")
        types_appareils = [
            ("Vidéo projecteur",   15000), ("Système de sonorisation", 20000),
            ("Réfrigérateur",       8000), ("Climatiseur",             12000),
            ("Tableau blanc",       3000), ("Microphone sans fil",      5000),
            ("Écran de projection", 6000), ("Table de mixage",         18000),
            ("Générateur",         25000), ("Chaises supplémentaires",  2000),
        ]
        appareils = []
        for i, (nom, prix) in enumerate(types_appareils * 15):
            ref = f"{nom[:3].upper()}-{i+1:03d}"
            louable = random.random() < 0.7
            app = Appareil.objects.create(
                nom           = nom,
                reference     = ref,
                prix_location = prix if louable else None,
            )
            appareils.append(app)
        self.stdout.write(f"   ✅ {len(appareils)} appareils créés")

        # ── APPAREIL_SALLE ──────────────────────────────
        self.stdout.write("🔗  Association appareils ↔ salles...")
        count_as = 0
        for salle in salles:
            nb = random.randint(2, 8)
            choix = random.sample(appareils, min(nb, len(appareils)))
            for app in choix:
                AppareilSalle.objects.get_or_create(
                    salle=salle, appareil=app,
                    defaults={"est_louable": app.prix_location is not None}
                )
                count_as += 1
        self.stdout.write(f"   ✅ {count_as} liaisons créées")

        # ── UTILISATEURS ────────────────────────────────
        self.stdout.write("👥  Création des utilisateurs...")
        prenoms = ["Komi", "Akosua", "Afi", "Kofi", "Abla", "Yao", "Ama", "Kwame", "Efua", "Sena"]
        noms    = ["Agbeko", "Mensah", "Dodzi", "Kpodo", "Amewu", "Tetteh", "Fiagbe", "Goka"]

        utilisateurs = []
        for i in range(30):
            prenom = random.choice(prenoms)
            nom    = random.choice(noms)
            u = Utilisateur.objects.create_user(
                email    = f"employe{i+1}@mairie-lome.tg",
                password = "mairie2026",
                nom      = nom,
                prenom   = prenom,
                role     = "employe_municipal",
            )
            utilisateurs.append(u)

        for i, salle in enumerate(salles[:50]):
            prenom = random.choice(prenoms)
            nom    = random.choice(noms)
            u = Utilisateur.objects.create_user(
                email    = f"gardien{i+1}@mairie-lome.tg",
                password = "mairie2026",
                nom      = nom,
                prenom   = prenom,
                role     = "gardien",
                salle    = salle,
            )
            utilisateurs.append(u)

        self.stdout.write(f"   ✅ {len(utilisateurs)} utilisateurs créés")

        # ── DEMANDES DE RÉSERVATION ──────────────────────
        self.stdout.write("📋  Création des demandes (10 000)...")
        statuts = ["en_attente", "acceptee", "acceptee", "acceptee", "refusee"]
        types   = ["particulier", "organisation"]
        manifestations = [
            "Mariage", "Baptême", "Conférence", "Formation", "Réunion communautaire",
            "Anniversaire", "Assemblée générale", "Séminaire", "Concert", "Exposition",
            "Fête de quartier", "Atelier", "Soirée caritative", "Forum", "Cérémonie"
        ]
        employes = [u for u in utilisateurs if u.role == "employe_municipal"]
        demandes = []
        now = timezone.now()

        for i in range(10000):
            salle        = random.choice(salles)
            type_dem     = random.choice(types)
            statut       = random.choice(statuts)
            date_debut   = now - timedelta(days=random.randint(0, 730)) + timedelta(hours=random.randint(8, 18))
            duree_heures = random.randint(2, 8)
            date_fin     = date_debut + timedelta(hours=duree_heures)
            nb_personnes = random.randint(salle.capacite_min, salle.capacite_max)

            prix = 0
            if salle.est_payante and type_dem == "particulier" and salle.prix_heure:
                prix = float(salle.prix_heure) * duree_heures

            d = DemandeReservation(
                salle             = salle,
                demandeur_nom     = fake.name(),
                demandeur_email   = fake.email(),
                type_demandeur    = type_dem,
                nom_manifestation = random.choice(manifestations),
                nb_personnes      = nb_personnes,
                date_debut        = date_debut,
                date_fin          = date_fin,
                statut            = statut,
                raison_refus      = fake.sentence() if statut == "refusee" else None,
                traite_par        = random.choice(employes) if statut != "en_attente" else None,
                date_traitement   = date_debut - timedelta(days=random.randint(1, 10)) if statut != "en_attente" else None,
                prix_total        = round(prix, 2),
            )
            demandes.append(d)

            if len(demandes) % 1000 == 0:
                DemandeReservation.objects.bulk_create(demandes)
                self.stdout.write(f"   ... {i+1}/10000")
                demandes = []

        if demandes:
            DemandeReservation.objects.bulk_create(demandes)

        self.stdout.write("   ✅ 10 000 demandes créées")

        # ── RESERVATION MATERIEL ────────────────────────
        self.stdout.write("🎛️  Ajout du matériel aux réservations...")
        toutes_demandes = DemandeReservation.objects.select_related("salle").all()
        rm_list = []
        for demande in toutes_demandes:
            liaisons = list(AppareilSalle.objects.filter(salle=demande.salle, est_louable=True))
            if liaisons and random.random() < 0.6:
                choix = random.sample(liaisons, min(random.randint(1, 3), len(liaisons)))
                for liaison in choix:
                    rm_list.append(ReservationMateriel(
                        demande  = demande,
                        appareil = liaison.appareil,
                        statut   = "annule" if demande.statut == "refusee" else "confirme"
                    ))
        ReservationMateriel.objects.bulk_create(rm_list, ignore_conflicts=True)
        self.stdout.write(f"   ✅ {len(rm_list)} réservations de matériel créées")

        # ── SUIVI DES CLÉS ──────────────────────────────
        self.stdout.write("🔑  Création des suivis de clés...")
        acceptees = DemandeReservation.objects.filter(statut="acceptee")
        suivi_list = []
        staff = utilisateurs
        for demande in acceptees:
            cles_rendues = random.choice([True, True, True, False, None])
            suivi_list.append(SuiviCles(
                demande                 = demande,
                date_remise_prevue      = demande.date_debut,
                date_remise_reelle      = demande.date_debut + timedelta(hours=random.randint(-1, 2)),
                paiement_effectue       = random.random() < 0.9,
                montant_paye            = demande.prix_total,
                date_restitution_prevue = demande.date_fin,
                date_restitution_reelle = demande.date_fin + timedelta(hours=random.randint(0, 3)) if cles_rendues else None,
                cles_rendues            = cles_rendues,
                rappel_envoye           = cles_rendues is False,
                enregistre_par          = random.choice(staff),
            ))
            if len(suivi_list) % 1000 == 0:
                SuiviCles.objects.bulk_create(suivi_list, ignore_conflicts=True)
                suivi_list = []

        if suivi_list:
            SuiviCles.objects.bulk_create(suivi_list, ignore_conflicts=True)

        total_suivis = SuiviCles.objects.count()
        self.stdout.write(f"   ✅ {total_suivis} suivis créés")

        # ── RÉSUMÉ ──────────────────────────────────────
        self.stdout.write("\n" + "="*50)
        self.stdout.write("✅  SEED TERMINÉ !")
        self.stdout.write(f"   Salles              : {Salle.objects.count()}")
        self.stdout.write(f"   Appareils           : {Appareil.objects.count()}")
        self.stdout.write(f"   Utilisateurs        : {Utilisateur.objects.count()}")
        self.stdout.write(f"   Demandes            : {DemandeReservation.objects.count()}")
        self.stdout.write(f"   Matériel réservé    : {ReservationMateriel.objects.count()}")
        self.stdout.write(f"   Suivis clés         : {SuiviCles.objects.count()}")
        self.stdout.write("="*50)
        self.stdout.write("\n💡 Connexion staff : employe1@mairie-lome.tg / mairie2026")
        self.stdout.write("💡 Connexion gardien : gardien1@mairie-lome.tg / mairie2026")
