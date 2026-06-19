---
name: Mairie Lomé — Réservation salles
description: Interface utilitaire institutionnelle pour la gestion des salles municipales
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.21 0.012 18)"
  card: "oklch(0.985 0.004 18)"
  card-foreground: "oklch(0.21 0.012 18)"
  primary: "oklch(0.45 0.12 250)"
  primary-foreground: "oklch(0.99 0 0)"
  secondary: "oklch(0.96 0.006 18)"
  secondary-foreground: "oklch(0.28 0.014 18)"
  muted: "oklch(0.96 0.006 18)"
  muted-foreground: "oklch(0.45 0.018 18)"
  accent: "oklch(0.94 0.025 250)"
  accent-foreground: "oklch(0.32 0.06 250)"
  destructive: "oklch(0.55 0.22 25)"
  destructive-foreground: "oklch(0.99 0 0)"
  border: "oklch(0.91 0.006 18)"
  input: "oklch(0.91 0.006 18)"
  ring: "oklch(0.45 0.12 250)"
  success-bg: "oklch(0.95 0.03 145)"
  success-fg: "oklch(0.38 0.08 145)"
  warning-bg: "oklch(0.96 0.04 85)"
  warning-fg: "oklch(0.42 0.1 85)"
  info-bg: "oklch(0.95 0.03 250)"
  info-fg: "oklch(0.38 0.08 250)"
  planning-libre: "oklch(0.95 0.03 145)"
  planning-libre-fg: "oklch(0.38 0.08 145)"
  planning-occupe: "oklch(0.94 0.04 18)"
  planning-occupe-fg: "oklch(0.45 0.12 18)"
typography:
  display:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  mono:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  page: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "oklch(0.42 0.14 145)"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  badge-status:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "9999px"
    padding: "2px 10px"
---

<!-- SEED -->

## Overview

**Le Guichet Numérique** — Interface product utilitaire pour une mairie : fond blanc pur, couleur institutionnelle **bleu administratif** (`oklch(0.45 0.12 250)`), typographie Geist Sans, composants **coss ui** sans personnalisation excessive.

Stratégie couleur **Restrained** : le vert primaire porte l’identité (CTA, liens, focus ring) ; le reste est neutre discret teinté légèrement vers le vert. **Pas de dark mode** — usage bureau et borne en journée uniquement.

Surfaces principales :
- **Portail public** (`/`) — planning, fiches salle, formulaire demande
- **Espace employé** (`/employe/*`) — file de demandes, détail, clés/paiements
- **Espace gardien** (`/gardien/*`) — planning mono-salle, suivi clés

## Colors

Palette OKLCH (source de vérité). Les variables coss ui dans `frontend/app/globals.css` mappent ces valeurs.

| Rôle | Token CSS | Valeur OKLCH | Usage |
|------|-----------|--------------|-------|
| Fond page | `--background` | `oklch(1 0 0)` | Blanc pur |
| Primaire | `--primary` | `oklch(0.45 0.12 250)` | CTA, liens actifs, ring focus |
| Texte principal | `--foreground` | `oklch(0.21 0.008 250)` | Corps, titres |
| Surface carte | `--card` | `oklch(0.985 0.004 250)` | Cartes, panneaux |
| Texte sur primaire | `--primary-foreground` | `oklch(0.99 0 0)` | Boutons remplis |
| Secondaire | `--secondary` | `oklch(0.96 0.006 250)` | Fond bouton ghost/secondary |
| Texte atténué | `--muted-foreground` | `oklch(0.45 0.016 250)` | Métadonnées, hints |
| Accent | `--accent` | `oklch(0.94 0.02 250)` | Survol lignes, sélection légère |
| Bordure | `--border` | `oklch(0.91 0.006 250)` | Séparateurs, inputs |
| Destructif | `--destructive` | `oklch(0.55 0.22 25)` | Refus, suppression, erreur bloquante |

**Sémantique métier** (badges planning & statuts demande) :

| État | Fond | Texte | Contexte |
|------|------|-------|----------|
| Libre | `--planning-libre` | `--planning-libre-fg` | Créneau disponible |
| Occupé | `--planning-occupe` | `--planning-occupe-fg` | Créneau réservé (sans détail) — neutre chaud, distinct du vert primaire |
| En attente | `--warning-bg` | `--warning-fg` | Demande non traitée |
| Acceptée | `--success-bg` | `--success-fg` | Réservation confirmée |
| Refusée | `--destructive` + 15% opacity bg | `--destructive` | Demande rejetée |
| Retard clés | `--warning-bg` | `--warning-fg` | Alerte restitution |

Règle texte sur fond saturé : **texte blanc** sur `--primary` et `--destructive` remplis ; texte foncé uniquement sur fonds pâles (L > 0.85).

## Typography

- **Une seule famille UI** : Geist Sans (`--font-geist-sans`) pour tout — titres, labels, corps, boutons.
- **Geist Mono** (`--font-geist-mono`) : références, prix, horaires, IDs demande.
- **Échelle fixe rem** (pas de clamp fluide) :

