// ============================================================
//  src/api/liferay.js
// ============================================================
const BASE = "";

const buildHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Basic " + btoa("prabhudasu:root"),
  // "x-csrf-token": window.Liferay?.authToken || ""

});

const buildCreds = () => "include";


const headers = { "Content-Type": "application/json" };
const opts    = { credentials: "include", headers: buildHeaders() };


export async function getStates0() {
  try {
    let allItems = [];
    let page = 1;
    let pageSize=30;

   
    while (true) {
      let url = `/o/c/states?page=${page}`;

      if (pageSize) {
        url += `&pageSize=${pageSize}`;
      }

      const response = await fetch(url+ '&sort=name:asc', {
        method: "GET",
        headers: buildHeaders(),
        credentials: buildCreds(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch states: ${response.status}`);
      }

      const data = await response.json();

      // Set pageSize dynamically from API response
      if (!pageSize) {
        pageSize = data.pageSize || 20;
      }

      const items = data.items || [];

      // Optional: filter like colleges (if needed)
      allItems = allItems.concat(items);

      // Stop when last page reached
      if (page >= data.lastPage) break;

      page++;
    }

    return allItems;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}


export async function apiFetch(path) {
  const res = await fetch(`${path}`, opts);
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

    //http://localhost:4001/o/c/districts?filter=r_state_c_stateId%20eq%20%27179438%27&page=2&pageSize=200
   // http://localhost:5001/o/c/districts?filter=r_state_c_stateId%20eq%20179438&pageSize=200&sort=name:asc

// Districts filtered by stateId
export const getDistricts = (stateId) =>
  apiFetch(`/o/c/districts?filter=r_state_c_stateId eq '${stateId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Talukas filtered by districtId
export const getTalukas = (districtId) =>
  apiFetch(`/o/c/talukas?filter=districtId eq '${districtId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Villages filtered by talukaId
export const getVillages = (talukaId) =>
  apiFetch(`/o/c/villages?filter=talukaId eq '${talukaId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// PO Names filtered by villageId
export const getPoNames = (villageId) =>
  apiFetch(`/o/c/ponames?filter=villageId eq '${villageId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// Save
export const saveSchoolBasicDetails = (payload) =>
  apiPost("/o/c/schoolbasicdetails", payload);
