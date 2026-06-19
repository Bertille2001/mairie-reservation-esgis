export interface AppareilLouable {
  id: number;
  nom: string;
  prix: number | string | null;
}

export interface Salle {
  id: number;
  nom: string;
  adresse: string;
  surface_m2: number | string;
  capacite_min: number;
  capacite_max: number;
  est_payante: boolean;
  a_gardien: boolean;
  prix_heure: number | string | null;
}

export interface SalleDetail extends Salle {
  appareils_fixes: string[];
  appareils_louables: AppareilLouable[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SallePlanning {
  id: number;
  nom: string;
  est_libre: boolean;
}

export type TypeDemandeur = "particulier" | "organisation";

export interface DemandeCreatePayload {
  salle: number;
  demandeur_nom: string;
  demandeur_email: string;
  type_demandeur: TypeDemandeur;
  nom_manifestation: string;
  nb_personnes: number;
  date_debut: string;
  date_fin: string;
  appareil_ids?: number[];
}

export type StatutDemande = "en_attente" | "acceptee" | "refusee";

export type UserRole = "employe_municipal" | "gardien";

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  salle: number | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DemandeReservation {
  id: number;
  salle: number;
  salle_nom: string;
  demandeur_nom: string;
  demandeur_email: string;
  type_demandeur: TypeDemandeur;
  nom_manifestation: string;
  nb_personnes: number;
  date_debut: string;
  date_fin: string;
  statut: StatutDemande;
  raison_refus: string | null;
  prix_total: string | number | null;
  date_soumission: string;
}

export interface TraiterPayload {
  statut: "acceptee" | "refusee";
  raison_refus?: string;
}

export interface SuiviCles {
  id: number;
  demande: number;
  date_remise_prevue: string;
  date_remise_reelle: string | null;
  paiement_effectue: boolean;
  montant_paye: string | number | null;
  date_restitution_prevue: string;
  date_restitution_reelle: string | null;
  cles_rendues: boolean | null;
  rappel_envoye: boolean;
}

export interface SuiviUpdatePayload {
  date_remise_reelle?: string;
  date_restitution_reelle?: string;
  paiement_effectue?: boolean;
  montant_paye?: string;
  cles_rendues?: boolean;
}
