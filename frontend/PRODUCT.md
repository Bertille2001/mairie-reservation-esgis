# Product

## Register

product

## Users

Trois profils distincts, chacun avec un contexte d’usage précis :

| Profil | Contexte | Besoin principal |
|--------|----------|------------------|
| **Visiteur public** | Hall de la mairie (borne) ou navigateur personnel | Consulter le planning sans données privées, découvrir une salle, déposer une demande de réservation |
| **Employé municipal** | Poste de travail au bureau | Traiter les demandes (accepter/refuser), gérer les réservations, suivre clés et paiements |
| **Gardien de salle** | Poste de travail ou accueil de la salle | Voir le planning de sa salle uniquement, enregistrer remise et restitution des clés |

Les visiteurs du hall ont besoin d’une interface lisible à distance, sans jargon administratif. Les agents manipulent des volumes importants (10 000+ demandes en seed) : densité, filtres et statuts clairs priment sur la décoration.

## Product Purpose

Application web de gestion des réservations de salles municipales pour la **Mairie de Lomé**. Elle remplace les processus manuels par un portail public (planning + demande) et des espaces connectés pour le personnel.

Succès = un citoyen dépose une demande sans aide, un employé traite une file de demandes sans ambiguïté, un gardien voit instantanément l’occupation de sa salle.

## Brand Personality

**Clair · Institutionnel · Accueillant**

Voix sobre et directe, en français. L’interface inspire confiance administrative sans froideur : comme un guichet bien organisé, pas comme une startup SaaS.

## Anti-references

- Dashboards « startup » (gradients, métriques hero, cartes identiques en grille)
- Fonds crème/sable génériques type IA 2026
- Planning surchargé exposant des données privées au public
- Modales systématiques pour des actions simples (préférer inline / panneaux latéraux)
- Composants custom quand coss ui couvre le besoin
- Copy marketing (« seamless », « elevate », « next-gen »)
- Dark mode par défaut (usage bureau + borne en journée)

## Design Principles

1. **La tâche avant la décoration** — Chaque écran sert une action concrète (consulter, demander, accepter, enregistrer).
2. **Confidentialité par défaut** — Le portail public ne montre jamais qui a réservé ni le motif ; libre/occupé uniquement.
3. **Feedback immédiat** — Erreurs de formulaire inline (créneau indisponible, capacité hors bornes) ; statuts visibles partout.
4. **Cohérence coss ui** — Boutons, formulaires, tables, dialogs : composants coss ui, pas de réinvention.
5. **Français natif** — Labels, messages d’erreur et e-mails référencés en français ; dates/heures format locale.

## Accessibility & Inclusion

- Cible **WCAG 2.1 AA**
- Contraste texte ≥ 4.5:1 (corps), ≥ 3:1 (grands titres)
- `prefers-reduced-motion` respecté sur toutes les animations
- Cibles tactiles ≥ 44×44 px sur le portail public (borne hall)
- Formulaires entièrement navigables au clavier ; focus visible sur tous les contrôles coss ui
