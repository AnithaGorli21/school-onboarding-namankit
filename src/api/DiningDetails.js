// ============================================================
//  src/api/diningDetails.js
//
//  loadDiningDetails(schoolProfileId)  → GET existing record
//  submitDiningDetails({ form, schoolProfileId, recordId })
//    → POST if new, PATCH if recordId exists
// ============================================================
import { uploadFileToFolder } from "./upload";
import { saveDiningFacilities, patchDiningFacilities, getDiningFacilities } from "./liferay";

// ── Load existing record ──────────────────────────────────────
export async function loadDiningDetails(schoolProfileId) {
  const record = await getDiningFacilities(schoolProfileId);
  return { record, recordId: record?.id || null };
}

// ── Map Liferay response → form state ────────────────────────
export function mapRecordToForm(record) {
  if (!record) return null;

  // Map Dining Hall Photo if exists
  let diningHallPhotoFile = null;
  if (record.uploadDinningHallPhoto) {
    diningHallPhotoFile = {
      existingFile: true,
      id: record.uploadDinningHallPhoto.id,
      name: record.uploadDinningHallPhoto.name,
      downloadURL: record.uploadDinningHallPhoto.link?.href || record.uploadDinningHallPhoto.link,
      contentUrl: record.uploadDinningHallPhoto.link?.href || record.uploadDinningHallPhoto.link,
    };
  }

  // Map Menu Photo if exists
  let menuPhotoFile = null;
  if (record.uploadMenu) {
    menuPhotoFile = {
      existingFile: true,
      id: record.uploadMenu.id,
      name: record.uploadMenu.name,
      downloadURL: record.uploadMenu.link?.href || record.uploadMenu.link,
      contentUrl: record.uploadMenu.link?.href || record.uploadMenu.link,
    };
  }

  return {
    SeparateDiningHallforBoysandGirls: record.separateDinningHallForBoysAndGirls ? "Yes" : "No",
    DiningHallAreainSqft:              record.dinningHallInAreaInSqft || "",
    DiningTable:                       record.dinningTable            ? "Yes" : "No",
    FoodServedAsPerMenu:               record.foodServedAsPerMenu     ? "Yes" : "No",
    DiningHallPhoto:                   diningHallPhotoFile,
    MenuPhoto:                         menuPhotoFile,
  };
}

// ── Build payload ─────────────────────────────────────────────
function buildPayload({ form, uploadedDining, uploadedMenu, schoolProfileId }) {
  return {
    schoolProfileId:                    schoolProfileId || 0,
    dinningHallInAreaInSqft:            form.DiningHallAreainSqft ? Number(form.DiningHallAreainSqft) : 0,
    dinningTable:                       form.DiningTable                       === "Yes",
    foodServedAsPerMenu:                form.FoodServedAsPerMenu               === "Yes",
    separateDinningHallForBoysAndGirls: form.SeparateDiningHallforBoysandGirls === "Yes",
    uploadDinningHallPhoto: uploadedDining
      ? {
          id:         uploadedDining.documentId,
          name:       uploadedDining.title,
          fileURL:    uploadedDining.downloadURL,
          fileBase64: "",
          folder: { externalReferenceCode: "", siteId: 0 },
        }
      : null,
    uploadMenu: uploadedMenu
      ? {
          id:         uploadedMenu.documentId,
          name:       uploadedMenu.title,
          fileURL:    uploadedMenu.downloadURL,
          fileBase64: "",
          folder: { externalReferenceCode: "", siteId: 0 },
        }
      : null,
  };
}

// ── Submit (POST or PATCH) ────────────────────────────────────
export async function submitDiningDetails({ form, schoolProfileId, recordId }) {
  // Upload both photos in parallel
  const [uploadedDining, uploadedMenu] = await Promise.all([
    form.DiningHallPhoto ? uploadFileToFolder(form.DiningHallPhoto, "School Documents") : Promise.resolve(null),
    form.MenuPhoto       ? uploadFileToFolder(form.MenuPhoto,       "School Documents") : Promise.resolve(null),
  ]);

  const payload = buildPayload({ form, uploadedDining, uploadedMenu, schoolProfileId });

  console.log(`[DiningDetails] ${recordId ? "PATCH" : "POST"} →`, JSON.stringify(payload, null, 2));

  if (recordId) {
    await patchDiningFacilities(recordId, payload);
  } else {
    await saveDiningFacilities(payload);
  }

  return payload;
}