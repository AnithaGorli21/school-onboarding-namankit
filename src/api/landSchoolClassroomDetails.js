// ============================================================
//  src/api/landSchoolClassroomDetails.js
//
//  loadLandSchoolClassroomDetails(schoolProfileId)
//    → GET existing records for this school → { records }
//
//  submitLandSchoolClassroomDetails(rows, schoolProfileId)
//    → POST each row to /o/c/landschoolclassroomdetails
//    → schoolProfileId added to every payload as foreign key
// ============================================================
import { saveLandSchoolClassroomDetails, getLandSchoolClassroomDetails } from "./liferay";

// ── Load existing records ──────────────────────────────────────
export async function loadLandSchoolClassroomDetails(schoolProfileId) {
  try {
    const records = await getLandSchoolClassroomDetails(schoolProfileId);
    return { records: records || [] };
  } catch (err) {
    console.error('[LandSchoolClassroomDetails] Load error:', err);
    return { records: [] };
  }
}

// ── Map Liferay response → form state ────────────────────────
export function mapRecordToRow(record) {
  if (!record) return null;
  return {
    id: record.id,
    standard: record.standardId || "",
    division: record.divisionId || "",
    separateClassroom: record.separateClassroomForEachDivision ? "Yes" : "No",
    classroomWithBenches: record.totalClassroomWithBenches || "",
    classroomWithoutBenches: record.totalClassroomWithoutBenches || "",
    liferayId: record.id
  };
}

// ── Map form rows → Liferay payload ────────────────────────────
export function mapRowToPayload(row, schoolProfileId) {
  return {
    schoolProfileId: schoolProfileId || 0,
    standardId: Number(row.standard) || 0,
    divisionId: Number(row.division) || 0,
    separateClassroomForEachDivision: row.separateClassroom === "Yes",
    totalClassroomWithBenches: Number(row.classroomWithBenches) || 0,
    totalClassroomWithoutBenches: Number(row.classroomWithoutBenches) || 0,
  };
}

// ── Submit all rows (POST new records) ────────────────────────────
export async function submitLandSchoolClassroomDetails(rows, schoolProfileId) {
  console.log('[LandSchoolClassroomDetails] Submitting', rows.length, 'rows for schoolProfileId:', schoolProfileId);
  
  const results = [];
  
  for (const row of rows) {
    try {
      // Only submit new rows (those without liferayId)
      if (!row.liferayId) {
        const payload = mapRowToPayload(row, schoolProfileId);
        console.log('[LandSchoolClassroomDetails] POST →', JSON.stringify(payload, null, 2));
        
        const result = await saveLandSchoolClassroomDetails(payload);
        results.push({ ...row, liferayId: result.id });
        
        console.log('[LandSchoolClassroomDetails] Saved row with ID:', result.id);
      } else {
        // Keep existing rows as-is
        results.push(row);
      }
    } catch (err) {
      console.error('[LandSchoolClassroomDetails] Failed to save row:', row, err);
      throw new Error(`Failed to save classroom details: ${err.message}`);
    }
  }
  
  return results;
}

// ── Map multiple records to rows ────────────────────────────────
export function mapRecordsToRows(records) {
  if (!Array.isArray(records)) return [];
  return records.map(record => mapRecordToRow(record)).filter(Boolean);
}
