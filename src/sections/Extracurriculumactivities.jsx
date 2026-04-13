// ============================================================
//  src/sections/ExtraCurriculumActivities.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  // Cultural
  culturalActivities: "", annualDayObserved: "",
  scienceExhibition: "", mathematicsExhibition: "",
  elocutionCompetition: "", essayCompetition: "",
  drawingCompetition: "", singingCompetition: "",
  // NSS / NCC
  nssUnit: "", nccUnit: "", scoutGuide: "",
  // Nature / Environment
  natureClub: "", ecoClub: "", mathsClub: "",
  scienceClub: "", computerClub: "",
  // Health
  yogaClass: "", firstAidTraining: "", healthCheckup: "",
  // Other
  studyTour: "", fieldTrip: "", remarkActivities: "",
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
        <Field label="Cultural Activities Conducted" required>
          <SelectInput value={form.culturalActivities} onChange={set("culturalActivities")} options={YES_NO} />
        </Field>
        <Field label="Annual Day Observed" required>
          <SelectInput value={form.annualDayObserved} onChange={set("annualDayObserved")} options={YES_NO} />
        </Field>
        <Field label="Science Exhibition" required>
          <SelectInput value={form.scienceExhibition} onChange={set("scienceExhibition")} options={YES_NO} />
        </Field>
      </Row3>
      <Row3>
        <Field label="Mathematics Exhibition" required>
          <SelectInput value={form.mathematicsExhibition} onChange={set("mathematicsExhibition")} options={YES_NO} />
        </Field>
        <Field label="Elocution Competition" required>
          <SelectInput value={form.elocutionCompetition} onChange={set("elocutionCompetition")} options={YES_NO} />
        </Field>
        <Field label="Essay Competition" required>
          <SelectInput value={form.essayCompetition} onChange={set("essayCompetition")} options={YES_NO} />
        </Field>
      </Row3>
      <Row2>
        <Field label="Drawing Competition" required>
          <SelectInput value={form.drawingCompetition} onChange={set("drawingCompetition")} options={YES_NO} />
        </Field>
        <Field label="Singing Competition" required>
          <SelectInput value={form.singingCompetition} onChange={set("singingCompetition")} options={YES_NO} />
        </Field>
      </Row2>

      <div style={{ marginTop: 20 }}>
        <SectionHeading title="NSS / NCC / Scout Guide" />
        <Row3>
          <Field label="NSS Unit Available" required>
            <SelectInput value={form.nssUnit} onChange={set("nssUnit")} options={YES_NO} />
          </Field>
          <Field label="NCC Unit Available" required>
            <SelectInput value={form.nccUnit} onChange={set("nccUnit")} options={YES_NO} />
          </Field>
          <Field label="Scout / Guide Available" required>
            <SelectInput value={form.scoutGuide} onChange={set("scoutGuide")} options={YES_NO} />
          </Field>
        </Row3>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionHeading title="Clubs" />
        <Row3>
          <Field label="Nature Club" required>
            <SelectInput value={form.natureClub} onChange={set("natureClub")} options={YES_NO} />
          </Field>
          <Field label="Eco Club" required>
            <SelectInput value={form.ecoClub} onChange={set("ecoClub")} options={YES_NO} />
          </Field>
          <Field label="Maths Club" required>
            <SelectInput value={form.mathsClub} onChange={set("mathsClub")} options={YES_NO} />
          </Field>
        </Row3>
        <Row2>
          <Field label="Science Club" required>
            <SelectInput value={form.scienceClub} onChange={set("scienceClub")} options={YES_NO} />
          </Field>
          <Field label="Computer Club" required>
            <SelectInput value={form.computerClub} onChange={set("computerClub")} options={YES_NO} />
          </Field>
        </Row2>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionHeading title="Health & Other Activities" />
        <Row3>
          <Field label="Yoga Class" required>
            <SelectInput value={form.yogaClass} onChange={set("yogaClass")} options={YES_NO} />
          </Field>
          <Field label="First Aid Training" required>
            <SelectInput value={form.firstAidTraining} onChange={set("firstAidTraining")} options={YES_NO} />
          </Field>
          <Field label="Regular Health Checkup" required>
            <SelectInput value={form.healthCheckup} onChange={set("healthCheckup")} options={YES_NO} />
          </Field>
        </Row3>
        <Row2>
          <Field label="Study Tour Conducted" required>
            <SelectInput value={form.studyTour} onChange={set("studyTour")} options={YES_NO} />
          </Field>
          <Field label="Remark">
            <TextInput value={form.remarkActivities} onChange={set("remarkActivities")} />
          </Field>
        </Row2>
      </div>
    </SectionWrapper>
  );
}