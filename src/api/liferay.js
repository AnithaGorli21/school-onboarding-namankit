// ============================================================
//  src/api/liferay.js
// ============================================================

const buildHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Basic " + btoa("prabhudasu:root"),
  // "x-csrf-token": window.Liferay?.authToken || "",
});

const opts = { credentials: "include", headers: buildHeaders() };

// ── Reads Liferay error body and surfaces it clearly ──────────
async function throwWithBody(res, method, path) {
  let body = "";
  try { body = await res.text(); } catch {}
  let message = "";
  try {
    const json = JSON.parse(body);
    message = json.title || json.detail || json.message || body;
  } catch {
    message = body;
  }
  const err = new Error(`[${method} ${path}] ${res.status} — ${message}`);
  err.status  = res.status;
  err.body    = body;
  err.apiPath = path;
  console.error("Liferay API error:", { status: res.status, path, body });
  if (typeof window.__showApiError === "function") window.__showApiError(err);
  throw err;
}

// ── Generic fetchers ──────────────────────────────────────────

export async function apiFetch(path) {
  const res = await fetch(path, opts);
  if (!res.ok) await throwWithBody(res, "GET", path);
  return res.json();
}

export async function apiPost(path, body) {
  // ✅ FIX: removed stray `o` that was causing syntax error on all POST calls
  const res = await fetch(path, {
    ...opts,
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) await throwWithBody(res, "POST", path);
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(path, {
    ...opts,
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!res.ok) await throwWithBody(res, "PATCH", path);
  return res.json();
}

// ── Location dropdowns ────────────────────────────────────────

export const getStates = () =>
  apiFetch("/o/c/states?pageSize=200&sort=name:asc")
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

export const getDistricts = (stateId) =>
  apiFetch(`/o/c/districts?filter=r_state_c_stateId eq '${stateId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

export const getTalukas = (districtId) =>
  apiFetch(`/o/c/talukas?filter=districtId eq '${districtId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

export const getVillages = (talukaId) =>
  apiFetch(`/o/c/villages?filter=talukaId eq '${talukaId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

export const getPoNames = (villageId) =>
  apiFetch(`/o/c/ponames?filter=villageId eq '${villageId}'&pageSize=200&sort=name:asc`)
    .then((d) => (d.items || []).map((r) => ({ value: r.id, label: r.name })));

// ── Section POST endpoints ────────────────────────────────────
// ⚠️  IF YOU GET 404: the endpoint name must match your Liferay Object Definition exactly.
//     QUICK FIX: Liferay → Objects → [Object] → Details → REST Endpoint field.
//     Copy that exact value and replace the path below.
//     Liferay generates: Object plural label → all lowercase → no spaces/hyphens
//     e.g. "School Basic Details" → /o/c/schoolbasicdetails

export const saveSchoolBasicDetails        = (p) => apiPost("/o/c/namankitschoolprofiles",      p);
export const saveLandDetails               = (p) => apiPost("/o/c/schoollanddetails",         p);
export const saveHostelDetails             = (p) => apiPost("/o/c/schoolhosteldetails",             p);
export const saveDiningFacilities          = (p) => apiPost("/o/c/dinningfacilities",          p);
export const saveLabDetails                = (p) => apiPost("/o/c/computerlabdetais",                p);
export const saveLibraryDetails            = (p) => apiPost("/o/c/librarydetails",            p);
export const saveTeacherDetails            = (p) => apiPost("/o/c/teacherdetails",            p);
export const saveExtraCurriculumActivities = (p) => apiPost("/o/c/extracurriculumactivities", p);
export const saveSportsFacilities          = (p) => apiPost("/o/c/sportfacilities",           p);
export const saveCulturalProgram           = (p) => apiPost("/o/c/culturalprogramsportsfacilities", p);
export const saveEducationalTour           = (p) => apiPost("/o/c/educationaltourssportsfacilities", p);
export const saveMedicalFacilities         = (p) => apiPost("/o/c/medicalfacilities",         p);
export const saveProfileFeeMaster          = (p) => apiPost("/o/c/profilefeemasters",          p);
export const saveSchoolBankDetails          = (p) => apiPost("/o/c/schoolbankdetails",          p);

// ── Section GET endpoints ─────────────────────────────────
// Used by FinalSubmit review to fetch saved data from Liferay
 
export const getSchoolProfiles        = () => apiFetch("/o/c/namankitschoolprofiles?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getSchoolLandDetails     = () => apiFetch("/o/c/schoollanddetails?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getHostelDetails         = () => apiFetch("/o/c/schoolhosteldetails?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getDiningFacilities      = () => apiFetch("/o/c/dinningfacilities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getLabDetails            = () => apiFetch("/o/c/computerlabdetais?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getLibraryDetails        = () => apiFetch("/o/c/librarydetails?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getTeacherDetails        = () => apiFetch("/o/c/teacherdetails?pageSize=200&sort=dateCreated:desc").then(d => d.items || []);
export const getExtraCurriculum       = () => apiFetch("/o/c/extracurriculumactivities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getSportsFacilities      = () => apiFetch("/o/c/sportfacilities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getCulturalProgramSportsFacilities     = () => apiFetch("/o/c/culturalprogramsportsfacilities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const geteducationaltourssportsfacilities    = () => apiFetch("/o/c/educationaltourssportsfacilities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getMedicalFacilities     = () => apiFetch("/o/c/medicalfacilities?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);
export const getProfileFeeMaster      = () => apiFetch("/o/c/profilefeemasters?pageSize=200&sort=dateCreated:desc").then(d => d.items || []);
export const getSchoolBankDetails     = () => apiFetch("/o/c/schoolbankdetails?pageSize=1&sort=dateCreated:desc").then(d => (d.items || [])[0] || null);  