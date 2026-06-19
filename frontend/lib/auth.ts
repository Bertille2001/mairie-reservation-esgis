import type { AuthTokens, UserRole } from "./types";

const ACCESS_KEY = "mairie_access_token";
const REFRESH_KEY = "mairie_refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case "employe_municipal":
      return "/employe";
    case "gardien":
      return "/gardien";
  }
}
