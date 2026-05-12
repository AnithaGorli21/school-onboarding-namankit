// ============================================================
//  src/api/auth.js
// ============================================================
import { apiFetch } from "./liferay";

// ── OAuth2 Client Credentials (for public registration page) ──
const CLIENT_ID     = "id-bb4aeb8a-e476-5cfe-3346-4e0bde719d6";
const CLIENT_SECRET = "secret-5a51426a-2f44-66ae-cc3e-b93d43ce05f";

let accessTokenCache = { token: null, expiresAt: 0, isRefreshing: false };

export async function getAccessToken() {
  const now = Date.now();
  if (accessTokenCache.token && accessTokenCache.expiresAt > now + 60000) {
    return accessTokenCache.token;
  }
  if (accessTokenCache.isRefreshing) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getAccessToken();
  }
  try {
    accessTokenCache.isRefreshing = true;
    const response = await fetch("/o/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });
    if (!response.ok) throw new Error(`Failed to get token: ${response.status}`);
    const data = await response.json();
    accessTokenCache.token     = data.access_token;
    accessTokenCache.expiresAt = now + data.expires_in * 1000;
    return data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    accessTokenCache.token     = null;
    accessTokenCache.expiresAt = 0;
    return null;
  } finally {
    accessTokenCache.isRefreshing = false;
  }
}

// ── Roles ─────────────────────────────────────────────────────
export const ROLES = {
  CONTROLLER: "Controller_namankit",
  PO:         "PO_namankit",
  ATC:        "ATC_namankit",
  SCHOOL:     "Pre School",
};

const IS_DEV = window.location.hostname === "localhost";
const DEV_ROLE_KEY = "namankit_dev_role";

export function getDevRole()     { return localStorage.getItem(DEV_ROLE_KEY); }
export function setDevRole(role) { localStorage.setItem(DEV_ROLE_KEY, role); }
export function clearDevRole()   { localStorage.removeItem(DEV_ROLE_KEY); }

export function logout() {
  if (IS_DEV) {
    clearDevRole();
    window.location.reload();
  } else {
    window.location.href = "/c/portal/logout";
  }
}

function getLiferayUserId() {
  return window.Liferay?.ThemeDisplay?.getUserId() || null;
}

export async function getUserRole() {
  // ── DEV MODE (localhost) ──
  if (IS_DEV) {
    const devRole = getDevRole();
    if (!devRole) return null;
    console.log("[auth] DEV role:", devRole);
    return devRole;
  }

  // ── QA/UAT — use Bearer token ─────────────────────────────
  const userId = getLiferayUserId();
  if (!userId) {
    console.warn("[auth] No Liferay user ID found");
    return null;
  }

  const token = await getAccessToken();
  if (!token) {
    console.warn("[auth] Could not get access token");
    return null;
  }

  const res = await fetch(
    `/o/headless-admin-user/v1.0/user-accounts/${userId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    console.warn("[auth] Failed to fetch user account:", res.status);
    return null;
  }

  const userData = await res.json();
  const roles = userData?.roleBriefs || [];

  console.log("[auth] userId:", userId);
  console.log("[auth] roles:", roles.map((r) => r.name));

  if (roles.some((r) => r.name === ROLES.CONTROLLER)) return ROLES.CONTROLLER;
  if (roles.some((r) => r.name === ROLES.PO))         return ROLES.PO;
  if (roles.some((r) => r.name === ROLES.ATC))        return ROLES.ATC;
  if (roles.some((r) => r.name === ROLES.SCHOOL))     return ROLES.SCHOOL;

  console.warn("[auth] No Namankit role found for userId:", userId);
  return null;
}