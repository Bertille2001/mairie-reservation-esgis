# Fonctionnalités & pages frontend

Spécification des écrans à implémenter pour l'application de réservation des salles municipales — Mairie de Lomé.

**Sources :** [Gestion_mairie.pdf](../../Gestion_mairie.pdf), cahier des charges DK Technologies  
**API backend :** [api_reference.md](../../docs/api_reference.md)  
**Design :** [DESIGN.md](../DESIGN.md) · [PRODUCT.md](../PRODUCT.md)

---

## 1. Vue d'ensemble

Application web en **3 espaces** :

| Espace | Accès | Objectif |
|--------|-------|----------|
| Portail public | Sans login | Consulter planning, fiches salles, déposer une demande |
| Employé municipal | JWT | Traiter demandes, gérer réservations, clés et paiements |
| Gardien de salle | JWT | Planning de sa salle, suivi remise/restitution clés |

**Stack :** Next.js 16 · coss ui · API Django `http://localhost:8000/api`

---

## 2. Profils utilisateurs

### Visiteur public
- Borne hall mairie ou navigateur personnel
- Voit planning **libre / occupé** uniquement (pas de nom, pas de motif)
- Dépose une demande, reçoit confirmation par e-mail après traitement

### Employé municipal
- Login e-mail / mot de passe
- Voit **toutes** les demandes et salles
- Accepte ou refuse (raison obligatoire si refus)
- Modifie / annule réservations acceptées
- Enregistre remise clés, paiement, restitution

### Gardien de salle
- Login e-mail / mot de passe
- Voit le planning **de sa salle uniquement**
- Enregistre remise et restitution des clés pour sa salle
- Ne traite pas les demandes de réservation

---

## 3. Pages & routes

| Route | Statut | Profil | Description |
|-------|--------|--------|-------------|
| `/` | ✅ Fait | Public | Accueil, liens vers les espaces |
| `/planning` | À faire | Public | Grille planning libre/occupé |
| `/salles` | À faire | Public | Liste des salles |
| `/salles/[id]` | À faire | Public | Fiche salle + appareils |
| `/planning/demande` | À faire | Public | Formulaire de demande |
| `/planning/demande/confirmation` | À faire | Public | Récap après soumission |
| `/connexion` | À faire | Employé / Gardien | Login JWT |
| `/employe` | À faire | Employé | Dashboard demandes en attente |
| `/employe/demandes/[id]` | À faire | Employé | Détail + accepter/refuser |
| `/employe/reservations` | À faire | Employé | Réservations acceptées |
| `/employe/reservations/[id]` | À faire | Employé | Détail + suivi clés/paiement |
| `/employe/salles/nouvelle` | À faire | Employé | Création salle (optionnel phase 2) |
| `/gardien` | ✅ Fait | Gardien | Liste réservations acceptées de sa salle |
| `/gardien/reservations/[id]` | ✅ Fait | Gardien | Suivi remise/restitution clés |

---

## 4. Fonctionnalités par page

### `/` — Accueil ✅
- Présentation du service, liens vers planning et espaces connectés
- Légende libre / occupé

### `/planning` — Planning public
**API :** `GET /salles/planning/?date_debut=&date_fin=`

- Grille salles × créneaux (jour / semaine)
- Cellules : **Libre** ou **Occupé** — jamais nom du demandeur ni manifestation
- Filtres : période, salle (optionnel)
- Lien « Déposer une demande » vers `/planning/demande`
- Clic sur salle → `/salles/[id]`

**États UI :** skeleton chargement, empty state, erreur réseau

### `/salles` — Liste des salles
**API :** `GET /salles/`

- Cartes : nom, adresse, capacité min/max, payante ou non
- Lien vers fiche et vers demande

### `/salles/[id]` — Fiche salle
**API :** `GET /salles/{id}/`

- Nom, adresse, surface, capacité min/max
- Liste appareils fixes (nom seul)
- Appareils louables avec prix
- Bouton « Réserver cette salle » → `/planning/demande?salle={id}`

### `/planning/demande` — Formulaire demande
**API :** `GET /salles/`, `GET /salles/{id}/`, `POST /reservations/`

**Champs :**
| Champ | Type | Obligatoire |
|-------|------|-------------|
| Salle | select | Oui |
| Date/heure début | datetime | Oui |
| Date/heure fin | datetime | Oui |
| Nom manifestation | text | Oui |
| Nombre de personnes | number | Oui |
| Nom demandeur / organisation | text | Oui |
| E-mail contact | email | Oui |
| Type demandeur | particulier / organisation | Oui |
| Matériel supplémentaire | checkboxes (par salle) | Non |