| Niveau | Taille | Poids | Usage |
|--------|--------|-------|-------|
| Display | 2rem (32px) | 600 | Titre de page |
| Headline | 1.5rem (24px) | 600 | Sections |
| Title | 1.125rem (18px) | 600 | Cartes, dialogs |
| Body | 0.9375rem (15px) | 400 | Texte courant |
| Label | 0.8125rem (13px) | 500 | Labels formulaire, badges |
| Mono | 0.8125rem (13px) | 400 | Données tabulaires |

- `text-wrap: balance` sur h1–h2 ; line-height corps 1.6 ; max-width prose 65ch.
- Langue UI : **français** ; `lang="fr"` sur `<html>`.

## Elevation

Approche **grouped moderée** — panneaux blancs sur fond légèrement grisé, coins arrondis discrets (pas pill), ombre légère.

| Token | Valeur | Usage |
|-------|--------|-------|
| `--background` | `oklch(0.975 0.004 250)` | Fond page (gris très léger) |
| `--surface-elevated` | `oklch(1 0 0)` | Panneaux, listes groupées |
| `--surface-grouped` | `oklch(0.97 0.004 250)` | Fond interne (calendrier, inputs) |
| `--shadow-panel` | diffuse légère | Panneaux `rounded-xl` |
| `--radius` | `0.625rem` (10px) | Base — entre institutionnel (6px) et Apple exagéré (20px) |
| `--radius-panel` | `0.875rem` (14px) | Panneaux principaux |

- **Grouped list** : conteneur `rounded-xl border border-border/60`, lignes séparées par `border-b border-border/50`, ligne entière cliquable + chevron.
- **Pas de cards individuelles** pour les listes homogènes (salles, demandes).
- Segmented control : `bg-muted rounded-lg p-1`, segment actif `rounded-md`.
- Inspiration Apple pour la structure (grouped, segmented), pas pour des radius extrêmes.

## Components

### coss ui — obligatoire

Tout composant interactif passe par **coss ui** (`frontend/components/ui/`), installé via le CLI shadcn :

```bash
pnpm dlx shadcn@latest add @coss/<component>
```

Exemples : `@coss/button`, `@coss/form`, `@coss/dialog`, `@coss/select`

Référence agent : `.agents/skills/coss/SKILL.md`

| Besoin projet | Composant coss |
|---------------|------------------|
| CTA, actions | `Button` (default, secondary, destructive, ghost, outline) |
| Formulaire demande | `Form` + `Input`, `Select`, `Textarea`, `Checkbox`, `Calendar` |
| Planning grille | `Table` ou grille custom avec `Badge` |
| Fiche salle | `Card` |
| Accepter/refuser | `Dialog` ou `Sheet` (raison obligatoire si refus) |
| Navigation espaces | `Tabs` ou sidebar avec `Separator` |
| États chargement | `Skeleton` (pas de spinner plein écran) |
| Retours utilisateur | `Alert`, `Toast` (sonner) |
| Statuts demande | `Badge` avec variantes sémantiques |

**Règles composants :**
- `--radius: 0.375rem` (6px) — pas de `rounded-full` sur cartes ou boutons principaux
- Chaque contrôle : états default, hover, focus-visible, disabled, error
- Bouton primaire : `bg-primary text-primary-foreground`, hover assombri (pas de shadow)
- Formulaires : label au-dessus, message d’erreur sous le champ (`FormMessage`)
- Tables employé : densité confortable, colonnes triables, pagination coss

### UX par écran

**Portail public**
1. Planning — grille salles × créneaux ; cellules Libre/Occupé uniquement ; légende claire
2. Fiche salle — nom, adresse, surface, capacité min/max, liste appareils (nom seul)
3. Demande — wizard ou formulaire unique : salle, dates/heures, manifestation, nb personnes, contact, type (particulier/org), matériel optionnel, prix total en temps réel
4. Erreurs inline si créneau indisponible ou capacité hors bornes

**Espace employé**
1. Liste demandes en attente (filtres : date, salle, statut)
2. Détail demande — accepter / refuser (textarea raison si refus)
3. Réservations acceptées — modifier, annuler, enregistrer remise clés + paiement, restitution

**Espace gardien**
1. Planning filtré sur sa salle
2. Actions clés : remise, restitution, signaler retard

### Motion

- Transitions UI : 150–200 ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- Animer `transform` et `opacity` uniquement
- `@media (prefers-reduced-motion: reduce)` : transitions instantanées
- Pas d’animation d’entrée de page orchestrée

### Icônes

- **Lucide React** — stroke 1.5, taille 16–20 px
- Pas d’emojis dans l’UI

## Do's and Don'ts

**Do**
- Utiliser les tokens CSS / classes Tailwind mappées (`bg-primary`, `text-muted-foreground`)
- Tester le contraste des badges sémantiques
- Afficher le prix total avant soumission de demande
- Masquer nom du demandeur et motif sur le planning public
- Prévoir empty states pédagogiques (« Aucune demande en attente »)

**Don't**
- Créer un bouton ou input custom si coss ui existe
- Utiliser des couleurs hex hardcodées dans les composants
- Afficher des données privées sur le portail public
- Ouvrir une modale pour une action réversible simple
- Utiliser Inter, Roboto, ou des gradients décoratifs
- Dépasser 8px de border-radius sur les cartes
