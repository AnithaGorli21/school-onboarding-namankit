// ============================================================
//  src/sections/SchoolBasicDetails.jsx
// ============================================================
import { useState, useEffect } from "react";
import SchoolProfile from "./SchoolProfile";
import SchoolIntake from "./SchoolIntake";
import SchoolPerformance from "./SchoolPerformance";
import UploadSchoolProfile from "./UploadSchoolProfile";
import { Alert, BtnSave, BtnReset, BtnBack } from "../components/FormFields";
import { validateSchoolProfile } from "../utils/validate";
import { saveSchoolBasicDetails, patchSchoolBasicDetails, getSchoolProfileById } from "../api/liferay";
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

export default function SchoolBasicDetails({ onTabChange, onSave, schoolProfileId }) {
  const [profile,  setProfile]  = useState(emptyProfile);
  const [intake,   setIntake]   = useState(emptyIntake);
  const [perfRows, setPerfRows] = useState([]);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [alert,       setAlert]       = useState(null);
  const [recordId,    setRecordId]    = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  console.log('schoolProfileId #######', schoolProfileId)

  // ── Load existing record when in edit mode ────────────────
  useEffect(() => {
    console.log("[SchoolBasicDetails] schoolProfileId prop →", schoolProfileId);
    if (!schoolProfileId) return;
    setLoadingData(true);
    getSchoolProfileById(schoolProfileId)
      .then((record) => {
        if (!record) return;
        setRecordId(record.id);
        // Map Liferay response → form state
        setProfile({
          trusteeName:              record.trusteeName              || "",
          schoolName:               record.schoolName               || "",
          address:                  record.address                  || "",
          mobileNumber:             record.mobileNumberTrustee      || "",
          state:                    record.stateId                  || "",
          district:                 record.districtId               || "",
          taluka:                   record.talukaId                 || "",
          village:                  record.villageId                || "",
          pincode:                  record.pincode                  || "",
          emailId:                  record.emailId                  || "",
          poName:                   record.poNameId                 || "",
          udiseCode:                record.udiseCode                || "",
          schoolSelectionYear:      record.schoolSelectionYear      || "",
          schoolRegistrationNumber: record.schoolRegistrationNo     || "",
          schoolBoard:              record.schoolBoardId            || "",
          sscBatchesCompletedCount: record.totalNoOfSscBatchesCompleted || "",
          yearOfEstablishment:      record.yearOfEstablishment      || "",
          isWebsiteAvailable:       record.schoolWebsiteAvailable   ? "Yes" : "No",
          websiteLink:              record.websiteLink              || "",
          schoolAreaType:           record.schoolFallsUnderWhichAreaId || "",
          toiletsPerFloorCount:     record.noOfToiletsOnEachFloorInSchlBuilding || "",
          schoolPhoto:              null,
        });
      })
      .catch((err) => console.error("[SchoolBasicDetails] load error:", err))
      .finally(() => setLoadingData(false));
      console.log('profile=========>',profile)
  }, [schoolProfileId]);

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
      const response = recordId
        ? await patchSchoolBasicDetails(recordId, payload)
        : await saveSchoolBasicDetails(payload);
      // Pass Liferay auto-generated id as schoolId — used as foreign key in all other sections
      onSave?.({ ...profile, ...intake, performance: perfRows, schoolId: response?.id });
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
      {loadingData && (
        <div style={{ textAlign: "center", padding: "12px", color: "#888", fontSize: 13 }}>
          Loading saved data...
        </div>
      )}
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