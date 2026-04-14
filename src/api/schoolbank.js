// ============================================================
//  src/api/schoolbank.js
// ============================================================

// ── Headers (same as your reference) ─────────────────────────
const buildHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: "Basic " + btoa("prabhudasu:root"),
});

// ── Error handler (optional fallback like your ref) ──────────
const safeApiErrorMessage = (errorText, fallback) => {
  try {
    const parsed = JSON.parse(errorText);
    return parsed?.message || fallback;
  } catch {
    return fallback;
  }
};

const apiFallbackMessages = {
  saveSchoolBank: "Failed to save School Bank Details",
};

// ── Base64 helper (moved here for reuse) ─────────────────────
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

// ── Payload Builder ──────────────────────────────────────────
const buildPayload = async (form) => {
  let fileBase64 = "";

  if (form.uploadCancelledChequeImage) {
    fileBase64 = await toBase64(form.uploadCancelledChequeImage);
  }

  return {
    bankName: form.bankName,
    bankBranchName: form.bankBranchName,
    bankIFSCCode: form.bankIFSCCode.toUpperCase(),
    bankAccountNo: Number(form.bankAccountNo),
    bankBranchAddress: form.bankBranchAddress,
    uploadCancelledChequeImage: {
      name: form.uploadCancelledChequeImage?.name || "cheque",
      fileBase64: fileBase64,
    },
  };
};

// ── SAVE API ─────────────────────────────────────────────────
export async function saveSchoolBankDetails(form) {
  const payload = await buildPayload(form);

  const response = await fetch("/o/c/schoolbankdetails", {
    method: "POST",
    headers: buildHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      safeApiErrorMessage(errorText, apiFallbackMessages.saveSchoolBank)
    );
  }

  return response.json();
}