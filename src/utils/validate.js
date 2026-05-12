// ============================================================
//  src/utils/validate.js
//
//  Validations for School Basic Details
//  Based on Excel spec: "School Application form" sheet
// ============================================================

// ── Helper ────────────────────────────────────────────────────
const toNum = (v) => parseInt(v || 0, 10);

// ── School Profile validations (rows 1–20) ────────────────────
export function validateSchoolProfile(form) {
  const errors = {};

  // Helper for dropdown fields that store numeric IDs
  const isEmptyField = (val) => 
    val === "" || val === null || val === undefined;

  // Row 1 — Trustee Name
  if (!form.trusteeName?.trim())
    errors.trusteeName = "Trustee Name is required.";
  else if (form.trusteeName.length > 100)
    errors.trusteeName = "Trustee Name must not exceed 100 characters.";

  // Row 2 — School Name
  if (!form.schoolName?.trim())
    errors.schoolName = "School Name is required.";
  else if (form.schoolName.length > 200)
    errors.schoolName = "School Name must not exceed 200 characters.";

  // Row 3 — Address
  if (!form.address?.trim())
    errors.address = "Address is required.";
  else if (form.address.length > 300)
    errors.address = "Address must not exceed 300 characters.";

  // Row 4 — Mobile Number
  if (!form.mobileNumber?.trim())
    errors.mobileNumber = "Mobile Number is required.";
  else if (!/^\d{10}$/.test(form.mobileNumber))
    errors.mobileNumber = "Enter a valid 10-digit mobile number.";

  // ✅ Fixed — use isEmptyField for all dropdown/ID fields
  // Row 5 — District
  if (isEmptyField(form.district))
    errors.district = "Please select a District.";

  // Row 6 — Taluka
  if (isEmptyField(form.taluka))
    errors.taluka = "Please select a Taluka.";

  // Row 7 — Village
  if (isEmptyField(form.village))
    errors.village = "Please select a Village.";

  // Row 8 — Pincode
  if (!form.pincode?.trim())
    errors.pincode = "Pincode is required.";
  else if (!/^\d{6}$/.test(form.pincode))
    errors.pincode = "Pincode must be exactly 6 digits.";

  // Row 9 — Email ID
  if (!form.emailId?.trim())
    errors.emailId = "Email ID is required.";
  else if (form.emailId.length > 150)
    errors.emailId = "Email ID must not exceed 150 characters.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
    errors.emailId = "Enter a valid email address.";

  // ✅ Fixed — PO Name stored as number
  // Row 10 — PO Name
  if (isEmptyField(form.poName))
    errors.poName = "Please select a PO Name.";

  // Row 11 — UDISE Code
  if (!form.udiseCode?.trim())
    errors.udiseCode = "UDISE Code is required.";
  else if (!/^\d{11}$/.test(form.udiseCode))
    errors.udiseCode = "UDISE Code must be exactly 11 digits.";

  // Row 12 — School Selection Year
  if (!form.schoolSelectionYear?.trim())
    errors.schoolSelectionYear = "School Selection Year is required.";

  // Row 13 — Registration Number
  if (!form.schoolRegistrationNumber?.trim())
    errors.schoolRegistrationNumber = "School Registration Number is required.";
  else if (form.schoolRegistrationNumber.length > 50)
    errors.schoolRegistrationNumber = "Registration Number must not exceed 50 characters.";

  // ✅ Fixed — School Board stored as number (can be 0)
  // Row 14 — School Board
  if (isEmptyField(form.schoolBoard))
    errors.schoolBoard = "Please select a School Board.";

  // Row 15 — SSC Batches
  if (isEmptyField(form.sscBatchesCompletedCount))
    errors.sscBatchesCompletedCount = "Total Number of SSC Batches Completed is required.";
  else if (isNaN(Number(form.sscBatchesCompletedCount)) || Number(form.sscBatchesCompletedCount) < 1)
    errors.sscBatchesCompletedCount = "Must be greater than 0.";
  else if (Number(form.sscBatchesCompletedCount) > 999)
    errors.sscBatchesCompletedCount = "Value cannot exceed 999.";

  // Row 16 — Year Of Establishment
  if (isEmptyField(form.yearOfEstablishment))
    errors.yearOfEstablishment = "Year of Establishment is required.";

  // Row 17 — School Website Available
  if (!form.isWebsiteAvailable)
    errors.isWebsiteAvailable = "Please select an option for School Website Available.";

  // Row 18 — Website Link
  if (form.isWebsiteAvailable === "Yes") {
    if (!form.websiteLink?.trim())
      errors.websiteLink = "Website Link is required when website is available.";
    else if (form.websiteLink.length > 200)
      errors.websiteLink = "Website Link must not exceed 200 characters.";
    else if (!/^https?:\/\/.+/.test(form.websiteLink))
      errors.websiteLink = "Enter a valid URL starting with http:// or https://";
  }

  // ✅ Fixed — School Area Type stored as number
  // Row 19 — School Area Type
  if (isEmptyField(form.schoolAreaType))
    errors.schoolAreaType = "Please select school Area Type";

  // Row 20 — Toilets Per Floor
  if (isEmptyField(form.toiletsPerFloorCount))
    errors.toiletsPerFloorCount = "Number of Toilets per Floor is required.";
  else if (isNaN(Number(form.toiletsPerFloorCount)) || Number(form.toiletsPerFloorCount) < 0)
    errors.toiletsPerFloorCount = "Must be a valid positive number.";
  else if (Number(form.toiletsPerFloorCount) > 5)
    errors.toiletsPerFloorCount = "Value cannot exceed 5.";

  return errors;
}

