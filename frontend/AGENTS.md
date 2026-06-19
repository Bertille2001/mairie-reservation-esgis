<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend — Mairie de Lomé, réservation des salles

Application Next.js 16 (App Router) pour le portail public et les espaces employé / gardien.

## Contexte produit & design

Avant tout travail UI, lire :

- [`PRODUCT.md`](./PRODUCT.md) — utilisateurs, principes UX, anti-patterns
- [`DESIGN.md`](./DESIGN.md) — palette OKLCH, typo, composants, règles par écran
- [`../.agents/skills/coss/SKILL.md`](../.agents/skills/coss/SKILL.md) — skill coss ui (API, migration, particles)

## Stack frontend

- **Next.js 16** + **React 19** + **TypeScript**
- **Tailwind CSS v4** — tokens dans `app/globals.css`
- **coss ui** (Base UI + shadcn CLI) — **obligatoire** pour tout composant interactif
- **Lucide React** — icônes
- **Geist Sans / Geist Mono** — typographie UI

Ajouter un composant coss :

```bash
pnpm dlx shadcn@latest add @coss/<component>
```

Exemples : `@coss/dialog`, `@coss/form`, `@coss/select`, `@coss/toast`

Ne jamais recréer un Button, Input, Dialog, etc. si coss le fournit. Vérifier l'API dans le skill coss avant d'écrire du code.

### Règles coss (migration)

- `asChild` → `render` sur les composants qui le supportent (`Button`, triggers Dialog/Menu…)
- Select : pattern `items` + `SelectPopup` (pas shadcn/Radix tel quel)
- Toast : `toastManager`, pas Sonner
- Préférer les exports stylés coss ; `*Primitive` seulement pour composition avancée
- Particles : s'inspirer de `https://coss.com/ui/particles` pour les patterns complets

## Couleurs

**Primaire (choix validé) : bleu administratif**

| Token | Valeur | Usage |
|-------|--------|-------|
| `--primary` | `oklch(0.45 0.12 250)` | CTA, liens actifs, focus ring |
| `--primary-foreground` | `oklch(0.99 0 0)` | Texte sur boutons remplis |
| `--background` | `oklch(1 0 0)` | Fond page (blanc pur) |
| `--foreground` | `oklch(0.21 0.008 145)` | Texte principal |
| `--muted-foreground` | `oklch(0.45 0.015 145)` | Texte secondaire |
| `--destructive` | `oklch(0.55 0.22 25)` | Refus, erreurs bloquantes |

**Sémantique métier** (classes Tailwind : `bg-planning-libre`, `bg-planning-occupe`, etc.) :

- `--planning-libre` — créneau disponible (vert pâle)
- `--planning-occupe` — créneau réservé (neutre chaud, sans détail privé)
- `--success-*`, `--warning-*`, `--info-*` — statuts demande

Utiliser les classes sémantiques Tailwind (`bg-primary`, `text-muted-foreground`) — **jamais de hex hardcodé** dans les composants.

**Pas de dark mode** — ne pas ajouter la classe `.dark` ni de variantes `dark:`.

## Typographie & layout

- UI entièrement en **français** ; `lang="fr"` sur `<html>`
- Geist Sans pour tout le texte UI ; Geist Mono pour prix, horaires, références
- Échelle fixe rem (pas de clamp fluide sur les titres)
- `--radius: 0.375rem` (6px) — max 8px sur les cartes
- Hiérarchie **plate** : bordures 1px, pas de `shadow-md` / `shadow-lg`
- Portail public (borne hall) : cibles tactiles ≥ 44×44 px

## Règles UX (cahier des charges)

1. **Portail public** — planning affiche uniquement libre/occupé ; jamais nom du demandeur ni motif
2. **Formulaire demande** — erreurs inline (créneau indisponible, capacité hors min/max) ; prix total visible avant soumission
3. **Employé** — accepter/refuser une demande ; raison **obligatoire** si refus
4. **Gardien** — planning limité à sa salle ; suivi remise/restitution clés
5. **Empty states** pédagogiques, **Skeleton** pour le chargement (pas de spinner plein écran)
6. **Modales** en dernier recours — préférer inline / Sheet pour les actions courantes

## Surfaces & routes prévues

| Route | Profil | Contenu |
|-------|--------|---------|
| `/` | Public | Planning, fiches salle, formulaire demande |
| `/employe/*` | Employé municipal | File demandes, détail, clés/paiements |
| `/gardien/*` | Gardien | Planning mono-salle, suivi clés |

## Composants coss recommandés

```bash
pnpm dlx shadcn@latest add @coss/button @coss/input @coss/label @coss/select @coss/textarea
pnpm dlx shadcn@latest add @coss/checkbox @coss/calendar @coss/dialog @coss/sheet
pnpm dlx shadcn@latest add @coss/table @coss/badge @coss/alert @coss/tabs @coss/form
pnpm dlx shadcn@latest add @coss/card @coss/separator @coss/skeleton @coss/toast
```

| Besoin | Composant coss |
|--------|----------------|
| CTA, actions | `@coss/button` |
| Formulaire demande | `@coss/form` + `@coss/input`, `@coss/select`, `@coss/textarea`, `@coss/checkbox`, `@coss/calendar` |
| Planning | `@coss/table` ou grille + `@coss/badge` |
| Accepter/refuser | `@coss/dialog` ou `@coss/sheet` |
| Retours | `@coss/alert`, `@coss/toast` |

## Interdit

- Composants interactifs custom quand coss ui existe
- Copier des snippets shadcn/Radix sans adapter à l'API coss (voir skill migration)
- Inter, Roboto, gradients décoratifs, glassmorphism
- Dark mode, emojis dans l'UI
- Copy marketing (« seamless », « elevate », etc.)
- Données privées sur le portail public
- `rounded-full` sur cartes ou boutons principaux

## Commandes

```bash
pnpm install
pnpm run dev    # http://localhost:3011
pnpm run build
pnpm run lint
```
