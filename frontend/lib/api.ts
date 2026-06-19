import type {
  DateRange,
  DemandeCreatePayload,
  DemandeReservation,
  SalleDetail,
  SalleDisponibilite,
  SallePlanning,
} from "./types";
import { rangeToApiParams } from "./dates";
import { parseApiError, type ParsedApiError } from "./errors";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) {
    throw new Error(`Erreur API (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function fetchPlanningFromApi(
  range: DateRange,
  init?: RequestInit,
): Promise<SallePlanning[]> {
  const { date_debut, date_fin } = rangeToApiParams(range);
  const params = new URLSearchParams({ date_debut, date_fin });
  const res = await fetch(`${API_URL}/salles/planning/?${params}`, init);

  if (!res.ok) {
    throw new Error(`Erreur planning (${res.status})`);
  }

  return res.json() as Promise<SallePlanning[]>;
}

/** Server Components, Route Handlers */
export async function fetchPlanningServer(
  range: DateRange,
): Promise<SallePlanning[]> {
  const { date_debut, date_fin } = rangeToApiParams(range);
  const params = new URLSearchParams({ date_debut, date_fin });
  const res = await fetch(`${API_URL}/salles/planning/?${params}`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Erreur planning (${res.status})`);
  }

  return res.json() as Promise<SallePlanning[]>;
}

/** Client Components (useEffect, événements) */
export async function fetchPlanningClient(
  range: DateRange,
): Promise<SallePlanning[]> {
  return fetchPlanningFromApi(range, { cache: "no-store" });
}

export function buildPlanningUrl(range?: DateRange): string {
  if (!range) return "/";
  const { date_debut, date_fin } = rangeToApiParams(range);
  const params = new URLSearchParams({ debut: date_debut, fin: date_fin });
  return `/?${params}`;
}

export function buildDemandeUrl(
  salleId: number,
  range?: DateRange,
): string {
  const params = new URLSearchParams({ salle: String(salleId) });
  if (range) {
    const { date_debut, date_fin } = rangeToApiParams(range);
    params.set("debut", date_debut);
    params.set("fin", date_fin);
  }
  return `/planning/demande?${params}`;
}

export function buildSalleUrl(salleId: number, range?: DateRange): string {
  const base = `/salles/${salleId}`;
  if (!range) return base;
  const { date_debut, date_fin } = rangeToApiParams(range);
  const params = new URLSearchParams({ debut: date_debut, fin: date_fin });
  return `${base}?${params}`;
}

/** Server Components */
export async function fetchSallesServer(): Promise<SalleDetail[]> {
  return apiFetch<SalleDetail[]>("/salles/", { next: { revalidate: 60 } });
}

export async function fetchSalleServer(id: number): Promise<SalleDetail> {
  return apiFetch<SalleDetail>(`/salles/${id}/`, { next: { revalidate: 60 } });
}

/** Client Components */
export async function fetchSalleClient(id: number): Promise<SalleDetail> {
  return apiFetch<SalleDetail>(`/salles/${id}/`, { cache: "no-store" });
}

async function fetchDisponibiliteFromApi(
  salleId: number,
  range: DateRange,
  init?: RequestInit,
): Promise<SalleDisponibilite> {
  const { date_debut, date_fin } = rangeToApiParams(range);
  const params = new URLSearchParams({ date_debut, date_fin });
  const res = await fetch(
    `${API_URL}/salles/${salleId}/disponibilite/?${params}`,
    init,
  );

  if (!res.ok) {
    throw new Error(`Erreur disponibilité (${res.status})`);
  }

  return res.json() as Promise<SalleDisponibilite>;
}

/** Server Components */
export async function fetchSalleDisponibiliteServer(
  salleId: number,
  range: DateRange,
): Promise<SalleDisponibilite> {
  return fetchDisponibiliteFromApi(salleId, range, { next: { revalidate: 0 } });
}

/** Client Components */
export async function fetchSalleDisponibiliteClient(
  salleId: number,
  range: DateRange,
): Promise<SalleDisponibilite> {
  return fetchDisponibiliteFromApi(salleId, range, { cache: "no-store" });
}

export interface CreateReservationResult {
  data?: DemandeReservation;
  error?: ParsedApiError;
}

export async function createReservationClient(
  payload: DemandeCreatePayload,
): Promise<CreateReservationResult> {
  const res = await fetch(`${API_URL}/reservations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (res.ok) {
    return { data: (await res.json()) as DemandeReservation };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  return { error: parseApiError(body) };
}

export const DEMANDE_CONFIRMATION_KEY = "demande-confirmation";