// ── School Intake validations (rows 21–28, auto-calc 29–35) ──
export function validateSchoolIntake(intake) {
  const errors = {};

  const fields = [
    // Rows 21–24: Residential + Non-Residential Boys
    {
      key: "namankit_boys_residential",
      label: "Total Count of Boys under Namankit (Residential)",
    },
    {
      key: "namankit_boys_nonresidential",
      label: "Total Count of Boys under Namankit (Non-Residential)",
    },
    {
      key: "other_boys_residential",
      label: "Total Count of Boys not under Namankit (Residential)",
    },
    {
      key: "other_boys_nonresidential",
      label: "Total Count of Boys not under Namankit (Non-Residential)",
    },
    // Rows 25–28: Residential + Non-Residential Girls
    {
      key: "namankit_girls_residential",
      label: "Total Count of Girls under Namankit (Residential)",
    },
    {
      key: "namankit_girls_nonresidential",
      label: "Total Count of Girls under Namankit (Non-Residential)",
    },
    {
      key: "other_girls_residential",
      label: "Total Count of Girls not under Namankit (Residential)",
    },
    {
      key: "other_girls_nonresidential",
      label: "Total Count of Girls not under Namankit (Non-Residential)",
    },
  ];

  fields.forEach(({ key, label }) => {
    const val = intake[key];
    if (val === "" || val === null || val === undefined)
      errors[key] = `${label} is required.`;
    else if (isNaN(Number(val)) || Number(val) < 0)
      errors[key] = `${label} must be a valid positive number.`;
  });

  return errors;
}

// ✅ Fixed — dynamic minimum based on establishment year
export function validateSchoolPerformance(rows, yearOfEstablishment) {
  const currentYear = new Date().getFullYear();
  const availableYears = yearOfEstablishment 
    ? currentYear - Number(yearOfEstablishment)
    : 3;
  const minRequired = Math.min(3, availableYears);
  
  if (!rows || rows.length < minRequired)
    return `Please add at least ${minRequired} School Performance Year${minRequired > 1 ? "s" : ""}.`;
  return null;
}

// ── Performance row validation (single row) ──────────────────
export function validatePerformanceRow(row) {
  const errors = {};

  // Row 36 — School Performance Year: Mandatory (YYYY-YYYY)
  if (!row.year) errors.year = "School Performance Year is required.";

  // Row 37 — Standard: Mandatory (HSC, SSC, Scholarship, MTS, NTS, Any Other)
  if (!row.standard) errors.standard = "Standard is required.";

  // Row 38 — Others (text area): Mandatory if "Any Other" selected
  if (row.standard === "Any Other" && !row.others?.trim())
    errors.others = "Please specify 'Others' when 'Any Other' is selected.";

  // Row 39 — No of Students Appeared: Mandatory + Numeric
  if (
    row.studentsAppeared === "" ||
    row.studentsAppeared === null ||
    row.studentsAppeared === undefined
  )
    errors.studentsAppeared = "No of Students Appeared is required.";
  else if (
    isNaN(Number(row.studentsAppeared)) ||
    Number(row.studentsAppeared) < 0
  )
    errors.studentsAppeared = "Must be a valid positive number.";

  // Row 40 — No of Students Passed: Mandatory + Numeric
  if (
    row.studentsPassed === "" ||
    row.studentsPassed === null ||
    row.studentsPassed === undefined
  )
    errors.studentsPassed = "No of Students Passed is required.";
  else if (isNaN(Number(row.studentsPassed)) || Number(row.studentsPassed) < 0)
    errors.studentsPassed = "Must be a valid positive number.";

  // Extra: Students Passed cannot exceed Students Appeared
  if (
    row.studentsAppeared !== "" &&
    row.studentsPassed !== "" &&
    !isNaN(Number(row.studentsAppeared)) &&
    !isNaN(Number(row.studentsPassed)) &&
    Number(row.studentsPassed) > Number(row.studentsAppeared)
  ) {
    errors.studentsPassed = "Students Passed cannot exceed Students Appeared.";
  }

  return errors;
}

