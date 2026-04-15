// ============================================================
//  src/App.jsx — FULLY UPDATED: Master State & Data Handling
// ============================================================
import { useState } from "react";
import "./styles/global.css";
import Header                     from "./components/Header";
import TabNav                     from "./components/TabNav";
import Footer                     from "./sections/Footer";
import SchoolBasicDetails         from "./sections/SchoolBasicDetails";
import LandDetails                from "./sections/LandDetails";
import HostelDetails              from "./sections/HostelDetails";
import DiningFacilitiesDetails    from "./sections/Diningfacilitiesdetails";
import LabDetails                 from "./sections/Labdetails";
import LibraryDetails              from "./sections/Librarydetails";
import TeachersDetails            from "./sections/Teachersdetails";
import ExtraCurriculumActivities  from "./sections/Extracurriculumactivities";
import SportsFacilities           from "./sections/Sportsfacilities";
import MedicalFacilities          from "./sections/Medicalfacilities";
import ProfileFeeMaster           from "./sections/Profilefeemaster";
import SchoolBankDetails          from "./sections/Schoolbankdetails";
import FinalSubmit                from "./sections/FinalSubmit";
import PreviewPage from "./sections/PreviewPage";



function ComingSoon({ name }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", color: "#888", fontSize: 14 }}>
      <strong style={{ color: "#555", fontSize: 15 }}>{name}</strong>
      <p style={{ marginTop: 8, fontSize: 13 }}>This section will be built next.</p>
    </div>
  );
}

export default function App() {
  // ✅ ADD THIS BLOCK HERE
  if (window.location.pathname === "/preview") {
    return <PreviewPage />;
  }
  const [activeTab, setActiveTab] = useState("School Basic Details");

  // Master state to collect data from ALL sections
  const [masterData, setMasterData] = useState({
    schoolBasic: {},
    landDetails: {},
    hostelDetails: {},
    diningDetails: {},
    labDetails: {},
    libraryDetails: {},
    teacherDetails: {},
    extraCurriculum: {},
    sportsDetails: {},
    medicalDetails: {},
    feeMaster: {},
    bankDetails: {},
  });

  // Function to update master state from individual sections
  const handleSaveSection = (sectionName, data) => {
    setMasterData(prev => ({
      ...prev,
      [sectionName]: data
    }));
  };

  const renderTab = () => {
    switch (activeTab) {
      case "School Basic Details":
        return <SchoolBasicDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('schoolBasic', data)} 
                />;
      case "Land Details":
        return <LandDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('landDetails', data)} 
                />;
      case "Hostel Details":
        return <HostelDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('hostelDetails', data)} 
                />;
      case "Dining Facilities Details":
        return <DiningFacilitiesDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('diningDetails', data)} 
                />;
      case "Lab Details":
        return <LabDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('labDetails', data)} 
                />;
      case "Library Details":
        return <LibraryDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('libraryDetails', data)} 
                />;
      case "Teachers Details":
        return <TeachersDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('teacherDetails', data)} 
                />;
      case "Extra Curriculum Activities":
        return <ExtraCurriculumActivities 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('extraCurriculum', data)} 
                />;
      case "Sports Facilities":
        return <SportsFacilities 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('sportsDetails', data)} 
                />;
      case "Medical Facilities":
        return <MedicalFacilities 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('medicalDetails', data)} 
                />;
      case "Profile FeeMaster":
        return <ProfileFeeMaster 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('feeMaster', data)} 
                />;
      case "School Bank Details":
        return <SchoolBankDetails 
                  onTabChange={setActiveTab} 
                  onSave={(data) => handleSaveSection('bankDetails', data)} 
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
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ background: "#f0f4f5", flex: 1 }}>
        {renderTab()}
      </div>
      <Footer />
    </div>
  );
}