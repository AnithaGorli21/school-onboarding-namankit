// ============================================================
//  src/App.jsx
// ============================================================
import { useState, useEffect } from "react";
import "./styles/global.css";
import Header                     from "./components/Header";
import TabNav                     from "./components/TabNav";
import Footer                     from "./sections/Footer";
import SchoolBasicDetails         from "./sections/SchoolBasicDetails";
import LandDetails                from "./sections/LandDetails";
import HostelDetails              from "./sections/HostelDetails";
import DiningFacilitiesDetails    from "./sections/Diningfacilitiesdetails";
import LabDetails                 from "./sections/Labdetails";
import LibraryDetails             from "./sections/Librarydetails";
import TeachersDetails            from "./sections/Teachersdetails";
import ExtraCurriculumActivities  from "./sections/Extracurriculumactivities";
import SportsFacilities           from "./sections/Sportsfacilities";
import MedicalFacilities          from "./sections/Medicalfacilities";
import ProfileFeeMaster           from "./sections/Profilefeemaster";
import SchoolBankDetails          from "./sections/Schoolbankdetails";
import FinalSubmit                from "./sections/FinalSubmit";
import PreviewPage                from "./sections/PreviewPage";
import { getSchoolProfiles }       from "./api/liferay";

function ComingSoon({ name }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", color: "#888", fontSize: 14 }}>
      <strong style={{ color: "#555", fontSize: 15 }}>{name}</strong>
      <p style={{ marginTop: 8, fontSize: 13 }}>This section will be built next.</p>
    </div>
  );
}

export default function App() {
  if (window.location.pathname === "/preview") {
    return <PreviewPage />;
  }

  const [activeTab, setActiveTab] = useState("School Basic Details");

  // ── schoolProfileId ───────────────────────────────────────
  // Set after School Basic Details saves, OR loaded from Liferay on mount.
  // = Liferay auto-generated ID from namankitschoolprofiles response
  // Passed to ALL sections as foreign key for load/save/update
  const [schoolProfileId, setSchoolProfileId] = useState(null);

  // On mount — fetch existing school profile to get the ID
  // This handles the case where the user saved School Basic Details
  // in a previous session and comes back to fill other sections
  useEffect(() => {
    getSchoolProfiles()
      .then((record) => {
        if (record?.id) {
          setSchoolProfileId(record.id);
          console.log("[App] schoolProfileId loaded from Liferay →", record.id);
        }
      })
      .catch((err) => console.error("[App] failed to load school profile:", err));
  }, []);

  // ── Master state ──────────────────────────────────────────
  const [masterData, setMasterData] = useState({
    schoolBasic:    {},
    landDetails:    {},
    hostelDetails:  {},
    diningDetails:  {},
    labDetails:     {},
    libraryDetails: {},
    teacherDetails: {},
    extraCurriculum:{},
    sportsDetails:  {},
    medicalDetails: {},
    feeMaster:      {},
    bankDetails:    {},
  });

  const handleSaveSection = (sectionName, data) => {
    setMasterData(prev => ({ ...prev, [sectionName]: data }));
  };

  const renderTab = () => {
    switch (activeTab) {

      case "School Basic Details":
        return <SchoolBasicDetails
                  onTabChange={setActiveTab}
                  onSave={(data) => {
                    handleSaveSection("schoolBasic", data);
                    // Capture Liferay auto-generated id as foreign key for all sections
                    if (data?.schoolId) {
                      setSchoolProfileId(data.schoolId);
                      console.log('[App] schoolProfileId set →', data.schoolId);
                    }
                  }}
                />;

      case "Land Details":
        return <LandDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("landDetails", data)}
                />;

      case "Hostel Details":
        return <HostelDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("hostelDetails", data)}
                />;

      case "Dining Facilities Details":
        return <DiningFacilitiesDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("diningDetails", data)}
                />;

      case "Lab Details":
        return <LabDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("labDetails", data)}
                />;

      case "Library Details":
        return <LibraryDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("libraryDetails", data)}
                />;

      case "Teachers Details":
        return <TeachersDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("teacherDetails", data)}
                />;

      case "Extra Curriculum Activities":
        return <ExtraCurriculumActivities
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("extraCurriculum", data)}
                />;

      case "Sports Facilities":
        return <SportsFacilities
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("sportsDetails", data)}
                />;

      case "Medical Facilities":
        return <MedicalFacilities
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("medicalDetails", data)}
                />;

      case "Profile FeeMaster":
        return <ProfileFeeMaster
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("feeMaster", data)}
                />;

      case "School Bank Details":
        return <SchoolBankDetails
                  onTabChange={setActiveTab}
                  schoolProfileId={schoolProfileId}
                  onSave={(data) => handleSaveSection("bankDetails", data)}
                />;

      case "Final Submit":
        return <FinalSubmit
                  data={masterData}
                  onTabChange={setActiveTab}
                />;

      default:
        return <ComingSoon name={activeTab} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "var(--font-main)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* <Header /> */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ background: "#f0f4f5", flex: 1 }}>
        {renderTab()}
      </div>
      <Footer />
    </div>
  );
}