import type { AppareilLouable, SalleDetail } from "./types";

export type TypeDemandeur = "particulier" | "organisation";

export function calculateDemandePrice(
  salle: Pick<SalleDetail, "est_payante" | "prix_heure">,
  dateDebut: Date,
  dateFin: Date,
  typeDemandeur: TypeDemandeur,
  appareils: AppareilLouable[],
): number {
  let prix = 0;

  if (
    salle.est_payante &&
    typeDemandeur === "particulier" &&
    salle.prix_heure !== null &&
    salle.prix_heure !== undefined &&
    salle.prix_heure !== ""
  ) {
    const dureeHeures = (dateFin.getTime() - dateDebut.getTime()) / 3_600_000;
    const prixHeure =
      typeof salle.prix_heure === "string"
        ? Number.parseFloat(salle.prix_heure)
        : salle.prix_heure;
    if (!Number.isNaN(prixHeure) && dureeHeures > 0) {
      prix += prixHeure * dureeHeures;
    }
  }

  for (const appareil of appareils) {
    if (appareil.prix === null || appareil.prix === undefined || appareil.prix === "") {
      continue;
    }
    const montant =
      typeof appareil.prix === "string"
        ? Number.parseFloat(appareil.prix)
        : appareil.prix;
    if (!Number.isNaN(montant)) {
      prix += montant;
    }
  }

  return Math.round(prix * 100) / 100;
}
