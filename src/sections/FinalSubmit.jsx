import React, { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import { TH, TD } from "../utils/Tablestyles";

export default function FinalSubmit({ data, onTabChange }) {
  const [showReview, setShowReview] = useState(false);

  const handleFinalSubmit = () => {
    if (window.confirm("Are you sure? You cannot edit after submission.")) {
      console.log("Final Data for Submission:", data);
      alert("Form submitted successfully!");
    }
  };

  // Helper to safely get data
  const val = (section, field) => data?.[section]?.[field] || "---";

  // Shared style for the table container
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    background: "#fff"
  };

  return (
    <div className="final-submit-container" style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", background: "#fff", padding: "20px", marginBottom: "20px", border: "1px solid #ddd" }}>
        <h2 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>Submit School Profile</h2>
        <p style={{ color: "black", fontSize: "14px" }}>
          Instructions : - Do you wish to submit the data for academic year 2026-2027 ...Please note that you will not be edit /delete the data once you submit it.
    
        </p>
        
        {!showReview && (
          <button 
            onClick={() => {
  // Save data to localStorage
  localStorage.setItem("schoolPreviewData", JSON.stringify(data));

  // Open new tab
  window.open("/preview", "_blank");
}}
            style={{ padding: "10px 25px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "10px" }}
          >
            Review
          </button>
        )}
      </div>

      {showReview && (
        <div className="review-content">
          {/* Section 1: School Basic Details */}
          <SectionWrapper title="School Basic Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>School Photo</th>
                  <td style={TD} colSpan="3">{/* Placeholder for Photo Path */} {val('schoolBasic', 'schoolPhoto')}</td>
                </tr>
                <tr>
                  <th style={TH}>Trustee Name :</th>
                  <td style={TD}>{val('schoolBasic', 'trusteeName')}</td>
                  <th style={TH}>School Name :</th>
                  <td style={TD}>{val('schoolBasic', 'schoolName')}</td>
                </tr>
                <tr>
                  <th style={TH}>Address :</th>
                  <td style={TD}>{val('schoolBasic', 'address')}</td>
                  <th style={TH}>Mobile No :</th>
                  <td style={TD}>{val('schoolBasic', 'mobileNo')}</td>
                </tr>
                <tr>
                  <th style={TH}>Email ID :</th>
                  <td style={TD}>{val('schoolBasic', 'emailId')}</td>
                  <th style={TH}>PO Name :</th>
                  <td style={TD}>{val('schoolBasic', 'poName')}</td>
                </tr>
                <tr>
                  <th style={TH}>District Name :</th>
                  <td style={TD}>{val('schoolBasic', 'districtName')}</td>
                  <th style={TH}>Taluka Name :</th>
                  <td style={TD}>{val('schoolBasic', 'talukaName')}</td>
                </tr>
                <tr>
                  <th style={TH}>Village Name :</th>
                  <td style={TD}>{val('schoolBasic', 'villageName')}</td>
                  <th style={TH}>UDISE :</th>
                  <td style={TD}>{val('schoolBasic', 'udise')}</td>
                </tr>
                <tr>
                  <th style={TH}>School Selection Year :</th>
                  <td style={TD}>{val('schoolBasic', 'selectionYear')}</td>
                  <th style={TH}>School Registration No :</th>
                  <td style={TD}>{val('schoolBasic', 'registrationNo')}</td>
                </tr>
                <tr>
                  <th style={TH}>School Board :</th>
                  <td style={TD}>{val('schoolBasic', 'schoolBoard')}</td>
                  <th style={TH}>Total SSC Batches Completed :</th>
                  <td style={TD}>{val('schoolBasic', 'sscBatches')}</td>
                </tr>
                <tr>
                  <th style={TH}>Year Of Establishment :</th>
                  <td style={TD}>{val('schoolBasic', 'establishmentYear')}</td>
                  <th style={TH}>School Falls Under Which Area :</th>
                  <td style={TD}>{val('schoolBasic', 'schoolArea')}</td>
                </tr>
                <tr>
                  <th style={TH}>School Website Available :</th>
                  <td style={TD}>{val('schoolBasic', 'websiteAvailable')}</td>
                  <th style={TH}>Website Link :</th>
                  <td style={TD}>{val('schoolBasic', 'websiteLink')}</td>
                </tr>
                <tr>
                  <th style={TH}>Toilets On Each Floor :</th>
                  <td style={TD} colSpan="3">{val('schoolBasic', 'toiletCount')}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Section 2: Land Details */}
          <SectionWrapper title="Land Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Ownership Type</th>
                  <td style={TD}>{val('landDetails', 'ownership')}</td>
                  <th style={TH}>Total Area (Acres)</th>
                  <td style={TD}>{val('landDetails', 'totalArea')}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Section 3: Hostel Details */}
          <SectionWrapper title="Hostel Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Boys Hostel Capacity</th>
                  <td style={TD}>{val('hostelDetails', 'boysHostelCapacity')}</td>
                  <th style={TH}>Girls Hostel Capacity</th>
                  <td style={TD}>{val('hostelDetails', 'girlsHostelCapacity')}</td>
                </tr>
                <tr>
                  <th style={TH}>Warden Name</th>
                  <td style={TD}>{val('hostelDetails', 'wardenName')}</td>
                  <th style={TH}>Warden Mobile</th>
                  <td style={TD}>{val('hostelDetails', 'wardenMobile')}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Footer Buttons */}
          <div style={{ textAlign: "center", marginTop: "30px", paddingBottom: "40px" }}>
            <button 
              onClick={() => window.print()}
              style={{ padding: "8px 20px", marginRight: "10px", cursor: "pointer", border: "1px solid #ccc" }}
            >
              Print Summary
            </button>
            <button 
              onClick={handleFinalSubmit}
              style={{ padding: "8px 25px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
            >
              Final Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}