// ============================================================
//  src/sections/Diningfacilitiesdetails.jsx
//  UI only — API logic in src/api/diningDetails.js
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

export default function DiningFacilitiesDetails({ onTabChange, onSave, schoolProfileId }) {
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [errors,      setErrors]      = useState({});
  const [recordId,    setRecordId]    = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // ── Load existing record on mount ────────────────────────
  useEffect(() => {
    if (!schoolProfileId) return;
    console.log("[DiningDetails] loading for schoolProfileId →", schoolProfileId);
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

  const handleFileChange = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.files[0] || null }));
  };

  const validate = () => {
    const e = {};
    if (!form.SeparateDiningHallforBoysandGirls) e.SeparateDiningHallforBoysandGirls = "Required";
    if (!form.DiningTable)                       e.DiningTable                       = "Required";
    if (!form.FoodServedAsPerMenu)               e.FoodServedAsPerMenu               = "Required";
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
  };

  return (
    <SectionWrapper
      alert={alert}
      onCloseAlert={() => setAlert(null)}
      onSave={handleSave}
      onReset={handleReset}
      saving={saving}
    >
      {loadingData && (
        <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>
          Loading saved data...
        </div>
      )}

      <SectionHeading title="Dining Facilities Details" />

      <Row3>
        <Field label="Separate Dining Hall for Boys and Girls" required error={errors.SeparateDiningHallforBoysandGirls}>
          <SelectInput value={form.SeparateDiningHallforBoysandGirls} onChange={set("SeparateDiningHallforBoysandGirls")} options={YES_NO} />
        </Field>
        <Field label="Dining Hall Area in Sq.Ft">
          <TextInput value={form.DiningHallAreainSqft} onChange={set("DiningHallAreainSqft")} type="number" />
        </Field>
        <Field label="Dining Table" required error={errors.DiningTable}>
          <SelectInput value={form.DiningTable} onChange={set("DiningTable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
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
          <Field label="Upload Dining Hall Photo">
            <input type="file" accept="image/*" onChange={handleFileChange("DiningHallPhoto")}
              style={{ fontSize: 13, padding: "4px 0" }} />
            {form.DiningHallPhoto && (
              <span style={{ fontSize: 12, color: "#555", marginTop: 4, display: "block" }}>
                {form.DiningHallPhoto.name}
              </span>
            )}
          </Field>
          <Field label="Upload Menu">
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange("MenuPhoto")}
              style={{ fontSize: 13, padding: "4px 0" }} />
            {form.MenuPhoto && (
              <span style={{ fontSize: 12, color: "#555", marginTop: 4, display: "block" }}>
                {form.MenuPhoto.name}
              </span>
            )}
          </Field>
        </Row2>
      </div>
    </SectionWrapper>
  );
}