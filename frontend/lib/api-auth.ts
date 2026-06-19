import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth";
import { parseApiError, type ParsedApiError } from "./errors";
import type {
  AuthTokens,
  DemandeReservation,
  StatutDemande,
  SuiviCles,
  SuiviUpdatePayload,
  TraiterPayload,
  User,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class AuthError extends Error {
  constructor(message = "Session expirée.") {
    super(message);
    this.name = "AuthError";
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!res.ok) {
    return false;
  }

  const data = (await res.json()) as { access: string };
  setTokens({ access: data.access, refresh });
  return true;
}

async function refreshTokensOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function authFetch(
  path: string,
  init?: RequestInit,
  retry = true,
): Promise<Response> {
  const access = getAccessToken();
  if (!access) {
    throw new AuthError();
  }

  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${access}`);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && retry) {
    const refreshed = await refreshTokensOnce();
    if (!refreshed) {
      clearTokens();
      throw new AuthError();
    }
    return authFetch(path, init, false);
  }

  return res;
}

export interface LoginResult {
  data?: AuthTokens;
  error?: ParsedApiError;
}

export async function loginClient(
  email: string,
  password: string,
): Promise<LoginResult> {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (res.ok) {
    const tokens = (await res.json()) as AuthTokens;
    setTokens(tokens);
    return { data: tokens };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  return { error: parseApiError(body) };
}

export async function fetchMe(): Promise<User> {
  const res = await authFetch("/utilisateurs/me/");
  if (!res.ok) {
    throw new Error(`Erreur profil (${res.status})`);
  }
  return res.json() as Promise<User>;
}

export async function fetchReservations(
  statut?: StatutDemande,
): Promise<DemandeReservation[]> {
  const params = statut ? `?statut=${statut}` : "";
  const res = await authFetch(`/reservations/list/${params}`);
  if (!res.ok) {
    throw new Error(`Erreur demandes (${res.status})`);
  }
  return res.json() as Promise<DemandeReservation[]>;
}

export async function fetchReservationById(
  id: number,
): Promise<DemandeReservation | null> {
  const all = await fetchReservations();
  return all.find((d) => d.id === id) ?? null;
}

export interface TraiterResult {
  data?: DemandeReservation;
  error?: ParsedApiError;
}

export async function traiterDemande(
  id: number,
  payload: TraiterPayload,
): Promise<TraiterResult> {
  const res = await authFetch(`/reservations/${id}/traiter/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
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

export async function fetchSuivi(id: number): Promise<SuiviCles> {
  const res = await authFetch(`/reservations/${id}/suivi/`);
  if (!res.ok) {
    throw new Error(`Erreur suivi (${res.status})`);
  }
  return res.json() as Promise<SuiviCles>;
}

export interface UpdateSuiviResult {
  data?: SuiviCles;
  error?: ParsedApiError;
}

export async function updateSuivi(
  id: number,
  payload: SuiviUpdatePayload,
): Promise<UpdateSuiviResult> {
  const res = await authFetch(`/reservations/${id}/suivi/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return { data: (await res.json()) as SuiviCles };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  return { error: parseApiError(body) };
}
