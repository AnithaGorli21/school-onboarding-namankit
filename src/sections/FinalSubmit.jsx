// ============================================================
//  src/sections/FinalSubmit.jsx
//  Original design restored.
//  Review button fetches data from Liferay GET APIs.
// ============================================================
import React, { useState } from "react";
import SectionWrapper from "../components/SectionWrapper";
import { TH, TD } from "../utils/Tablestyles";
import {
  getSchoolProfiles, getSchoolLandDetails, getHostelDetails,
  getDiningFacilities, getLabDetails, getLibraryDetails,
  getTeacherDetails, getExtraCurriculum, getSportsFacilities,
  getMedicalFacilities, getProfileFeeMaster, getSchoolBankDetails,
} from "../api/liferay";

export default function FinalSubmit({ data, onTabChange }) {
  const [showReview, setShowReview] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const handleReview = async () => {
    setLoading(true);
    try {
      const [
        schoolBasic, landDetails, hostelDetails, diningDetails,
        labDetails, libraryDetails, teacherDetails, extraCurriculum,
        sportsDetails, medicalDetails, feeMaster, bankDetails,
      ] = await Promise.all([
        getSchoolProfiles(), getSchoolLandDetails(), getHostelDetails(),
        getDiningFacilities(), getLabDetails(), getLibraryDetails(),
        getTeacherDetails(), getExtraCurriculum(), getSportsFacilities(),
        getMedicalFacilities(), getProfileFeeMaster(), getSchoolBankDetails(),
      ]);
      setReviewData({
        schoolBasic, landDetails, hostelDetails, diningDetails,
        labDetails, libraryDetails, teacherDetails, extraCurriculum,
        sportsDetails, medicalDetails, feeMaster, bankDetails,
      });
      setShowReview(true);
    } catch (e) {
      alert("Failed to load review data — " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (window.confirm("Are you sure? You cannot edit after submission.")) {
      console.log("Final Data for Submission:", reviewData);
      alert("Form submitted successfully!");
    }
  };

  // Safe value getter — uses exact Liferay response field names
  const val = (obj, field) => {
    if (!obj) return "---";
    const v = obj[field];
    if (v === null || v === undefined || v === "") return "---";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    return String(v);
  };

  const tableStyle = { width: "100%", borderCollapse: "collapse", marginBottom: "20px", background: "#fff" };

  const sb  = reviewData?.schoolBasic    || {};
  const ld  = reviewData?.landDetails    || {};
  const hd  = reviewData?.hostelDetails  || {};
  const dd  = reviewData?.diningDetails  || {};
  const lab = reviewData?.labDetails     || {};
  const lib = reviewData?.libraryDetails || {};
  const td  = reviewData?.teacherDetails || [];
  const ec  = reviewData?.extraCurriculum|| {};
  const sp  = reviewData?.sportsDetails  || {};
  const md  = reviewData?.medicalDetails || {};
  const fm  = reviewData?.feeMaster      || [];
  const bd  = reviewData?.bankDetails    || {};

  return (
    <div className="final-submit-container" style={{ padding: "20px" }}>

      {/* ── Original top card design ── */}
      <div style={{ textAlign: "center", background: "#fff", padding: "20px", marginBottom: "20px", border: "1px solid #ddd" }}>
        <h2 style={{ color: "#2c3e50", margin: "0 0 10px 0" }}>Submit School Profile</h2>
        <p style={{ color: "black", fontSize: "14px" }}>
          Instructions : - Do you wish to submit the data for academic year 2026-2027 ...Please note that you will not be edit /delete the data once you submit it.
        </p>
        {!showReview && (
          <button
            onClick={handleReview}
            disabled={loading}
            style={{ padding: "10px 25px", background: "#3498db", color: "#fff", border: "none", borderRadius: "4px", cursor: loading ? "default" : "pointer", marginTop: "10px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Loading..." : "Review"}
          </button>
        )}
      </div>

      {/* ── Review sections ── */}
      {showReview && (
        <div className="review-content">

          {/* School Basic Details */}
          <SectionWrapper title="School Basic Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>School Photo</th>
                  <td style={TD} colSpan="3">
                    {sb.uploadSchoolPhoto?.fileURL
                      ? <a href={sb.uploadSchoolPhoto.fileURL} target="_blank" rel="noreferrer">View Photo</a>
                      : "No Photo Uploaded"}
                  </td>
                </tr>
                <tr>
                  <th style={TH}>Trustee Name :</th>
                  <td style={TD}>{val(sb,"trusteeName")}</td>
                  <th style={TH}>School Name :</th>
                  <td style={TD}>{val(sb,"schoolName")}</td>
                </tr>
                <tr>
                  <th style={TH}>Address :</th>
                  <td style={TD}>{val(sb,"address")}</td>
                  <th style={TH}>MobileNo :</th>
                  <td style={TD}>{val(sb,"mobileNumberTrustee")}</td>
                </tr>
                <tr>
                  <th style={TH}>EmailID :</th>
                  <td style={TD}>{val(sb,"emailId")}</td>
                  <th style={TH}>POName :</th>
                  <td style={TD}>{val(sb,"poName")}</td>
                </tr>
                <tr>
                  <th style={TH}>DistrictName :</th>
                  <td style={TD}>{val(sb,"districtId")}</td>
                  <th style={TH}>TalukaName :</th>
                  <td style={TD}>{val(sb,"talukaId")}</td>
                </tr>
                <tr>
                  <th style={TH}>VillageName :</th>
                  <td style={TD}>{val(sb,"villageId")}</td>
                  <th style={TH}>UDISE :</th>
                  <td style={TD}>{val(sb,"udiseCode")}</td>
                </tr>
                <tr>
                  <th style={TH}>School Selection Year :</th>
                  <td style={TD}>{val(sb,"schoolSelectionYear")}</td>
                  <th style={TH}>School Registration No :</th>
                  <td style={TD}>{val(sb,"schoolRegistrationNo")}</td>
                </tr>
                <tr>
                  <th style={TH}>School Board :</th>
                  <td style={TD}>{val(sb,"schoolBoardId")}</td>
                  <th style={TH}>Total Number Of SSC Batches Completed :</th>
                  <td style={TD}>{val(sb,"totalNoOfSscBatchesCompleted")}</td>
                </tr>
                <tr>
                  <th style={TH}>Year Of Establishment :</th>
                  <td style={TD}>{val(sb,"yearOfEstablishment")}</td>
                  <th style={TH}>School Falls Under Which Area :</th>
                  <td style={TD}>{val(sb,"schoolFallsUnderWhichAreaId")}</td>
                </tr>
                <tr>
                  <th style={TH}>School Website Available :</th>
                  <td style={TD}>{val(sb,"schoolWebsiteAvailable")}</td>
                  <th style={TH}>Website Link :</th>
                  <td style={TD}>{val(sb,"websiteLink")}</td>
                </tr>
                <tr>
                  <th style={TH}>Number of Toilets On Each Floor In School Building :</th>
                  <td style={TD} colSpan="3">{val(sb,"noOfToiletsOnEachFloorInSchlBuilding")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Land Details */}
          <SectionWrapper title="Land Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Ownership Type</th>
                  <td style={TD}>{val(ld,"ownershipId")}</td>
                  <th style={TH}>Total Area (Acres)</th>
                  <td style={TD}>{val(ld,"totalAreainAcres")}</td>
                </tr>
                <tr>
                  <th style={TH}>Compound Wall</th>
                  <td style={TD}>{val(ld,"schoolCompoundWall")}</td>
                  <th style={TH}>Playground</th>
                  <td style={TD}>{val(ld,"playground")}</td>
                </tr>
                <tr>
                  <th style={TH}>Swimming Tank</th>
                  <td style={TD}>{val(ld,"swimmingTank")}</td>
                  <th style={TH}>Running Track</th>
                  <td style={TD}>{val(ld,"runningTrack")}</td>
                </tr>
                <tr>
                  <th style={TH}>Basketball Ground</th>
                  <td style={TD}>{val(ld,"basketBallGround")}</td>
                  <th style={TH}>Kho-Kho Ground</th>
                  <td style={TD}>{val(ld,"khokhoKabbadiGround")}</td>
                </tr>
                <tr>
                  <th style={TH}>Sport Quality</th>
                  <td style={TD}>{val(ld,"qualityOfSportFacilitiesInfrastrcAvaId")}</td>
                  <th style={TH}>Other Sports</th>
                  <td style={TD}>{val(ld,"othersSports")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Hostel Details */}
          <SectionWrapper title="Hostel Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Boys Hostel Capacity</th>
                  <td style={TD}>{val(hd,"ttlCapacityOfBoysHstl")}</td>
                  <th style={TH}>Girls Hostel Capacity</th>
                  <td style={TD}>{val(hd,"ttlCapacityOfGirlsHstl")}</td>
                </tr>
                <tr>
                  <th style={TH}>Separate Building</th>
                  <td style={TD}>{val(hd,"availibilityOfSeparateHstlBuildng")}</td>
                  <th style={TH}>Area (Sq.Ft)</th>
                  <td style={TD}>{val(hd,"areaInSqft")}</td>
                </tr>
                <tr>
                  <th style={TH}>Actual Bathrooms</th>
                  <td style={TD}>{val(hd,"actualBathrooms")}</td>
                  <th style={TH}>Actual Washrooms</th>
                  <td style={TD}>{val(hd,"actualWashrooms")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Dining Details */}
          <SectionWrapper title="Dining Facilities Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Separate Dining Hall</th>
                  <td style={TD}>{val(dd,"separateDinningHallForBoysAndGirls")}</td>
                  <th style={TH}>Dining Hall Area (Sq.Ft)</th>
                  <td style={TD}>{val(dd,"dinningHallInAreaInSqft")}</td>
                </tr>
                <tr>
                  <th style={TH}>Dining Table</th>
                  <td style={TD}>{val(dd,"dinningTable")}</td>
                  <th style={TH}>Food Served As Per Menu</th>
                  <td style={TD}>{val(dd,"foodServedAsPerMenu")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Lab Details */}
          <SectionWrapper title="Lab Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Computer Lab</th>
                  <td style={TD}>{val(lab,"wellEquipmentCompLab")}</td>
                  <th style={TH}>Computers (Working)</th>
                  <td style={TD}>{val(lab,"noOfCompInWrkngCond")}</td>
                </tr>
                <tr>
                  <th style={TH}>Chemistry Lab</th>
                  <td style={TD}>{val(lab,"availabilityOfChemistryLabWithLabAsst")}</td>
                  <th style={TH}>Biology Lab</th>
                  <td style={TD}>{val(lab,"availabilityOfBiologyLabWithLabAsst")}</td>
                </tr>
                <tr>
                  <th style={TH}>Physics Lab</th>
                  <td style={TD}>{val(lab,"availabilityOfPhysicsLabWithLabAsst")}</td>
                  <th style={TH}>Digital Classrooms</th>
                  <td style={TD}>{val(lab,"numberOfDigitalClassroomInSchool")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Library Details */}
          <SectionWrapper title="Library Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Separate Library</th>
                  <td style={TD}>{val(lib,"separateLibrary")}</td>
                  <th style={TH}>Area Min 200 Ft</th>
                  <td style={TD}>{val(lib,"areamin200FtWithFurniture")}</td>
                </tr>
                <tr>
                  <th style={TH}>Actual Area</th>
                  <td style={TD}>{val(lib,"actualArea")}</td>
                  <th style={TH}>No of Books</th>
                  <td style={TD}>{val(lib,"noOfBooks")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Teacher Details */}
          {td.length > 0 && (
            <SectionWrapper title="Teachers Details">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={TH}>Name</th>
                    <th style={TH}>Qualification</th>
                    <th style={TH}>Gender</th>
                    <th style={TH}>Experience</th>
                    <th style={TH}>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {td.map((t, i) => (
                    <tr key={i}>
                      <td style={TD}>{t.name || "---"}</td>
                      <td style={TD}>{t.highestQualification || "---"}</td>
                      <td style={TD}>{t.genderId === 1 ? "Male" : t.genderId === 2 ? "Female" : "Other"}</td>
                      <td style={TD}>{t.yearOfExperience ?? "---"}</td>
                      <td style={TD}>{t.subject1Id || "---"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionWrapper>
          )}

          {/* Extra Curriculum */}
          <SectionWrapper title="Extra Curriculum Activities">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>NCC Sanctioned</th>
                  <td style={TD}>{val(ec,"nccsanctioned")}</td>
                  <th style={TH}>Scout/Guide</th>
                  <td style={TD}>{val(ec,"scoutguide")}</td>
                </tr>
                <tr>
                  <th style={TH}>NSS</th>
                  <td style={TD}>{val(ec,"nSS")}</td>
                  <th style={TH}>Other Activity</th>
                  <td style={TD}>{val(ec,"otherCurriculumActivity")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Sports Facilities */}
          <SectionWrapper title="Sports Facilities">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>PT Teachers</th>
                  <td style={TD}>{val(sp,"noOfPhysicalEducationPTTeacherAvailable")}</td>
                  <th style={TH}>Sports Count</th>
                  <td style={TD}>{val(sp,"numberOfSportsPlayedOnPlayground")}</td>
                </tr>
                <tr>
                  <th style={TH}>Sports Details</th>
                  <td style={TD} colSpan="3">{val(sp,"detailsOfSportsPlayedOnPlayground")}</td>
                </tr>
                <tr>
                  <th style={TH}>Auditorium</th>
                  <td style={TD}>{val(sp,"availabilityOfSeparateAuditorium")}</td>
                  <th style={TH}>Auditorium Area</th>
                  <td style={TD}>{val(sp,"auditoriumAreasqFt")}</td>
                </tr>
                <tr>
                  <th style={TH}>School Magazine</th>
                  <td style={TD} colSpan="3">{val(sp,"schoolMagazine")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Medical Facilities */}
          <SectionWrapper title="Medical Facilities">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Medical Room</th>
                  <td style={TD}>{val(md,"availabilitOfMedicalSickRoom")}</td>
                  <th style={TH}>Doctors Available</th>
                  <td style={TD}>{val(md,"availabilityOfDoctorsInSchoolId")}</td>
                </tr>
                <tr>
                  <th style={TH}>No of Doctors</th>
                  <td style={TD}>{val(md,"numberOfDoctors")}</td>
                  <th style={TH}>No of Nurses</th>
                  <td style={TD}>{val(md,"numberOfNurse")}</td>
                </tr>
                <tr>
                  <th style={TH}>No of Ambulance</th>
                  <td style={TD} colSpan="3">{val(md,"numberOfAmbulance")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Profile Fee Master */}
          {fm.length > 0 && (
            <SectionWrapper title="Profile Fee Master">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={TH}>Fees Item</th>
                    <th style={TH}>Item Fees TDD</th>
                    <th style={TH}>Item Fees General</th>
                    <th style={TH}>Fees Per Student ST</th>
                    <th style={TH}>Fees Per Student General</th>
                  </tr>
                </thead>
                <tbody>
                  {fm.map((f, i) => (
                    <tr key={i}>
                      <td style={TD}>{f.feesItemId ?? "---"}</td>
                      <td style={TD}>{f.itemFeesTDD ?? "---"}</td>
                      <td style={TD}>{f.itemFeesGeneral ?? "---"}</td>
                      <td style={TD}>{f.feesPerStudentST ?? "---"}</td>
                      <td style={TD}>{f.feesPerStudentGeneral ?? "---"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionWrapper>
          )}

          {/* School Bank Details */}
          <SectionWrapper title="School Bank Details">
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={TH}>Bank Name</th>
                  <td style={TD}>{val(bd,"bankName")}</td>
                  <th style={TH}>Branch Name</th>
                  <td style={TD}>{val(bd,"bankBranchName")}</td>
                </tr>
                <tr>
                  <th style={TH}>IFSC Code</th>
                  <td style={TD}>{val(bd,"bankIFSCCode")}</td>
                  <th style={TH}>Account No</th>
                  <td style={TD}>{val(bd,"bankAccountNo")}</td>
                </tr>
                <tr>
                  <th style={TH}>Branch Address</th>
                  <td style={TD} colSpan="3">{val(bd,"bankBranchAddress")}</td>
                </tr>
              </tbody>
            </table>
          </SectionWrapper>

          {/* Footer Buttons — original design */}
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