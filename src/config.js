// src/api/config.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for auth across QA, UAT, and localhost
// No credentials are hardcoded — all read from Liferay context
// ─────────────────────────────────────────────────────────────

const IS_DEV = window.location.hostname === "localhost";

// In dev (localhost), we use Basic auth with hardcoded creds.
// In QA/UAT, we always use Liferay session (cookies + CSRF token).
const AUTH_TOKEN = IS_DEV
  ? "Basic " + btoa("prabhudasu:root")
  : null;

export { AUTH_TOKEN };

// ── Headers ───────────────────────────────────────────────────

export const buildHeaders = () => {
  if (AUTH_TOKEN) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: AUTH_TOKEN,
    };
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-csrf-token": window.Liferay?.authToken ?? "",
  };
};

export const buildHeadersDocument = () => {
  if (AUTH_TOKEN) {
    return {
      Accept: "application/json",
      Authorization: AUTH_TOKEN,
    };
  }
  return {
    Accept: "application/json",
    "x-csrf-token": window.Liferay?.authToken ?? "",
  };
};

// ── Credentials ───────────────────────────────────────────────
// localhost: "omit" (Basic auth handles it)
// QA/UAT:   "include" (send session cookies)

export const buildCreds = () => (IS_DEV ? "omit" : "include");

// ── User ID ───────────────────────────────────────────────────

export const getLiferayUserId = () => {
  try {
    return window.Liferay.ThemeDisplay.getUserId();
  } catch (error) {
    console.error("[config] Error getting Liferay user ID:", error);
    return null;
  }
};

// ── Auth state ────────────────────────────────────────────────

export const isSignedIn = () => {
  if (IS_DEV) return true;
  return window.Liferay?.ThemeDisplay?.isSignedIn() ?? false;
};

// ── Scope Group ID ────────────────────────────────────────────
// Always read from Liferay — never hardcode (differs per env)

export const getScopeGroupId = () =>
  window.Liferay?.ThemeDisplay?.getScopeGroupId() ?? null;

export default AUTH_TOKEN;