# Référence API — Gestion des Réservations de Salles

**Dernière mise à jour :** 19 juin 2026  
**Version API :** 1.0  
**Stack :** Django REST Framework + PostgreSQL

---

## Table des matières

1. [Configuration générale](#configuration-générale)
2. [Authentification](#authentification)
3. [Ressources](#ressources)
   - [Utilisateurs](#utilisateurs)
   - [Salles](#salles)
   - [Demandes de réservation](#demandes-de-réservation)
   - [Suivi des clés](#suivi-des-clés)
4. [Codes de statut HTTP](#codes-de-statut-http)
5. [Énumérés (Choices)](#énumérés-choices)
6. [Mapping Frontend/Backend](#mapping-frontenddbackend)

---

## Configuration générale

### Base URL

```
http://localhost:8000/api
```

**Environnements :**
- **Développement local :** `http://localhost:8000/api`
- **Production :** À configurer selon le déploiement

### Authentification par défaut

Toutes les requêtes (sauf mention explicite) doivent inclure un token JWT valide dans le header :

```
Authorization: Bearer <access_token>
```

### Format des réponses

- **Content-Type :** `application/json`
- **Encoding :** UTF-8
- **Dates/heures :** Format ISO 8601 (ex. `2026-06-19T14:30:00Z`)

### Configuration Django

**Base de données :** PostgreSQL  
**Timezone :** Africa/Lome  
**Langue :** Français (fr-FR)  

**Packages clés :**
- `djangorestframework` — REST API
- `djangorestframework-simplejwt` — Authentification JWT
- `django-cors-headers` — CORS (actuellement tous les origines autorisées)
- `django-filter` — Filtrage des requêtes

---

## Authentification

### 1. Connexion (Obtenir token JWT)

**Endpoint :** `POST /auth/login/`  
**Authentification requise :** Non  
**Description :** Génère un token d'accès (et de rafraîchissement) pour un utilisateur.

**Requête :**

```json
{
  "email": "employe@mairie-lome.tg",
  "password": "motdepasse123"
}
```

**Réponse (200 OK) :**

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs :**
- `401 Unauthorized` — Email ou mot de passe invalide

**Détails JWT :**
- **Durée de vie du token d'accès :** 1 heure
- **Durée de vie du refresh token :** 7 jours
- **Algorithme :** HS256
- **Header type :** Bearer

---

### 2. Rafraîchir le token

**Endpoint :** `POST /auth/refresh/`  
**Authentification requise :** Non  
**Description :** Utilise un refresh token pour obtenir un nouveau token d'accès.

**Requête :**

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse (200 OK) :**

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs :**
- `401 Unauthorized` — Refresh token expiré ou invalide

---

## Ressources

---

## Utilisateurs

### 1. Créer un compte (Enregistrement)

**Endpoint :** `POST /utilisateurs/register/`  
**Authentification requise :** Non  
**Description :** Enregistre un nouvel utilisateur (employé ou gardien).

**Requête :**

```json
{
  "email": "nouveau.gardien@mairie-lome.tg",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "gardien",
  "salle": 1,
  "password": "motdepasse123"
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `email` | string | Oui | Email unique de l'utilisateur |
| `nom` | string | Oui | Nom de famille |
| `prenom` | string | Non | Prénom |
| `role` | enum | Oui | `"employe_municipal"` ou `"gardien"` |
| `salle` | int (Salle ID) | Conditionnels | Requis si `role="gardien"` |
| `password` | string | Oui | Mot de passe (minimum recommandé : 8 caractères) |

**Réponse (201 Created) :**

```json
{
  "id": 15,
  "email": "nouveau.gardien@mairie-lome.tg",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "gardien",
  "salle": 1,
  "actif": true
}
```

**Erreurs :**
- `400 Bad Request` — Email déjà existant, ou salle manquante pour un gardien
- `404 Not Found` — Salle non trouvée (si `salle_id` invalide)

---

### 2. Récupérer les infos de l'utilisateur connecté

**Endpoint :** `GET /utilisateurs/me/`  
**Authentification requise :** Oui  
**Description :** Retourne les données du compte actuel (identifié par le token JWT).

**Requête :**

```
GET /utilisateurs/me/
Authorization: Bearer <access_token>
```

**Réponse (200 OK) :**

```json
{
  "id": 1,
  "nom": "Lefevre",
  "prenom": "Marie",
  "email": "marie.lefevre@mairie-lome.tg",
  "role": "employe_municipal",
  "salle": null
}
```

**Erreurs :**
- `401 Unauthorized` — Token invalide ou expiré

---

## Salles

### 1. Lister toutes les salles (Public)

**Endpoint :** `GET /salles/`  
**Authentification requise :** Non  
**Description :** Retourne la liste complète des salles avec leurs équipements. Accessible au portail public.

**Requête :**

```
GET /salles/
```

**Réponse (200 OK) :**

```json
[
  {
    "id": 1,
    "nom": "Salle des fêtes centrale",
    "adresse": "10 rue de l'Indépendance, Lomé",
    "surface_m2": "250.00",
    "capacite_min": 50,
    "capacite_max": 200,
    "est_payante": true,
    "a_gardien": true,
    "prix_heure": "50000.00",
    "appareils_fixes": ["Chaises", "Tables"],
    "appareils_louables": [
      {
        "id": 3,
        "nom": "Projecteur",
        "prix": "15000.00"
      }
    ]
  },
  {
    "id": 2,
    "nom": "Salle de formation",
    "adresse": "5 avenue de la Mairie, Lomé",
    "surface_m2": "120.00",
    "capacite_min": 20,
    "capacite_max": 80,
    "est_payante": false,
    "a_gardien": false,
    "prix_heure": null,
    "appareils_fixes": ["Tableau blanc"],
    "appareils_louables": []
  }
]
```

**Filtres :**
- Aucun filtrage implémenté actuellement

---

### 2. Consulter une salle (Public)

**Endpoint :** `GET /salles/{id}/`  
**Authentification requise :** Non  
**Description :** Retourne les détails complets d'une salle spécifique.

**Requête :**

```
GET /salles/1/
```

**Réponse (200 OK) :**

```json
{
  "id": 1,
  "nom": "Salle des fêtes centrale",
  "adresse": "10 rue de l'Indépendance, Lomé",
  "surface_m2": "250.00",
  "capacite_min": 50,
  "capacite_max": 200,
  "est_payante": true,
  "a_gardien": true,
  "prix_heure": "50000.00",
  "appareils_fixes": ["Chaises", "Tables"],
  "appareils_louables": [
    {
      "id": 3,
      "nom": "Projecteur",
      "prix": "15000.00"
    }
  ]
}
```

**Erreurs :**
- `404 Not Found` — Salle non trouvée

---

### 3. Créer une salle (Employé municipal)

**Endpoint :** `POST /salles/create/`  
**Authentification requise :** Oui  
**Rôle requis :** `employe_municipal`  
**Description :** Ajoute une nouvelle salle au répertoire.

**Requête :**

```json
{
  "nom": "Salle Bandabas",
  "adresse": "15 boulevard de la République, Lomé",
  "surface_m2": 180,
  "capacite_min": 40,
  "capacite_max": 150,
  "est_payante": true,
  "a_gardien": true,
  "prix_heure": 40000
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `nom` | string | Oui | Nom de la salle |
| `adresse` | string | Oui | Adresse complète |
| `surface_m2` | decimal | Oui | Surface en mètres carrés |
| `capacite_min` | int | Oui | Capacité minimale |
| `capacite_max` | int | Oui | Capacité maximale |
| `est_payante` | bool | Oui | La salle est payante |
| `a_gardien` | bool | Oui | La salle dispose d'un gardien |
| `prix_heure` | decimal | Conditionnels | Requis si `est_payante=true` |

**Réponse (201 Created) :**

```json
{
  "id": 5,
  "nom": "Salle Bandabas",
  "adresse": "15 boulevard de la République, Lomé",
  "surface_m2": "180.00",
  "capacite_min": 40,
  "capacite_max": 150,
  "est_payante": true,
  "a_gardien": true,
  "prix_heure": "40000.00",
  "appareils_fixes": [],
  "appareils_louables": []
}
```

**Erreurs :**
- `400 Bad Request` — `capacite_min > capacite_max`, ou prix manquant pour salle payante
- `401 Unauthorized` — Non authentifié

---

### 4. Planning des salles (Public)

**Endpoint :** `GET /salles/planning/`  
**Authentification requise :** Non  
**Description :** Retourne l'état occupé/libre de chaque salle pour une plage de dates. Utilisé pour le portail public.

**Requête :**

```
GET /salles/planning/?date_debut=2026-06-20T08:00:00Z&date_fin=2026-06-20T18:00:00Z
```

**Paramètres de query :**
| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `date_debut` | datetime (ISO) | Oui | Début de la plage (format : `2026-06-20T08:00:00Z`) |
| `date_fin` | datetime (ISO) | Oui | Fin de la plage |

**Réponse (200 OK) :**

```json
[
  {
    "id": 1,
    "nom": "Salle des fêtes centrale",
    "est_libre": true
  },
  {
    "id": 2,
    "nom": "Salle de formation",
    "est_libre": false
  }
]
```

**Logique :**
- Une salle est considérée comme **occupée** (`est_libre: false`) si une demande acceptée existe qui chevauche la plage.

**Erreurs :**
- `400 Bad Request` — Paramètres `date_debut` ou `date_fin` manquants/invalides

---

## Demandes de réservation

### 1. Créer une demande de réservation (Public)

**Endpoint :** `POST /reservations/`  
**Authentification requise :** Non  
**Description :** Permet à un visiteur public ou une organisation de déposer une demande de réservation.

**Requête :**

```json
{
  "salle": 1,
  "demandeur_nom": "Traore",
  "demandeur_email": "contact@asso-traore.tg",
  "type_demandeur": "organisation",
  "nom_manifestation": "Séminaire de formation",
  "nb_personnes": 85,
  "date_debut": "2026-07-15T09:00:00Z",
  "date_fin": "2026-07-15T17:00:00Z",
  "appareil_ids": [3, 5]
}
```

**Champs :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `salle` | int | Oui | ID de la salle |
| `demandeur_nom` | string | Oui | Nom du demandeur |
| `demandeur_email` | email | Oui | Email de contact |
| `type_demandeur` | enum | Oui | `"particulier"` ou `"organisation"` |
| `nom_manifestation` | string | Oui | Titre/objet de l'événement |
| `nb_personnes` | int | Oui | Nombre de participants attendus |
| `date_debut` | datetime | Oui | Début (ISO 8601) |
| `date_fin` | datetime | Oui | Fin (ISO 8601) |
| `appareil_ids` | list[int] | Non | IDs des équipements louables |

**Validations :**
- `nb_personnes` doit être entre `salle.capacite_min` et `salle.capacite_max`
- Le créneau `[date_debut, date_fin]` ne doit pas chevaucher une demande acceptée existante
- `date_fin` doit être > `date_debut`
- Les `appareil_ids` doivent être louables pour cette salle

**Réponse (201 Created) :**

```json
{
  "id": 234,
  "salle": 1,
  "salle_nom": "Salle des fêtes centrale",
  "demandeur_nom": "Traore",
  "demandeur_email": "contact@asso-traore.tg",
  "type_demandeur": "organisation",
  "nom_manifestation": "Séminaire de formation",
  "nb_personnes": 85,
  "date_debut": "2026-07-15T09:00:00Z",
  "date_fin": "2026-07-15T17:00:00Z",
  "statut": "en_attente",
  "raison_refus": null,
  "prix_total": "45000.00",
  "date_soumission": "2026-06-19T14:32:00Z"
}
```

**Calcul du prix :**
- Pour une salle payante ET un particulier : `prix_heure * duree_heures`
- Pour chaque appareil louable : `appareil.prix_location` (additif)
- Pour une organisation : pas de tarification salle, uniquement équipements
- Arrondi à 2 décimales

**Erreurs :**
- `400 Bad Request` — Validation échouée (capacité, créneau, dates)
- `404 Not Found` — Salle ou appareil non trouvé

---

### 2. Lister les demandes (Espace staff)

**Endpoint :** `GET /reservations/list/`  
**Authentification requise :** Oui  
**Description :** Retourne les demandes de réservation. Accès limité selon le rôle.

**Requête :**

```
GET /reservations/list/?statut=en_attente
Authorization: Bearer <access_token>
```

**Paramètres de query :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `statut` | enum | Optionnel : `"en_attente"`, `"acceptee"`, `"refusee"` |

**Contrôle d'accès :**
- **Employé municipal** : Voir toutes les demandes
- **Gardien** : Voir uniquement les demandes de sa salle
- **Autres** : Accès interdit (`403 Forbidden`)

**Réponse (200 OK) :**

```json
[
  {
    "id": 234,
    "salle": 1,
    "salle_nom": "Salle des fêtes centrale",
    "demandeur_nom": "Traore",
    "demandeur_email": "contact@asso-traore.tg",
    "type_demandeur": "organisation",
    "nom_manifestation": "Séminaire de formation",
    "nb_personnes": 85,
    "date_debut": "2026-07-15T09:00:00Z",
    "date_fin": "2026-07-15T17:00:00Z",
    "statut": "en_attente",
    "raison_refus": null,
    "prix_total": "45000.00",
    "date_soumission": "2026-06-19T14:32:00Z"
  }
]
```

**Erreurs :**
- `401 Unauthorized` — Non authentifié
- `403 Forbidden` — Pas de permission (ni employé ni gardien)

---

### 3. Traiter une demande (Employé municipal)

**Endpoint :** `PATCH /reservations/{id}/traiter/`  
**Authentification requise :** Oui  
**Rôle requis :** `employe_municipal`  
**Description :** Accepte ou refuse une demande. Créé un suivi des clés si acceptée.

**Requête :**

```json
{
  "statut": "acceptee"
}
```

Ou pour un refus :

```json
{
  "statut": "refusee",
  "raison_refus": "Salle déjà réservée sur cette date."
}
```

**Champs :**
| Champ | Type | Requis | Condition |
|-------|------|--------|-----------|
| `statut` | enum | Oui | `"acceptee"` ou `"refusee"` |
| `raison_refus` | string | Oui si refusée | Requis si `statut="refusee"` |

**Logique métier :**
1. La demande doit avoir le statut `en_attente`
2. Si acceptée :
   - Crée un enregistrement `SuiviCles` avec `date_remise_prevue = demande.date_debut`
   - Envoie un email de confirmation au demandeur
3. Si refusée :
   - Annule tous les matériels associés (`StatutMateriel.ANNULE`)
   - Envoie un email de refus au demandeur
4. Enregistre l'employé qui a traité + timestamp

**Réponse (200 OK) :**

```json
{
  "id": 234,
  "salle": 1,
  "salle_nom": "Salle des fêtes centrale",
  "demandeur_nom": "Traore",
  "demandeur_email": "contact@asso-traore.tg",
  "type_demandeur": "organisation",
  "nom_manifestation": "Séminaire de formation",
  "nb_personnes": 85,
  "date_debut": "2026-07-15T09:00:00Z",
  "date_fin": "2026-07-15T17:00:00Z",
  "statut": "acceptee",
  "raison_refus": null,
  "prix_total": "45000.00",
  "date_soumission": "2026-06-19T14:32:00Z"
}
```

**Erreurs :**
- `400 Bad Request` — Demande déjà traitée, ou raison_refus manquante pour refus
- `401 Unauthorized` — Non authentifié
- `403 Forbidden` — Non employé municipal
- `404 Not Found` — Demande non trouvée

---

## Suivi des clés

### 1. Consulter le suivi des clés

**Endpoint :** `GET /reservations/{id}/suivi/`  
**Authentification requise :** Oui  
**Description :** Retourne les infos de remise/restitution des clés et paiement pour une demande acceptée.

**Requête :**

```
GET /reservations/234/suivi/
Authorization: Bearer <access_token>
```

**Réponse (200 OK) :**

```json
{
  "id": 89,
  "demande": 234,
  "date_remise_prevue": "2026-07-15T09:00:00Z",
  "date_remise_reelle": null,
  "paiement_effectue": false,
  "montant_paye": null,
  "date_restitution_prevue": "2026-07-15T17:00:00Z",
  "date_restitution_reelle": null,
  "cles_rendues": null,
  "rappel_envoye": false
}
```

**Erreurs :**
- `404 Not Found` — Demande non trouvée ou pas de suivi (demande non acceptée)
- `401 Unauthorized` — Non authentifié

---

### 2. Mettre à jour le suivi des clés

**Endpoint :** `PATCH /reservations/{id}/suivi/`  
**Authentification requise :** Oui  
**Description :** Enregistre la remise, restitution et paiement des clés.

**Requête :**

```json
{
  "date_remise_reelle": "2026-07-15T08:45:00Z",
  "paiement_effectue": true,
  "montant_paye": "45000.00"
}
```

Ou plus tard :

```json
{
  "date_restitution_reelle": "2026-07-15T17:30:00Z",
  "cles_rendues": true
}
```

**Champs (tous optionnels en PATCH) :**
| Champ | Type | Description |
|-------|------|-------------|
| `date_remise_reelle` | datetime | Moment réel de remise des clés |
| `date_restitution_reelle` | datetime | Moment réel de restitution |
| `paiement_effectue` | bool | Paiement enregistré |
| `montant_paye` | decimal | Montant payé |
| `cles_rendues` | bool | Clés rendues ou non |

**Logique métier :**
- Si `cles_rendues = false` et `rappel_envoye = false` → envoie un email de rappel et marque `rappel_envoye = true`
- Enregistre l'utilisateur qui effectue la mise à jour

**Réponse (200 OK) :**

```json
{
  "id": 89,
  "demande": 234,
  "date_remise_prevue": "2026-07-15T09:00:00Z",
  "date_remise_reelle": "2026-07-15T08:45:00Z",
  "paiement_effectue": true,
  "montant_paye": "45000.00",
  "date_restitution_prevue": "2026-07-15T17:00:00Z",
  "date_restitution_reelle": null,
  "cles_rendues": null,
  "rappel_envoye": false
}
```

**Erreurs :**
- `400 Bad Request` — Données invalides
- `404 Not Found` — Suivi non trouvé
- `401 Unauthorized` — Non authentifié

---

## Codes de statut HTTP

| Code | Signification | Cas d'usage |
|------|---------------|-----------|
| `200 OK` | Requête réussie | GET, PATCH avec succès |
| `201 Created` | Ressource créée | POST avec succès |
| `204 No Content` | Pas de contenu | Suppression réussie (si implémentée) |
| `400 Bad Request` | Erreur de validation | Données manquantes/invalides |
| `401 Unauthorized` | Non authentifié | Token manquant/expiré |
| `403 Forbidden` | Permission insuffisante | Rôle non autorisé |
| `404 Not Found` | Ressource introuvable | ID invalide |
| `500 Internal Server Error` | Erreur serveur | Bug système |

---

## Énumérés (Choices)

### RôleChoices (Utilisateur)

| Valeur | Label | Description |
|--------|-------|-------------|
| `employe_municipal` | Employé municipal | Traite les demandes, gère les salles |
| `gardien` | Gardien | Enregistre remise/restitution des clés, voit sa salle |

### TypeDemandeur

| Valeur | Label |
|--------|-------|
| `particulier` | Particulier |
| `organisation` | Organisation |

### StatutDemande

| Valeur | Label | Signification |
|--------|-------|---------------|
| `en_attente` | En attente | Demande soumise, en attente de traitement |
| `acceptee` | Acceptée | Demande validée, réservation confirmée |
| `refusee` | Refusée | Demande rejetée (raison enregistrée) |

### StatutMateriel

| Valeur | Label |
|--------|-------|
| `confirme` | Confirmé |
| `annule` | Annulé |

---

## Mapping Frontend/Backend

Ce tableau montre comment les pages/sections frontend consomment les endpoints.

| Page/Section | Endpoint(s) | Méthode(s) | Authentification |
|--------------|-------------|-----------|------------------|
| **Portail Public** | | | |
| · Planning des salles | `GET /salles/planning/` | GET | Non |
| · Liste des salles | `GET /salles/` | GET | Non |
| · Détail salle | `GET /salles/{id}/` | GET | Non |
| · Formulaire réservation | `POST /reservations/` | POST | Non |
| **Authentification** | | | |
| · Connexion | `POST /auth/login/` | POST | Non |
| · Rafraîchissement token | `POST /auth/refresh/` | POST | Non |
| · Mon profil | `GET /utilisateurs/me/` | GET | Oui |
| **Espace Employé Municipal** | | | |
| · Tableau de bord demandes | `GET /reservations/list/` | GET | Oui |
| · Filtrer par statut | `GET /reservations/list/?statut=X` | GET | Oui |
| · Détail demande & traitement | `PATCH /reservations/{id}/traiter/` | PATCH | Oui |
| · Suivi clés | `GET /reservations/{id}/suivi/` | GET | Oui |
| · Mise à jour suivi clés | `PATCH /reservations/{id}/suivi/` | PATCH | Oui |
| · Créer salle | `POST /salles/create/` | POST | Oui |
| **Espace Gardien** | | | |
| · Planning de sa salle | `GET /reservations/list/?statut=acceptee` | GET | Oui |
| · Suivi clés (sa salle) | `GET /reservations/{id}/suivi/` | GET | Oui |
| · Enregistrer remise/restitution | `PATCH /reservations/{id}/suivi/` | PATCH | Oui |

---

## Exemples de flux complet

### Flux 1 : Demande de réservation (Visiteur public)

```
1. GET /salles/
   → Affiche la liste des salles disponibles

2. GET /salles/planning/?date_debut=...&date_fin=...
   → Montre quelles salles sont libres sur la date

3. GET /salles/{id}/
   → Affiche détails complets + équipements louables

4. POST /reservations/
   {salle, demandeur_nom, ..., date_debut, date_fin, appareil_ids}
   → Crée la demande (statut: "en_attente")
   → Envoie confirmation email (futur)
```

### Flux 2 : Traitement (Employé municipal)

```
1. POST /auth/login/
   → Obtient token JWT

2. GET /utilisateurs/me/
   → Vérifie role = "employe_municipal"

3. GET /reservations/list/
   → Liste toutes les demandes en attente

4. PATCH /reservations/{id}/traiter/
   {statut: "acceptee"}
   → Crée SuiviCles, envoie email confirmation
   → Demande peut maintenant être vue dans planning

5. PATCH /reservations/{id}/suivi/
   {date_remise_reelle, paiement_effectue, montant_paye}
   → Enregistre paiement et remise des clés
```

### Flux 3 : Suivi des clés (Gardien)

```
1. POST /auth/login/
   → Obtient token JWT

2. GET /utilisateurs/me/
   → Vérifie role = "gardien", récupère salle assignée

3. GET /reservations/list/?statut=acceptee
   → Voit uniquement les réservations acceptées de sa salle

4. GET /reservations/{id}/suivi/
   → Vérifie état remise/restitution des clés

5. PATCH /reservations/{id}/suivi/
   {date_restitution_reelle: "...", cles_rendues: true}
   → Enregistre la restitution
```

---

## Notes d'implémentation

### Emails

Les emails suivants sont envoyés automatiquement :

1. **Confirmation de demande** (non encore implémenté) — Lorsqu'une demande est soumise
2. **Décision** — Lorsqu'une demande est acceptée/refusée (implémenté, voir `envoyer_email_decision`)
3. **Rappel clés** — Lorsqu'un gardien signale que les clés n'ont pas été rendues (implémenté, voir `envoyer_rappel_cles`)

En développement, les emails sont envoyés à la console (voir `settings.py : EMAIL_BACKEND`).

### Validation métier

- **Créneau libre :** Vérifié lors de la création de demande et du traitement
- **Capacité salle :** Vérifiée lors de la création de demande
- **Prix :** Calculé automatiquement selon la salle, type demandeur et appareils
- **Permissions :** Vérifiées pour chaque endpoint selon le rôle

### Performance

- Utilisation de `select_related()` et `prefetch_related()` pour réduire les requêtes DB
- Indexation sur `statut`, `date_debut`, `date_fin` recommandée pour les requêtes de planning
- Pagination non implémentée actuellement (à ajouter pour listes volumineuses)

### Sécurité

- **CORS :** Actuellement accepte tous les origines (`CORS_ALLOW_ALL_ORIGINS = True`) — À restreindre en production
- **JWT :** Token d'accès expire après 1 heure
- **Authentification :** Obligatoire pour tous les endpoints staff/gardien
- **Base de données :** PostgreSQL avec UTF-8 natif

---

**Document généré le 19 juin 2026**  
Pour toute question, se référer aux sources : `/backend/apps/*/views.py`, `/backend/apps/*/serializers.py`
