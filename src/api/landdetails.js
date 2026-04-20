// ============================================================
//  src/api/landdetails.js
//
//  loadLandDetails(schoolProfileId)
//    → GET existing record for this school → { record, recordId }
//
//  submitLandDetails({ land, photoFile, schoolProfileId, recordId })
//    → POST if new record
//    → PATCH if recordId exists (update)
//    → schoolProfileId added to every payload as foreign key
// ============================================================
import { uploadFileToFolder } from "./upload";
import { saveLandDetails, patchLandDetails, getSchoolLandDetails } from "./liferay";

// ⚠️ Replace with actual Liferay picklist IDs
const OWNERSHIP_IDS = { Owned: 1, Rented: 2, Government: 3 };
const QUALITY_IDS   = { Excellent: 1, Good: 2, Average: 3, Poor: 4 };

// ── Load existing record ──────────────────────────────────────
export async function loadLandDetails(schoolProfileId) {
  const record = await getSchoolLandDetails(schoolProfileId);
  return {
    record,
    recordId: record?.id || null,
  };
}

// ── Map Liferay response → form state ────────────────────────
export function mapRecordToForm(record) {
  if (!record) return null;
  return {
    ownership:           record.ownershipId === 1 ? "Owned" : record.ownershipId === 2 ? "Rented" : "Government",
    totalAreaAcres:      record.totalAreainAcres      || "",
    compoundWall:        record.schoolCompoundWall    ? "Yes" : "No",
    playground:          record.playground            ? "Yes" : "No",
    playgroundAreaAcres: record.playgroundAreainAcres || "",
    swimmingTank:        record.swimmingTank          ? "Yes" : "No",
    runningTrack:        record.runningTrack          ? "Yes" : "No",
    basketballGround:    record.basketBallGround      ? "Yes" : "No",
    khoKhokabaddiGround: record.khokhoKabbadiGround   ? "Yes" : "No",
    sportsFacilityQuality:
      record.qualityOfSportFacilitiesInfrastrcAvaId === 1 ? "Excellent" :
      record.qualityOfSportFacilitiesInfrastrcAvaId === 2 ? "Good"      :
      record.qualityOfSportFacilitiesInfrastrcAvaId === 3 ? "Average"   : "Poor",
    otherSports: record.othersSports || "",
  };
}

// ── Build payload ─────────────────────────────────────────────
function buildPayload({ land, uploaded, schoolProfileId }) {
  return {
    schoolProfileId:     schoolProfileId || 0,   // foreign key → namankitschoolprofiles.id
    basketBallGround:    land.basketballGround    === "Yes",
    khokhoKabbadiGround: land.khoKhokabaddiGround === "Yes",
    othersSports:        land.otherSports         || "",
    ownershipId:         OWNERSHIP_IDS[land.ownership] || 3,
    playground:          land.playground          === "Yes",
    playgroundAreainAcres: land.playgroundAreaAcres ? Number(land.playgroundAreaAcres) : 0,
    qualityOfSportFacilitiesInfrastrcAvaId: QUALITY_IDS[land.sportsFacilityQuality] || 4,
    runningTrack:        land.runningTrack        === "Yes",
    schoolCompoundWall:  land.compoundWall        === "Yes",
    swimmingTank:        land.swimmingTank        === "Yes",
    totalAreainAcres:    land.totalAreaAcres ? Number(land.totalAreaAcres) : 0,
    uploadSchoolLandPhoto: uploaded
      ? {
          id:         uploaded.documentId,
          name:       uploaded.title,
          fileURL:    uploaded.downloadURL,
          fileBase64: "",
          folder: { externalReferenceCode: "", siteId: 0 },
        }
      : null,
  };
}

// ── Submit (POST or PATCH) ────────────────────────────────────
export async function submitLandDetails({ land, photoFile, schoolProfileId, recordId }) {
  const uploaded = photoFile
    ? await uploadFileToFolder(photoFile, "School Documents")
    : null;

  const payload = buildPayload({ land, uploaded, schoolProfileId });

  console.log(`[LandDetails] ${recordId ? "PATCH" : "POST"} →`, JSON.stringify(payload, null, 2));

  if (recordId) {
    await patchLandDetails(recordId, payload);
  } else {
    await saveLandDetails(payload);
  }

  return payload;
}