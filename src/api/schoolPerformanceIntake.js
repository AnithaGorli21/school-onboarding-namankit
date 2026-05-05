// ============================================================
//  src/api/schoolPerformanceIntake.js
//
//  loadSchoolPerformanceIntake(schoolProfileId)  → GET existing rows
//  submitSchoolPerformanceIntake({ rows, schoolProfileId })
//    → POST new rows, PATCH existing rows
// ============================================================
import { saveSchoolProfileIntake, patchSchoolPerformanceIntake, getSchoolProfileIntake } from "./liferay";

// ── Load existing rows ────────────────────────────────────────
export async function loadSchoolPerformanceIntake(schoolProfileId) {
  console.log('[SchoolPerformanceIntake] Loading for schoolProfileId:', schoolProfileId);
  const records = await getSchoolProfileIntake(schoolProfileId);
  console.log('[SchoolPerformanceIntake] Raw API response records:', records);
  console.log('[SchoolPerformanceIntake] Number of records found:', records.length);
  return { records };
}

// Reverse mapping for display (ID → name)
const ID_TO_STANDARD_MAP = {
  1: "SSC",
  2: "HSC",
  3: "Scholarship", 
  4: "MTS",
  5: "NTS",
  6: "Any Other"
};

// ── Map Liferay records → table rows ─────────────────────────
export function mapRecordsToRows(records) {
  if (!records || records.length === 0) return [];
  return records.map((r) => ({
    id: r.id,
    liferayId: r.id,
    year: ID_TO_YEAR_MAP[r.schoolPerformanceYearId] || r.schoolPerformanceYearId || "",
    standard: ID_TO_STANDARD_MAP[r.standardId] || r.standardId || "",
    others: r.others || "",
    studentsAppeared: r.noOfStudentsAppeared || "",
    studentsPassed: r.noOfStudentsPassed || "",
  }));
}

// Map standard names to IDs (these should match the Liferay object field values)
const STANDARD_ID_MAP = {
  "SSC": 1,
  "HSC": 2, 
  "Scholarship": 3,
  "MTS": 4,
  "NTS": 5,
  "Any Other": 6
};

// Map year strings to IDs (to avoid field size issues)
const YEAR_ID_MAP = {
  "2020-2021": 1,
  "2021-2022": 2,
  "2022-2023": 3,
  "2023-2024": 4,
  "2024-2025": 5
};

// Reverse mapping for display (ID → year)
const ID_TO_YEAR_MAP = {
  1: "2020-2021",
  2: "2021-2022", 
  3: "2022-2023",
  4: "2023-2024",
  5: "2024-2025"
};

// ── Build single row payload ──────────────────────────────────
function buildPayload({ row, schoolProfileId }) {
  return {
    schoolProfileId,
    schoolPerformanceYearId: YEAR_ID_MAP[row.year] || 0, // Map to numeric ID
    standardId: STANDARD_ID_MAP[row.standard] || 0, // Map to proper ID
    noOfStudentsAppeared: parseInt(row.studentsAppeared, 10) || 0,
    noOfStudentsPassed: parseInt(row.studentsPassed, 10) || 0,
    others: row.others || "",
  };
}

// ── Submit (POST new rows, PATCH existing rows) ───────────────
export async function submitSchoolPerformanceIntake(rows, schoolProfileId ) {
  if (!schoolProfileId) throw new Error("School Profile ID is missing. Please complete School Basic Details first.");

  for (const row of rows) {
    const payload = buildPayload({ row, schoolProfileId });

    console.log(`[SchoolPerformanceIntake] ${row.liferayId ? "PATCH" : "POST"} →`, JSON.stringify(payload, null, 2));

    if (row.liferayId) {
      await patchSchoolPerformanceIntake(row.liferayId, payload);
    } else {
      await saveSchoolProfileIntake(payload);
    }
  }
}
