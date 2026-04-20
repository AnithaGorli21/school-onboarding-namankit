// ============================================================
//  src/App.jsx
//
//  Two views:
//  1. "list"    → SchoolListPage — table of all schools
//  2. "details" → Multi-tab form — edit selected school
//
//  Navigation:
//  - App starts on "list" view
//  - Click Edit on any school → sets schoolProfileId → goes to "details"
//  - Back button in details → returns to list
// ============================================================
import { useState } from "react";
import "./styles/global.css";
import TabNav                     from "./components/TabNav";
import Footer                     from "./sections/Footer";
import SchoolListPage             from "./sections/SchoolListPage";
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
import { getSchoolProfiles }      from "./api/liferay";
import { useEffect } from "react";

export default function App() {
  // ── Preview page ──────────────────────────────────────────
  if (window.location.pathname === "/preview") {
    return <PreviewPage />;
  }

  // ── View state: "list" or "details" ──────────────────────
  const [view,           setView]           = useState("list");
  const [activeTab,      setActiveTab]      = useState("School Basic Details");
  const [schoolProfileId, setSchoolProfileId] = useState(null);

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

  // ── Called from List Page when Edit is clicked ────────────
  const handleEdit = (schoolId) => {
    setSchoolProfileId(schoolId);
    setActiveTab("School Basic Details");
    setView("details");
  };

  // ── Called from New School button ─────────────────────────
  const handleNewSchool = () => {
    setSchoolProfileId(null);
    setMasterData({
      schoolBasic: {}, landDetails: {}, hostelDetails: {}, diningDetails: {},
      labDetails: {}, libraryDetails: {}, teacherDetails: {}, extraCurriculum: {},
      sportsDetails: {}, medicalDetails: {}, feeMaster: {}, bankDetails: {},
    });
    setActiveTab("School Basic Details");
    setView("details");
  };

  // ── Back to list ──────────────────────────────────────────
  const handleBackToList = () => {
    setView("list");
    setSchoolProfileId(null);
  };

  // ── Details tab renderer ──────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "School Basic Details":
        return <SchoolBasicDetails
                  onTabChange={setActiveTab}
                  onSave={(data) => {
                    handleSaveSection("schoolBasic", data);
                    if (data?.schoolId) setSchoolProfileId(data.schoolId);
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
        return <FinalSubmit data={masterData} onTabChange={setActiveTab} />;
      default:
        return null;
    }
  };

  // ── List View ─────────────────────────────────────────────
  if (view === "list") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f5", fontFamily: "var(--font-main)", display: "flex", flexDirection: "column" }}>
        {/* Header bar */}
        <div style={{ background: "#1a2a5e", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>Namankit School Onboarding</span>
          <button
            onClick={handleNewSchool}
            style={{ background: "#fff", color: "#1a7a8a", border: "none", borderRadius: 4, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            + New School
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <SchoolListPage onEdit={handleEdit} />
        </div>
        <Footer />
      </div>
    );
  }

  // ── Details View ──────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "var(--font-main)", display: "flex", flexDirection: "column" }}>
      {/* Back button bar */}
      <div style={{ background: "#f0f4f5", padding: "8px 20px", borderBottom: "1px solid #dee2e6", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={handleBackToList}
          style={{ background: "none", border: "1px solid #1a7a8a", color: "#1a7a8a", borderRadius: 4, padding: "5px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          ← Back to List
        </button>
        {schoolProfileId && (
          <span style={{ fontSize: 13, color: "#888" }}>
            Editing School ID: <strong style={{ color: "#1a7a8a" }}>{schoolProfileId}</strong>
          </span>
        )}
      </div>

      {/* Tabs */}
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Section content */}
      <div style={{ background: "#f0f4f5", flex: 1 }}>
        {renderTab()}
      </div>

      <Footer />
    </div>
  );
}