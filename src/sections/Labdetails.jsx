// ============================================================
//  src/sections/LabDetails.jsx
// ============================================================
import { useState } from "react";
import { 
  Field, TextInput, SelectInput, 
  SectionHeading, Row3, Row2, 
  Alert, BtnSave, BtnReset 
} from "../components/FormFields";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  // Computer Lab
  isComputerLabAvailable: "",
  computersWithPeripheralsCount: "",
  computersWorkingCount: "",
  // Chemistry Lab
  isChemistryLabAvailable: "",
  isChemistryLabAreaSufficient: "",
  chemistryLabAreaSqft: "",
  // Biology Lab
  isBiologyLabAvailable: "",
  isBiologyLabAreaSufficient: "",
  biologyLabAreaSqft: "",
  // Physics Lab
  isPhysicsLabAvailable: "",
  isPhysicsLabAreaSufficient: "",
  physicsLabAreaSqft: "",
  // Digital Classroom
  digitalClassroomCount: "",
};

export default function LabDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  // --- Photo handling from your reference code ---
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
    if (!form.isComputerLabAvailable) e.isComputerLabAvailable = "Required";
    if (!form.digitalClassroomCount) e.digitalClassroomCount = "Required";
    if (!photoFile) e.photo = "Photo is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // --- Save Logic using FormData (Required for Files) ---
  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors." });
      return;
    }

    setSaving(true);
    setAlert(null);

    try {
      const data = new FormData();
      
      // Append all text fields
      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      // Append the actual file
      if (photoFile) {
        data.append("labPhoto", photoFile);
      }

      await fetch("/o/c/labdetails", {
        method: "POST",
        credentials: "include",
        // Note: Do NOT set Content-Type header when sending FormData
        body: data, 
      });

      setAlert({ type: "success", message: "Lab Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setPhotoFile(null);
    setErrors({});
    setAlert(null);
  };

  return (
    <div style={{ padding: "16px 20px 32px" }}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={{ background: "#ffffff", border: "1px solid #d6e0e0", borderRadius: 3, padding: "18px 20px 22px" }}>
        
        {/* Computer Lab */}
        <SectionHeading title="Computer Lab Details" />
        <Row3>
          <Field label="Well Equipped Computer Lab (Computers, Printers, Scanners, Internet, etc)" required error={errors.isComputerLabAvailable}>
            <SelectInput value={form.isComputerLabAvailable} onChange={set("isComputerLabAvailable")} options={YES_NO} />
          </Field>
          <Field label="No of Computers in Working Condition (With Printers, Scanners, Internet, etc)">
            <TextInput value={form.computersWithPeripheralsCount} onChange={set("computersWithPeripheralsCount")} type="number" />
          </Field>
          <Field label="No of Computers in Working Condition">
            <TextInput value={form.computersWorkingCount} onChange={set("computersWorkingCount")} type="number" />
          </Field>
        </Row3>

        {/* Chem/Bio/Phys Lab */}
        <div style={{ marginTop: 24 }}>
          <SectionHeading title="Chemistry, Biology & Physics Lab Details" />
          <Row3>
            <Field label="Availability of Chemistry Laboratory with Lab Assistant" required>
              <SelectInput value={form.isChemistryLabAvailable} onChange={set("isChemistryLabAvailable")} options={YES_NO} />
            </Field>
            <Field label="Area of Chemistry Laboratory (Min 150 Sq ft)" required>
              <SelectInput value={form.isChemistryLabAreaSufficient} onChange={set("isChemistryLabAreaSufficient")} options={YES_NO} />
            </Field>
            <Field label="Chemistry lab Available Area Sq ft">
              <TextInput value={form.chemistryLabAreaSqft} onChange={set("chemistryLabAreaSqft")} type="number" />
            </Field>
          </Row3>

          <Row3>
            <Field label="Availability of Biology Laboratory with Lab Assistant" required>
              <SelectInput value={form.isBiologyLabAvailable} onChange={set("isBiologyLabAvailable")} options={YES_NO} />
            </Field>
            <Field label="Area of Biology Laboratory (Min 150 Sq ft)" required>
              <SelectInput value={form.isBiologyLabAreaSufficient} onChange={set("isBiologyLabAreaSufficient")} options={YES_NO} />
            </Field>
            <Field label="Biology lab Available Area Sq ft">
              <TextInput value={form.biologyLabAreaSqft} onChange={set("biologyLabAreaSqft")} type="number" />
            </Field>
          </Row3>

          <Row3>
            <Field label="Availability of Physics Laboratory with Lab Assistant" required>
              <SelectInput value={form.isPhysicsLabAvailable} onChange={set("isPhysicsLabAvailable")} options={YES_NO} />
            </Field>
            <Field label="Area of Physics Laboratory (Min 150 Sq ft)" required>
              <SelectInput value={form.isPhysicsLabAreaSufficient} onChange={set("isPhysicsLabAreaSufficient")} options={YES_NO} />
            </Field>
            <Field label="Physics lab Available Area Sq ft">
              <TextInput value={form.physicsLabAreaSqft} onChange={set("physicsLabAreaSqft")} type="number" />
            </Field>
          </Row3>
        </div>

        {/* Digital Classroom */}
        <div style={{ marginTop: 24 }}>
          <SectionHeading title="Digital Class-room" />
          <Row3>
            <Field label="Number of Digital Classroom in the school" required error={errors.digitalClassroomCount}>
              <TextInput value={form.digitalClassroomCount} onChange={set("digitalClassroomCount")} type="number" />
            </Field>
          </Row3>
        </div>

        {/* Upload Photo Section - Matching Screenshot and Reference Code */}
        <div style={{ marginTop: 28, borderTop: "1px solid #cccccc", paddingTop: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 14 }}>
            Upload Photo
          </div>
          <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 400, marginBottom: 14 }}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>
          <Row3>
            <Field label="Upload Lab Photo" required error={errors.photo}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ fontSize: 13, padding: "4px 0" }}
              />
            </Field>
          </Row3>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}