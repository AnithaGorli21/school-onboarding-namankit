// ============================================================
//  src/api/schoolIntakeStudents.js
//
//  loadSchoolIntakeStudents(schoolProfileId)  → GET existing data
//  submitSchoolIntakeStudents({ intake, schoolProfileId })
//    → POST new data, PATCH existing data
// ============================================================
import { saveSchoolIntakeStudents, patchSchoolIntakeStudents, getSchoolIntakeStudents } from "./liferay";

// ── Load existing data ────────────────────────────────────────
export async function loadSchoolIntakeStudents(schoolProfileId) {
  console.log('[SchoolIntakeStudents] Loading for schoolProfileId:', schoolProfileId);
  const record = await getSchoolIntakeStudents(schoolProfileId);
  console.log('[SchoolIntakeStudents] Raw API response:', record);
  return { record };
}

// ── Build payload for API ───────────────────────────────────────
export function buildPayload(intake, schoolProfileId) {
  return {
    schoolMasterId: Number(schoolProfileId) || 0,
    boysResidentialNamankit: Number(intake.namankit_boys_residential) || 0,
    boysNonResidentialNamankit: Number(intake.namankit_boys_nonresidential) || 0,
    boysResidentialExceptNamankit: Number(intake.other_boys_residential) || 0,
    boysNonResidentialExceptNamankit: Number(intake.other_boys_nonresidential) || 0,
    girlsResidentialNamankit: Number(intake.namankit_girls_residential) || 0,
    girlsNonResidentialNamankit: Number(intake.namankit_girls_nonresidential) || 0,
    girlsResidentialExceptNamankit: Number(intake.other_girls_residential) || 0,
    girlsNonResidentialExceptNamankit: Number(intake.other_girls_nonresidential) || 0,
    // Auto-calculated totals (optional - can be calculated on backend too)
    totalBoysNamankit: (Number(intake.namankit_boys_residential) || 0) + (Number(intake.namankit_boys_nonresidential) || 0),
    totalGirlsNamankit: (Number(intake.namankit_girls_residential) || 0) + (Number(intake.namankit_girls_nonresidential) || 0),
    totalBoysExceptNamankit: (Number(intake.other_boys_residential) || 0) + (Number(intake.other_boys_nonresidential) || 0),
    totalGirlsExceptNamankit: (Number(intake.other_girls_residential) || 0) + (Number(intake.other_girls_nonresidential) || 0),
    totalBoys: (Number(intake.namankit_boys_residential) || 0) + (Number(intake.namankit_boys_nonresidential) || 0) + (Number(intake.other_boys_residential) || 0) + (Number(intake.other_boys_nonresidential) || 0),
    totalGirls: (Number(intake.namankit_girls_residential) || 0) + (Number(intake.namankit_girls_nonresidential) || 0) + (Number(intake.other_girls_residential) || 0) + (Number(intake.other_girls_nonresidential) || 0),
    totalStudents: (Number(intake.namankit_boys_residential) || 0) + (Number(intake.namankit_boys_nonresidential) || 0) + (Number(intake.other_boys_residential) || 0) + (Number(intake.other_boys_nonresidential) || 0) + (Number(intake.namankit_girls_residential) || 0) + (Number(intake.namankit_girls_nonresidential) || 0) + (Number(intake.other_girls_residential) || 0) + (Number(intake.other_girls_nonresidential) || 0),
  };
}

// ── Map API record to form fields ───────────────────────────────────
export function mapRecordToIntake(record) {
  if (!record) {
    return {
      namankit_boys_residential: "",
      namankit_boys_nonresidential: "",
      other_boys_residential: "",
      other_boys_nonresidential: "",
      namankit_girls_residential: "",
      namankit_girls_nonresidential: "",
      other_girls_residential: "",
      other_girls_nonresidential: "",
    };
  }

  return {
    namankit_boys_residential: record.boysResidentialNamankit?.toString() || "",
    namankit_boys_nonresidential: record.boysNonResidentialNamankit?.toString() || "",
    other_boys_residential: record.boysResidentialExceptNamankit?.toString() || "",
    other_boys_nonresidential: record.boysNonResidentialExceptNamankit?.toString() || "",
    namankit_girls_residential: record.girlsResidentialNamankit?.toString() || "",
    namankit_girls_nonresidential: record.girlsNonResidentialNamankit?.toString() || "",
    other_girls_residential: record.girlsResidentialExceptNamankit?.toString() || "",
    other_girls_nonresidential: record.girlsNonResidentialExceptNamankit?.toString() || "",
  };
}

// ── Submit intake data (POST new or PATCH existing) ───────────────────────
export async function submitSchoolIntakeStudents({ intake, schoolProfileId }) {
  const payload = buildPayload(intake, schoolProfileId);
  console.log('[SchoolIntakeStudents] Submitting payload:', payload);

  // Try to get existing record first
  const existingRecord = await getSchoolIntakeStudents(schoolProfileId);
  
  if (existingRecord?.id) {
    // Update existing record
    console.log('[SchoolIntakeStudents] Updating existing record:', existingRecord.id);
    return await patchSchoolIntakeStudents(existingRecord.id, payload);
  } else {
    // Create new record
    console.log('[SchoolIntakeStudents] Creating new record');
    return await saveSchoolIntakeStudents(payload);
  }
}
