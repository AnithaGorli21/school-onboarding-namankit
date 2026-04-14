// ============================================================
//  src/sections/TeachersDetails.jsx
// ============================================================
import { useState } from "react";
import { 
  Field, TextInput, SelectInput, 
  SectionHeading, Row3, Row2, 
  Alert, BtnSave, BtnReset 
} from "../components/FormFields";
import { TH, TD, DELETE_BTN } from "../utils/Tablestyles";
import Pagination from "../components/Pagination";

// Options from image and common educational standards
const QUALIFICATIONS = ["SSC", "HSC", "D.Ed", "B.Ed", "M.Ed", "B.A", "B.Sc", "M.A", "M.Sc", "PhD"];
const MEDIUMS = ["English", "Marathi", "Hindi", "Urdu", "Other"];
const SUBJECTS = ["Mathematics", "Science", "English", "Marathi", "Hindi", "Social Science", "Sanskrit", "P.E."];

const themeStyles = {
  container: { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px)" },
  card: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #d6e0e0)",
    borderRadius: "var(--radius-sm, 3px)",
    padding: "18px 20px 22px",
  },
  radioGroup: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    fontSize: "13px",
    marginTop: "8px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    cursor: "pointer",
    marginTop: "30px" // Align with fields
  },
  addBtn: {
    background: "var(--btn-save-bg, #28a745)",
    color: "#fff",
    border: "none",
    padding: "6px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  }
};

const emptyRow = {
  teacherName: "",
  highestQualification: "",
  medium10th: "",
  mediumDegree: "",
  mediumProfessional: "", // For B.ed/D.ed
  yearsExperience: "",
  subject1: "",
  subject2: "",
  isSportsTeacher: false,
  gender: "",
  status: "", // Residential vs Non-Residential
};

export default function TeachersDetails() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState(emptyRow);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const setR = (k) => (v) => setNewRow(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newRow.teacherName || !newRow.highestQualification || !newRow.gender) {
      setAlert({ type: "error", message: "Please fill Name, Qualification and Gender." });
      return;
    }
    setRows(p => [...p, { ...newRow, id: Date.now() }]);
    setNewRow(emptyRow);
    setPage(1);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Using FormData for theme-consistent file uploads if needed, 
      // otherwise JSON works for table data
      await fetch("/o/c/teacherdetails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
      });
      setAlert({ type: "success", message: "Teachers data saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed." });
    } finally { setSaving(false); }
  };

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={themeStyles.container}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={themeStyles.card}>
        <SectionHeading title="Teacher Details" />

        <Row3>
          <Field label="Name" required>
            <TextInput value={newRow.teacherName} onChange={setR("teacherName")} />
          </Field>
          <Field label="Highest Qualification" required>
            <TextInput value={newRow.highestQualification} onChange={setR("highestQualification")} />
          </Field>
          <Field label="Medium of Education till Std. 10th" required>
            <SelectInput value={newRow.medium10th} onChange={setR("medium10th")} options={MEDIUMS} />
          </Field>
        </Row3>

        <Row3>
          <Field label="Medium of Education for Degree" required>
            <SelectInput value={newRow.mediumDegree} onChange={setR("mediumDegree")} options={MEDIUMS} />
          </Field>
          <Field label="Medium of Education for B.ed/D.ed/B.P.ed/B.ed Physical" required>
            <SelectInput value={newRow.mediumProfessional} onChange={setR("mediumProfessional")} options={MEDIUMS} />
          </Field>
          <Field label="Years Of Experience" required>
            <TextInput value={newRow.yearsExperience} onChange={setR("yearsExperience")} type="number" />
          </Field>
        </Row3>

        <Row3>
          <Field label="Subject 1" required>
            <SelectInput value={newRow.subject1} onChange={setR("subject1")} options={SUBJECTS} />
          </Field>
          <Field label="Subject 2">
            <SelectInput value={newRow.subject2} onChange={setR("subject2")} options={SUBJECTS} />
          </Field>
          <label style={themeStyles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={newRow.isSportsTeacher} 
              onChange={(e) => setR("isSportsTeacher")(e.target.checked)} 
            />
            Is Sports B.P.ed <span style={{color: 'red'}}>*</span>
          </label>
        </Row3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '10px' }}>
          <Field label="Gender" required>
            <div style={themeStyles.radioGroup}>
              {["Male", "Female", "Other"].map(g => (
                <label key={g}>
                  <input type="radio" name="gender" checked={newRow.gender === g} onChange={() => setR("gender")(g)} /> {g}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Status" required>
            <div style={themeStyles.radioGroup}>
              {["Residential", "Non Residential"].map(s => (
                <label key={s}>
                  <input type="radio" name="status" checked={newRow.status === s} onChange={() => setR("status")(s)} /> {s}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <button onClick={handleAdd} style={{ ...themeStyles.addBtn, marginTop: '20px' }}>Save</button>

        {/* Table Section */}
        {rows.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <div style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", marginBottom: 12 }}>Filled Details</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border-color)" }}>
                <thead>
                  <tr>
                    <th style={TH}>Teacher Name</th>
                    <th style={TH}>Qualifications</th>
                    <th style={TH}>Subject</th>
                    <th style={TH}>Medium till 10th</th>
                    <th style={TH}>Medium Degree</th>
                    <th style={TH}>Gender</th>
                    <th style={TH}>Exp.</th>
                    <th style={TH}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map(r => (
                    <tr key={r.id}>
                      <td style={TD}>{r.teacherName}</td>
                      <td style={TD}>{r.highestQualification}</td>
                      <td style={TD}>{r.subject1}</td>
                      <td style={TD}>{r.medium10th}</td>
                      <td style={TD}>{r.mediumDegree}</td>
                      <td style={TD}>{r.gender === "Male" ? "M" : "F"}</td>
                      <td style={TD}>{r.yearsExperience}</td>
                      <td style={TD}><button style={DELETE_BTN} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={rows.length} pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={() => { setRows([]); setNewRow(emptyRow); }} />
        <BtnSave onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Final Submit"}</BtnSave>
      </div>
    </div>
  );
}