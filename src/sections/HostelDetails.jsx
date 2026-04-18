// ============================================================
//  src/sections/HostelDetails.jsx
//
//  FIXES:
//  1. Endpoint → /o/c/schoolhosteldetails (confirmed from swagger URL)
//  2. uploadHostelPhoto uses uploadFileToFolder → { id, name, fileURL }
//     instead of inline base64
//  3. Uses saveHostelDetails from liferay.js (includes Authorization header)
//  4. Payload matches swagger exactly — no extra fields
// ============================================================
import { useState } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
} from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import { uploadFileToFolder } from "../api/upload";
import { saveHostelDetails } from "../api/liferay";

const YES_NO = ["Yes", "No"];

const HOT_WATER_OPTIONS = [
  { key: "solarWaterheater",   label: "Solar Waterheater" },
  { key: "gasElectric",        label: "Gas/Electric" },
  { key: "traditionalSources", label: "Traditional Sources" },
  { key: "notAvailable",       label: "Not Available" },
];

const emptyForm = {
  studentsClass1to4:          "",
  femaleCaretakers1to4:       "",
  availabilityIncinerators:   "",
  washingMachine:             "",
  separateHostelBuilding:     "",
  areaInSqFt:                 "",
  lightFanBedding:            "",
  hotWater_solarWaterheater:   false,
  hotWater_gasElectric:        false,
  hotWater_traditionalSources: false,
  hotWater_notAvailable:       false,
  totalBoysHostels:    "",
  capacityBoysHostels: "",
  totalGirlsHostels:   "",
  capacityGirlsHostels:"",
  actualBathrooms:  "",
  actualWashrooms:  "",
};