**Comportement :**
- Prix total calculé en temps réel (salle si payante + matériel)
- Erreurs **inline** si créneau indisponible ou capacité hors min/max
- Soumission → redirection confirmation avec numéro de demande
- Une demande déposée n'est **plus modifiable** par le visiteur

### `/connexion`
**API :** `POST /auth/login/`, `GET /utilisateurs/me/`

- Formulaire e-mail + mot de passe
- Redirection selon rôle : `/employe` ou `/gardien`
- Stockage token (access + refresh)

### `/employe` — File des demandes
**API :** `GET /reservations/list/?statut=en_attente`

- Table : date, salle, demandeur, manifestation, statut, prix
- Filtres : statut, salle, date
- Clic → `/employe/demandes/[id]`

### `/employe/demandes/[id]` — Traitement
**API :** `GET /reservations/list/`, `PATCH /reservations/{id}/traiter/`

- Détail complet de la demande
- Actions : **Accepter** / **Refuser**
- Si refus : textarea **raison obligatoire**
- E-mail automatique au demandeur (backend)

### `/employe/reservations/[id]` — Suivi clés & paiement
**API :** `GET /reservations/{id}/suivi/`, `PATCH /reservations/{id}/suivi/`

- Enregistrer remise des clés (date/heure)
- Enregistrer paiement (montant, effectué oui/non)
- Enregistrer restitution des clés
- Signaler retard → e-mail rappel (backend)

### `/gardien` — Réservations de la salle ✅

**API :** `GET /utilisateurs/me/`, `GET /reservations/list/?statut=acceptee`, `GET /reservations/{id}/suivi/`

- Liste filtrée par la salle assignée au gardien (côté API)
- Filtres : À venir / Aujourd'hui / Toutes
- Badge statut clés (remise à faire, en cours, retard, terminé)
- Alerte si restitutions en retard
- Clic → `/gardien/reservations/[id]`

### `/gardien/reservations/[id]` — Suivi clés ✅

**API :** `GET /reservations/{id}/suivi/`, `PATCH /reservations/{id}/suivi/`

- Remise et restitution des clés (sans section paiement)
- Signalement explicite d'un retard de restitution
- Toasts de confirmation et d'erreur

---

## 5. Règles métier

### Confidentialité (portail public)
- Planning : **libre / occupé** uniquement
- Jamais afficher : nom demandeur, organisation, motif de manifestation

### Validations demande
- Créneau entièrement libre (pas de chevauchement avec demandes acceptées)
- `capacite_min ≤ nb_personnes ≤ capacite_max`
- Matériel louable uniquement si disponible pour la salle choisie
- Pas de location matériel sans réservation de salle

### Prix
- Salle payante **uniquement pour les particuliers**
- Total = prix salle (si applicable) + somme locations matériel
- Afficher le total **avant** soumission

### Traitement employé
- Refus : raison obligatoire, demande conservée à titre informatif
- Acceptation : e-mail avec consignes remise clés (date, heure, adresse)
- Clés remises à la mairie sauf si salle avec gardien → adresse de la salle
- Matériel remis avec les clés, restitué en même temps

### Matériel
- Si demande salle refusée → matériel associé annulé automatiquement
- Si appareil indisponible → retiré, demandeur informé par e-mail de confirmation

---

## 6. Phases de développement

### Phase 1 — Portail public (priorité)
1. `/planning` — grille + API planning
2. `/salles` + `/salles/[id]`
3. `/planning/demande` + confirmation

### Phase 2 — Authentification & employé
4. `/connexion` + gestion JWT
5. `/employe` + `/employe/demandes/[id]`
6. `/employe/reservations/[id]` — suivi clés

### Phase 3 — Gardien & finitions
7. `/gardien` + `/gardien/reservations/[id]` ✅
8. Empty states, toasts erreurs, responsive borne hall ✅
9. Tests E2E parcours complet (à faire)

---

## 7. Composants coss ui recommandés

| Besoin | Composants |
|--------|------------|
| Planning | `Table`, `Badge`, `Calendar` |
| Formulaire | `Form`, `Input`, `Select`, `Textarea`, `Checkbox` |
| Employé | `Table`, `Dialog`, `Sheet`, `Tabs` |
| Feedback | `Alert`, `Toast`, `Skeleton` |

Voir [AGENTS.md](../AGENTS.md) pour les conventions UI.
