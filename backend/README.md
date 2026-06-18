# Mairie de Lomé — Backend Django REST Framework

Projet de gestion des réservations de salles municipales.  
DK Technologies — 2026

---

## Stack technique

- **Django 5** + **Django REST Framework**
- **PostgreSQL**
- **JWT** (simplejwt)
- **Faker** pour les données de test

---

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/ton-repo/mairie-lome
cd mairie-lome
```

### 2. Créer l'environnement virtuel
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Configurer le fichier .env
```bash
cp .env.example .env
# Ouvrir .env et remplir DB_PASSWORD avec ton mot de passe PostgreSQL
```

### 5. Créer la base de données
```bash
psql -U postgres -c "CREATE DATABASE mairie_lome;"
```

### 6. Créer les tables (migrations)
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Remplir la base avec des données de test
```bash
python manage.py seed
# → 10 000 demandes, 50 salles, ~33 000 lignes au total !
```

### 8. Créer un superuser (admin Django)
```bash
python manage.py createsuperuser
```

### 9. Lancer le serveur
```bash
python manage.py runserver
```

L'API est disponible sur : **http://localhost:8000**

---

## Endpoints de l'API

### Authentification
| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/login/` | Connexion (retourne JWT) |
| POST | `/api/auth/refresh/` | Rafraîchir le token |
| POST | `/api/utilisateurs/register/` | Créer un compte |
| GET  | `/api/utilisateurs/me/` | Infos utilisateur connecté |

### Salles (public)
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/salles/` | Liste des salles |
| GET | `/api/salles/<id>/` | Détail d'une salle |
| GET | `/api/salles/planning/?date_debut=...&date_fin=...` | Planning |

### Réservations
| Méthode | URL | Description |
|---------|-----|-------------|
| POST  | `/api/reservations/` | Déposer une demande (public) |
| GET   | `/api/reservations/list/` | Liste des demandes (staff) |
| PATCH | `/api/reservations/<id>/traiter/` | Accepter / refuser (employé) |
| GET   | `/api/reservations/<id>/suivi/` | Voir suivi des clés (staff) |
| PATCH | `/api/reservations/<id>/suivi/` | Mettre à jour suivi (staff) |

---

## Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Employé municipal | employe1@mairie-lome.tg | mairie2026 |
| Gardien | gardien1@mairie-lome.tg | mairie2026 |

---

## Dump & Restore (pour le cours)

```bash
# Exporter la base
python manage.py dumpdata --indent 2 > backup.json

# Importer sur un autre PC
python manage.py migrate
python manage.py loaddata backup.json
```

---

## Branches Git

```
main        ← production
develop     ← intégration

back/...    ← tes branches backend
front/...   ← branches du binôme React
```

**Règle : ne jamais pousser directement sur main ou develop.**
