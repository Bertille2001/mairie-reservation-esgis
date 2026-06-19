export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const amount = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSurface(value: number | string): string {
  const n = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(n)) return String(value);
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} m²`;
}

export function formatCapacite(min: number, max: number): string {
  return `${min} à ${max} personnes`;
}

export function formatDateTimeFr(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatStatutDemande(
  statut: "en_attente" | "acceptee" | "refusee",
): string {
  switch (statut) {
    case "en_attente":
      return "En attente";
    case "acceptee":
      return "Acceptée";
    case "refusee":
      return "Refusée";
  }
}

export function formatTypeDemandeur(
  type: "particulier" | "organisation",
): string {
  return type === "particulier" ? "Particulier" : "Organisation";
}
