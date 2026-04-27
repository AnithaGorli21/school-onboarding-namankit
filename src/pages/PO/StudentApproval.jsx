import React, { useState } from 'react'
import Header from '../../components/Header';
import Footer from '../../sections/Footer';

export default function StudentApproval() {
    const [school, setSchool] = useState('');
    const [rows, setRows] = useState([]);

    const handleSearch = () => {
        // Placeholder: fetch rows for selected school
        setRows([]);
    };

    const handleSave = () => {
        // Placeholder: save approvals
        alert('Please select School');
    };

    const handleExport = () => {
        // Placeholder: export logic
        alert('Export to Excel clicked (not implemented)');
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f8fbfb", fontFamily: "var(--font-main)", display: "flex", flexDirection: "column" }}>
            <Header />
            <div style={{ padding: 18 }}>

                <h2 style={{ marginTop: 0, marginBottom: 12 }}>Student's Approval</h2>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 14 }}>
                    <div>
                        <div style={{ fontSize: 13, marginBottom: 6 }}>Select School <span style={{ color: '#e53935' }}>*</span></div>
                        <select value={school} onChange={e => setSchool(e.target.value)} style={{ padding: 8, minWidth: 240 }}>
                            <option value="">--Select--</option>
                            <option value="school1">School 1</option>
                            <option value="school2">School 2</option>
                        </select>
                    </div>

                    <button onClick={handleSearch} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}>Search</button>
                </div>

                <div style={{ border: '1px solid #e6e6e6', borderRadius: 4, overflow: 'hidden' }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                        <thead style={{ background: '#fafafa' }}>
                            <th style={thStyle}></th>
                            <tr>{["Sr. No.", "Student Unq. No.", "Renewal Status", "Student Name", "Aadhar Number", "Family Income", "Class", "View Student Details", "Approve", "Remarks", "Approval Status"].map(title => (
                                <th style={{ padding: "12px 16px", background: "#1a2a5e", color: "#fff", fontWeight: 600, fontSize: 13, textAlign: "left", borderRight: "1px solid #2d3d6e", whiteSpace: "nowrap" }}>{title}</th>

                            ))}

                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={11} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No records found</td>
                                </tr>
                            ) : rows.map((r, i) => (
                                <tr key={i}>
                                    <td style={tdStyle}>{i + 1}</td>
                                    <td style={tdStyle}>{r.unique}</td>
                                    <td style={tdStyle}>{r.renewal}</td>
                                    <td style={tdStyle}>{r.name}</td>
                                    <td style={tdStyle}>{r.aadhar}</td>
                                    <td style={tdStyle}>{r.income}</td>
                                    <td style={tdStyle}>{r.class}</td>
                                    <td style={tdStyle}><button style={linkBtn}>View</button></td>
                                    <td style={tdStyle}><input type="checkbox" /></td>
                                    <td style={tdStyle}><input style={{ width: '100%' }} /></td>
                                    <td style={tdStyle}>{r.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Save</button>
                    <button onClick={handleExport} style={{ background: '#f0ad4e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 4 }}>Export to Excel</button>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const thStyle = { padding: '10px 12px', borderBottom: '1px solid #eee', textAlign: 'left', fontSize: 13 };
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', fontSize: 13 };
const linkBtn = { background: 'transparent', border: 'none', color: '#1a7a8a', cursor: 'pointer' };