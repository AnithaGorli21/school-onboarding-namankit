import React from "react";

export default function PreviewPage() {
  const data = JSON.parse(localStorage.getItem("schoolPreviewData")) || {};
  const val = (section, field) => data?.[section]?.[field] || "";

  const containerStyle = {
    padding: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#fff",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    fontSize: "13px"
  };

  const sectionHeaderStyle = {
    textAlign: "center",
    fontWeight: "600",
    padding: "10px",
    borderBottom: "1px solid #eee",
    marginBottom: "15px",
    fontSize: "16px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px"
  };

  const tdStyle = {
    border: "1px solid #e0e0e0",
    padding: "8px 12px",
    verticalAlign: "middle"
  };

  const labelStyle = {
    ...tdStyle,
    color: "#555",
    width: "25%",
    backgroundColor: "#fafafa" // Very light tint for labels
  };

  const valueStyle = {
    ...tdStyle,
    width: "25%",
    fontWeight: "500"
  };

  return (
    <div style={containerStyle}>
      <button 
        onClick={() => window.print()} 
        style={{ marginBottom: "10px", padding: "5px 15px", backgroundColor: "#5bc0de", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}
      >
        Print
      </button>

      <div style={{ border: "1px solid #ddd", padding: "10px" }}>
        <div style={sectionHeaderStyle}>School Basic Details</div>

        <table style={tableStyle}>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td style={labelStyle}>School Photo</td>
              <td colSpan="3" style={valueStyle}>
                {val("schoolProfile", "photo") ? "Uploaded" : "No Photo Uploaded"}
              </td>
            </tr>
            {/* Row 2 */}
            <tr>
              <td style={labelStyle}>Trustee Name :</td>
              <td style={valueStyle}>{val("schoolProfile", "trusteeName")}</td>
              <td style={labelStyle}>School Name :</td>
              <td style={valueStyle}>{val("schoolProfile", "schoolName")}</td>
            </tr>
            {/* Row 3 */}
            <tr>
              <td style={labelStyle}>Address :</td>
              <td style={valueStyle}>{val("schoolProfile", "address")}</td>
              <td style={labelStyle}>MobileNo :</td>
              <td style={valueStyle}>{val("schoolProfile", "mobileNumber")}</td>
            </tr>
            {/* Row 4 */}
            <tr>
              <td style={labelStyle}>EmailID :</td>
              <td style={valueStyle}>{val("schoolProfile", "emailId")}</td>
              <td style={labelStyle}>POName :</td>
              <td style={valueStyle}>{val("schoolProfile", "poName")}</td>
            </tr>
            {/* Row 5 */}
            <tr>
              <td style={labelStyle}>DistrictName :</td>
              <td style={valueStyle}>{val("schoolProfile", "district")}</td>
              <td style={labelStyle}>TalukaName :</td>
              <td style={valueStyle}>{val("schoolProfile", "taluka")}</td>
            </tr>
            {/* Row 6 */}
            <tr>
              <td style={labelStyle}>VillageName :</td>
              <td style={valueStyle}>{val("schoolProfile", "village")}</td>
              <td style={labelStyle}>UDISE :</td>
              <td style={valueStyle}>{val("schoolProfile", "udiseCode")}</td>
            </tr>
            {/* Row 7 */}
            <tr>
              <td style={labelStyle}>School Selection Year :</td>
              <td style={valueStyle}>{val("schoolProfile", "schoolSelectionYear")}</td>
              <td style={labelStyle}>School Registration No :</td>
              <td style={valueStyle}>{val("schoolProfile", "schoolRegistrationNumber")}</td>
            </tr>
            {/* Row 8 */}
            <tr>
              <td style={labelStyle}>School Board :</td>
              <td style={valueStyle}>{val("schoolProfile", "schoolBoard")}</td>
              <td style={labelStyle}>Total Number Of SSC Batches Completed :</td>
              <td style={valueStyle}>{val("schoolProfile", "sscBatchesCompletedCount")}</td>
            </tr>
            {/* Row 9 */}
            <tr>
              <td style={labelStyle}>Year Of Establishment :</td>
              <td style={valueStyle}>{val("schoolProfile", "yearOfEstablishment")}</td>
              <td style={labelStyle}>School Falls Under Which Area :</td>
              <td style={valueStyle}>{val("schoolProfile", "schoolAreaType")}</td>
            </tr>
            {/* Row 10 */}
            <tr>
              <td style={labelStyle}>School Website Available :</td>
              <td style={valueStyle}>{val("schoolProfile", "isWebsiteAvailable")}</td>
              <td style={labelStyle}>Website Link :</td>
              <td style={valueStyle}>{val("schoolProfile", "websiteLink")}</td>
            </tr>
            {/* Row 11 */}
            <tr>
              <td style={labelStyle} colSpan="2">Number of Toilets On Each Floor In School Building :</td>
              <td style={valueStyle} colSpan="2">{val("schoolProfile", "toiletsPerFloorCount")}</td>
            </tr>
          </tbody>
        </table>

        {/* INTAKE SECTION (Based on your screenshot) */}
        <div style={{ display: "flex", marginTop: "10px" }}>
          <div style={{ ...labelStyle, width: "30%", borderRight: "none" }}>School Intake :</div>
          <table style={{ ...tableStyle, width: "70%", marginBottom: 0 }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
                <th style={tdStyle} rowSpan="2"></th>
                <th style={tdStyle} colSpan="2">Total Students Under Namankit Scheme</th>
                <th style={tdStyle} colSpan="2">Total Students Except Namankit Scheme</th>
                <th style={tdStyle} rowSpan="2">Total</th>
              </tr>
              <tr style={{ backgroundColor: "#fafafa", fontSize: "11px" }}>
                <th style={tdStyle}>Residential</th>
                <th style={tdStyle}>Non-residential</th>
                <th style={tdStyle}>Residential</th>
                <th style={tdStyle}>Non-residential</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Boys</td>
                <td style={tdStyle}>{val("intake", "boysRes")}</td>
                <td style={tdStyle}>{val("intake", "boysNonRes")}</td>
                <td style={tdStyle}>{val("intake", "boysExclRes")}</td>
                <td style={tdStyle}>{val("intake", "boysExclNonRes")}</td>
                <td style={tdStyle}>---</td>
              </tr>
              <tr>
                <td style={tdStyle}>Girls</td>
                <td style={tdStyle}>{val("intake", "girlsRes")}</td>
                <td style={tdStyle}>{val("intake", "girlsNonRes")}</td>
                <td style={tdStyle}>{val("intake", "girlsExclRes")}</td>
                <td style={tdStyle}>{val("intake", "girlsExclNonRes")}</td>
                <td style={tdStyle}>---</td>
              </tr>
              <tr style={{ fontWeight: "bold" }}>
                <td style={tdStyle}>Total</td>
                <td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td><td style={tdStyle}></td>
              </tr>
            </tbody>
          </table>
          
        </div>
      </div>
      {/* RESULTS SECTION */}
<table style={{ width: "100%", borderCollapse: "collapse", borderTop: "2px solid #ddd" }}>
  <thead>
    <tr style={{ backgroundColor: "#f9f9f9" }}>
      <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>Year</th>
      <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>Standard</th>
      <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>No of Students Appeared</th>
      <th style={{ border: "1px solid #eee", padding: "8px", textAlign: "left" }}>No of Students Passed</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ border: "1px solid #eee", padding: "10px" }}>{val("results", "year")}</td>
      <td style={{ border: "1px solid #eee", padding: "10px" }}>{val("results", "standard")}</td>
      <td style={{ border: "1px solid #eee", padding: "10px" }}>{val("results", "appeared")}</td>
      <td style={{ border: "1px solid #eee", padding: "10px" }}>{val("results", "passed")}</td>
    </tr>
  </tbody>
</table>
{/* LAND DETAILS SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Land Details</div>

  <table style={tableStyle}>
    <tbody>
      {/* Row 1: Photo */}
      <tr>
        <td style={labelStyle}>School Land Photo</td>
        <td colSpan="3" style={valueStyle}>
          {val("landDetails", "photo") ? "Uploaded" : "No Photo Uploaded"}
        </td>
      </tr>
      {/* Row 2 */}
      <tr>
        <td style={labelStyle}>Ownership :</td>
        <td style={valueStyle}>{val("landDetails", "ownership")}</td>
        <td style={labelStyle}>Total Area(In Acres)[Building + Playground + Hostel etc] :</td>
        <td style={valueStyle}>{val("landDetails", "totalAreaAcres")}</td>
      </tr>
      {/* Row 3 */}
      <tr>
        <td style={labelStyle}>School Compound Wall :</td>
        <td style={valueStyle}>{val("landDetails", "compoundWall")}</td>
        <td style={labelStyle}>Playground :</td>
        <td style={valueStyle}>{val("landDetails", "playground")}</td>
      </tr>
      {/* Row 4 */}
      <tr>
        <td style={labelStyle}>Playground Area(In Acres) :</td>
        <td style={valueStyle}>{val("landDetails", "playgroundAreaAcres")}</td>
        <td style={labelStyle}>Swimming Tank :</td>
        <td style={valueStyle}>{val("landDetails", "swimmingTank")}</td>
      </tr>
      {/* Row 5 */}
      <tr>
        <td style={labelStyle}>Running Track :</td>
        <td style={valueStyle}>{val("landDetails", "runningTrack")}</td>
        <td style={labelStyle}>Basket ball Ground :</td>
        <td style={valueStyle}>{val("landDetails", "basketballGround")}</td>
      </tr>
      {/* Row 6 */}
      <tr>
        <td style={labelStyle}>Kho-Kho,Kabaddi :</td>
        <td style={valueStyle}>{val("landDetails", "khoKhokabaddi")}</td>
        <td style={labelStyle}>Others :</td>
        <td style={valueStyle}>{val("landDetails", "others")}</td>
      </tr>
      {/* Row 7 */}
      <tr>
        <td style={labelStyle} colSpan="2">Quality Of Sport Facilities / Infrastructure available :</td>
        <td style={valueStyle} colSpan="2">{val("landDetails", "qualityOfSports")}</td>
      </tr>
    </tbody>
  </table>

  {/* CLASSROOM DETAILS TABLE */}
  <div style={{ marginTop: "10px" }}>
    <table style={{ ...tableStyle, marginBottom: 0 }}>
      <thead>
        <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
          <th style={tdStyle}>Standard</th>
          <th style={tdStyle}>Division</th>
          <th style={tdStyle}>Separate Classroom For Each Division</th>
          <th style={tdStyle}>Total Classroom With Benches</th>
          <th style={tdStyle}>Total Classroom Without Benches</th>
        </tr>
      </thead>
      <tbody>
        {/* If classroomDetails is an array, map through it; otherwise show the single row */}
        {data.landDetails?.classroomDetails?.map((row, index) => (
          <tr key={index}>
            <td style={tdStyle}>{row.standard}</td>
            <td style={tdStyle}>{row.division}</td>
            <td style={tdStyle}>{row.separateClassroom}</td>
            <td style={tdStyle}>{row.classroomWithBenches}</td>
            <td style={tdStyle}>{row.classroomWithoutBenches}</td>
          </tr>
        )) || (
          <tr>
            <td colSpan="5" style={{ ...tdStyle, textAlign: "center", color: "#999" }}>No Classroom Details Available</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
{/* HOSTEL DETAILS SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Hostel Details</div>

  <table style={tableStyle}>
    <tbody>
      {/* Row 1: Photo */}
      <tr>
        <td style={labelStyle}>Hostel Photo</td>
        <td colSpan="3" style={valueStyle}>
          {val("hostelDetails", "photo") ? "Uploaded" : "No Photo Uploaded"}
        </td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td style={labelStyle}>Total Number of Students studying from class 1st to 4th :</td>
        <td style={valueStyle}>{val("hostelDetails", "studentsClass1to4")}</td>
        <td style={labelStyle}>Total Number of Female caretakers for Students studying in 1st to 4th standard :</td>
        <td style={valueStyle}>{val("hostelDetails", "femaleCaretakers1to4")}</td>
      </tr>

      {/* Row 3 */}
      <tr>
        <td style={labelStyle}>Availability Of incinerators :</td>
        <td style={valueStyle}>{val("hostelDetails", "availabilityIncinerators")}</td>
        <td style={labelStyle}>Availability Of washing Machine for students use :</td>
        <td style={valueStyle}>{val("hostelDetails", "washingMachine")}</td>
      </tr>

      {/* Row 4 */}
      <tr>
        <td style={labelStyle}>Availability Of Separate Hostel Building:</td>
        <td style={valueStyle}>{val("hostelDetails", "separateHostelBuilding")}</td>
        <td style={labelStyle}>Area In Sq.Ft:</td>
        <td style={valueStyle}>{val("hostelDetails", "areaInSqFt")}</td>
      </tr>

      {/* Row 5 */}
      <tr>
        <td style={labelStyle}>Availability Of Light,Fan & Bedding Facility In Hostel:</td>
        <td style={valueStyle}>{val("hostelDetails", "lightFanBedding")}</td>
        <td style={labelStyle}>Availabilty of Hot water:</td>
        <td style={valueStyle}>{val("hostelDetails", "hotWaterOptions")}</td>
      </tr>

      {/* Row 6: Boys Hostels */}
      <tr>
        <td style={labelStyle}>Total Number of Boys Hostels :</td>
        <td style={valueStyle}>{val("hostelDetails", "totalBoysHostels")}</td>
        <td style={labelStyle}>Total Capacity of Boys Hostels :</td>
        <td style={valueStyle}>{val("hostelDetails", "capacityBoysHostels")}</td>
      </tr>

      {/* Row 7: Girls Hostels */}
      <tr>
        <td style={labelStyle}>Total Number of Girls Hostels :</td>
        <td style={valueStyle}>{val("hostelDetails", "totalGirlsHostels")}</td>
        <td style={labelStyle}>Total Capacity of Girls Hostels :</td>
        <td style={valueStyle}>{val("hostelDetails", "capacityGirlsHostels")}</td>
      </tr>

      {/* Row 8: Totals */}
      <tr>
        <td style={labelStyle}>Grand Total (Number of Hostels) :</td>
        <td style={valueStyle}>{val("hostelDetails", "grandTotalHostels")}</td>
        <td style={labelStyle}>Grand Total (Capacity of Hostel) :</td>
        <td style={valueStyle}>{val("hostelDetails", "grandTotalCapacity")}</td>
      </tr>

      {/* Row 9: Residential Students & Expected Bathrooms */}
      <tr>
        <td style={labelStyle}>Total No. Of Residential Students:</td>
        <td style={valueStyle}>{val("hostelDetails", "totalResidentialStudents")}</td>
        <td style={labelStyle}>Expected Bathrooms:</td>
        <td style={valueStyle}>{val("hostelDetails", "expectedBathrooms")}</td>
      </tr>

      {/* Row 10: Actual vs Expected Bathrooms */}
      <tr>
        <td style={labelStyle}>Expected Washrooms:</td>
        <td style={valueStyle}>{val("hostelDetails", "expectedWashrooms")}</td>
        <td style={labelStyle}>Actual Bathroom:</td>
        <td style={valueStyle}>{val("hostelDetails", "actualBathrooms")}</td>
      </tr>

      {/* Row 11: Actual Washrooms */}
      <tr>
        <td style={labelStyle}>Actual Washrooms:</td>
        <td style={valueStyle}>{val("hostelDetails", "actualWashrooms")}</td>
        <td colSpan="2" style={valueStyle}></td>
      </tr>
    </tbody>
  </table>
</div>
{/* DINING FACILITIES DETAILS SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Dining Facilities Details</div>

  <table style={tableStyle}>
    <tbody>
      {/* Photo Row */}
      <tr>
        <td style={labelStyle}>Dining Hall Photo</td>
        <td style={valueStyle}>
          {val("diningDetails", "DiningHallPhoto") ? "Uploaded" : "No Photo Uploaded"}
        </td>
        <td style={labelStyle}>
          <button 
            type="button"
            style={{ 
              backgroundColor: '#5bc0de', 
              color: 'white', 
              border: 'none', 
              padding: '5px 12px', 
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            View Uploaded Menu
          </button>
        </td>
        <td style={valueStyle}>
          {val("diningDetails", "MenuPhoto") ? "Menu Uploaded" : "No Menu Uploaded"}
        </td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td style={labelStyle}>Separate Dining Hall for Boys and Girls:</td>
        <td style={valueStyle}>{val("diningDetails", "SeparateDiningHallforBoysandGirls")}</td>
        <td style={labelStyle}>Dining Hall Area in Sq.ft:</td>
        <td style={valueStyle}>{val("diningDetails", "DiningHallAreainSqft")}</td>
      </tr>

      {/* Row 3 */}
      <tr>
        <td style={labelStyle}>Dining Table:</td>
        <td style={valueStyle}>{val("diningDetails", "DiningTable")}</td>
        <td style={labelStyle}>Food Served As Per Menu:</td>
        <td style={valueStyle}>{val("diningDetails", "FoodServedAsPerMenu")}</td>
      </tr>
    </tbody>
  </table>

  {/* LAB DETAILS SECTION */}
  <div style={{ borderTop: "1px solid #ddd", marginTop: "20px", paddingTop: "10px" }}>
    <div style={sectionHeaderStyle}>Lab Details</div>
    
    <table style={tableStyle}>
      <tbody>
        {/* Lab Photo Row */}
        <tr>
          <td style={labelStyle}>Lab Photo</td>
          <td colSpan="3" style={valueStyle}>
            {val("labDetails", "photoFile") ? "Uploaded" : "No Photo Uploaded"}
          </td>
        </tr>

        {/* Digital Classroom Row */}
        <tr>
          <td style={labelStyle}>Number of Digital Classroom in the school</td>
          <td colSpan="3" style={valueStyle}>{val("labDetails", "digitalClassroomCount")}</td>
        </tr>

        {/* Computer Lab Row 1 */}
        <tr>
          <td style={labelStyle}>Well Equipped Computer Lab (Computers,Printers,Scanners,etc):</td>
          <td style={valueStyle}>{val("labDetails", "isComputerLabAvailable")}</td>
          <td style={labelStyle}>No of Computers in Working Condition (With Printers,Scanners,Internet,etc):</td>
          <td style={valueStyle}>{val("labDetails", "computersWithPeripheralsCount")}</td>
        </tr>

        {/* Computer Lab Row 2 */}
        <tr>
          <td style={labelStyle}>No of Computers in Working Condition:</td>
          <td style={valueStyle}>{val("labDetails", "computersWorkingCount")}</td>
          <td style={labelStyle}>Availability of Chemistry Laboratory with Lab Assistant:</td>
          <td style={valueStyle}>{val("labDetails", "isChemistryLabAvailable")}</td>
        </tr>

        {/* Chemistry Lab */}
        <tr>
          <td style={labelStyle}>Area of Chemistry Laboratory (Min 150 Sq ft):</td>
          <td style={valueStyle}>{val("labDetails", "isChemistryLabAreaSufficient")}</td>
          <td style={labelStyle}>Chemistry lab Available Area Sq ft:</td>
          <td style={valueStyle}>{val("labDetails", "chemistryLabAreaSqft")}</td>
        </tr>

        {/* Biology Lab Row 1 */}
        <tr>
          <td style={labelStyle}>Availability of Biology Laboratory with Lab Assistant:</td>
          <td style={valueStyle}>{val("labDetails", "isBiologyLabAvailable")}</td>
          <td style={labelStyle}>Area of Biology Laboratory (Min 150 Sq ft):</td>
          <td style={valueStyle}>{val("labDetails", "isBiologyLabAreaSufficient")}</td>
        </tr>

        {/* Biology Lab Row 2 */}
        <tr>
          <td style={labelStyle}>Biology lab Available Area Sq ft:</td>
          <td style={valueStyle}>{val("labDetails", "biologyLabAreaSqft")}</td>
          <td style={labelStyle}>Availability of Physics Laboratory with Lab Assistant:</td>
          <td style={valueStyle}>{val("labDetails", "isPhysicsLabAvailable")}</td>
        </tr>

        {/* Physics Lab */}
        <tr>
          <td style={labelStyle}>Area of Physics Laboratory (Min 150 Sq ft):</td>
          <td style={valueStyle}>{val("labDetails", "isPhysicsLabAreaSufficient")}</td>
          <td style={labelStyle}>Physics lab Available Area Sq ft:</td>
          <td style={valueStyle}>{val("labDetails", "physicsLabAreaSqft")}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>  
{/* LIBRARY DETAILS SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Library Details</div>

  <table style={tableStyle}>
    <tbody>
      {/* Photo Row */}
      <tr>
        <td style={labelStyle}>Library Photo</td>
        <td colSpan="3" style={valueStyle}>
          {val("libraryDetails", "photoFile") ? "Uploaded" : "No Photo Uploaded"}
        </td>
      </tr>

      {/* Row 1 */}
      <tr>
        <td style={labelStyle}>Separate Library:</td>
        <td style={valueStyle}>{val("libraryDetails", "separateLibrary")}</td>
        <td style={labelStyle}>Area(Min 200 Ft with Furniture):</td>
        <td style={valueStyle}>{val("libraryDetails", "areamin200FtWithFurniture")}</td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td style={labelStyle}>Actual Area:</td>
        <td style={valueStyle}>{val("libraryDetails", "actualArea")}</td>
        <td style={labelStyle}>No of Books:</td>
        <td style={valueStyle}>{val("libraryDetails", "noOfBooks")}</td>
      </tr>
    </tbody>
  </table>

  {/* TEACHERS DETAILS SECTION */}

</div>   
{/* EXTRA CURRICULUM ACTIVITIES SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Extra Curriculum Activities</div>

  <table style={tableStyle}>
    <tbody>
      {/* Row 1: NCC & Scout/Guide */}
      <tr>
        <td style={labelStyle}>NCC:</td>
        <td style={valueStyle}>
          {val("extraCurriculumActivities", "nccsanctioned") || "---"}
        </td>
        <td style={labelStyle}>Scout/Guide:</td>
        <td style={valueStyle}>
          {val("extraCurriculumActivities", "scoutguide") || "---"}
        </td>
      </tr>

      {/* Row 2: NSS & Other */}
      <tr>
        <td style={labelStyle}>NSS:</td>
        <td style={valueStyle}>
          {val("extraCurriculumActivities", "nSS") || "---"}
        </td>
        <td style={labelStyle}>Other:</td>
        <td style={valueStyle}>
          {val("extraCurriculumActivities", "otherCurriculumActivity") || "None"}
        </td>
      </tr>
    </tbody>
  </table>
</div>   
{/* SPORTS FACILITIES */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Sports Facilities</div>

  <table style={tableStyle}>
    <tbody>
      <tr>
        <td style={labelStyle}>Number Of PT teacher available:</td>
        <td style={valueStyle}>{val("sportsFacilities", "noOfPhysicalEducationPTTeacherAvailable") || "0"}</td>
        <td style={labelStyle}>Number Of sports Played:</td>
        <td style={valueStyle}>{val("sportsFacilities", "numberOfSportsPlayedOnPlayground") || "0"}</td>
      </tr>
      <tr>
        <td style={labelStyle}>Details Of sports Played:</td>
        <td colSpan="3" style={valueStyle}>{val("sportsFacilities", "detailsOfSportsPlayedOnPlayground") || "---"}</td>
      </tr>
      <tr>
        <td style={labelStyle}>Qualified Sport's Teachers available:</td>
        <td style={valueStyle}>{val("sportsFacilities", "availOfQualifiedSportsTeacherAsPerStuCnt") || "No"}</td>
        <td style={labelStyle}>Separate Auditorium:</td>
        <td style={valueStyle}>{val("sportsFacilities", "availabilityOfSeparateAuditorium") || "No"}</td>
      </tr>
      <tr>
        <td style={labelStyle}>Auditorium Area (sq ft):</td>
        <td style={valueStyle}>{val("sportsFacilities", "auditoriumAreasqFt") || "0"}</td>
        <td style={labelStyle}>School Magazine:</td>
        <td style={valueStyle}>{val("sportsFacilities", "schoolMagazine") || "No"}</td>
      </tr>
      <tr>
        <td style={labelStyle}>School Magazine Type:</td>
        <td colSpan="3" style={valueStyle}>{val("sportsFacilities", "schoolMagazineTypeId") || "---"}</td>
      </tr>
    </tbody>
  </table>

  {/* CULTURAL PROGRAMS TABLE */}
  <div style={{ marginTop: "20px" }}>
    <div style={{ ...sectionHeaderStyle, fontSize: '14px', backgroundColor: '#f9f9f9', padding: '8px' }}>
      Cultural programs conducted by school
    </div>
    <table style={{ ...tableStyle, borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px', width: '60px' }}>Sr No</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Year</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Program Name</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {val("sportsFacilities", "culturalPrograms")?.length > 0 ? (
          val("sportsFacilities", "culturalPrograms").map((item, idx) => (
            <tr key={idx}>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.culturalProgramConductedBySchoolYearId || "---"}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.culturalProgramName || "---"}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.culturalProgramRemarks || "---"}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="4" style={{ ...valueStyle, textAlign: 'center', padding: '15px' }}>No Cultural Programs Data Available</td></tr>
        )}
      </tbody>
    </table>
  </div>

  {/* EDUCATIONAL TOURS TABLE */}
  <div style={{ marginTop: "20px" }}>
    <div style={{ ...sectionHeaderStyle, fontSize: '14px', backgroundColor: '#f9f9f9', padding: '8px' }}>
      Educational tours conducted by school
    </div>
    <table style={{ ...tableStyle, borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px', width: '60px' }}>Sr No</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Year</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Program Name</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Place</th>
          <th style={{ ...labelStyle, border: '1px solid #ddd', padding: '8px' }}>Purpose</th>
        </tr>
      </thead>
      <tbody>
        {val("sportsFacilities", "educationalTours")?.length > 0 ? (
          val("sportsFacilities", "educationalTours").map((item, idx) => (
            <tr key={idx}>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.year || "---"}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.programName || "---"}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.place || "---"}</td>
              <td style={{ ...valueStyle, border: '1px solid #ddd', padding: '8px' }}>{item.purpose || "---"}</td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="5" style={{ ...valueStyle, textAlign: 'center', padding: '15px' }}>No Educational Tours Data Available</td></tr>
        )}
      </tbody>
    </table>
  </div>
</div>
{/* MEDICAL FACILITIES SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>Medical Facilities</div>

  <table style={tableStyle}>
    <tbody>
      {/* Row 1 */}
      <tr>
        <td style={labelStyle}>Availability of Medical Facility/Sick Room:</td>
        <td style={valueStyle}>{val("medicalFacilities", "availabilitOfMedicalSickRoom") || "---"}</td>
        <td style={labelStyle}>Availability of Doctors in School:</td>
        <td style={valueStyle}>{val("medicalFacilities", "availabilityOfDoctorsInSchoolId") || "---"}</td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td style={labelStyle}>Number of Doctors:</td>
        <td style={valueStyle}>{val("medicalFacilities", "numberOfDoctors") || "0"}</td>
        <td style={labelStyle}>Number of Nurse:</td>
        <td style={valueStyle}>{val("medicalFacilities", "numberOfNurse") || "0"}</td>
      </tr>

      {/* Row 3 */}
      <tr>
        <td style={labelStyle}>Number of Ambulance:</td>
        <td style={valueStyle}>{val("medicalFacilities", "numberOfAmbulance") || "0"}</td>
        <td style={{ ...labelStyle, border: 'none' }}></td>
        <td style={{ ...valueStyle, border: 'none' }}></td>
      </tr>
    </tbody>
  </table>
</div> 
{/* SCHOOL BANK DETAILS SECTION */}
<div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
  <div style={sectionHeaderStyle}>School Bank Details</div>

  <table style={tableStyle}>
    <tbody>
      {/* Row 1: Bank Name & Branch Name */}
      <tr>
        <td style={labelStyle}>Bank Name:</td>
        <td style={valueStyle}>{val("schoolBankDetails", "bankName") || "---"}</td>
        <td style={labelStyle}>Bank Branch Name:</td>
        <td style={valueStyle}>{val("schoolBankDetails", "bankBranchName") || "---"}</td>
      </tr>

      {/* Row 2: IFSC Code & Account No */}
      <tr>
        <td style={labelStyle}>Bank IFSC Code:</td>
        <td style={valueStyle}>{val("schoolBankDetails", "bankIFSCCode") || "---"}</td>
        <td style={labelStyle}>Bank Account No:</td>
        <td style={valueStyle}>{val("schoolBankDetails", "bankAccountNo") || "---"}</td>
      </tr>

      {/* Row 3: Branch Address & Cancelled Cheque */}
      <tr>
        <td style={labelStyle}>Bank Branch Address:</td>
        <td style={valueStyle}>{val("schoolBankDetails", "bankBranchAddress") || "---"}</td>
        <td style={labelStyle}>Cancelled Cheque Image:</td>
        <td style={valueStyle}>
          {val("schoolBankDetails", "uploadCancelledChequeImage") ? (
            <span style={{ color: "#2e9e5b", fontWeight: "bold", cursor: "pointer" }}>
              Uploaded (View)
            </span>
          ) : (
            <span style={{ color: "#888" }}>Not Uploaded</span>
          )}
        </td>
      </tr>
    </tbody>
  </table>
</div>
{/* FEES DETAILS SECTION */}
      <div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "20px" }}>
        <div style={sectionHeaderStyle}>Fees Details</div>

        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={labelStyle}>Fees Per Student ST :</td>
              <td style={valueStyle}>{val("feesDetails", "feesPerStudentST") || "0.00"}</td>
              <td style={labelStyle}>Fees Per Student General :</td>
              <td style={valueStyle}>{val("feesDetails", "feesPerStudentGeneral") || "0.00"}</td>
            </tr>
            <tr>
              <td style={labelStyle}>Receipt :</td>
              <td colSpan="3" style={valueStyle}>
                <button 
                  style={{ 
                    backgroundColor: "#5bc0de", 
                    color: "white", 
                    border: "none", 
                    padding: "4px 12px", 
                    borderRadius: "3px", 
                    fontSize: "12px",
                    cursor: "pointer" 
                  }}
                >
                  View Uploaded Receipt
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Itemized Fees Table */}
        <div style={{ marginTop: "10px" }}>
          <table style={{ ...tableStyle, marginBottom: 0 }}>
            <thead>
              <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold" }}>
                <th style={tdStyle}>Item Name</th>
                <th style={tdStyle}>Item Fees ST</th>
                <th style={tdStyle}>Item Fees General</th>
              </tr>
            </thead>
            <tbody>
              {data.feesDetails?.feeItems?.length > 0 ? (
                data.feesDetails.feeItems.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{item.itemName || "---"}</td>
                    <td style={tdStyle}>{item.itemFeesTDD || "0.00"}</td>
                    <td style={tdStyle}>{item.itemFeesGeneral || "0.00"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ ...tdStyle, textAlign: "center", color: "#999" }}>
                    No Fees Breakdown Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    
  );
}