# Gestion des salles municipales — Mairie de Lomé

Application web permettant à la mairie de Lomé de gérer les réservations de ses salles municipales. Les visiteurs peuvent consulter le planning et déposer une demande ; les employés municipaux et les gardiens de salle disposent d’espaces dédiés pour traiter les demandes et suivre les clés.

## Stack

| Couche          | Technologie                |
| --------------- | -------------------------- |
| Base de données | PostgreSQL                 |
| Backend         | Django (Python) + API REST |
| Frontend        | Next.js (React)            |

## Structure du projet

```
mairie-reservation-esgis/
├── backend/     # API Django (salles, réservations, utilisateurs…)
├── frontend/    # Interface Next.js (portail public + espaces connectés)
└── README.md
```

## Installation

**Prérequis :** Git, Node.js (avec pnpm), Python, PostgreSQL.

```bash
git clone git@github.com:Bertille2001/mairie-reservation-esgis.git
cd mairie-reservation-esgis
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Ouvrir [http://localhost:3011](http://localhost:3011).

### Backend

//to complete
