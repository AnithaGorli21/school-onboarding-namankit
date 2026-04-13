// ============================================================
//  src/sections/SchoolBasicDetails.jsx
//  "School Basic Details" tab wrapper
//  FIXED: white card matches original — full width, no grey sides
// ============================================================
import { useState } from "react";
import SchoolProfile     from "./SchoolProfile";
import SchoolIntake      from "./SchoolIntake";
import SchoolPerformance from "./SchoolPerformance";
import { Alert, BtnSave, BtnReset, BtnBack } from "../components/FormFields";
import { validateSchoolProfile }             from "../utils/validate";
import { saveSchoolBasicDetails }            from "../api/liferay";

const emptyProfile = {
  trusteeName: "", schoolName: "", address: "", mobileNumber: "",
  district: "", taluka: "", village: "", pincode: "", emailId: "",
  poName: "", udiseCode: "", schoolSelectionYear: "",
  schoolRegistrationNumber: "",
  schoolBoard: "",
  sscBatchesCompletedCount: "", yearOfEstablishment: "",
  isWebsiteAvailable: "", websiteLink: "", schoolAreaType: "",
  toiletsPerFloorCount: "",
  state: "",
};

const emptyIntake = {
  namankit_boys_residential: "", namankit_boys_nonresidential: "",
  other_boys_residential: "", other_boys_nonresidential: "",
  namankit_girls_residential: "", namankit_girls_nonresidential: "",
  other_girls_residential: "", other_girls_nonresidential: "",
};

export default function SchoolBasicDetails({ onTabChange }) {
  const [profile,  setProfile]  = useState(emptyProfile);
  const [intake,   setIntake]   = useState(emptyIntake);
  const [perfRows, setPerfRows] = useState([]);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [alert,    setAlert]    = useState(null);

  const handleSave = async () => {
    const errs = validateSchoolProfile(profile);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setAlert({ type: "error", message: "Please fix the highlighted errors before saving." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      const payload = {
        ...profile,
        district:                 Number(profile.district)                 || null,
        taluka:                   Number(profile.taluka)                   || null,
        village:                  Number(profile.village)                  || null,
        poName:                   Number(profile.poName)                   || null,
        sscBatchesCompletedCount: Number(profile.sscBatchesCompletedCount) || 0,
        yearOfEstablishment:      Number(profile.yearOfEstablishment)      || null,
        toiletsPerFloorCount:     Number(profile.toiletsPerFloorCount)     || 0,
        isWebsiteAvailable:       profile.isWebsiteAvailable === "Yes",
        intakeData:               JSON.stringify(intake),
        performanceData:          JSON.stringify(perfRows),
      };
      await saveSchoolBasicDetails(payload);
      setAlert({ type: "success", message: "School Basic Details saved successfully!" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setAlert({ type: "error", message: "Save failed — " + (err.message || "Please try again.") });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setProfile(emptyProfile);
    setIntake(emptyIntake);
    setPerfRows([]);
    setErrors({});
    setAlert(null);
  };

  return (
    // Outer: light grey page bg — same as original
    <div style={{ padding: "16px 20px 32px" }}>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* White content card — matches original: thin border, no big shadow */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #d6e0e0",
          borderRadius: 3,
          padding: "18px 20px 22px",
        }}
      >
        <SchoolProfile  form={profile}  setForm={setProfile}  errors={errors} />
        <SchoolIntake   intake={intake} setIntake={setIntake} />
        <SchoolPerformance rows={perfRows} setRows={setPerfRows} />
      </div>

      {/* Buttons: right-aligned, matching original Save/Reset/Back */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} />
        <BtnBack  onClick={() => onTabChange && onTabChange("Final Submit")} />
        <BtnSave  onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}
