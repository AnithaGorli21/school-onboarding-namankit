// ============================================================
//  src/utils/validate.js
//  Validation rules for School Basic Details form
// ============================================================

export function validateSchoolProfile(form) {
  const errors = {};

  if (!form.trusteeName?.trim())
    errors.trusteeName = "Trustee name is required";

  if (!form.schoolName?.trim()) errors.schoolName = "School name is required";

  if (!form.mobileNumber?.trim())
    errors.mobileNumber = "Mobile number is required";
  else if (!/^\d{10}$/.test(form.mobileNumber))
    errors.mobileNumber = "Enter a valid 10-digit mobile number";

  if (!form.district) errors.district = "Please select a district";

  if (!form.taluka) errors.taluka = "Please select a taluka";

  if (!form.village) errors.village = "Please select a village";

  if (!form.pincode?.trim()) errors.pincode = "Pincode is required";
  else if (!/^\d{6}$/.test(form.pincode))
    errors.pincode = "Pincode must be 6 digits";

  if (!form.emailId?.trim()) errors.emailId = "Email ID is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailId))
    errors.emailId = "Enter a valid email address";

  if (!form.schoolRegistrationNumber?.trim())
    errors.schoolRegistrationNumber = "Registration number is required";

  if (!form.schoolBoard) errors.schoolBoard = "Please select a school board";

  if (!form.schoolSelectionYear?.trim())
    errors.schoolSelectionYear = "School selection year is required";

  if (!form.sscBatchesCompletedCount && form.sscBatchesCompletedCount !== 0)
    errors.sscBatchesCompletedCount = "This field is required";

  if (!form.yearOfEstablishment)
    errors.yearOfEstablishment = "Please select year of establishment";

  if (!form.isWebsiteAvailable)
    errors.isWebsiteAvailable = "Please select an option";

  if (!form.schoolAreaType)
    errors.schoolAreaType = "Please select school area type";

  if (!form.toiletsPerFloorCount && form.toiletsPerFloorCount !== 0)
    errors.toiletsPerFloorCount = "This field is required";

  return errors;
}

export function validateStudentRegistration(form) {
  const errors = {};

  if (!form.firstName?.trim()) errors.firstName = "First name is required";
  if (!form.lastName?.trim()) errors.lastName = "Last name is required";

  if (!form.gender) errors.gender = "Please select gender";

  if (!form.birthDate?.trim()) errors.birthDate = "Birth date is required";

  if (!form.currentClass) errors.currentClass = "Please select current class";

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
