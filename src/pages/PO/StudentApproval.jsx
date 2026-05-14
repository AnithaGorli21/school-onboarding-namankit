import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import ExcelJS from "exceljs";
import { getAllSchools, getStudentApprovalList } from "../../api/liferay";
import { apiPatch } from "../../api/liferay";

export default function StudentApproval() {
  const [schoolId, setSchoolId] = useState("");
  const [rows, setRows] = useState([]);
  const [approvals, setApprovals] = useState({});
  const [remarks, setRemarks] = useState({});
  const [schoolError, setSchoolError] = useState("");
  const [schools, setSchools] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [saving, setSaving] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  const handleSearch = async () => {
    if (!schoolId) {
      setSchoolError("Please select a school");
      setRows([]);
      return;
    }
    setSchoolError("");
    try {
      const items = await getStudentApprovalList(schoolId);

      console.log("Raw API items:", items); // ✅ debug

      const mapped = (items || []).map((it) => ({
        id: it.id,
        unique: it.uniqueNumber || it.aadharNumberUID || "",
        renewal: it.renewal || it.renewalStatus || "",
        name: it.studentName || `${it.firstName || ""} ${it.lastName || ""}`.trim(),
        aadhar: it.aadharNumberUID || "",
        income: it.familyIncome || "",
        class: it.currentClass || "",
        status: it.approvalStatus || "",
        poRemarks: it.pORemarks || "", // ✅ map saved remarks
      }));

      console.log("Mapped rows:", mapped); // ✅ debug

      setRows(mapped);

      const initApprovals = {};
      const initRemarks = {};
      mapped.forEach((r) => {
        initApprovals[r.id] = r.status === "approved";
        initRemarks[r.id] = r.poRemarks || ""; // ✅ pre-fill with saved value
      });
      setApprovals(initApprovals);
      setRemarks(initRemarks);
      setPage(1);
    } catch (err) {
      console.error("Failed to fetch student approvals", err);
      setRows([]);
      setSchoolError("Failed to load approvals");
    }
  };

  useEffect(() => {
    let mounted = true;
    getAllSchools()
      .then((s) => { if (!mounted) return; setSchools(s || []); })
      .catch((e) => console.error("Failed loading schools", e));
    return () => (mounted = false);
  }, []);

  const totalPages = Math.max(1, Math.ceil((rows || []).length / pageSize));
  const paged = (rows || []).slice((page - 1) * pageSize, page * pageSize);

  const handleSave = async () => {
    if (!schoolId) {
      setSchoolError("Please select a school");
      return;
    }

    const pendingRows = rows.filter(
      (r) => r.status !== "approved" && r.status !== "rejected"
    );
    const missingRemarks = pendingRows.filter(
      (r) => approvals[r.id] && !remarks[r.id]?.trim()
    );

    if (missingRemarks.length > 0) {
      alert(`Please add remarks for ${missingRemarks.length} approved student(s) before saving.`);
      return;
    }

    setSaving(true);
    try {
      for (const row of rows) {
        if (row.status === "approved" || row.status === "rejected") continue;
        const isApproved = approvals[row.id] || false;
        const remark = remarks[row.id] || "";
        await apiPatch(`/o/c/studentregistarions/${row.id}`, {
          approvalStatus: isApproved ? "approved" : "rejected",
          pORemarks: remark,
        });
      }
      alert("Students approval saved successfully!");
      handleSearch();
    } catch (err) {
      console.error("Save failed", err);
      alert("Save failed: " + (err?.message || "Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!rows || rows.length === 0) { alert("No data to export"); return; }
    (async () => {
      try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "School Onboarding";
        const sheet = workbook.addWorksheet("Student Approvals");
        sheet.columns = [
          { header: "Sr No", key: "sr", width: 8 },
          { header: "Unique No", key: "unique", width: 20 },
          { header: "Renewal Status", key: "renewal", width: 18 },
          { header: "Student Name", key: "name", width: 30 },
          { header: "Aadhar Number", key: "aadhar", width: 20 },
          { header: "Family Income", key: "income", width: 15 },
          { header: "Class", key: "class", width: 10 },
          { header: "Approval Status", key: "status", width: 20 },
          { header: "PO Remarks", key: "poRemarks", width: 30 }, // ✅ added
        ];
        rows.forEach((r, i) => {
          sheet.addRow({
            sr: i + 1, unique: r.unique, renewal: r.renewal,
            name: r.name, aadhar: r.aadhar, income: r.income,
            class: r.class, status: r.status,
            poRemarks: r.poRemarks || "", // ✅ added
          });
        });
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
        headerRow.alignment = { vertical: "middle", horizontal: "left" };
        headerRow.eachCell((cell) => {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A2A5E" } };
          cell.border = {
            top: { style: "thin", color: { argb: "FFDADFE6" } },
            left: { style: "thin", color: { argb: "FFDADFE6" } },
            bottom: { style: "thin", color: { argb: "FFDADFE6" } },
            right: { style: "thin", color: { argb: "FFDADFE6" } },
          };
        });
        (rows || []).forEach((_, idx) => {
          const excelRow = sheet.getRow(idx + 2);
          const isAlt = idx % 2 === 1;
          excelRow.eachCell((cell) => {
            cell.border = {
              top: { style: "thin", color: { argb: "FFF1F5F8" } },
              left: { style: "thin", color: { argb: "FFF1F5F8" } },
              bottom: { style: "thin", color: { argb: "FFF1F5F8" } },
              right: { style: "thin", color: { argb: "FFF1F5F8" } },
            };
            if (isAlt) { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } }; }
            cell.alignment = cell.col === 4
              ? { horizontal: "left", vertical: "middle" }
              : { horizontal: "center", vertical: "middle" };
          });
        });
        const buf = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `student-approvals.xlsx`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Export failed", err);
        alert("Export failed: " + (err && err.message ? err.message : err));
      }
    })();
  };

  const hasPendingStudents = rows.some(
    (r) => r.status !== "approved" && r.status !== "rejected"
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fbfb", fontFamily: "var(--font-main)", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ padding: 18 }}>
        <h6 style={{ margin: 0 }}>Student's Approval</h6>
        <hr style={{ margin: "0px 0px 1rem 0px" }} />

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>
              Select School <span style={{ color: "#e53935" }}>*</span>
            </div>
            <select
              value={schoolId}
              onChange={(e) => { setSchoolId(e.target.value); setSchoolError(""); }}
              aria-invalid={!!schoolError}
              style={{ padding: 8, minWidth: 240, borderColor: schoolError ? "#e53935" : undefined }}
            >
              <option value="">--Select--</option>
              {(schools || []).map((s) => (
                <option key={s.id} value={s.id}>{s.schoolName}</option>
              ))}
            </select>
            {schoolError && <div style={{ color: "#e53935", fontSize: 12, marginTop: 6 }}>{schoolError}</div>}
          </div>
          <button onClick={handleSearch} style={{ background: "#28a745", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 4, cursor: "pointer" }}>
            Search
          </button>
        </div>

        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
            <thead>
              <tr>
                {["Sr. No.", "Student Unq. No.", "Renewal Status", "Student Name", "Aadhar Number", "Family Income", "Class", "View Student Details", "Approve", "Remarks", "Approval Status"].map((title) => (
                  <th key={title} style={{ padding: "12px 16px", background: "#1a2a5e", color: "#fff", fontWeight: 600, fontSize: 13, textAlign: "left", borderRight: "1px solid #2d3d6e", whiteSpace: "nowrap" }}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={11} style={{ padding: 20, textAlign: "center", color: "#666" }}>No records found</td></tr>
              ) : (
                paged.map((r, i) => (
                  <tr key={r.id || i}>
                    <td style={tdStyle}>{(page - 1) * pageSize + i + 1}</td>
                    <td style={tdStyle}>{r.unique}</td>
                    <td style={tdStyle}>{r.renewal}</td>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={tdStyle}>{r.aadhar}</td>
                    <td style={tdStyle}>{r.income}</td>
                    <td style={tdStyle}>{r.class}</td>

                    {/* View button */}
                    <td style={tdStyle}>
                      <button style={linkBtn} onClick={() => setViewStudent(r)}>View</button>
                    </td>

                    {/* Approve column */}
                    <td style={tdStyle}>
                      {r.status === "approved" || r.status === "rejected" ? (
                        <span style={{ color: r.status === "approved" ? "#28a745" : "#dc3545", fontWeight: 600 }}>
                          {r.status === "approved" ? "✓ Approved" : "✗ Rejected"}
                        </span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={approvals[r.id] || false}
                          onChange={(e) => setApprovals((prev) => ({ ...prev, [r.id]: e.target.checked }))}
                        />
                      )}
                    </td>

                    {/* Remarks column */}
                    <td style={tdStyle}>
                      {r.status === "approved" || r.status === "rejected" ? (
                        // ✅ Show saved poRemarks directly
                        <span>{r.poRemarks || "—"}</span>
                      ) : (
                        <div>
                          <input
                            style={{
                              width: "100%",
                              border: approvals[r.id] && !remarks[r.id]?.trim()
                                ? "1px solid #e53935"
                                : "1px solid #ced4da",
                              borderRadius: 3, padding: "4px 6px", fontSize: 13,
                            }}
                            placeholder={approvals[r.id] ? "Remarks required *" : "Remarks"}
                            value={remarks[r.id] || ""}
                            onChange={(e) => setRemarks((prev) => ({ ...prev, [r.id]: e.target.value }))}
                          />
                          {approvals[r.id] && !remarks[r.id]?.trim() && (
                            <div style={{ color: "#e53935", fontSize: 11, marginTop: 2 }}>Required</div>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {rows.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, fontSize: 13, color: "#555" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>Rows per page:</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                style={{ padding: "4px 8px", border: "1px solid #ced4da", borderRadius: 4, fontSize: 13 }}>
                {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <PBtn label="Previous" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PBtn key={n} label={String(n)} onClick={() => setPage(n)} active={n === page} />
              ))}
              <PBtn label="Next" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button
            onClick={handleSave}
            disabled={saving || !hasPendingStudents}
            style={{
              background: saving || !hasPendingStudents ? "#6cbe89" : "#28a745",
              color: "#fff", border: "none", padding: "8px 12px", borderRadius: 4,
              cursor: saving || !hasPendingStudents ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={handleExport} style={{ background: "#f0ad4e", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 4 }}>
            Export to Excel
          </button>
        </div>
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: 24, minWidth: 400, maxWidth: 600, width: "90%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h6 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Student Details</h6>
              <button onClick={() => setViewStudent(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#666" }}>×</button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {[
                  ["Student Name", viewStudent.name],
                  ["Unique No", viewStudent.unique],
                  ["Aadhar Number", viewStudent.aadhar],
                  ["Family Income", viewStudent.income],
                  ["Class", viewStudent.class],
                  ["Renewal Status", viewStudent.renewal],
                  ["Approval Status", viewStudent.status],
                  ["PO Remarks", viewStudent.poRemarks || "—"], // ✅ added
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, background: "#f8f9fa", border: "1px solid #dee2e6", width: "40%" }}>{label}</td>
                    <td style={{ padding: "8px 12px", border: "1px solid #dee2e6" }}>{value || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button onClick={() => setViewStudent(null)} style={{ background: "#1a2a5e", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 4, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PBtn({ label, onClick, disabled, active }) {
  return (
    <button onClick={!disabled ? onClick : undefined} style={{
      padding: "5px 12px", fontSize: 13, borderRadius: 4,
      cursor: disabled ? "default" : "pointer",
      border: `1px solid ${active ? "#1a2a5e" : "#dee2e6"}`,
      background: active ? "#1a2a5e" : "#fff",
      color: active ? "#fff" : disabled ? "#aaa" : "#333",
      fontWeight: active ? 600 : 400,
    }}>{label}</button>
  );
}

const tdStyle = { padding: "10px 12px", borderBottom: "1px solid #f5f5f5", fontSize: 13, textAlign: "center" };
const linkBtn = { background: "transparent", border: "none", color: "#1a7a8a", cursor: "pointer" };