// ============================================================
//  src/sections/DiningFacilitiesDetails.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";

const YES_NO = ["Yes", "No"];

const emptyForm = {
  SeparateDiningHallforBoysandGirls: "", 
  DiningHallAreainSqft: "",
  DiningTable: "", 
  FoodServedAsPerMenu: "",
  DiningHallPhoto: null, // New field
  MenuPhoto: null        // New field
};

export default function DiningFacilitiesDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  // Helper for file inputs
  const handleFileChange = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.files[0] }));
  };

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      // Note: If uploading actual files, you would typically use FormData() 
      // instead of JSON.stringify(form).
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
        <Field label="Separate Dining Hall for Boys and Girls" required>
          <SelectInput value={form.SeparateDiningHallforBoysandGirls} onChange={set("SeparateDiningHallforBoysandGirls")} options={YES_NO} />
        </Field>
        <Field label="Dining Hall Area in Sq.ft">
          <TextInput value={form.DiningHallAreainSqft} onChange={set("DiningHallAreainSqft")} type="number" />
        </Field>
        <Field label="Dining Table" required>
          <SelectInput value={form.DiningTable} onChange={set("DiningTable")} options={YES_NO} />
        </Field>
        <Field label="Food Served As Per Menu" required>
          <SelectInput value={form.FoodServedAsPerMenu} onChange={set("FoodServedAsPerMenu")} options={YES_NO} />
        </Field>
      </Row3>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />

      <SectionHeading title="Upload Photo" />
      
      <p style={{ color: 'red', fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>
        Note:- The size of the photograph should fall between 5KB to 100KB.
      </p>

      <Row2>
        <Field label="Upload Dining Hall Photo" required>
          <input 
            type="file" 
            className="form-control" 
            onChange={handleFileChange("DiningHallPhoto")} 
          />
        </Field>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
          <Field label="Upload Menu" required>
            <input 
              type="file" 
              className="form-control" 
              onChange={handleFileChange("MenuPhoto")} 
            />
          </Field>
          <button 
            type="button" 
            className="btn btn-info" 
            style={{ marginBottom: '5px', backgroundColor: '#5bc0de', color: 'white', border: 'none', padding: '7px 15px', borderRadius: '4px' }}
          >
            View Uploaded Menu
          </button>
        </div>
      </Row2>
      
    </SectionWrapper>
  );
}