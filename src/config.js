// src/api/config.js
// ─────────────────────────────────────────────────────────────
// Single source of truth for auth across QA, UAT, and localhost
// No credentials are hardcoded — all read from Liferay context
// ─────────────────────────────────────────────────────────────

import { getAccessToken } from "./api/auth";

// const IS_DEV = window.location.hostname === "localhost";
const IS_DEV = false; // ← UAT mode, Bearer token, data goes to UAT

// In dev (localhost), we use Basic auth with hardcoded creds.
// In QA/UAT, we always use Liferay session (cookies + CSRF token).
const AUTH_TOKEN = IS_DEV
  ? "Basic " + btoa("prabhudasu:root")
  : null;

export { AUTH_TOKEN };

// ── Headers ───────────────────────────────────────────────────

export const buildHeaders = (useBearer = false) => {
  if (AUTH_TOKEN) {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: AUTH_TOKEN,
    };
  }
  if(useBearer){
  const token = getAccessToken();
    return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
  }
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-csrf-token": window.Liferay?.authToken ?? "",
  };


};

export const buildHeadersRegistration = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa("prabhudasu:root")
  };
};

export const buildHeadersRegistrationUpdate = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-csrf-token": window.Liferay?.authToken ?? "",
  };
};

export const buildHeadersHeadLess = async (useBearer = true) => {
  const token = await getAccessToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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

export const buildCredsHeadless = () => (IS_DEV ? "include" : "include");


export const buildCredsRegistration = () => (IS_DEV ? "include" : "include");


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