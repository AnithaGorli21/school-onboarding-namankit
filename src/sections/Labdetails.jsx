// ============================================================
//  src/sections/Labdetails.jsx
//  Fixes:
//  - Removed duplicate computer field
//  - Fixed alignment for computer lab fields
//  - Area field hidden when Lab availability = No
//  - Consistent "Classroom" (not "Class-room") everywhere
// ============================================================
import { useState, useEffect } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import { loadLabDetails, submitLabDetails, mapRecordToForm } from "../api/LabDetails";
import Loader from "../components/Loader";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  isComputerLabAvailable:        "",
  computersWithPeripheralsCount: "",
  computersWorkingCount:         "",
  isChemistryLabAvailable:       "",
  isChemistryLabAreaSufficient:  "",
  chemistryLabAreaSqft:          "",
  isBiologyLabAvailable:         "",
  isBiologyLabAreaSufficient:    "",
  biologyLabAreaSqft:            "",
  isPhysicsLabAvailable:         "",
  isPhysicsLabAreaSufficient:    "",
  physicsLabAreaSqft:            "",
  digitalClassroomCount:         "",
};

export default function LabDetails({ onTabChange, onSave, schoolProfileId, onLoadingChange }) {
  const [form,        setForm]        = useState(emptyForm);
  const [photoFile,   setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [errors,      setErrors]      = useState({});
  const [recordId,    setRecordId]    = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    onLoadingChange?.(loadingData);
  }, [loadingData, onLoadingChange]);

  useEffect(() => {
    if (!schoolProfileId) return;
    setLoadingData(true);
    loadLabDetails(schoolProfileId)
      .then(({ record, recordId: rid }) => {
        setRecordId(rid);
        const formData = mapRecordToForm(record);
        if (formData) {
          setForm(formData);
          if (formData.photoFile) setPhotoFile(formData.photoFile);
        }
      })
      .catch((err) => console.error("[LabDetails] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId]);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (photoFile) {
      if (photoFile.existingFile) {
        setPhotoPreview(photoFile.downloadURL || photoFile.contentUrl);
      } else {
        setPhotoPreview(URL.createObjectURL(photoFile));
      }
    } else {
      setPhotoPreview(null);
    }
  }, [photoFile]);

  const onComputerLabChange = (v) => {
    setForm((p) => ({
      ...p,
      isComputerLabAvailable:        v,
      computersWithPeripheralsCount: v !== "Yes" ? "" : p.computersWithPeripheralsCount,
      computersWorkingCount:         v !== "Yes" ? "" : p.computersWorkingCount,
    }));
  };

  // ✅ Fix 3 — Clear area fields when Lab availability = No
  const onChemistryLabChange = (v) => {
    setForm((p) => ({
      ...p,
      isChemistryLabAvailable:      v,
      isChemistryLabAreaSufficient: v !== "Yes" ? "" : p.isChemistryLabAreaSufficient,
      chemistryLabAreaSqft:         v !== "Yes" ? "" : p.chemistryLabAreaSqft,
    }));
  };

  const onBiologyLabChange = (v) => {
    setForm((p) => ({
      ...p,
      isBiologyLabAvailable:      v,
      isBiologyLabAreaSufficient: v !== "Yes" ? "" : p.isBiologyLabAreaSufficient,
      biologyLabAreaSqft:         v !== "Yes" ? "" : p.biologyLabAreaSqft,
    }));
  };

  const onPhysicsLabChange = (v) => {
    setForm((p) => ({
      ...p,
      isPhysicsLabAvailable:      v,
      isPhysicsLabAreaSufficient: v !== "Yes" ? "" : p.isPhysicsLabAreaSufficient,
      physicsLabAreaSqft:         v !== "Yes" ? "" : p.physicsLabAreaSqft,
    }));
  };

  const onChemistryAreaChange = (v) => {
    setForm((p) => ({
      ...p,
      isChemistryLabAreaSufficient: v,
      chemistryLabAreaSqft:         v !== "Yes" ? "" : p.chemistryLabAreaSqft,
    }));
  };

  const onBiologyAreaChange = (v) => {
    setForm((p) => ({
      ...p,
      isBiologyLabAreaSufficient: v,
      biologyLabAreaSqft:         v !== "Yes" ? "" : p.biologyLabAreaSqft,
    }));
  };

  const onPhysicsAreaChange = (v) => {
    setForm((p) => ({
      ...p,
      isPhysicsLabAreaSufficient: v,
      physicsLabAreaSqft:         v !== "Yes" ? "" : p.physicsLabAreaSqft,
    }));
  };

  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ Format check
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    setAlert({ 
      type: "error", 
      message: "Invalid file format. Only JPG and PNG files are accepted." 
    });
    e.target.value = "";  // ✅ reset file input
    return;               // ✅ stop execution
  }

  // ✅ Size check
  const sizeKB = file.size / 1024;
  if (sizeKB < 5 || sizeKB > 100) {
    setAlert({ type: "error", message: "Photo size must be between 5KB and 100KB." });
    e.target.value = "";
    return;
  }

  setPhotoFile(file);
  setErrors((p) => ({ ...p, photo: "" }));
};

  const validate = () => {
    const e = {};
    if (!form.isComputerLabAvailable)
      e.isComputerLabAvailable = "Well Equipped Computer Lab is required.";
    if (!form.isChemistryLabAvailable)
      e.isChemistryLabAvailable = "Availability of Chemistry Laboratory is required.";
    // ✅ Fix 3 — Only validate area if Chemistry Lab = Yes
    if (form.isChemistryLabAvailable === "Yes" && !form.isChemistryLabAreaSufficient)
      e.isChemistryLabAreaSufficient = "Area of Chemistry Laboratory is required.";
    if (!form.isBiologyLabAvailable)
      e.isBiologyLabAvailable = "Availability of Biology Laboratory is required.";
    // ✅ Fix 3 — Only validate area if Biology Lab = Yes
    if (form.isBiologyLabAvailable === "Yes" && !form.isBiologyLabAreaSufficient)
      e.isBiologyLabAreaSufficient = "Area of Biology Laboratory is required.";
    if (!form.isPhysicsLabAvailable)
      e.isPhysicsLabAvailable = "Availability of Physics Laboratory is required.";
    // ✅ Fix 3 — Only validate area if Physics Lab = Yes
    if (form.isPhysicsLabAvailable === "Yes" && !form.isPhysicsLabAreaSufficient)
      e.isPhysicsLabAreaSufficient = "Area of Physics Laboratory is required.";
    if (!form.digitalClassroomCount)
      e.digitalClassroomCount = "Number of Digital Classrooms is required.";
    else if (isNaN(Number(form.digitalClassroomCount)) || Number(form.digitalClassroomCount) < 0)
      e.digitalClassroomCount = "Must be a valid positive number.";
    if (!photoFile)
      e.photo = "Lab Photo is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setAlert(null);
    setLoadingData(true);
    try {
      await submitLabDetails({ form, photoFile, schoolProfileId, recordId });
      setAlert({ type: "success", message: `Lab Details ${recordId ? "updated" : "saved"} successfully!` });
      onSave?.(form);
      setLoadingData(false);
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
    <div style={{ padding: "16px 20px 32px", position: "relative" }}>
      {loadingData && (
        <div style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute", zIndex: 1000, background: "rgba(255, 255, 255, 0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      )}

      <div style={{ background: "#ffffff", border: "1px solid #d6e0e0", borderRadius: 3, padding: "18px 20px 22px" }}>

        {/* ── Computer Lab ── */}
        <SectionHeading title="Computer Lab Details" />

        {/* ✅ Fix 2 — Correct alignment: availability in own row */}
        <Row3>
          <Field label="Well Equipped Computer Lab (Computers, Printers, Scanners, Internet, etc)" required error={errors.isComputerLabAvailable}>
            <SelectInput value={form.isComputerLabAvailable} onChange={onComputerLabChange} options={YES_NO} />
          </Field>
          {/* ✅ Fix 1 — Only ONE computer count field (removed duplicate) */}
          {/* ✅ Fix 2 — Both fields in same Row3 for alignment */}
          {form.isComputerLabAvailable === "Yes" && (
            <>
              <Field label="No of Computers in Working Condition (With Printers, Scanners, Internet, etc)">
                <TextInput value={form.computersWithPeripheralsCount} onChange={set("computersWithPeripheralsCount")} type="number" />
              </Field>
              <Field label="No of Computers in Working Condition (Without Peripherals)">
                <TextInput value={form.computersWorkingCount} onChange={set("computersWorkingCount")} type="number" />
              </Field>
            </>
          )}
        </Row3>

        {/* ── Chemistry / Biology / Physics Lab ── */}
        <div style={{ marginTop: 24 }}>
          <SectionHeading title="Chemistry, Biology & Physics Lab Details" />

          {/* Chemistry */}
          <Row3>
            {/* ✅ Fix 3 — onChange clears area fields when No selected */}
            <Field label="Availability of Chemistry Laboratory with Lab Assistant" required error={errors.isChemistryLabAvailable}>
              <SelectInput value={form.isChemistryLabAvailable} onChange={onChemistryLabChange} options={YES_NO} />
            </Field>
            {/* ✅ Fix 3 — Only show area fields when Chemistry Lab = Yes */}
            {form.isChemistryLabAvailable === "Yes" && (
              <>
                <Field label="Area of Chemistry Laboratory (Min 150 Sq ft)" required error={errors.isChemistryLabAreaSufficient}>
                  <SelectInput value={form.isChemistryLabAreaSufficient} onChange={onChemistryAreaChange} options={YES_NO} />
                </Field>
                {form.isChemistryLabAreaSufficient === "Yes" && (
                  <Field label="Chemistry Lab Available Area Sq ft">
                    <TextInput value={form.chemistryLabAreaSqft} onChange={set("chemistryLabAreaSqft")} type="number" />
                  </Field>
                )}
              </>
            )}
          </Row3>

          {/* Biology */}
          <Row3>
            {/* ✅ Fix 3 — onChange clears area fields when No selected */}
            <Field label="Availability of Biology Laboratory with Lab Assistant" required error={errors.isBiologyLabAvailable}>
              <SelectInput value={form.isBiologyLabAvailable} onChange={onBiologyLabChange} options={YES_NO} />
            </Field>
            {/* ✅ Fix 3 — Only show area fields when Biology Lab = Yes */}
            {form.isBiologyLabAvailable === "Yes" && (
              <>
                <Field label="Area of Biology Laboratory (Min 150 Sq ft)" required error={errors.isBiologyLabAreaSufficient}>
                  <SelectInput value={form.isBiologyLabAreaSufficient} onChange={onBiologyAreaChange} options={YES_NO} />
                </Field>
                {form.isBiologyLabAreaSufficient === "Yes" && (
                  <Field label="Biology Lab Available Area Sq ft">
                    <TextInput value={form.biologyLabAreaSqft} onChange={set("biologyLabAreaSqft")} type="number" />
                  </Field>
                )}
              </>
            )}
          </Row3>

          {/* Physics */}
          <Row3>
            {/* ✅ Fix 3 — onChange clears area fields when No selected */}
            <Field label="Availability of Physics Laboratory with Lab Assistant" required error={errors.isPhysicsLabAvailable}>
              <SelectInput value={form.isPhysicsLabAvailable} onChange={onPhysicsLabChange} options={YES_NO} />
            </Field>
            {/* ✅ Fix 3 — Only show area fields when Physics Lab = Yes */}
            {form.isPhysicsLabAvailable === "Yes" && (
              <>
                <Field label="Area of Physics Laboratory (Min 150 Sq ft)" required error={errors.isPhysicsLabAreaSufficient}>
                  <SelectInput value={form.isPhysicsLabAreaSufficient} onChange={onPhysicsAreaChange} options={YES_NO} />
                </Field>
                {form.isPhysicsLabAreaSufficient === "Yes" && (
                  <Field label="Physics Lab Available Area Sq ft">
                    <TextInput value={form.physicsLabAreaSqft} onChange={set("physicsLabAreaSqft")} type="number" />
                  </Field>
                )}
              </>
            )}
          </Row3>
        </div>

        {/* ── Digital Classroom ── */}
        {/* ✅ Fix 4 — Consistent "Classroom" (not "Class-room") */}
        <div style={{ marginTop: 24 }}>
          <SectionHeading title="Digital Classroom" />
          <Row3>
            <Field label="Number of Digital Classrooms in the school" required error={errors.digitalClassroomCount}>
              <TextInput value={form.digitalClassroomCount} onChange={set("digitalClassroomCount")} type="number" />
            </Field>
          </Row3>
        </div>

        {/* ── Upload Photo ── */}
        <div style={{ marginTop: 28, borderTop: "1px solid #cccccc", paddingTop: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 14 }}>Upload Photo</div>
          <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 400, marginBottom: 14 }}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
            <div>
              <Field label="Upload Lab Photo" required error={errors.photo}>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handlePhotoChange}
                  style={{ fontSize: 13, padding: "4px 0" }} />
              </Field>
            </div>
            {photoPreview && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 120, height: 90, border: "1px solid #cccccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                  <img src={photoPreview} alt="Lab Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <button
                  type="button"
                  onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                  style={{ fontSize: 11, color: "#cc0000", background: "none", border: "1px solid #cc0000", borderRadius: 3, padding: "2px 6px", cursor: "pointer" }}
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
    </div>
  );
}