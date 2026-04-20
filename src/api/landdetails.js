// ============================================================
//  src/api/landdetails.js
//  All payload building and API calls for Land Details section
// ============================================================
import { uploadFileToFolder } from "./upload";
import { saveLandDetails } from "./liferay";

// ⚠️ Replace IDs with actual Liferay picklist values
const OWNERSHIP_IDS = { Owned: 1, Rented: 2, Government: 3 };
const QUALITY_IDS   = { Excellent: 1, Good: 2, Average: 3, Poor: 4 };

export async function submitLandDetails({ land, photoFile }) {
  // Step 1 — upload photo if provided
  const uploaded = photoFile
    ? await uploadFileToFolder(photoFile, "School Documents")
    : null;

  // Step 2 — build payload exactly matching swagger
  const payload = {
    basketBallGround:    land.basketballGround    === "Yes",
    khokhoKabbadiGround: land.khoKhokabaddiGround === "Yes",
    othersSports:        land.otherSports         || "",
    ownershipId:         OWNERSHIP_IDS[land.ownership] || 3,
    playground:          land.playground          === "Yes",
    playgroundAreainAcres: land.playgroundAreaAcres ? Number(land.playgroundAreaAcres) : 0,
    qualityOfSportFacilitiesInfrastrcAvaId: QUALITY_IDS[land.sportsFacilityQuality] || 4,
    runningTrack:        land.runningTrack         === "Yes",
    schoolCompoundWall:  land.compoundWall         === "Yes",
    swimmingTank:        land.swimmingTank         === "Yes",
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

  console.log("[LandDetails] payload →", JSON.stringify(payload, null, 2));

  // Step 3 — POST to Liferay
  await saveLandDetails(payload);

  return payload;
}