// ============================================================
//  src/sections/MedicalFacilities.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  firstAidBox: "", medicalRoomAvailable: "",
  doctorVisit: "", doctorVisitFrequency: "",
  nurseAvailable: "", nurseName: "", nurseMobile: "",
  annualHealthCheckup: "", dentalCheckup: "", eyeCheckup: "",
  weighingMachine: "", heightMeasurement: "",
  deworming: "", ironFolicSupplementation: "",
  midDayMeal: "", midDayMealType: "",
  cleanToilets: "", separateToiletGirls: "",
  handwashFacility: "", sanitizerAvailable: "",
  medicalRemark: "",
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
        <Field label="First Aid Box Available" required>
          <SelectInput value={form.firstAidBox} onChange={set("firstAidBox")} options={YES_NO} />
        </Field>
        <Field label="Medical Room Available" required>
          <SelectInput value={form.medicalRoomAvailable} onChange={set("medicalRoomAvailable")} options={YES_NO} />
        </Field>
        <Field label="Doctor Visit Arranged" required>
          <SelectInput value={form.doctorVisit} onChange={set("doctorVisit")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Doctor Visit Frequency">
          <SelectInput value={form.doctorVisitFrequency} onChange={set("doctorVisitFrequency")}
            options={["Weekly","Fortnightly","Monthly","Quarterly","Yearly"]}
            disabled={form.doctorVisit !== "Yes"} />
        </Field>
        <Field label="Nurse Available" required>
          <SelectInput value={form.nurseAvailable} onChange={set("nurseAvailable")} options={YES_NO} />
        </Field>
        <Field label="Nurse Name">
          <TextInput value={form.nurseName} onChange={set("nurseName")}
            disabled={form.nurseAvailable !== "Yes"} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Nurse Mobile">
          <TextInput value={form.nurseMobile} onChange={set("nurseMobile")} type="tel"
            disabled={form.nurseAvailable !== "Yes"} />
        </Field>
        <Field label="Annual Health Checkup" required>
          <SelectInput value={form.annualHealthCheckup} onChange={set("annualHealthCheckup")} options={YES_NO} />
        </Field>
        <Field label="Dental Checkup" required>
          <SelectInput value={form.dentalCheckup} onChange={set("dentalCheckup")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Eye Checkup" required>
          <SelectInput value={form.eyeCheckup} onChange={set("eyeCheckup")} options={YES_NO} />
        </Field>
        <Field label="Weighing Machine Available" required>
          <SelectInput value={form.weighingMachine} onChange={set("weighingMachine")} options={YES_NO} />
        </Field>
        <Field label="Height Measurement Available" required>
          <SelectInput value={form.heightMeasurement} onChange={set("heightMeasurement")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Deworming Done" required>
          <SelectInput value={form.deworming} onChange={set("deworming")} options={YES_NO} />
        </Field>
        <Field label="Iron & Folic Acid Supplementation" required>
          <SelectInput value={form.ironFolicSupplementation} onChange={set("ironFolicSupplementation")} options={YES_NO} />
        </Field>
        <Field label="Mid Day Meal Provided" required>
          <SelectInput value={form.midDayMeal} onChange={set("midDayMeal")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Mid Day Meal Type">
          <SelectInput value={form.midDayMealType} onChange={set("midDayMealType")}
            options={["Cooked Meal","Dry Ration","Both"]}
            disabled={form.midDayMeal !== "Yes"} />
        </Field>
        <Field label="Clean Toilets Available" required>
          <SelectInput value={form.cleanToilets} onChange={set("cleanToilets")} options={YES_NO} />
        </Field>
        <Field label="Separate Toilet for Girls" required>
          <SelectInput value={form.separateToiletGirls} onChange={set("separateToiletGirls")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Hand Wash Facility" required>
          <SelectInput value={form.handwashFacility} onChange={set("handwashFacility")} options={YES_NO} />
        </Field>
        <Field label="Sanitizer Available" required>
          <SelectInput value={form.sanitizerAvailable} onChange={set("sanitizerAvailable")} options={YES_NO} />
        </Field>
        <Field label="Remark">
          <TextInput value={form.medicalRemark} onChange={set("medicalRemark")} />
        </Field>
      </Row3>

    </SectionWrapper>
  );
}