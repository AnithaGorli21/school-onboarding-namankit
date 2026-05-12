// ============================================================
//  src/sections/Diningfacilitiesdetails.jsx
//  Validations added per Excel spec:
//  - Dining Hall Area: shown ONLY if Separate Dining Hall = Yes (row 85)
//  - Upload Dining Hall Photo: mandatory (row 88)
//  - Upload Menu: mandatory (row 89)
//  - All existing working code unchanged
// ============================================================
import { useState, useEffect } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import { loadDiningDetails, submitDiningDetails, mapRecordToForm } from "../api/DiningDetails";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  SeparateDiningHallforBoysandGirls: "",
  DiningHallAreainSqft:              "",
  DiningTable:                       "",
  FoodServedAsPerMenu:               "",
  DiningHallPhoto:                   null,
  MenuPhoto:                         null,
};

export default function DiningFacilitiesDetails({ onTabChange, onSave, schoolProfileId, onLoadingChange }) {
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [errors,      setErrors]      = useState({});
  const [recordId,    setRecordId]    = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [diningPhotoPreview, setDiningPhotoPreview] = useState(null);
  const [menuPhotoPreview, setMenuPhotoPreview] = useState(null);

  // ── Load existing record on mount ────────────────────────
  useEffect(() => {
    onLoadingChange?.(loadingData);
  }, [loadingData, onLoadingChange]);

  useEffect(() => {
    if (!schoolProfileId) return;
    setLoadingData(true);
    loadDiningDetails(schoolProfileId)
      .then(({ record, recordId: rid }) => {
        setRecordId(rid);
        const formData = mapRecordToForm(record);
        if (formData) setForm(formData);
      })
      .catch((err) => console.error("[DiningDetails] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId]);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Handle photo preview for existing and new photos ───────────────────────
  useEffect(() => {
    if (form.DiningHallPhoto) {
      console.log('[DiningDetails] Setting dining photo preview:', form.DiningHallPhoto);
      // For existing files, use the downloadURL or contentUrl
      if (form.DiningHallPhoto.existingFile) {
        setDiningPhotoPreview(form.DiningHallPhoto.downloadURL || form.DiningHallPhoto.contentUrl);
      } else {
        // For newly selected files, create object URL
        setDiningPhotoPreview(URL.createObjectURL(form.DiningHallPhoto));
      }
    } else {
      setDiningPhotoPreview(null);
    }
  }, [form.DiningHallPhoto]);

  useEffect(() => {
    if (form.MenuPhoto) {
      console.log('[DiningDetails] Setting menu photo preview:', form.MenuPhoto);
      // For existing files, use the downloadURL or contentUrl
      if (form.MenuPhoto.existingFile) {
        setMenuPhotoPreview(form.MenuPhoto.downloadURL || form.MenuPhoto.contentUrl);
      } else {
        // For newly selected files, create object URL
        setMenuPhotoPreview(URL.createObjectURL(form.MenuPhoto));
      }
    } else {
      setMenuPhotoPreview(null);
    }
  }, [form.MenuPhoto]);

  // ── Clear Dining Hall Area when Separate Dining Hall = No
  const onSeparateDiningChange = (v) => {
    setForm((p) => ({
      ...p,
      SeparateDiningHallforBoysandGirls: v,
      DiningHallAreainSqft: v !== "Yes" ? "" : p.DiningHallAreainSqft,
    }));
  };

  const handleFileChange = (k) => (e) => {
    const file = e.target.files[0] || null;
    if (!file) return;
    
    // Validate file size (5KB to 100KB)
    const sizeKB = file.size / 1024;
    if (sizeKB < 5 || sizeKB > 100) {
      setAlert({ type: "error", message: "Photo size must be between 5KB and 100KB." });
      e.target.value = "";
      return;
    }
    
    setForm((p) => ({ ...p, [k]: file }));
    // Clear file error on selection
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e = {};

    // Row 84 — Separate Dining Hall: Mandatory
    if (!form.SeparateDiningHallforBoysandGirls)
      e.SeparateDiningHallforBoysandGirls = "Separate Dining Hall for Boys and Girls is required.";

    // Row 85 — Dining Hall Area: Not mandatory, shown only if Yes (no validation needed)

    // Row 86 — Dining Table: Mandatory
    if (!form.DiningTable)
      e.DiningTable = "Dining Table is required.";

    // Row 87 — Food Served As Per Menu: Mandatory
    if (!form.FoodServedAsPerMenu)
      e.FoodServedAsPerMenu = "Food Served As Per Menu is required.";

    // Row 88 — Upload Dining Hall Photo: Mandatory
    if (!form.DiningHallPhoto)
      e.DiningHallPhoto = "Upload Dining Hall Photo is required.";

    // Row 89 — Upload Menu: Mandatory
    if (!form.MenuPhoto)
      e.MenuPhoto = "Upload Menu is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors before saving." });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      await submitDiningDetails({ form, schoolProfileId, recordId });
      setAlert({ type: "success", message: `Dining Facilities Details ${recordId ? "updated" : "saved"} successfully!` });
      onSave?.(form);
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    setAlert(null);
    setDiningPhotoPreview(null);
    setMenuPhotoPreview(null);
  };

  return (
    <SectionWrapper
      alert={alert}
      onCloseAlert={() => setAlert(null)}
      onSave={handleSave}
      onReset={handleReset}
      saving={saving}
      loading={loadingData}
    >
      <SectionHeading title="Dining Facilities Details" />

      <Row3>
        {/* Row 84 — Separate Dining Hall: Mandatory */}
        <Field label="Separate Dining Hall for Boys and Girls" required error={errors.SeparateDiningHallforBoysandGirls}>
          <SelectInput
            value={form.SeparateDiningHallforBoysandGirls}
            onChange={onSeparateDiningChange}
            options={YES_NO}
          />
        </Field>

        {/* Row 85 — Dining Hall Area: shown ONLY if Yes selected */}
        {form.SeparateDiningHallforBoysandGirls === "Yes" && (
          <Field label="Dining Hall Area in Sq.Ft" error={errors.DiningHallAreainSqft}>
            <TextInput value={form.DiningHallAreainSqft} onChange={set("DiningHallAreainSqft")} type="number" />
          </Field>
        )}

        {/* Row 86 — Dining Table: Mandatory */}
        <Field label="Dining Table" required error={errors.DiningTable}>
          <SelectInput value={form.DiningTable} onChange={set("DiningTable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        {/* Row 87 — Food Served As Per Menu: Mandatory */}
        <Field label="Food Served As Per Menu" required error={errors.FoodServedAsPerMenu}>
          <SelectInput value={form.FoodServedAsPerMenu} onChange={set("FoodServedAsPerMenu")} options={YES_NO} />
        </Field>
      </Row3>

      {/* Upload Section */}
      <div style={{ marginTop: 28, borderTop: "1px solid #cccccc", paddingTop: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 14 }}>
          Upload Photos
        </div>
        <p style={{ color: "#cc0000", fontSize: 13, marginBottom: 14 }}>
          Note:- The size of the photograph should fall between 5KB to 100KB.
        </p>
        <Row2>
          {/* Row 88 — Dining Hall Photo: Mandatory */}
          <div>
            <Field label="Upload Dining Hall Photo" required error={errors.DiningHallPhoto}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange("DiningHallPhoto")}
                style={{ fontSize: 13, padding: "4px 0" }}
              />
            </Field>
            {diningPhotoPreview && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 120, height: 90, border: "1px solid #cccccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                  <img src={diningPhotoPreview} alt="Dining Hall Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, DiningHallPhoto: null }));
                    setDiningPhotoPreview(null);
                  }}
                  style={{
                    fontSize: 11,
                    color: "#cc0000",
                    background: "none",
                    border: "1px solid #cc0000",
                    borderRadius: 3,
                    padding: "2px 6px",
                    cursor: "pointer"
                  }}
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          {/* Row 89 — Upload Menu: Mandatory */}
          <div>
            <Field label="Upload Menu" required error={errors.MenuPhoto}>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange("MenuPhoto")}
                style={{ fontSize: 13, padding: "4px 0" }}
              />
            </Field>
            {menuPhotoPreview && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 120, height: 90, border: "1px solid #cccccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                  {form.MenuPhoto?.name?.toLowerCase().endsWith('.pdf') ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
                      <div style={{ textAlign: "center", color: "#666", fontSize: 12, padding: 8 }}>
                        📄 PDF Menu
                      </div>
                    </div>
                  ) : (
                    <img src={menuPhotoPreview} alt="Menu Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
                  {form.MenuPhoto?.existingFile ? "Current Menu" : "New Menu"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm((p) => ({ ...p, MenuPhoto: null }));
                    setMenuPhotoPreview(null);
                  }}
                  style={{
                    fontSize: 11,
                    color: "#cc0000",
                    background: "none",
                    border: "1px solid #cc0000",
                    borderRadius: 3,
                    padding: "2px 6px",
                    cursor: "pointer"
                  }}
                >
                  Remove Menu
                </button>
              </div>
            )}
          </div>
        </Row2>
      </div>
    </SectionWrapper>
  );
}
