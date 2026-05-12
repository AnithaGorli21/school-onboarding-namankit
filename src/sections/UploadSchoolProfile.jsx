// ============================================================
// src/sections/UploadSchoolProfile.jsx
// ============================================================
import { useState, useEffect } from "react";
import { Field, Row3 } from "../components/FormFields";

export default function UploadSchoolProfile({ form, setForm, errors }) {
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (form.schoolPhoto) {
      if (form.schoolPhoto.existingFile) {
        setPhotoPreview(form.schoolPhoto.downloadURL || form.schoolPhoto.contentUrl);
      } else {
        setPhotoPreview(URL.createObjectURL(form.schoolPhoto));
      }
    } else {
      setPhotoPreview(null);
    }
  }, [form.schoolPhoto]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Format validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Only JPG and PNG files are accepted.");
      e.target.value = "";
      return;
    }

    const sizeKB = file.size / 1024;
    if (sizeKB < 5 || sizeKB > 100) {
      alert("Photo size must be between 5KB and 100KB.");
      e.target.value = "";
      return;
    }
    setForm((prev) => ({ ...prev, schoolPhoto: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  return (
    <div style={{ marginTop: 28, borderTop: "1px solid #eee", paddingTop: 20 }}>

      {/* ✅ Fix 2 — Removed duplicate "Upload Photo" heading */}
      {/* ❌ Removed: <div>Upload Photo</div> */}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        <div style={{ flex: "0 0 400px" }}>
          {/* ✅ Fix 1 — Note moved BELOW Choose File */}
          <Field label="Upload School Photo" required error={errors?.schoolPhoto || errors?.photo}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handlePhotoChange}
              style={{ fontSize: 13, fontFamily: "var(--font-main)", padding: "4px 0" }}
            />
          </Field>
          {/* ✅ Note now BELOW the file input */}
          <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 400, marginTop: 8, lineHeight: 1.5 }}>
            Note:- The size of the photograph should fall between 5KB to 100KB.
          </p>
        </div>

        {photoPreview && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 120, height: 90,
              border: "1px solid #cccccc",
              borderRadius: 3, overflow: "hidden",
              flexShrink: 0, marginTop: 10
            }}>
              <img
                src={photoPreview}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, schoolPhoto: null }));
                setPhotoPreview(null);
              }}
              style={{
                fontSize: 11, color: "#cc0000",
                background: "none", border: "1px solid #cc0000",
                borderRadius: 3, padding: "2px 6px", cursor: "pointer"
              }}
            >
              Remove Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}