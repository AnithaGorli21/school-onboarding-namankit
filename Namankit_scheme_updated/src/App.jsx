// ============================================================
//  src/App.jsx  — FIXED: correct case strings + clean imports
// ============================================================
import { useState } from "react";
import "./styles/global.css";
import Header                    from "./components/Header";
import TabNav                    from "./components/TabNav";
import Footer                    from "./sections/Footer";
import SchoolBasicDetails        from "./sections/SchoolBasicDetails";
import LandDetails               from "./sections/LandDetails";
import HostelDetails             from "./sections/HostelDetails";
import DiningFacilitiesDetails   from "./sections/Diningfacilitiesdetails";
import LabDetails                from "./sections/Labdetails";
import LibraryDetails            from "./sections/Librarydetails";
import TeachersDetails           from "./sections/Teachersdetails";
import ExtraCurriculumActivities from "./sections/Extracurriculumactivities";
import SportsFacilities          from "./sections/Sportsfacilities";
import MedicalFacilities         from "./sections/Medicalfacilities";
import ProfileFeeMaster          from "./sections/Profilefeemaster";
import SchoolBankDetails         from "./sections/Schoolbankdetails";

function ComingSoon({ name }) {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", color: "#888", fontSize: 14 }}>
      <strong style={{ color: "#555", fontSize: 15 }}>{name}</strong>
      <p style={{ marginTop: 8, fontSize: 13 }}>This section will be built next.</p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("School Basic Details");

  const renderTab = () => {
    switch (activeTab) {
      case "School Basic Details":
        return <SchoolBasicDetails onTabChange={setActiveTab} />;
      case "Land Details":
        return <LandDetails onTabChange={setActiveTab} />;
      case "Hostel Details":
        return <HostelDetails onTabChange={setActiveTab} />;
      case "Dining Facilities Details":
        return <DiningFacilitiesDetails onTabChange={setActiveTab} />;
      case "Lab Details":
        return <LabDetails onTabChange={setActiveTab} />;
      case "Library Details":
        return <LibraryDetails onTabChange={setActiveTab} />;
      case "Teachers Details":
        return <TeachersDetails onTabChange={setActiveTab} />;
      case "Extra Curriculum Activities":
        return <ExtraCurriculumActivities onTabChange={setActiveTab} />;
      case "Sports Facilities":
        return <SportsFacilities onTabChange={setActiveTab} />;
      case "Medical Facilities":
        return <MedicalFacilities onTabChange={setActiveTab} />;
      case "Profile FeeMaster":
        return <ProfileFeeMaster onTabChange={setActiveTab} />;
      case "School Bank Details":
        return <SchoolBankDetails onTabChange={setActiveTab} />;
      case "Final Submit":
        return <ComingSoon name="Final Submit" />;
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
