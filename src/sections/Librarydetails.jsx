// ============================================================
//  src/sections/Librarydetails.jsx
//  UI only — API logic in src/api/libraryDetails.js
// ============================================================
import { useState, useEffect } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import { loadLibraryDetails, submitLibraryDetails, mapRecordToForm } from "../api/LibraryDetails";
import Loader from "../components/Loader";

const YES_NO = ["Yes", "No"];

const themeStyles = {
  container:     { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px) var(--spacing-xl, 32px)", position: "relative" },
  card:          { background: "var(--card-bg, #ffffff)", border: "1px solid var(--border-color, #d6e0e0)", borderRadius: "var(--radius-sm, 3px)", padding: "18px 20px 22px" },
  uploadSection: { marginTop: "28px", borderTop: "1px solid var(--divider-color, #cccccc)", paddingTop: "20px" },
  sectionTitle:  { fontSize: "16px", fontWeight: "400", color: "var(--text-primary, #333)", marginBottom: "14px" },
  noteText:      { color: "var(--error-color, #cc0000)", fontSize: "13px", marginBottom: "14px" },
  fileInput:     { fontSize: "13px", padding: "4px 0" },
  buttonRow:     { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" },
};

const emptyForm = {
  separateLibrary:           "",
  areamin200FtWithFurniture: "",
  actualArea:                "",
  noOfBooks:                 "",
};

export default function LibraryDetails({ onTabChange, onSave, schoolProfileId, onLoadingChange }) {
  const [form,        setForm]        = useState(emptyForm);
  const [photoFile,   setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [errors,      setErrors]      = useState({});
  const [recordId,    setRecordId]    = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // ── Load existing record on mount ────────────────────────
  useEffect(() => {
    onLoadingChange?.(loadingData);
  }, [loadingData, onLoadingChange]);

  useEffect(() => {
    if (!schoolProfileId) return;
    setLoadingData(true);
    loadLibraryDetails(schoolProfileId)
      .then(({ record, recordId: rid }) => {
        setRecordId(rid);
        const formData = mapRecordToForm(record);
        if (formData) {
          setForm(formData);
          // Set photo file if exists in the mapped data
          if (formData.photoFile) {
            setPhotoFile(formData.photoFile);
          }
        }
      })
      .catch((err) => console.error("[LibraryDetails] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId]);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Handle photo preview for existing and new photos ───────────────────────
  useEffect(() => {
    if (photoFile) {
      console.log('[LibraryDetails] Setting photo preview:', photoFile);
      // For existing files, use the downloadURL or contentUrl
      if (photoFile.existingFile) {
        setPhotoPreview(photoFile.downloadURL || photoFile.contentUrl);
      } else {
        // For newly selected files, create object URL
        setPhotoPreview(URL.createObjectURL(photoFile));
      }
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const sizeKB = file.size / 1024;
    if (sizeKB < 5 || sizeKB > 100) {
      setAlert({ type: "error", message: "Photo size must be between 5KB and 100KB." });
      e.target.value = "";
      return;
    }
    setPhotoFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.separateLibrary)           e.separateLibrary           = "Required";
    if (!form.areamin200FtWithFurniture) e.areamin200FtWithFurniture = "Required";
    if (!form.noOfBooks)                 e.noOfBooks                 = "Required";
    if (!photoFile && !recordId)         e.photo                     = "Library photo is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors." });
      return;
    }
    setSaving(true);
    setAlert(null);
    setLoadingData(true);
    try {
      await submitLibraryDetails({ form, photoFile, schoolProfileId, recordId });
      setAlert({ type: "success", message: `Library Details ${recordId ? "updated" : "saved"} successfully!` });
      onSave?.(form);
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
      setLoadingData(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setAlert(null);
  };

  return (
    <div style={themeStyles.container}>
      {loadingData && (
        <div style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute", zIndex: 1000, background: "rgba(255, 255, 255, 0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      )}

      <div style={themeStyles.card}>
        <SectionHeading title="Library Details" />
        <Row3>
          <Field label="Separate Library" required error={errors.separateLibrary}>
            <SelectInput value={form.separateLibrary} onChange={set("separateLibrary")} options={YES_NO} />
          </Field>
          <Field label="Area (Min 200 Ft with Furniture)" required error={errors.areamin200FtWithFurniture}>
            <SelectInput value={form.areamin200FtWithFurniture} onChange={set("areamin200FtWithFurniture")} options={YES_NO} />
          </Field>
          <Field label="Actual Area">
            <TextInput value={form.actualArea} onChange={set("actualArea")} type="number" />
          </Field>
          <Field label="No of Books" required error={errors.noOfBooks}>
            <TextInput value={form.noOfBooks} onChange={set("noOfBooks")} type="number" />
          </Field>
        </Row3>

        <div style={themeStyles.uploadSection}>
          <div style={themeStyles.sectionTitle}>Upload Photo</div>
          <p style={themeStyles.noteText}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div>
              <Field label="Upload Library Photo" required error={errors.photo}>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={themeStyles.fileInput} />
              </Field>
            </div>
            {photoPreview && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 120, height: 90, border: "1px solid #cccccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                  <img src={photoPreview} alt="Library Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}>
                  {photoFile?.existingFile ? "Current Photo" : "New Photo"}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
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
        </div>
      </div>

      <div style={themeStyles.buttonRow}>
        <BtnReset onClick={handleReset} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}
