// ============================================================
//  src/sections/MedicalFacilities.jsx
//
//  FIXES:
//  1. availabilitOfMedicalSickRoom → boolean (was string "Yes"/"No")
//  2. availabilityOfDoctorsInSchoolId → number (was string "Full Time" etc)
//  3. numberOfDoctors/Nurse/Ambulance → number (were strings)
//  4. Uses saveMedicalFacilities from liferay.js (Authorization header)
//  5. Payload matches swagger exactly
//  ⚠️  availabilityOfDoctorsInSchoolId IDs are placeholders — check Liferay picklist
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import { saveMedicalFacilities } from "../api/liferay";

const YES_NO = ["Yes", "No"];

// ⚠️ Replace value IDs with actual Liferay picklist IDs
const TIME_OPTIONS = [
  { value: 1, label: "Full Time" },
  { value: 2, label: "Part Time" },
  { value: 3, label: "Not Available" },
];

const emptyForm = {
  availabilitOfMedicalSickRoom:    "",
  availabilityOfDoctorsInSchoolId: "",
  numberOfAmbulance:               "",
  numberOfDoctors:                 "",
  numberOfNurse:                   "",
};

export default function MedicalFacilities({ onTabChange }) {
  const [form,   setForm]   = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert,  setAlert]  = useState(null);

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const isNotAvailable = Number(form.availabilityOfDoctorsInSchoolId) === 3;

  const handleSave = async () => {
    setSaving(true);
    setAlert(null);
    try {
      // Payload exactly matching swagger schema
      const payload = {
        availabilitOfMedicalSickRoom:    form.availabilitOfMedicalSickRoom === "Yes",
        availabilityOfDoctorsInSchoolId: Number(form.availabilityOfDoctorsInSchoolId) || 0,
        numberOfAmbulance:               Number(form.numberOfAmbulance) || 0,
        numberOfDoctors:                 Number(form.numberOfDoctors)   || 0,
        numberOfNurse:                   Number(form.numberOfNurse)     || 0,
      };

      console.log("[MedicalFacilities] payload →", JSON.stringify(payload, null, 2));
      await saveMedicalFacilities(payload);

      setAlert({ type: "success", message: "Medical Facilities saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper
      alert={alert}
      onCloseAlert={() => setAlert(null)}
      onSave={handleSave}
      onReset={handleReset}
      saving={saving}
    >
      <SectionHeading title="Medical Facilities" />

      <Row3>
        <Field label="Availability of Medical/Sick Room" required>
          <SelectInput value={form.availabilitOfMedicalSickRoom} onChange={set("availabilitOfMedicalSickRoom")} options={YES_NO} />
        </Field>
        <Field label="Availability of Doctors in School" required>
          {/* ⚠️ Stores numeric ID — replace IDs 1,2,3 with actual Liferay picklist values */}
          <SelectInput value={form.availabilityOfDoctorsInSchoolId} onChange={set("availabilityOfDoctorsInSchoolId")} options={TIME_OPTIONS} />
        </Field>
        <Field label="Number of Doctors" required>
          <TextInput value={form.numberOfDoctors} onChange={set("numberOfDoctors")} type="number" disabled={isNotAvailable} />
        </Field>
        <Field label="Number of Nurse" required>
          <TextInput value={form.numberOfNurse} onChange={set("numberOfNurse")} type="number" disabled={isNotAvailable} />
        </Field>
        <Field label="Number of Ambulance" required>
          <TextInput value={form.numberOfAmbulance} onChange={set("numberOfAmbulance")} type="number" disabled={isNotAvailable} />
        </Field>
      </Row3>
    </SectionWrapper>
  );
}