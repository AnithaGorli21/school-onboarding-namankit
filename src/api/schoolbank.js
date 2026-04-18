// ============================================================
//  src/api/schoolbank.js
//
//  FIXES:
//  1. uploadCancelledChequeImage structure → { id, name, fileURL, fileBase64, folder }
//     matches swagger exactly (was { documentId, name, url })
//  2. bankAccountNo sent as number (swagger: integer)
//  ⚠️  Endpoint /o/c/schoolbankdetails — verify from swagger URL
// ============================================================

import { uploadFileToFolder } from "./upload.js";

const LIFERAY_USER = "prabhudasu";
const LIFERAY_PASS = "root";

const buildHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Basic " + btoa(`${LIFERAY_USER}:${LIFERAY_PASS}`),
});

export async function saveSchoolBankDetails(form) {
  // Upload cheque image first → get documentId
  const uploaded = form.uploadCancelledChequeImage
    ? await uploadFileToFolder(form.uploadCancelledChequeImage, "School Documents")
    : null;

  // Payload exactly matching swagger schema
  const payload = {
    bankAccountNo:     Number(form.bankAccountNo)        || 0,
    bankBranchAddress: form.bankBranchAddress             || "",
    bankBranchName:    form.bankBranchName                || "",
    bankIFSCCode:      form.bankIFSCCode.toUpperCase()    || "",
    bankName:          form.bankName                      || "",

    // Attachment — exact swagger structure
    uploadCancelledChequeImage: uploaded
      ? {
          id:         uploaded.documentId,
          name:       uploaded.title,
          fileURL:    uploaded.downloadURL,
          fileBase64: "",
          folder: { externalReferenceCode: "", siteId: 0 },
        }
      : null,
  };

  console.log("[SchoolBankDetails] payload →", JSON.stringify(payload, null, 2));

  const response = await fetch("/o/c/schoolbankdetails", {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let msg = `POST /o/c/schoolbankdetails → ${response.status}`;
    try { msg = JSON.parse(errorText)?.title || JSON.parse(errorText)?.message || msg; } catch {}
    throw new Error(msg);
  }

  return response.json();
}