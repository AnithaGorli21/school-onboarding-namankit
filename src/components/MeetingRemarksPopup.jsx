import React, { useState } from 'react'

function MeetingRemarksPopup({
    schoolProfileId,
    handleSaveMeetingRemarks,
    setShowMeetingRemarks,
    studentsRegistered= 0,
    studentsTransferred= 0,
    finalApprovalStatus= 'approved',
    sanctionedSeats= 0,
    samayojan= 0,
    assignedMarks= 0,
    assignedFees= 0,
    schoolProposedFees= 0,
    finalFees= 0
}) {
    const [formData, setFormData] = useState({
        studentsRegistered,
        studentsTransferred,
        finalApprovalStatus,
        sanctionedSeats,
        samayojan,
        assignedMarks,
        assignedFees,
        schoolProposedFees,
        finalFees,
        finalRemarks: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        handleSaveMeetingRemarks(schoolProfileId, formData);
    };

    return (
        <div style={{ 
                                position: "fixed", 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0, 
                                background: "rgba(0,0,0,0.5)", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                zIndex: 1000 
                            }}>
                                <div style={{ 
                                    background: "#fff", 
                                    borderRadius: 4, 
                                    width: 800, 
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)" 
                                }}>
                                    {/* Header */}
                                    <div style={{ 
                                        background: "#f8d7da", 
                                        padding: "12px 18px", 
                                        borderRadius: "4px 4px 0 0", 
                                        fontSize: 15, 
                                        fontWeight: 700, 
                                        color: "#c0392b", 
                                        borderBottom: "1px solid #f5c6cb" ,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>Meeting Remarks</div>
                                        <button 
                                            onClick={() => setShowMeetingRemarks(false)}
                                            style={{ 
                                                background: "none", 
                                                border: "none", 
                                                fontSize: 20, 
                                                cursor: "pointer", 
                                                color: "#c0392b",
                                                fontWeight: 700
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    
                                    {/* Body */}
                                    <div style={{ padding: "22px 18px", fontSize: 14, color: "#333" }}>
                                        {/* First Row: Two inputs */}
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Actual Students Registered <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.studentsRegistered}
                                                    onChange={(e) => handleInputChange('studentsRegistered', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter actual students registered"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Actual Students Transferred <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.studentsTransferred}
                                                    onChange={(e) => handleInputChange('studentsTransferred', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter actual students transferred"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Second Row: One select */}
                                        <div style={{ marginBottom: 16 }}>
                                            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                Final Decision <span style={{ color: "#d9534f" }}>*</span>
                                            </label>
                                            <select 
                                                style={{ 
                                                    width: "100%", 
                                                    padding: 8, 
                                                    borderRadius: 4, 
                                                    border: "1px solid #ddd", 
                                                    fontSize: 14
                                                }}
                                                value={formData.finalApprovalStatus}
                                                onChange={(e) => handleInputChange('finalApprovalStatus', e.target.value)}
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="approved">Approved</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                        </div>
                                        
                                        {/* Third Row: Two inputs */}
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Sanctioned admissions (current academic year)<span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.sanctionedSeats}
                                                    onChange={(e) => handleInputChange('sanctionedSeats', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter sanctioned number"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Samayojan <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.samayojan}
                                                    onChange={(e) => handleInputChange('samayojan', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter samayojan number"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Fourth Row: Two inputs */}
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Assigned Marks <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.assignedMarks}
                                                    onChange={(e) => handleInputChange('assignedMarks', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter assigned marks"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Assigned Fees <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.assignedFees}
                                                    onChange={(e) => handleInputChange('assignedFees', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter assigned fees"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Fifth Row: Two inputs */}
                                        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    School Proposed Fees <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.schoolProposedFees}
                                                    onChange={(e) => handleInputChange('schoolProposedFees', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter school proposed fees"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                    Final Fees <span style={{ color: "#d9534f" }}>*</span>
                                                </label>
                                                <input 
                                                    type="number"
                                                    value={formData.finalFees}
                                                    onChange={(e) => handleInputChange('finalFees', e.target.value)}
                                                    style={{ 
                                                        width: "100%", 
                                                        padding: 8, 
                                                        borderRadius: 4, 
                                                        border: "1px solid #ddd", 
                                                        fontSize: 14
                                                    }}
                                                    placeholder="Enter final fees"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Sixth Row: One text input */}
                                        <div style={{ marginBottom: 16 }}>
                                            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                                                Final Remarks <span style={{ color: "#d9534f" }}>*</span>
                                            </label>
                                            <textarea 
                                                rows={3}
                                                value={formData.finalRemarks}
                                                onChange={(e) => handleInputChange('finalRemarks', e.target.value)}
                                                style={{ 
                                                    width: "100%", 
                                                    padding: 8, 
                                                    borderRadius: 4, 
                                                    border: "1px solid #ddd", 
                                                    resize: "vertical",
                                                    fontSize: 14
                                                }}
                                                placeholder="Enter final remarks..."
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div style={{ padding: "10px 18px 18px", textAlign: "center", borderTop: "1px solid #eee" }}>
                                        <button 
                                            onClick={handleSave}
                                            style={{ 
                                                background: "rgb(44, 164, 74)", 
                                                color: "#fff", 
                                                border: "none", 
                                                borderRadius: 4, 
                                                padding: "8px 36px", 
                                                fontSize: 14, 
                                                fontWeight: 600, 
                                                cursor: "pointer"
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>  
    )
}
 
export default MeetingRemarksPopup