export function validateStudentRegistration(form) {
  const errors = {};

  if (!form.firstName?.trim()) errors.firstName = "First name is required";
  if (!form.lastName?.trim()) errors.lastName = "Last name is required";

  if (!form.gender) errors.gender = "Please select gender";

  if (!form.birthDate?.trim()) errors.birthDate = "Birth date is required";

  if (!form.currentClass) errors.currentClass = "Please select current class";
  if (!form.currentAdmissionDate)
    errors.currentAdmissionDate = "Please select current admission date";

  if (!form.fatherFirstName?.trim())
    errors.fatherFirstName = "Father's name is required";

  if (!form.mothersName?.trim())
    errors.mothersName = "Mother's name is required";

  if (!form.homeAddress?.trim())
    errors.homeAddress = "Home address is required";

  if (!form.district) errors.district = "Please select a district";
  if (!form.taluka) errors.taluka = "Please select a taluka";
  if (!form.village) errors.village = "Please select a village";

  if (!form.pincode?.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(form.pincode))
    errors.pincode = "Pincode must be 6 digits";

  if (form.mobileNumber && !/^\d{10}$/.test(form.mobileNumber))
    errors.mobileNumber = "Enter a valid 10-digit mobile number";

  if (form.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
    errors.emailId = "Enter a valid email address";

  if (!form.aadharNumberUID?.toString()?.trim())
    errors.aadharNumberUID = "Aadhar number is required";
  else if (!/^\d{12}$/.test(form.aadharNumberUID.toString()))
    errors.aadharNumberUID = "Aadhar must be 12 digits";

  return errors;
}

// ── GR Details validation ───────────────────────────────────
export function validateGRDetails(form) {
  const errors = {};
  if (!form.committeeDate)
    errors.committeeDate = "Committee meeting date is required.";
  if (!form.grDate) errors.grDate = "GR date is required.";
  if (form.committeeDate && form.grDate) {
    const c = new Date(form.committeeDate);
    const g = new Date(form.grDate);
    if (isNaN(c.getTime()) || isNaN(g.getTime())) {
      errors.grDate = "Invalid date format.";
    } else if (g < c) {
      errors.grDate = "GR date cannot be before committee meeting date.";
    }
  }

  if (!form.atcName) errors.atcName = "Please select ATC.";
  if (!form.schoolType) errors.schoolType = "Please select School Type.";
  if (!form.description || !form.description.trim())
    errors.description = "Brief description is required.";

  const maxSize = 5 * 1024 * 1024; // 5 MB
  // Only PDF allowed per requirement
  const allowed = ["application/pdf"];

  if (!form.grFile) errors.grFile = "GR file is required.";
  else if (form.grFile.size > maxSize)
    errors.grFile = "GR file must be <= 5MB.";
  else if (form.grFile.type && !allowed.includes(form.grFile.type))
    errors.grFile = "GR file should be PDF.";

  if (!form.momFile) errors.momFile = "MOM file is required.";
  else if (form.momFile.size > maxSize)
    errors.momFile = "MOM file must be <= 5MB.";
  else if (form.momFile.type && !allowed.includes(form.momFile.type))
    errors.momFile = "MOM file should be PDF.";

  return errors;
}

// ── Photo upload validation (row 42) ─────────────────────────
export function validateSchoolPhoto(form) {
  const errors = {};
  // Row 42 — Upload School Photo: Mandatory
  if (!form.schoolPhoto && !form.uploadSchoolPhoto)
    errors.schoolPhoto = "School Photo is required.";
  return errors;
}

// ── Full School Basic Details validation ─────────────────────
// Combines all sub-section validations into one call
export function validateAllSchoolBasicDetails(profile, intake, perfRows) {
  const profileErrors = validateSchoolProfile(profile);
  const intakeErrors = validateSchoolIntake(intake);
  const photoErrors = validateSchoolPhoto(profile);
  const perfError = validateSchoolPerformance(perfRows, profile.yearOfEstablishment);

  return {
    profileErrors,
    intakeErrors,
    photoErrors,
    perfError, // string or null
    hasErrors:
      Object.keys(profileErrors).length > 0 ||
      Object.keys(intakeErrors).length > 0 ||
      Object.keys(photoErrors).length > 0 ||
      !!perfError,
  };
}
