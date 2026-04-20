// ============================================================
//  src/api/teacherDetails.js
//
//  loadTeacherDetails(schoolProfileId)  → GET existing rows
//  submitTeacherDetails({ rows, schoolProfileId, existingIds })
//    → POST new rows, PATCH existing rows
// ============================================================
import { saveTeacherDetails, patchTeacherDetails, getTeacherDetails } from "./liferay";

// ── Load existing records ─────────────────────────────────────
export async function loadTeacherDetails(schoolProfileId) {
  const records = await getTeacherDetails(schoolProfileId);
  return { records };
}

// ── Map Liferay records → table rows ─────────────────────────
export function mapRecordsToRows(records) {
  if (!records || records.length === 0) return [];
  return records.map((r) => ({
    id:                                      r.id,  // Liferay record id for PATCH
    liferayId:                               r.id,
    name:                                    r.name                                    || "",
    highestQualification:                    r.highestQualification                    || "",
    mediumOfEducationTillStd10thId:          r.mediumOfEducationTillStd10thId          || "",
    mediumOfEducationForDegreeId:            r.mediumOfEducationForDegreeId            || "",
    mediumForEducationForBedDedBPedBedPhyId: r.mediumForEducationForBedDedBPedBedPhyId || "",
    yearOfExperience:                        r.yearOfExperience                        || "",
    subject1Id:                              r.subject1Id                              || "",
    subject2Id:                              r.subject2Id                              || "",
    isSportsBPed:                            !!r.isSportsBPed,
    genderId:                                r.genderId                                || "",
    teacherDetailStatus:                     !!r.teacherDetailStatus,
  }));
}

// ── Build single teacher payload ─────────────────────────────
function buildPayload(row, schoolProfileId) {
  return {
    schoolProfileId:                         schoolProfileId || 0,
    name:                                    row.name                                    || "",
    highestQualification:                    row.highestQualification                    || "",
    mediumOfEducationTillStd10thId:          Number(row.mediumOfEducationTillStd10thId)  || 0,
    mediumOfEducationForDegreeId:            Number(row.mediumOfEducationForDegreeId)    || 0,
    mediumForEducationForBedDedBPedBedPhyId: Number(row.mediumForEducationForBedDedBPedBedPhyId) || 0,
    yearOfExperience:                        Number(row.yearOfExperience)                || 0,
    subject1Id:                              Number(row.subject1Id)                      || 0,
    subject2Id:                              Number(row.subject2Id)                      || 0,
    isSportsBPed:                            !!row.isSportsBPed,
    genderId:                                Number(row.genderId)                        || 0,
    teacherDetailStatus:                     !!row.teacherDetailStatus,
  };
}

// ── Submit (POST new rows, PATCH existing rows) ───────────────
export async function submitTeacherDetails({ rows, schoolProfileId }) {
  for (const row of rows) {
    const payload = buildPayload(row, schoolProfileId);
    console.log(`[TeacherDetails] ${row.liferayId ? "PATCH" : "POST"} →`, JSON.stringify(payload, null, 2));

    if (row.liferayId) {
      // Existing record from Liferay → PATCH
      await patchTeacherDetails(row.liferayId, payload);
    } else {
      // New row added by user → POST
      await saveTeacherDetails(payload);
    }
  }
}