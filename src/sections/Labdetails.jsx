// ============================================================
//  src/sections/LabDetails.jsx
//  Matches screenshot: Computer Lab + Chem/Bio/Physics + Digital
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

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
  // Language Lab
  isLanguageLabAvailable: "",
  languageLabComputersCount: "",
  // Mathematics Lab
  isMathsLabAvailable: "",
};

export default function LabDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/labdetails", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setAlert({ type: "success", message: "Lab Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      {/* Computer Lab */}
      <SectionHeading title="Computer Lab Details" />
      <Row3>
        <Field label="Well Equipped Computer Lab (Computers, Printers, Scanners, Internet, etc)" required>
          <SelectInput value={form.isComputerLabAvailable} onChange={set("isComputerLabAvailable")} options={YES_NO} />
        </Field>
        <Field label="No of Computers in Working Condition (With Printers, Scanners, Internet, etc)">
          <TextInput value={form.computersWithPeripheralsCount} onChange={set("computersWithPeripheralsCount")} type="number" />
        </Field>
        <Field label="No of Computers in Working Condition">
          <TextInput value={form.computersWorkingCount} onChange={set("computersWorkingCount")} type="number" />
        </Field>
      </Row3>

      {/* Chemistry, Biology & Physics Lab */}
      <div style={{ marginTop: 24 }}>
        <SectionHeading title="Chemistry, Biology & Physics Lab Details" />

        <Row3>
          <Field label="Availability of Chemistry Laboratory with Lab Assistant" required>
            <SelectInput value={form.isChemistryLabAvailable} onChange={set("isChemistryLabAvailable")} options={YES_NO} />
          </Field>
          <Field label="Area of Chemistry Laboratory (Min 150 Sq ft)" required>
            <SelectInput value={form.isChemistryLabAreaSufficient} onChange={set("isChemistryLabAreaSufficient")} options={YES_NO} />
          </Field>
          <Field label="Chemistry Lab Available Area Sq ft">
            <TextInput value={form.chemistryLabAreaSqft} onChange={set("chemistryLabAreaSqft")} type="number" placeholder="e.g. 170" />
          </Field>
        </Row3>

        <Row3>
          <Field label="Availability of Biology Laboratory with Lab Assistant" required>
            <SelectInput value={form.isBiologyLabAvailable} onChange={set("isBiologyLabAvailable")} options={YES_NO} />
          </Field>
          <Field label="Area of Biology Laboratory (Min 150 Sq ft)" required>
            <SelectInput value={form.isBiologyLabAreaSufficient} onChange={set("isBiologyLabAreaSufficient")} options={YES_NO} />
          </Field>
          <Field label="Biology Lab Available Area Sq ft">
            <TextInput value={form.biologyLabAreaSqft} onChange={set("biologyLabAreaSqft")} type="number" placeholder="e.g. 200" />
          </Field>
        </Row3>

        <Row3>
          <Field label="Availability of Physics Laboratory with Lab Assistant" required>
            <SelectInput value={form.isPhysicsLabAvailable} onChange={set("isPhysicsLabAvailable")} options={YES_NO} />
          </Field>
          <Field label="Area of Physics Laboratory (Min 150 Sq ft)" required>
            <SelectInput value={form.isPhysicsLabAreaSufficient} onChange={set("isPhysicsLabAreaSufficient")} options={YES_NO} />
          </Field>
          <Field label="Physics Lab Available Area Sq ft">
            <TextInput value={form.physicsLabAreaSqft} onChange={set("physicsLabAreaSqft")} type="number" placeholder="e.g. 180" />
          </Field>
        </Row3>
      </div>

      {/* Digital Classroom */}
      <div style={{ marginTop: 24 }}>
        <SectionHeading title="Digital Class-room" />
        <Row3>
          <Field label="Number of Digital Classroom in the school" required>
            <TextInput value={form.digitalClassroomCount} onChange={set("digitalClassroomCount")} type="number" />
          </Field>
        </Row3>
      </div>

      {/* Language Lab */}
      <div style={{ marginTop: 24 }}>
        <SectionHeading title="Language Lab" />
        <Row3>
          <Field label="Language Lab Available" required>
            <SelectInput value={form.isLanguageLabAvailable} onChange={set("isLanguageLabAvailable")} options={YES_NO} />
          </Field>
          <Field label="No of Computers in Language Lab">
            <TextInput value={form.languageLabComputersCount} onChange={set("languageLabComputersCount")} type="number"
              disabled={form.isLanguageLabAvailable !== "Yes"} />
          </Field>
          <Field label="Mathematics Lab Available" required>
            <SelectInput value={form.isMathsLabAvailable} onChange={set("isMathsLabAvailable")} options={YES_NO} />
          </Field>
        </Row3>
      </div>

    </SectionWrapper>
  );
}