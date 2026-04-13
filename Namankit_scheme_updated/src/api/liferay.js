// ============================================================
//  src/api/liferay.js
// ============================================================
const BASE = "https://mahadbt2-qa-dashboard.quantela.com";

const headers = { "Content-Type": "application/json" };
const opts    = { credentials: "include", headers };

export async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts, method: "POST", body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts, method: "PATCH", body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}`);
  return res.json();
}

// ── Master data loaders ──────────────────────────────────────

// States — load all, no filter
export const getStates = () =>
  apiFetch("/o/c/states?pageSize=200&sort=name:asc")
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Districts filtered by stateId
export const getDistricts = (stateId) =>
  apiFetch(`/o/c/districts?filter=stateId eq ${stateId}&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Talukas filtered by districtId
export const getTalukas = (districtId) =>
  apiFetch(`/o/c/talukas?filter=districtId eq ${districtId}&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Villages filtered by talukaId
export const getVillages = (talukaId) =>
  apiFetch(`/o/c/villages?filter=talukaId eq ${talukaId}&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// PO Names filtered by villageId
export const getPoNames = (villageId) =>
  apiFetch(`/o/c/ponames?filter=villageId eq ${villageId}&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Save
export const saveSchoolBasicDetails = (payload) =>
  apiPost("/o/c/schoolbasicdetails", payload);
