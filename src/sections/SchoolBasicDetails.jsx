// ============================================================
//  src/sections/SchoolBasicDetails.jsx
// ============================================================
import { useState } from "react";
import SchoolProfile from "./SchoolProfile";
import SchoolIntake from "./SchoolIntake";
import SchoolPerformance from "./SchoolPerformance";
import UploadSchoolProfile from "./UploadSchoolProfile";
import { Alert, BtnSave, BtnReset, BtnBack } from "../components/FormFields";
import { validateSchoolProfile } from "../utils/validate";
import { saveSchoolBasicDetails } from "../api/liferay";
import { uploadFileToFolder } from "../api/upload";

const emptyProfile = {
  trusteeName: "",
  schoolName: "",
  address: "",
  mobileNumber: "",
  state: "",
  district: "",
  taluka: "",
  village: "",
  pincode: "",
  emailId: "",
  poName: "",
  udiseCode: "",
  schoolSelectionYear: "",
  schoolRegistrationNumber: "",
  schoolBoard: "",
  sscBatchesCompletedCount: "",
  yearOfEstablishment: "",
  isWebsiteAvailable: "",
  websiteLink: "",
  schoolAreaType: "",
  toiletsPerFloorCount: "",
  schoolPhoto: null,
};

const emptyIntake = {
  namankit_boys_residential: "",
  namankit_boys_nonresidential: "",
  other_boys_residential: "",
  other_boys_nonresidential: "",
  namankit_girls_residential: "",
  namankit_girls_nonresidential: "",
  other_girls_residential: "",
  other_girls_nonresidential: "",
};

export default function SchoolBasicDetails({ onTabChange, onSave }) {
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
      const uploadedPhoto = profile.schoolPhoto
        ? await uploadFileToFolder(profile.schoolPhoto, "School Documents")
        : null;

      // Payload exactly matching swagger schema
      const payload = {
        address:                  profile.address                  || "",
        districtId:               Number(profile.district)         || 0,
        emailId:                  profile.emailId                  || "",
        higherSecondaryUDISECode: "",
        liferayUserId:            0,
        // mobileNumber is Integer in Liferay — 10-digit number overflows Java Integer
        // Sending 0. Actual number is in mobileNumberTrustee/School/Principal (Text fields)
        mobileNumber:             0,
        mobileNumberPrincipal:    profile.mobileNumber             || "",
        mobileNumberSchool:       profile.mobileNumber             || "",
        mobileNumberTrustee:      profile.mobileNumber             || "",
        noOfToiletsOnEachFloorInSchlBuilding: Number(profile.toiletsPerFloorCount) || 0,
        pincode:                  profile.pincode                  || "",
        poName:                   "",
        poNameId:                 Number(profile.poName)           || 0,
        primaryUDISECode:         profile.udiseCode || "",
        schoolBoardId:            Number(profile.schoolBoard)      || 0,
        schoolFallsUnderWhichAreaId: Number(profile.schoolAreaType) || 0,
        schoolMasterID:           0,
        schoolName:               profile.schoolName               || "",
        schoolRegistrationNo:     profile.schoolRegistrationNumber || "",
        // Date field — Liferay requires ISO-8601 "YYYY-MM-DD"
        // "2019-20" → "2019-01-01"
        schoolSelectionYear:      profile.schoolSelectionYear
                                    ? `${profile.schoolSelectionYear.split("-")[0]}-01-01`
                                    : "",
        schoolWebsiteAvailable:   profile.isWebsiteAvailable === "Yes",
        screenName:               "",
        secondaryUDISECode:       "",
        stateId:                  Number(profile.state)            || 0,
        talukaId:                 Number(profile.taluka)           || 0,
        totalNoOfSscBatchesCompleted: Number(profile.sscBatchesCompletedCount) || 0,
        trusteeName:              profile.trusteeName              || "",
        udiseCode:                profile.udiseCode                || "",
        // Attachment — exact swagger structure
        uploadSchoolPhoto: uploadedPhoto
          ? {
              id:         uploadedPhoto.documentId,
              name:       uploadedPhoto.title,
              fileURL:    uploadedPhoto.downloadURL,
              fileBase64: "",
              folder: { externalReferenceCode: "", siteId: 0 },
            }
          : null,
        villageId:            Number(profile.village)          || 0,
        websiteLink:          profile.websiteLink              || "",
        yearOfEstablishment:  Number(profile.yearOfEstablishment) || 0,
      };

      console.log("[SchoolBasicDetails] payload →", JSON.stringify(payload, null, 2));
      await saveSchoolBasicDetails(payload);
      onSave?.({ ...profile, ...intake, performance: perfRows });
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
    <div style={{ padding: "16px 20px 32px" }}>
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}
      <div style={{ background: "#ffffff", border: "1px solid #d6e0e0", borderRadius: 3, padding: "18px 20px 22px" }}>
        <SchoolProfile form={profile} setForm={setProfile} errors={errors} />
        <SchoolIntake intake={intake} setIntake={setIntake} />
        <SchoolPerformance rows={perfRows} setRows={setPerfRows} />
        <UploadSchoolProfile form={profile} setForm={setProfile} errors={errors} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} />
        <BtnBack onClick={() => onTabChange?.("Final Submit")} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}