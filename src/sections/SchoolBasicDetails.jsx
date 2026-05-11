// ============================================================
//  src/sections/SchoolBasicDetails.jsx
// ============================================================
import { useState, useEffect } from "react";
import SchoolProfile from "./SchoolProfile";
import SchoolIntake from "./SchoolIntake";
import SchoolPerformance from "./SchoolPerformance";
import UploadSchoolProfile from "./UploadSchoolProfile";
import { Alert, BtnSave, BtnReset, BtnBack } from "../components/FormFields";
import {
  validateAllSchoolBasicDetails,
} from "../utils/validate";
import {
  saveSchoolBasicDetails,
  patchSchoolBasicDetails,
  getSchoolProfileById,
} from "../api/liferay";
import { uploadFileToFolder } from "../api/upload";
import { submitSchoolIntakeStudents } from "../api/schoolIntakeStudents";
import Loader from "../components/Loader";
import { fetchPOByATC } from "../api/fetch-masters";
import { getSchoolDetails, patchSchoolDetails, saveSchoolDetails } from "../api/schoolDetails";
 
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
 
export default function SchoolBasicDetails({ onTabChange, onSave, schoolProfileId, isDisabled = false, onLoadingChange }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [intake, setIntake] = useState(emptyIntake);
  const [perfRows, setPerfRows] = useState([]);
  const [errors, setErrors] = useState({});        // profile field errors
  const [intakeErrors, setIntakeErrors] = useState({});        // intake field errors
  const [photoErrors, setPhotoErrors] = useState({});        // photo errors
  const [perfError, setPerfError] = useState(null);      // performance min-3 error
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [schoolIntakeData, setSchoolIntakeData] = useState([]);
  const [poNames, setPoNames] = useState([]);
  const [schoolDetailsId,setSchoolDetailsId] = useState(null)
 
  useEffect(() => {
    onLoadingChange?.(loadingData || childrenLoading);
  }, [loadingData, childrenLoading, onLoadingChange]);
  useEffect(() => {
     let cancelled = false;
 
     fetchPOByATC()
           .then((data) => {
             console.log("fetch PO masters...", data);
     
             if (!cancelled) setPoNames(Array.isArray(data) ? data : []);
           })
     
           .catch((err) => {
             console.error("[SchoolMasterForm] PO Names load failed:", err);
     
             if (!cancelled) setPoNames([]);
           })
     
           .finally(() => {
             //if (!cancelled) setLoadingPO(false);
           });
   }, []);
  // ── Helper functions to map API IDs to dropdown values ───────────
  const mapSchoolBoardIdToValue = (boardId) => {
    const boardMappings = {
      0: "SSC",
      1: "CBSE",
      2: "ICSE",
      3: "State",
      // Add more mappings as needed based on actual database
    };

    return boardMappings[boardId] || "";
  };

  const mapAreaIdToValue = (areaId) => {
    // TEMPORARY: Use test values when database has 0 to demonstrate prepopulation
    if (!areaId || areaId === 0) return "Rural"; // Temporary test value

    // Map known area IDs to their string values
    // These mappings should match the actual database IDs
    const areaMappings = {
      1: "Rural",
      2: "NagarPalika",
      3: "MahaNagarPalika",
      // Add more mappings as needed based on actual database
    };

    return areaMappings[areaId] || "";
  };
 
  // ── Load existing record ──────────────────────────────────
  useEffect(() => {
    if (!schoolProfileId) return;
    setLoadingData(true);
    console.log('Loading school details for ID:', schoolProfileId);
     Promise.all([
          getSchoolDetails(schoolProfileId)
        ]).then(([schoolDetails]) => {
          if(schoolDetails) {
            console.log('School details...for SchoolBasic.....', schoolDetails);
            const matchedSchool = schoolDetails.find(
          sch => sch.schoolProfileId === school.id
        );

        if (matchedSchool) {
          setSchoolDetailsId(matchedSchool.id);
        }
          }
        }).catch(err=>{

        });

    getSchoolProfileById(schoolProfileId)
      .then((record) => {
        if (!record) return;
        console.log('School Details.....', record)
 
        // Debug missing fields
        console.log('Missing fields debug:', {
          schoolSelectionYear: record.schoolSelectionYear,
          schoolBoardId: record.schoolBoardId,
          schoolFallsUnderWhichAreaId: record.schoolFallsUnderWhichAreaId,
          'Possible intake fields': Object.keys(record).filter(k => k.toLowerCase().includes('intake') || k.toLowerCase().includes('namankit')),
        });
 
        setRecordId(record.id);
        
        const mappedProfile = {
          trusteeName: record.trusteeName || "",
          schoolName: record.schoolName || "",
          address: record.address || "",
          mobileNumber: record.mobileNumberTrustee || "",
          state: record.stateId || "",
          district: record.districtId || "",
          taluka: record.talukaId || "",
          village: record.villageId || "",
          pincode: record.pincode || "",
          emailId: record.emailId || "",
          poName: record.poNameId,
          udiseCode: record.udiseCode || "",
          schoolSelectionYear: record.schoolSelectionYear ? `${new Date(record.schoolSelectionYear).getFullYear()}-${(new Date(record.schoolSelectionYear).getFullYear() + 1).toString().slice(-2)}` : "",
          schoolRegistrationNumber: record.schoolRegistrationNo || "",
          schoolBoard: record.schoolBoardId,
          sscBatchesCompletedCount: record.totalNoOfSscBatchesCompleted || "",
          yearOfEstablishment: record.yearOfEstablishment || "",
          isWebsiteAvailable: record.schoolWebsiteAvailable ? "Yes" : "No",
          websiteLink: record.websiteLink || "",
          schoolAreaType: record.schoolFallsUnderWhichAreaId,
          toiletsPerFloorCount: record.noOfToiletsOnEachFloorInSchlBuilding || "",
          schoolPhoto: record.uploadSchoolPhoto ? {
            documentId: record.uploadSchoolPhoto.id,
            title: record.uploadSchoolPhoto.name,
            downloadURL: record.uploadSchoolPhoto.link?.href || "",
            contentUrl: record.uploadSchoolPhoto.link?.href || "",
            externalReferenceCode: record.uploadSchoolPhoto.externalReferenceCode,
            existingFile: true
          } : null,
        };
        setProfile(mappedProfile);
      })
      .catch((err) => console.error("[SchoolBasicDetails] load error:", err))
      .finally(() => {
        setLoadingData(false);
      });
  }, [schoolProfileId]);
 
  // ── Load Intake Data (if API available) ───────────────────────
  useEffect(() => {
    if (!schoolProfileId) return;
    // TODO: Add intake data loading API call when available
    // For now, intake data will remain empty until API is implemented
    console.log("Intake data loading not implemented - schoolProfileId:", schoolProfileId);
  }, [schoolProfileId]);
 
  // ── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    // Run full validation
    const { profileErrors, intakeErrors, photoErrors, perfError, hasErrors }
      = validateAllSchoolBasicDetails(profile, intake, perfRows);
 
    setErrors(profileErrors);
    setIntakeErrors(intakeErrors);
    setPhotoErrors(photoErrors);
    setPerfError(perfError);
 
    if (hasErrors) {
      setAlert({
        type: "error",
        message: "Please fix the highlighted errors before saving.",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
 
    setSaving(true);
    setAlert(null);
    try {
      // Only upload if it's a new file (not existing)
      const uploadedPhoto = profile.schoolPhoto && !profile.schoolPhoto.existingFile
        ? await uploadFileToFolder(profile.schoolPhoto, "School Documents")
        : profile.schoolPhoto;
 console.log('Profile school......', profile)
      const payload = {
        address: profile.address || "",
        districtId: Number(profile.district) || 0,
        emailId: profile.emailId || "",
        higherSecondaryUDISECode: "",
        liferayUserId: 0,
        mobileNumber: 0,
        mobileNumberPrincipal: profile.mobileNumber || "",
        mobileNumberSchool: profile.mobileNumber || "",
        mobileNumberTrustee: profile.mobileNumber || "",
        noOfToiletsOnEachFloorInSchlBuilding: Number(profile.toiletsPerFloorCount) || 0,
        pincode: profile.pincode || "",
        poName: poNames[profile.poName]?.label || "",
        poNameId: Number(profile.poName) || 0,
        primaryUDISECode: profile.udiseCode || "",
        schoolBoardId: Number(profile.schoolBoard) || 0,
        schoolFallsUnderWhichAreaId: Number(profile.schoolAreaType) || 0,
        schoolMasterID: 0,
        schoolName: profile.schoolName || "",
        schoolRegistrationNo: profile.schoolRegistrationNumber || "",
        schoolSelectionYear: profile.schoolSelectionYear
          ? `${profile.schoolSelectionYear.split("-")[0]}-01-01`
          : "",
        schoolWebsiteAvailable: profile.isWebsiteAvailable === "Yes",
        screenName: "",
        secondaryUDISECode: "",
        stateId: Number(profile.state) || 0,
        talukaId: Number(profile.taluka) || 0,
        totalNoOfSscBatchesCompleted: Number(profile.sscBatchesCompletedCount) || 0,
        trusteeName: profile.trusteeName || "",
        udiseCode: profile.udiseCode || "",
        uploadSchoolPhoto: uploadedPhoto
          ? uploadedPhoto.existingFile 
            ? {
                id: uploadedPhoto.documentId,
                name: uploadedPhoto.title,
                fileURL: uploadedPhoto.downloadURL,
                fileBase64: "",
                folder: { externalReferenceCode: uploadedPhoto.externalReferenceCode || "", siteId: 0 },
              }
            : {
                id: uploadedPhoto.documentId,
                name: uploadedPhoto.title,
                fileURL: uploadedPhoto.downloadURL,
                fileBase64: "",
                folder: { externalReferenceCode: "", siteId: 0 },
              }
          : null,
        villageId: Number(profile.village) || 0,
        websiteLink: profile.websiteLink || "",
        yearOfEstablishment: Number(profile.yearOfEstablishment) || 0,
      };
console.log('payload:::::::', payload);
      const response = recordId
        ? await patchSchoolBasicDetails(recordId, payload)
        : await saveSchoolBasicDetails(payload);

      // Save intake data using the new approach
      if (response?.id || schoolProfileId) {
        try {
          console.log('[SchoolBasicDetails] Saving intake data:', intake);
          const effectiveSchoolProfileId = response?.id || schoolProfileId;
          const intakeResponse = await submitSchoolIntakeStudents({ intake, schoolProfileId: effectiveSchoolProfileId });
          console.log('[SchoolBasicDetails] Intake data saved successfully:', intakeResponse);
          // Update school details
                 const schoolDetailsPayLoad = {
                    schoolProfileId: Number(schoolProfileId),                   
                    schoolName: profile.schoolName,
                    pOName: poNames[profile.poName]?.label || "",
                    noOfGeneralStudents: intakeResponse.totalStudents
                 }
                 if(schoolDetailsId === null || schoolDetailsId === undefined || schoolDetailsId === '') {
                    console.log('Saving school details.....',schoolDetailsId);
                  await saveSchoolDetails(schoolDetailsPayLoad);
                 }else{
                  console.log('Updating school details.....');
                  await patchSchoolDetails(schoolDetailsId, schoolDetailsPayLoad);
                 }
        } catch (intakeErr) {
          console.error('[SchoolBasicDetails] Intake save error:', intakeErr);
          // Don't fail the entire save if intake fails, but show a warning
          setAlert({ 
            type: "warning", 
            message: "School Basic Details saved, but intake data failed to save. Please save again." 
          });
        }
      }

      onSave?.({ ...profile, ...intake, performance: perfRows, schoolId: response?.id });
      if (!alert || alert.type !== "warning") {
        setAlert({ type: "success", message: "School Basic Details saved successfully!" });
      }
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
    setIntakeErrors({});
    setPhotoErrors({});
    setPerfError(null);
    setAlert(null);
  };
 
  return (
    <div style={{ padding: "16px 20px 32px", position: 'relative' }}>
      {(loadingData || childrenLoading) && (
        <div style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute', zIndex: 1000, background: 'rgba(255, 255, 255, 0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader />
        </div>
      )}
 
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}
 
      <div style={{ background: "#ffffff", border: "1px solid #d6e0e0", borderRadius: 3, padding: "18px 20px 22px" }}>
        {/* School Profile fields */}
        <SchoolProfile
          form={profile}
          setForm={setProfile}
          errors={errors}
          isDisabled={isDisabled}
          onApiLoadingChange={setChildrenLoading}
          poNames={poNames}
          setPoNames={setPoNames}
        />
 
        {/* School Intake table with errors */}
        <SchoolIntake
          intake={intake}
          setIntake={setIntake}
          errors={intakeErrors}
          isDisabled={isDisabled}
          schoolProfileId={schoolProfileId}
          onApiLoadingChange={setChildrenLoading}
          setSchoolIntakeData={setSchoolIntakeData}
        />
 
        {/* School Performance with min-3 error */}
        <SchoolPerformance
          rows={perfRows}
          setRows={setPerfRows}
          perfError={perfError}
          isDisabled={isDisabled}
          schoolProfileId={schoolProfileId}
        />
 
        {/* Photo upload with error */}
        <UploadSchoolProfile
          form={profile}
          setForm={setProfile}
          errors={photoErrors}
          isDisabled={isDisabled}
        />
      </div>
 
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={handleReset} disabled={isDisabled} />
        {/* <BtnBack onClick={() => onTabChange?.("Final Submit")} /> */}
        <BtnSave onClick={handleSave} disabled={saving || isDisabled}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}