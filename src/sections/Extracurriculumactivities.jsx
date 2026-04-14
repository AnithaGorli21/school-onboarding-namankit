// ============================================================
//  src/sections/ExtraCurriculumActivities.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  // Cultural
  nccsanctioned: "", scoutguide: "",
  nSS: "", otherCurriculumActivity: "",
};

export default function ExtraCurriculumActivities({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/extracurriculumactivities", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setAlert({ type: "success", message: "Extra Curriculum Activities saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Cultural Activities" />
      <Row3>
  <Field label="NCC (Sanctioned)" required>
    <SelectInput
      value={form.nccsanctioned}
      onChange={set("nccsanctioned")}
      options={YES_NO}
    />
  </Field>

  <Field label="Scout/Guide" required>
    <SelectInput
      value={form.scoutguide}
      onChange={set("scoutguide")}
      options={YES_NO}
    />
  </Field>

  <Field label="NSS" required>
    <SelectInput
      value={form.nSS}
      onChange={set("nSS")}
      options={YES_NO}
    />
  </Field>

  <Field label="Other">
    <TextInput
      value={form.otherCurriculumActivity}
      onChange={set("otherCurriculumActivity")}
    />
  </Field>
</Row3>
     
    </SectionWrapper>
  );
}