export type ApiFieldErrors = Record<string, string[]>;

export interface ParsedApiError {
  fieldErrors: ApiFieldErrors;
  generalError: string | null;
}

export function parseApiError(body: unknown): ParsedApiError {
  const fieldErrors: ApiFieldErrors = {};
  let generalError: string | null = null;

  if (!body || typeof body !== "object") {
    return { fieldErrors, generalError: "Une erreur est survenue." };
  }

  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
      if (key === "non_field_errors" || key === "detail") {
        generalError = value.join(" ");
      } else {
        fieldErrors[key] = value;
      }
      continue;
    }

    if (typeof value === "string" && (key === "detail" || key === "non_field_errors")) {
      generalError = value;
    }
  }

  if (
    Array.isArray(body) &&
    body.every((item) => typeof item === "string")
  ) {
    generalError = body.join(" ");
  }

  if (!generalError && Object.keys(fieldErrors).length === 0) {
    generalError = "Une erreur est survenue.";
  }

  return { fieldErrors, generalError };
}

export function firstFieldError(
  fieldErrors: ApiFieldErrors,
  field: string,
): string | undefined {
  return fieldErrors[field]?.[0];
}