export default function HostelDetails({ onTabChange }) {
  const [form,         setForm]         = useState(emptyForm);
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [alert,        setAlert]        = useState(null);
  const [errors,       setErrors]       = useState({});

  const set = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));

  const grandTotalHostels  = (Number(form.totalBoysHostels)    || 0) + (Number(form.totalGirlsHostels)    || 0);
  const grandTotalCapacity = (Number(form.capacityBoysHostels) || 0) + (Number(form.capacityGirlsHostels) || 0);
  const totalResidentialStudents = grandTotalCapacity;
  const expectedBathrooms = totalResidentialStudents ? Math.ceil(totalResidentialStudents / 20) : 0;
  const expectedWashrooms = totalResidentialStudents ? Math.ceil(totalResidentialStudents / 20) : 0;

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
    setPhotoPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.studentsClass1to4)        e.studentsClass1to4        = "Required";
    if (!form.femaleCaretakers1to4)     e.femaleCaretakers1to4     = "Required";
    if (!form.availabilityIncinerators) e.availabilityIncinerators = "Required";
    if (!form.washingMachine)           e.washingMachine           = "Required";
    if (!form.separateHostelBuilding)   e.separateHostelBuilding   = "Required";
    if (!form.lightFanBedding)          e.lightFanBedding          = "Required";
    if (!HOT_WATER_OPTIONS.some(o => form[`hotWater_${o.key}`]))
                                        e.hotWater                 = "Select at least one option";
    if (!form.totalBoysHostels)         e.totalBoysHostels         = "Required";
    if (!form.capacityBoysHostels)      e.capacityBoysHostels      = "Required";
    if (!form.totalGirlsHostels)        e.totalGirlsHostels        = "Required";
    if (!form.capacityGirlsHostels)     e.capacityGirlsHostels     = "Required";
    if (!form.actualBathrooms)          e.actualBathrooms          = "Required";
    if (!form.actualWashrooms)          e.actualWashrooms          = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      setAlert({ type: "error", message: "Please fix the highlighted errors before saving." });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      const uploaded = photoFile
        ? await uploadFileToFolder(photoFile, "School Documents")
        : null;

      // Payload exactly matching swagger schema
      const payload = {
        actualBathrooms:                    Number(form.actualBathrooms)          || 0,
        actualWashrooms:                    Number(form.actualWashrooms)          || 0,
        areaInSqft:                         Number(form.areaInSqFt)               || 0,
        availabilityOfLghtFansBeddng:       form.lightFanBedding                  === "Yes",
        availibilityOfHotWater:
          form.hotWater_solarWaterheater ||
          form.hotWater_gasElectric      ||
          form.hotWater_traditionalSources,
        availibilityOfIncinerators:         form.availabilityIncinerators         === "Yes",
        availibilityOfSeparateHstlBuildng:  form.separateHostelBuilding           === "Yes",
        availibilityOfWashingMchneForStdnt: form.washingMachine                   === "Yes",
        expectedBathrooms,
        expectedWashrooms,
        grndTtlcapacityOfHstl:              grandTotalCapacity,
        grndTtlnoOfHstl:                    grandTotalHostels,
        totalNoOfFemaleCaretaker1To4:       Number(form.femaleCaretakers1to4)     || 0,
        totalNoOfResidentialStudents:       totalResidentialStudents,
        totalNoOfStdntsStudyngCls1To4:      Number(form.studentsClass1to4)        || 0,
        ttlCapacityOfBoysHstl:              Number(form.capacityBoysHostels)      || 0,
        ttlCapacityOfGirlsHstl:             Number(form.capacityGirlsHostels)     || 0,
        ttlNoOfBoysHstl:                    Number(form.totalBoysHostels)         || 0,
        ttlNoOfGirlsHstl:                   Number(form.totalGirlsHostels)        || 0,

        // Attachment — exact swagger structure
        uploadHostelPhoto: uploaded
          ? {
              id:         uploaded.documentId,
              name:       uploaded.title,
              fileURL:    uploaded.downloadURL,
              fileBase64: "",
              folder: { externalReferenceCode: "", siteId: 0 },
            }
          : null,
      };

      console.log("[HostelDetails] payload →", JSON.stringify(payload, null, 2));
      await saveHostelDetails(payload);

      setAlert({ type: "success", message: "Hostel Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setAlert(null);
  };

  const subHeading = {
    fontSize: 16, fontWeight: 400, color: "#333",
    paddingBottom: 8, marginBottom: 14, marginTop: 24,
    borderBottom: "1px solid #cccccc",
  };

  return (
    <SectionWrapper
      alert={alert}
      onCloseAlert={() => setAlert(null)}
      onSave={handleSave}
      onReset={handleReset}
      saving={saving}
    >
      <SectionHeading title="School Hostel Details" />

      <Row3>
        <Field label="Total Number of Students studying from class 1st to 4th" required error={errors.studentsClass1to4}>
          <TextInput value={form.studentsClass1to4} onChange={set("studentsClass1to4")} type="number" />
        </Field>
        <Field label="Total Number of Female caretakers for Students studying in 1st to 4th standard" required error={errors.femaleCaretakers1to4}>
          <TextInput value={form.femaleCaretakers1to4} onChange={set("femaleCaretakers1to4")} type="number" />
        </Field>
        <Field label="Availability Of incinerators" required error={errors.availabilityIncinerators}>
          <SelectInput value={form.availabilityIncinerators} onChange={set("availabilityIncinerators")} options={YES_NO} />
        </Field>
      </Row3>

      <Row3>
        <Field label="Availability Of washing Machine for students use" required error={errors.washingMachine}>
          <SelectInput value={form.washingMachine} onChange={set("washingMachine")} options={YES_NO} />
        </Field>
        <Field label="Availability Of Separate Hostel Building" required error={errors.separateHostelBuilding}>
          <SelectInput
            value={form.separateHostelBuilding}
            onChange={(v) => setForm((p) => ({ ...p, separateHostelBuilding: v, areaInSqFt: v !== "Yes" ? "" : p.areaInSqFt }))}
            options={YES_NO}
          />
        </Field>
        <Field label="Area In Sq.Ft" error={errors.areaInSqFt}>
          <TextInput
            value={form.areaInSqFt}
            onChange={set("areaInSqFt")}
            type="number"
            disabled={form.separateHostelBuilding !== "Yes"}
            placeholder={form.separateHostelBuilding !== "Yes" ? "N/A" : ""}
          />
        </Field>
      </Row3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px 18px", marginBottom: 12 }}>
        <Field label="Availability Of Light,Fan & Bedding Facility For Each Student" required error={errors.lightFanBedding}>
          <SelectInput value={form.lightFanBedding} onChange={set("lightFanBedding")} options={YES_NO} />
        </Field>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, color: "#333", display: "block", marginBottom: 8 }}>
          Availability of Hot water (Select atleast one availability of Hot water)
          <span style={{ color: "#cc0000", marginLeft: 2 }}>*</span>
        </label>
        {errors.hotWater && (
          <span style={{ color: "#cc0000", fontSize: 11, display: "block", marginBottom: 6 }}>{errors.hotWater}</span>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {HOT_WATER_OPTIONS.map((opt) => (
            <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!!form[`hotWater_${opt.key}`]}
                onChange={(e) => set(`hotWater_${opt.key}`)(e.target.checked)}
                style={{ accentColor: "#1a7a8a", width: 14, height: 14 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div style={subHeading}>Hostel Capacity</div>
      <Row3>
        <Field label="Total Number of Boys Hostels" required error={errors.totalBoysHostels}>
          <TextInput value={form.totalBoysHostels} onChange={set("totalBoysHostels")} type="number" />
        </Field>
        <Field label="Total Capacity of Boys Hostels" required error={errors.capacityBoysHostels}>
          <TextInput value={form.capacityBoysHostels} onChange={set("capacityBoysHostels")} type="number" />
        </Field>
        <Field label="Total Number of Girls Hostels" required error={errors.totalGirlsHostels}>
          <TextInput value={form.totalGirlsHostels} onChange={set("totalGirlsHostels")} type="number" />
        </Field>
      </Row3>
      <Row3>
        <Field label="Total Capacity of Girls Hostels" required error={errors.capacityGirlsHostels}>
          <TextInput value={form.capacityGirlsHostels} onChange={set("capacityGirlsHostels")} type="number" />
        </Field>
        <Field label="Grand Total (Number of Hostels)" required>
          <TextInput value={grandTotalHostels || ""} readOnly />
        </Field>
        <Field label="Grand Total (Capacity of Hostel)" required>
          <TextInput value={grandTotalCapacity || ""} readOnly />
        </Field>
      </Row3>

      <div style={subHeading}>Availability of Bathrooms</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px 18px", marginBottom: 12 }}>
        <Field label="Total No. Of Residential Students" required>
          <TextInput value={totalResidentialStudents || ""} readOnly />
        </Field>
      </div>
      <Row2>
        <Field label="Expected Bathrooms" required>
          <TextInput value={expectedBathrooms || ""} readOnly />
        </Field>
        <Field label="Actual Bathrooms" required error={errors.actualBathrooms}>
          <TextInput value={form.actualBathrooms} onChange={set("actualBathrooms")} type="number" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Expected Washrooms" required>
          <TextInput value={expectedWashrooms || ""} readOnly />
        </Field>
        <Field label="Actual Washrooms" required error={errors.actualWashrooms}>
          <TextInput value={form.actualWashrooms} onChange={set("actualWashrooms")} type="number" />
        </Field>
      </Row2>

      <div style={subHeading}>Upload Photo</div>
      <p style={{ color: "#cc0000", fontSize: 13, fontWeight: 400, marginBottom: 14, lineHeight: 1.5 }}>
        Note:- The size of the photograph should fall between 5KB to 100KB.
      </p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
        <div>
          <Field label="Upload Hostel Photo" required error={errors.photo}>
            <input type="file" accept="image/*" onChange={handlePhotoChange}
              style={{ fontSize: 13, fontFamily: "var(--font-main)", padding: "4px 0" }} />
          </Field>
        </div>
        {photoPreview && (
          <div style={{ width: 120, height: 90, border: "1px solid #ccc", borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
            <img src={photoPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}