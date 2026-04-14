// ============================================================
//  src/sections/LibraryDetails.jsx
// ============================================================
import { useState } from "react";
import { 
  Field, TextInput, SelectInput, 
  SectionHeading, Row3, Row2, 
  Alert, BtnSave, BtnReset 
} from "../components/FormFields";

const YES_NO = ["Yes", "No"];

// Style configuration using CSS Variables for Dynamic Themes
const themeStyles = {
  container: {
    padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px) var(--spacing-xl, 32px)",
  },
  card: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #d6e0e0)",
    borderRadius: "var(--radius-sm, 3px)",
    padding: "18px 20px 22px",
  },
  uploadSection: {
    marginTop: "28px",
    borderTop: "1px solid var(--divider-color, #cccccc)",
    paddingTop: "20px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "400",
    color: "var(--text-primary, #333)",
    marginBottom: "14px",
  },
  noteText: {
    color: "var(--error-color, #cc0000)",
    fontSize: "13px",
    fontWeight: "400",
    marginBottom: "14px",
  },
  fileInput: {
    fontSize: "13px",
    fontFamily: "var(--font-main)",
    padding: "4px 0",
    color: "var(--text-secondary, #666)",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "12px",
  }
};

const emptyForm = {
  separateLibrary: "",
  areaSufficient: "",
  actualArea: "",
  noOfBooks: "",
};

export default function LibraryDetails({ onTabChange }) {
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

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
    if (!form.separateLibrary) e.separateLibrary = "Required";
    if (!form.areaSufficient) e.areaSufficient = "Required";
    if (!form.noOfBooks) e.noOfBooks = "Required";
    if (!photoFile) e.photo = "Library photo is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors." });
      return;
    }
    setSaving(true);
    setAlert(null);

    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (photoFile) data.append("libraryPhoto", photoFile);

      await fetch("/o/c/librarydetails", {
        method: "POST",
        credentials: "include",
        body: data, 
      });

      setAlert({ type: "success", message: "Library Details saved successfully!" });
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
    <div style={themeStyles.container}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={themeStyles.card}>
        <SectionHeading title="Library Details" />
        
        <Row3>
          <Field label="Separate Library" required error={errors.separateLibrary}>
            <SelectInput value={form.separateLibrary} onChange={set("separateLibrary")} options={YES_NO} />
          </Field>
          <Field label="Area (Min 200 Ft with Furniture)" required error={errors.areaSufficient}>
            <SelectInput value={form.areaSufficient} onChange={set("areaSufficient")} options={YES_NO} />
          </Field>
          <Field label="Actual Area">
            <TextInput value={form.actualArea} onChange={set("actualArea")} type="number" />
          </Field>
          <Field label="No of Books" required error={errors.noOfBooks}>
            <TextInput value={form.noOfBooks} onChange={set("noOfBooks")} type="number" />
          </Field>
        </Row3>

        {/* Dynamic Upload Section */}
        <div style={themeStyles.uploadSection}>
          <div style={themeStyles.sectionTitle}>Upload Photo</div>
          <p style={themeStyles.noteText}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>

          <Row3>
            <Field label="Upload Library Photo" required error={errors.photo}>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={themeStyles.fileInput}
              />
            </Field>
          </Row3>
        </div>
      </div>

      <div style={themeStyles.buttonRow}>
        <BtnReset onClick={handleReset} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}