import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "../components/Header";
import { apiPost, getGRDetails } from "../api/liferay";
import { uploadFileToFolder } from "../api/upload";
import { Alert } from "../components/FormFields";
import { fetchATCMasters } from "../api/fetch-masters";
import { validateGRDetails } from "../utils/validate";
import { today } from "../utils/dates";
import { getSchoolDetails, patchSchoolDetails,getAllSchoolDetails } from "../api/schoolDetails";
import Loader from "../components/Loader";
import MeetingRemarksPopup from "../components/MeetingRemarksPopup";

export default function ScheduleMeeting() {
    const emptyForm = { committeeDate: "", grDate: "", atcName: "", schoolType: "", grFile: null, momFile: null, description: "" };

    const [view, setView] = useState("list");
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState(null);
    const [showSchoolResults, setShowSchoolResults] = useState(false);
    const [schoolData, setSchoolData] = useState([]);
    const [showMeetingRemarks, setShowMeetingRemarks] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [meetingRemark, setMeetingRemark] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState({ grFile: null, momFile: null });
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isSearchSchools,setIsSearchSchools] = useState(false);
    const [atcMasters, setAtcMasters] = useState([]);

    // sample meeting data — replace with API data as needed
    const [meetings, setMeetings] = useState([]);
    const [loadingMeetings, setLoadingMeetings] = useState(false);
    const [schoolDetails, setSchoolDetails] = useState([]);
    const [loadingSchoolDetails, setLoadingSchoolDetails] = useState(false);

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        try {
            return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        } catch (e) {
            return iso;
        }
    };

    // Load meetings data from API
    const loadMeetings = async () => {
        setLoadingMeetings(true);
        try {
            const grDetails = await getGRDetails();
            console.log('Meetings data from API:', grDetails);
            
            // Transform GR details to meetings format
            const transformedMeetings = grDetails.map((gr, index) => ({
                id: gr.id || index + 1,
                grDate: gr.gRDate || "",
                meetingDate: gr.commiteeMeetingDate || "",
                atc: gr.aTCName || "",
                description: gr.briefDescription || "",
                schoolType: gr.schoolType || "",
                // Store original data for view functionality
                commiteeMeetingDate: gr.commiteeMeetingDate || "",
                aTCName: gr.aTCName || "",
                briefDescription: gr.briefDescription || "",
                gRDate: gr.gRDate || "", // Preserve original gRDate for view
                // Store file data
                uploadGRFile: gr.uploadGRFile || null,
                uploadMOMFile: gr.uploadMOMFile || null
            }));
            
            setMeetings(transformedMeetings);
        } catch (error) {
            console.error('Error loading meetings:', error);
            // Fallback to mock data if API fails
            setMeetings([
                { id: 1, grDate: "2026-03-20", meetingDate: "2026-03-20", atc: "Thane", description: "After Approval of school from both ATC and Po Decision will be taken whether school is approved, cancelled or rejected", schoolType: "NEW" },
                { id: 2, grDate: "2025-03-04", meetingDate: "2025-03-05", atc: "Amravati", description: "vvv", schoolType: "OLD" },
                { id: 3, grDate: "2025-01-21", meetingDate: "2025-01-21", atc: "Thane", description: "Test 21.01.2025", schoolType: "OLD" },
            ]);
        } finally {
            setLoadingMeetings(false);
        }
    };

    // Load meetings on component mount
    React.useEffect(() => {
        loadMeetings();
    }, []);

    // Load ATC masters on component mount
    React.useEffect(() => {
        const loadATCMasters = async () => {
            try {
                const masters = await fetchATCMasters();
                setAtcMasters(masters);
            } catch (error) {
                console.error("Error loading ATC masters:", error);
            }
        };
        loadATCMasters();
    }, []);
    React.useEffect(() => {
        console.log('isSearchSchools', isSearchSchools);
        if (isSearchSchools || selectedMeeting) {
            console.log('Fetching school details...');
            setLoadingSchoolDetails(true);
            getAllSchoolDetails().then((res) => {
                console.log('School Details.....',res);
                console.log('School Details length:', res?.length);
                console.log('School Details type:', typeof res);
                if (res && Array.isArray(res)) {
                    console.log('First school detail:', res[0]);
                }
                setSchoolDetails(res || []);
            }).catch((err) => {
                console.error('Error fetching school details:', err);
                setSchoolDetails([]);
            }).finally(() => {
                setLoadingSchoolDetails(false);
            });
        }
    }, [isSearchSchools,selectedMeeting]);

    // pagination state
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const totalPages = Math.max(1, Math.ceil(meetings.length / rowsPerPage));
    const visibleMeetings = meetings.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleRowsPerPageChange = (e) => {
        const v = parseInt(e.target.value, 10) || 5;
        setRowsPerPage(v);
        setPage(1);
    };

    const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));
    useEffect(()=>{
        fetchSchoolData()
    },[]);
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm(prev => ({ ...prev, [name]: files[0] }));
        else setForm(prev => ({ ...prev, [name]: value }));
        setErrors((s) => ({ ...s, [name]: undefined }));
    };

    const handleNewMeeting = () => {
        setForm(emptyForm);
        setView("details");
    setSelectedMeeting(null)
    };

    const handleView = (meeting) => {
        console.log('Viewing meeting:', meeting);
        
        // Format dates for date input (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
            console.log('Formatting date:', dateString);
            if (!dateString) return "";
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const formatted = date.toISOString().split('T')[0];
            console.log('Formatted date:', formatted);
            return formatted;
        };
        
        const formData = {
            committeeDate: formatDateForInput(meeting.commiteeMeetingDate),
            grDate: formatDateForInput(meeting.gRDate),
            atcName: meeting.aTCName || "",
            schoolType: meeting.schoolType || "",
            grFile: null,
            momFile: null,
            description: meeting.briefDescription || "",
        };
        
        console.log('Setting form data:', formData);
        setForm(formData);
        
        // Store the original meeting data for file access
        setSelectedMeeting(meeting);
        setView("details");
    };

    const handleReset = () => {
        setForm(emptyForm);
        setShowSchoolResults(false);
        setSchoolData([]);
        setUploadedFiles({ grFile: null, momFile: null });
        setErrors({});
        setAlert(null);
        setSelectedMeeting(null);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        // Show confirmation alert
        const confirmMessage = "Are you sure you want to search schools? This will fetch school data based on your criteria.";
        if (!window.confirm(confirmMessage)) {
            return; // User cancelled
        }
        
        const errs = validateGRDetails(form);
        setErrors(errs);

        // If file-type specific errors exist for PDF requirement, show prominent alert (and browser alert to match existing UX)
        if (errs.grFile && errs.grFile.toLowerCase().includes("pdf")) {
            const msg = errs.grFile;
            setAlert({ type: "error", message: msg });
            try { window.alert(msg); } catch (e) { }
            return;
        }
        if (errs.momFile && errs.momFile.toLowerCase().includes("pdf")) {
            const msg = errs.momFile;
            setAlert({ type: "error", message: msg });
            try { window.alert(msg); } catch (e) { }
            return;
        }

        if (Object.keys(errs).length > 0) return;

        setAlert(null);
        setLoadingSchoolDetails(true);

        try {
            const uploadedGR = form.grFile ? await uploadFileToFolder(form.grFile, "GR Documents") : null;
            const uploadedMOM = form.momFile ? await uploadFileToFolder(form.momFile, "GR Documents") : null;

            const payload = {
                aTCName: form.atcName,
                briefDescription: form.description,
                commiteeMeetingDate: form.committeeDate,
                gRDate: form.grDate,
                schoolType: form.schoolType,
                uploadGRFile: uploadedGR
                    ? {
                        id: uploadedGR.documentId,
                        name: uploadedGR.title,
                        fileURL: uploadedGR.contentUrl,
                        fileBase64: "",
                        folder: { externalReferenceCode: "", siteId: 0 },
                    }
                    : null,
                uploadMOMFile: uploadedMOM
                    ? {
                        id: uploadedMOM.documentId,
                        name: uploadedMOM.title,
                        fileURL: uploadedMOM.contentUrl,
                        fileBase64: "",
                        folder: { externalReferenceCode: "", siteId: 0 },
                    }
                    : null,
            };

            const res = await apiPost("/o/c/grdetails", payload);
            setAlert({ type: "success", message: `GR record saved (id=${res?.id || "-"})` });
            
            // Store uploaded file URLs for later viewing
            setUploadedFiles({
                grFile: uploadedGR,
                momFile: uploadedMOM
            });
            
            // After successful save, fetch school data
            //fetchSchoolData();
            setIsSearchSchools(true);
            //setForm(emptyForm);
            setLoadingSchoolDetails(false);

        } catch (err) {
            console.error(err);
            setLoadingSchoolDetails(false);

            setAlert({ type: "error", message: err.message || "Failed to save GR details" });
        }
    };

    // Function to fetch school data using getGRDetails API
    const fetchSchoolData = async () => {
        try {
            const grDetails = await getGRDetails();
            console.log('GR Details from API:', grDetails);
            
            // Transform GR details data to match the table structure
            const transformedData = grDetails.map((gr, index) => ({
                id: gr.id || index + 1,
                poName: gr.poName || "N/A",
                schoolName: gr.schoolName || "N/A",
                existingStudents: gr.existingStudents || 0,
                poVerificationStatus: gr.poVerificationStatus || "Pending",
                atcVerificationStatus: gr.atcVerificationStatus || "Pending",
                systemCalculatedMarks: gr.systemCalculatedMarks || "0.00",
                atcMarks: gr.atcMarks || "0.00",
                poRemarks: gr.poRemarks || "",
                atcRemarks: gr.atcRemarks || "",
                noOfGeneralStudents: gr.noOfGeneralStudents || 0,
                sanctionedAdmissions: gr.sanctionedAdmissions || 0,
                committeeDecision: gr.committeeDecision || "Pending",
                committeeRemarks: gr.committeeRemarks || "",
                // Store file URLs for PDF viewing
                grFileUrl: gr.uploadGRFile?.fileURL || null,
                momFileUrl: gr.uploadMOMFile?.fileURL || null,
            }));
            
            setSchoolData(transformedData);
            setShowSchoolResults(true);
        } catch (error) {
            console.error('Error fetching GR details:', error);
            setAlert({ type: "error", message: "Failed to fetch school data. Please try again." });
            
            // Fallback to mock data if API fails
            const mockSchoolData = [
                {
                    id: 1,
                    poName: "Mumbai",
                    schoolName: "SchoolNa",
                    existingStudents: 0,
                    poVerificationStatus: "PO recommended for Approval",
                    atcVerificationStatus: "Approved",
                    systemCalculatedMarks: "49.00",
                    atcMarks: "64.00",
                    poRemarks: "school is good for approval. school has enrollments for current academic year",
                    atcRemarks: "school basic details are available",
                    noOfGeneralStudents: 11,
                    sanctionedAdmissions: 0,
                    committeeDecision: "Pending",
                    committeeRemarks: ""
                }
            ];
            
            setSchoolData(mockSchoolData);
            setShowSchoolResults(true);
        }
    };

    // Function to view existing files from API
    const viewExistingFile = (fileUrl) => {
  if (!fileUrl) {
    alert('File URL not available');
    return;
  }

  let pdfUrl = fileUrl;
  if (pdfUrl.startsWith('/')) {
    pdfUrl = window.location.origin + pdfUrl;
  }

  const link = document.createElement('a');
  link.href = pdfUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
    const viewPDFFile = (fileType, schoolId) => {
        const school = schoolData.find(s => s.id === schoolId);
        if (!school) {
            window.alert('School data not found');
            return;
        }
        
        const fileUrl = fileType === 'gr' ? school.grFileUrl : school.momFileUrl;
        console.log('Attempting to view file:', fileType, fileUrl);
        
        if (!fileUrl) {
            window.alert(`No ${fileType === 'gr' ? 'GR' : 'MOM'} file available for this school`);
            return;
        }
        
        // Ensure the URL is complete
        let pdfUrl = fileUrl;
        if (pdfUrl.startsWith('/')) {
            pdfUrl = window.location.origin + pdfUrl;
        }
        
        console.log('Opening PDF URL:', pdfUrl);
        
        // Open in new tab
        try {
            const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow) {
                window.alert('Popup blocked! Please allow popups for this site to view the PDF.');
            }
        } catch (error) {
            console.error('Error opening PDF:', error);
            window.alert('Failed to open PDF. Please try again.');
        }
    };

    // Handle meeting remarks button click
    const handleMeetingRemarks = (school) => {
        setSelectedSchool(school);
        setMeetingRemark(school.committeeRemarks || "");
        setShowMeetingRemarks(true);
    };

    // Handle saving meeting remarks
    const handleSaveMeetingRemarks = async (schoolProfileId, payload) => {
        // Update the school data with new remarks
        try{
           await patchSchoolDetails(selectedSchool.id, payload);
            setSchoolData(prevData => 
            prevData.map(school => 
                school.id === selectedSchool.id 
                    ? { ...school, committeeRemarks: meetingRemark }
                    : school
            )
        );
        setShowMeetingRemarks(false);
        setSelectedSchool(null);
        setMeetingRemark("");

        }catch{

        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fbfb", fontFamily: "var(--font-main)", display: "flex", flexDirection: "column" }}>
            {/* <div style={{ background: "#1a2a5e", padding: "12px 24px", color: "#fff", fontWeight: 600 }}>Namankit School Onboarding — Controller Panel</div> */}
            <Header />

            <div style={{ flex: 1, padding: 24 }}>
                {view === "list" ? (
                    <div style={{ background: "#fff", borderRadius: 4, padding: 20, boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
                        <h2 style={{ color: "#1aa0b6", marginTop: 0 }}>Meetings Details</h2>
                        <button onClick={handleNewMeeting} style={{ background: "#57b1c9", color: "#fff", padding: "10px 14px", borderRadius: 6, border: "none", cursor: "pointer", marginBottom: 12 }}>New Meeting</button>

                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa" }}>
                                        {['GR Date', 'Meeting Date', 'ATC', 'Brief Description', 'School Type', 'View'].map(h => (
                                            <th key={h} style={{ padding: "12px 16px", background: "#1a2a5e", color: "#fff", fontWeight: 600, fontSize: 13, textAlign: "left", borderRight: "1px solid #2d3d6e", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}



                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingMeetings ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "20px", textAlign: "center", fontSize: 14, color: "#666" }}>
                                                Loading meetings data...
                                            </td>
                                        </tr>
                                    ) : visibleMeetings.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "20px", textAlign: "center", fontSize: 14, color: "#666" }}>
                                                No meetings found
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleMeetings.map((m, idx) => (
                                            <tr key={m.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fbfbfb", borderBottom: "1px solid #eef2f3" }}>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>{formatDate(m.grDate)}</td>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>{formatDate(m.meetingDate)}</td>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>{m.atc}</td>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>{m.description}</td>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>{m.schoolType}</td>
                                                <td style={{ padding: "11px 16px", fontSize: 13, border: "1px solid #dee2e6" }}>
                                                    <button onClick={() => handleView(m)} style={{ background: "#17a2b8", color: "#fff", border: "none", padding: "11px 16px", fontSize: 13, borderRadius: 6, cursor: "pointer" }}>View</button>

                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ color: "#666" }}>Rows per page:</span>
                                <select value={rowsPerPage} onChange={handleRowsPerPageChange} style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #dcdcdc" }}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <button onClick={() => goToPage(page - 1)} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e6e6e6", background: page === 1 ? "#f5f7f8" : "#fff", color: "#333", cursor: page === 1 ? "default" : "pointer" }}>Previous</button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button key={p} onClick={() => goToPage(p)} style={{ padding: "6px 12px", borderRadius: 6, border: p === page ? "none" : "1px solid #e6e6e6", background: p === page ? "#122b54" : "#fff", color: p === page ? "#fff" : "#111", cursor: "pointer" }}>{p}</button>
                                    );
                                })}
                                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e6e6e6", background: page === totalPages ? "#f5f7f8" : "#fff", color: "#333", cursor: page === totalPages ? "default" : "pointer" }}>Next</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{position:'relative', background: "#fff", borderRadius: 4, padding: 20, boxShadow: "0 1px 0 rgba(0,0,0,0.05)" }}>
                                {loadingSchoolDetails && (
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        top: 0, 
                                        left: 0, 
                                        position: 'absolute', 
                                        zIndex: 1000, 
                                        background: 'rgba(255, 255, 255, 0.72)', 
                                        display: 'flex', 
                                        alignItems: 'start', 
                                        justifyContent: 'center',
                                        minHeight: '200px'
                                    }}>
                                        <div style={{width: '100%', 
                                        height: '100%', 
                                        display:'flex',
                                        top: '20%', 
                                        left: 0, 
                                        position: 'absolute',justifyContent:'center' }}>
                                            <Loader />
                                        </div>
                                    </div>
                                )}
                                
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h2 style={{ color: "#1aa0b6", marginTop: 0 }}>GR Details</h2>
                            <button onClick={() => setView("list")} style={{ background: "#fff", color: "#1a2a5e", border: "1px solid #1a2a5e", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}>← Back to List</button>
                        </div>

                        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                        <form onSubmit={handleSearch}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 18 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6 }}>Committee Meeting Date <span style={{ color: "#d9534f" }}>*</span></label>
                                    <input 
                                    name="committeeDate" type="date" 
                                    min={today}
                                    value={form.committeeDate} onChange={handleChange} 
                                    style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd" }} 
                                    disabled ={selectedMeeting ? true : false}
                                    />
                                    {errors.committeeDate && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.committeeDate}</div>}
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6 }}>GR Date <span style={{ color: "#d9534f" }}>*</span></label>
                                    <input name="grDate" 
                                    min={today}
                                    type="date" value={form.grDate} 
                                    onChange={handleChange} 
                                    style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd" }} 
                                    disabled ={selectedMeeting ? true : false}
                                    />
                                    {errors.grDate && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.grDate}</div>}
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6 }}>ATC Name <span style={{ color: "#d9534f" }}>*</span></label>
                                    <select name="atcName" value={form.atcName} onChange={handleChange}
                                    
                                    style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #bcd" }}
                                    disabled ={selectedMeeting ? true : false}
                                    >
                                        <option value="">---Select---</option>
                                        {atcMasters.map((atc) => (
                                            <option key={atc.value} value={atc.label}>
                                                {atc.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.atcName && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.atcName}</div>}
                                </div>
                            </div>

                            <div style={{ marginBottom: 18, maxWidth: 420 }}>
                                <label style={{ display: "block", marginBottom: 6 }}>School Type <span style={{ color: "#d9534f" }}>*</span></label>
                                <select 
                                disabled ={selectedMeeting ? true : false}
                                name="schoolType" value={form.schoolType} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd" }}>
                                    <option value="">---Select---</option>
                                    <option>NEW</option>
                                    <option>OLD</option>
                                </select>
                                {errors.schoolType && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.schoolType}</div>}
                            </div>

                            <div style={{ display: "flex", gap: 30, marginBottom: 18 }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: 6 }}>Upload GR File <span style={{ color: "#d9534f" }}>*</span></label>
                                    <input 
                                    disabled ={selectedMeeting ? true : false}
                                    name="grFile" type="file" onChange={handleChange} />
                                    {errors.grFile && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.grFile}</div>}
                                </div>
                                
                                {/* Show existing files when viewing a meeting */}
                                {selectedMeeting && selectedMeeting.uploadGRFile && (
                                    <div style={{ marginTop: 10 }}>
                                        <button
                                            onClick={() => viewExistingFile(selectedMeeting.uploadGRFile.link?.href)}
                                            style={{
                                                background: "#5bc0de",
                                                color: "#fff",
                                                border: "none",
                                                padding: "6px 12px",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                                fontSize: 12
                                            }}
                                        >
                                            View GR File
                                        </button>
                                    </div>
                                )}
                                <div>
                                    <label style={{ display: "block", marginBottom: 6 }}>Upload MOM File <span style={{ color: "#d9534f" }}>*</span></label>
                                    <input 
                                    disabled ={selectedMeeting ? true : false}
                                    name="momFile" type="file" onChange={handleChange} />
                                    {errors.momFile && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.momFile}</div>}
                                </div>
                                
                                {/* Show existing MOM file when viewing a meeting */}
                                {selectedMeeting && selectedMeeting.uploadMOMFile && (
                                    <div style={{ marginTop: 10 }}>
                                        <button
                                            onClick={() => viewExistingFile(selectedMeeting.uploadMOMFile.link?.href)}
                                            style={{
                                                background: "#5bc0de",
                                                color: "#fff",
                                                border: "none",
                                                padding: "6px 12px",
                                                borderRadius: 4,
                                                cursor: "pointer",
                                                fontSize: 12
                                            }}
                                        >
                                            View MOM File
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 18 }}>
                                <label style={{ display: "block", marginBottom: 6 }}>Brief Description <span style={{ color: "#d9534f" }}>*</span></label>
                                <textarea 
                                disabled={selectedMeeting}
                                name="description" value={form.description} onChange={handleChange} rows={5} style={{ width: "100%", padding: 10, borderRadius: 4, border: "1px solid #ddd" }} />
                                {errors.description && <div style={{ color: "#cc0000", fontSize: 12, marginTop: 6 }}>{errors.description}</div>}
                            </div>

                            <div style={{ display: "flex", gap: 12 }}>
                                <button 
                                    type="submit" 
                                   // disabled={selectedMeeting}
                                    
                                    style={{ 
                                        background: selectedMeeting ? "#ccc" : "#2ca44a", 
                                        color: "#fff", 
                                        border: "none", 
                                        padding: "10px 18px", 
                                        borderRadius: 4, 
                                        //cursor: showSchoolResults ? "not-allowed" : "pointer" 
                                    }}
                                >
                                    Search Schools
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleReset} 
                                    style={{ background: "#57b1c9", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 4, cursor: "pointer" }}
                                >
                                    Reset/New
                                </button>
                            </div>
                        </form>
                        <div style={{ marginTop: 28 }}>
                            <h3 style={{ color: "#1aa0b6", marginBottom: 8 }}>School Details</h3>
                            <div style={{ height: 8, borderBottom: "2px solid #f5b07a" }} />
                        </div>

                        {/* School Details Table */}
                        {console.log('Rendering table - isSearchSchools:', isSearchSchools, 'schoolDetails:', schoolDetails) || (isSearchSchools || selectedMeeting) && (
                            <div style={{ marginTop: 20, position: 'relative' }}>
                                {loadingSchoolDetails && (
                                    <div style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        top: 0, 
                                        left: 0, 
                                        position: 'absolute', 
                                        zIndex: 1000, 
                                        background: 'rgba(255, 255, 255, 0.72)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        minHeight: '200px'
                                    }}>
                                        <Loader />
                                    </div>
                                )}
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                        <thead>
                                            <tr style={{ background: "#f8f9fa" }}>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>Enter Meeting Decisions/remarks</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>View Grading Report</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>View School Profile</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>PO Name</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>School Name</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>Existing students</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>PO verification status</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>ATC verification status</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>System Calculated Marks</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>ATC Marks</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>PO remarks</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>ATC remarks</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>No of General Students</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>Sanctioned admissions(current academic year)</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>Committee Decision</th>
                                                <th style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", textAlign: "left", border: "1px solid #ddd", fontWeight: 600, fontSize: 12 }}>Committee Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schoolDetails && schoolDetails.length > 0 ? (
                                                schoolDetails.map((school) => (
                                                    <tr key={school.id}>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top" }}>
                                                        <button 
                                                            onClick={() => handleMeetingRemarks(school)}
                                                            style={{ 
                                                                background: "#007bff", 
                                                                color: "#fff", 
                                                                border: "none", 
                                                                padding: "4px 8px", 
                                                                borderRadius: 3, 
                                                                cursor: "pointer", 
                                                                fontSize: 12 
                                                            }}
                                                        >
                                                            Meeting Remarks
                                                        </button>
                                                    </td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top" }}>
                                                        <button 
                                                            onClick={() => viewPDFFile('gr', school.id)}
                                                            style={{ 
                                                                background: "#28a745", 
                                                                color: "#fff", 
                                                                border: "none", 
                                                                padding: "4px 8px", 
                                                                borderRadius: 3, 
                                                                cursor: "pointer", 
                                                                fontSize: 12 
                                                            }}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top" }}>
                                                        <button 
                                                            onClick={() => viewPDFFile('mom', school.id)}
                                                            style={{ 
                                                                background: "#28a745", 
                                                                color: "#fff", 
                                                                border: "none", 
                                                                padding: "4px 8px", 
                                                                borderRadius: 3, 
                                                                cursor: "pointer", 
                                                                fontSize: 12 
                                                            }}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.pOName}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.schoolName}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", textAlign: "center" }}>{school.existingStudents}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.pOVerificationStatus}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.aTCVerificationStatus}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", textAlign: "right" }}>{school.systemCalculatedMarks}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", textAlign: "right" }}>{school.atcMarks}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.poRemarks}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.atcRemarks}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", textAlign: "center" }}>{school.noOfGeneralStudents}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", textAlign: "center" }}>{school.sanctionedAdmissionscurrentAcademicYear}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.committeeDecision}</td>
                                                    <td style={{ minWidth: "50px", maxWidth: "110px", padding: "10px 8px", border: "1px solid #ddd", verticalAlign: "top", wordWrap: "break-word" }}>{school.committeeRemarks}</td>
                                                </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="15" style={{ padding: "20px", textAlign: "center", fontSize: 14, color: "#666" }}>
                                                        {isSearchSchools ? "No school details found" : "Click 'Search Schools' to view school details"}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination */}
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, fontSize: 13 }}>
                                    <div><strong>Total Records {schoolDetails.length}</strong></div>
                                    <div>Page: 1 of 1</div>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <button style={{ padding: "5px 16px", fontSize: 13, background: "#1a3a5c", color: "#fff", border: "1px solid #1a3a5c", borderRadius: 3, cursor: "pointer" }}>First</button>
                                        <button style={{ padding: "5px 16px", fontSize: 13, background: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: 3, cursor: "not-allowed" }} disabled>Previous</button>
                                        <button style={{ padding: "5px 16px", fontSize: 13, background: "#fff", color: "#333", border: "1px solid #ccc", borderRadius: 3, cursor: "not-allowed" }} disabled>Next</button>
                                        <button style={{ padding: "5px 16px", fontSize: 13, background: "#1a3a5c", color: "#fff", border: "1px solid #1a3a5c", borderRadius: 3, cursor: "pointer" }}>Last</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Meeting Remarks Popup */}
                        {showMeetingRemarks && selectedSchool && (
                            <MeetingRemarksPopup 
                            schoolProfileId={selectedSchool.schoolProfileId}
                            handleSaveMeetingRemarks={handleSaveMeetingRemarks}
                            setShowMeetingRemarks={() => setShowMeetingRemarks(false)}
                            studentsRegistered={selectedSchool.noOfGeneralStudents || 0}
                            studentsTransferred={selectedSchool.studentsTransferred || 0}
                            finalApprovalStatus={selectedSchool.aTCVerificationStatus || 'approved'}
                            sanctionedSeats={selectedSchool.sanctionedAdmissionscurrentAcademicYear || 0}
                            samayojan={selectedSchool.samayojan || 0}
                            assignedMarks={selectedSchool.assignedMarks || 0}
                            assignedFees={selectedSchool.assignedFees || 0}
                            schoolProposedFees={selectedSchool.schoolProposedFees || 0}
                            finalFees={selectedSchool.finalFees || 0}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
