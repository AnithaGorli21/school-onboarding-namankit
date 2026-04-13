// ============================================================
//  src/sections/DiningFacilitiesDetails.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  diningHallAvailable: "", diningHallCapacity: "",
  cleanDrinkingWater: "", waterPurifier: "",
  kitchenAvailable: "", kitchenType: "",
  separateCookingStaff: "", numberOfCooks: "",
  gasConnection: "", firewoodUsed: "",
  grainStorageAvailable: "", grainStorageCapacity: "",
  vegetableGarden: "", mealTimings: "",
  menuAvailable: "", nutritionStandards: "",
  diningRemark: "",
};

export default function DiningFacilitiesDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/diningfacilities", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setAlert({ type: "success", message: "Dining Facilities Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => { setForm(emptyForm); setAlert(null); };

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Dining Facilities Details" />

      <Row3>
        <Field label="Dining Hall Available" required>
          <SelectInput value={form.diningHallAvailable} onChange={set("diningHallAvailable")} options={YES_NO} />
        </Field>
        <Field label="Dining Hall Capacity">
          <TextInput value={form.diningHallCapacity} onChange={set("diningHallCapacity")} type="number"
            disabled={form.diningHallAvailable !== "Yes"} />
        </Field>
        <Field label="Clean Drinking Water Available" required>
          <SelectInput value={form.cleanDrinkingWater} onChange={set("cleanDrinkingWater")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Water Purifier Available" required>
          <SelectInput value={form.waterPurifier} onChange={set("waterPurifier")} options={YES_NO} />
        </Field>
        <Field label="Kitchen Available" required>
          <SelectInput value={form.kitchenAvailable} onChange={set("kitchenAvailable")} options={YES_NO} />
        </Field>
        <Field label="Kitchen Type">
          <SelectInput value={form.kitchenType} onChange={set("kitchenType")}
            options={["Central Kitchen", "Individual Kitchen", "Contractor"]}
            disabled={form.kitchenAvailable !== "Yes"} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Separate Cooking Staff" required>
          <SelectInput value={form.separateCookingStaff} onChange={set("separateCookingStaff")} options={YES_NO} />
        </Field>
        <Field label="Number of Cooks">
          <TextInput value={form.numberOfCooks} onChange={set("numberOfCooks")} type="number"
            disabled={form.separateCookingStaff !== "Yes"} />
        </Field>
        <Field label="Gas Connection Available" required>
          <SelectInput value={form.gasConnection} onChange={set("gasConnection")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Firewood Used" required>
          <SelectInput value={form.firewoodUsed} onChange={set("firewoodUsed")} options={YES_NO} />
        </Field>
        <Field label="Grain Storage Available" required>
          <SelectInput value={form.grainStorageAvailable} onChange={set("grainStorageAvailable")} options={YES_NO} />
        </Field>
        <Field label="Grain Storage Capacity (Quintals)">
          <TextInput value={form.grainStorageCapacity} onChange={set("grainStorageCapacity")} type="number"
            disabled={form.grainStorageAvailable !== "Yes"} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Vegetable Garden Available" required>
          <SelectInput value={form.vegetableGarden} onChange={set("vegetableGarden")} options={YES_NO} />
        </Field>
        <Field label="Meal Timings Fixed" required>
          <SelectInput value={form.mealTimings} onChange={set("mealTimings")} options={YES_NO} />
        </Field>
        <Field label="Menu Available" required>
          <SelectInput value={form.menuAvailable} onChange={set("menuAvailable")} options={YES_NO} />
        </Field>
      </Row3>

      <Row2>
        <Field label="Nutrition Standards Followed" required>
          <SelectInput value={form.nutritionStandards} onChange={set("nutritionStandards")} options={YES_NO} />
        </Field>
        <Field label="Remark">
          <TextInput value={form.diningRemark} onChange={set("diningRemark")} />
        </Field>
      </Row2>
    </SectionWrapper>
  );
}