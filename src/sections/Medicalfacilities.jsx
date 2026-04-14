// ============================================================
//  src/sections/MedicalFacilities.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const CSS = `
 /* ================================
   Global Styles
================================ */

body {
  font-family: var(--font-main, Arial, sans-serif);
  background: #f5f7f7;
}

/* ================================
   Buttons
================================ */

.pfm-actions {
  margin-top: 12px;
}

.pfm-save-btn {
  background-color: #2e9e5b;
  color: #ffffff;
  border: 1px solid #2e9e5b;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pfm-save-btn:hover {
  background-color: #25874d;
  border-color: #25874d;
}

.pfm-save-btn:disabled {
  background-color: #a5d6b8;
  border-color: #a5d6b8;
  cursor: not-allowed;
}
`;

const YES_NO = ["Yes", "No"];
const TIME = ["Full Time", "Part Time", "Not Available"]

const emptyForm = {
  availabilitOfMedicalSickRoom: "",
  availabilityOfDoctorsInSchoolId: "",
  numberOfAmbulance: "",
  numberOfDoctors: "",
  numberOfNurse: ""
};


export default function MedicalFacilities({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/medicalfacilities", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setAlert({ type: "success", message: "Medical Facilities saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Medical Facilities" />

    <Row3>
  <Field label="Availability of Medical/Sick Room" required>
    <SelectInput
      value={form.availabilitOfMedicalSickRoom}
      onChange={set("availabilitOfMedicalSickRoom")}
      options={YES_NO}
    />
  </Field>

  <Field label="Availability of Doctors in School" required>
    <SelectInput
      value={form.availabilityOfDoctorsInSchoolId}
      onChange={set("availabilityOfDoctorsInSchoolId")}
      options={TIME}
    />
  </Field>

  <Field label="Number of Doctors" required>
    <TextInput
      value={form.numberOfDoctors}
      onChange={set("numberOfDoctors")}
      disabled={form.availabilityOfDoctorsInSchoolId === "Not Available"}
    />
  </Field>

  <Field label="Number of Nurse" required>
    <TextInput
      value={form.numberOfNurse}
      onChange={set("numberOfNurse")}
      disabled={form.availabilityOfDoctorsInSchoolId === "Not Available"}
    />
  </Field>

  <Field label="Number of Ambulance" required>
    <TextInput
      value={form.numberOfAmbulance}
      onChange={set("numberOfAmbulance")}
      disabled={form.availabilityOfDoctorsInSchoolId === "Not Available"}
    />
  </Field>
</Row3>
{/* ── Save ── */}
<div className="pfm-actions">
  <button
    type="button"
    className="pfm-save-btn"
    onClick={handleSave}
    disabled={saving}
  >
    {saving ? "Saving…" : "Save"}
  </button>
</div>


    </SectionWrapper>
  );
}