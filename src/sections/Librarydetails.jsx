// ============================================================
//  src/sections/LibraryDetails.jsx
// ============================================================
import { useState } from "react";
import { 
  Field, TextInput, SelectInput, 
  SectionHeading, Row3, 
  Alert, BtnSave, BtnReset 
} from "../components/FormFields";

const YES_NO = ["Yes", "No"];

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
    marginBottom: "14px",
  },
  fileInput: {
    fontSize: "13px",
    padding: "4px 0",
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
  areamin200FtWithFurniture: "",
  actualArea: "",
  noOfBooks: "",
};

export default function LibraryDetails() {
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
    if (!form.areamin200FtWithFurniture) e.areamin200FtWithFurniture = "Required"; // ✅ FIX
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
      let base64File = "";

      if (photoFile) {
        base64File = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(photoFile);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = error => reject(error);
        });
      }

      const payload = {
        separateLibrary: form.separateLibrary === "Yes",
        areamin200FtWithFurniture: form.areamin200FtWithFurniture === "Yes",

        actualArea: form.actualArea ? Number(form.actualArea) : 0,
        noOfBooks: form.noOfBooks ? Number(form.noOfBooks) : 0,

        uploadLibraryPhoto: {
          externalReferenceCode: "LIB_PHOTO",
          fileBase64: base64File,
          fileURL: "",
          folder: {
            externalReferenceCode: "LIB_FOLDER",
            siteId: 0
          }
        }
      };

      await fetch("/o/c/librarydetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
            <SelectInput 
              value={form.separateLibrary} 
              onChange={set("separateLibrary")} 
              options={YES_NO} 
            />
          </Field>

          <Field label="Area (Min 200 Ft with Furniture)" required error={errors.areamin200FtWithFurniture}>
            <SelectInput 
              value={form.areamin200FtWithFurniture}   // ✅ FIX
              onChange={set("areamin200FtWithFurniture")} // ✅ FIX
              options={YES_NO} 
            />
          </Field>

          <Field label="Actual Area">
            <TextInput 
              value={form.actualArea} 
              onChange={set("actualArea")} 
              type="number" 
            />
          </Field>

          <Field label="No of Books" required error={errors.noOfBooks}>
            <TextInput 
              value={form.noOfBooks} 
              onChange={set("noOfBooks")} 
              type="number" 
            />
          </Field>
        </Row3>

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