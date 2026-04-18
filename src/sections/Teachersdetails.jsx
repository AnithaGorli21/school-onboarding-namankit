// ============================================================
//  src/sections/Teachersdetails.jsx
//
//  FIXES:
//  1. Uses saveTeacherDetails from liferay.js (Authorization header)
//  2. POST each teacher row individually (Liferay object API = one record per POST)
//  3. Subject/Medium dropdowns now use { value, label } to store numeric IDs
//     instead of SUBJECTS.indexOf() which is fragile and wrong
//  4. highestQualification mapped to qualificationId (numeric)
//  ⚠️  Share Teacher swagger payload to confirm exact field names
// ============================================================
import { useState } from "react";
import {
  Field, TextInput, SelectInput,
  SectionHeading, Row3, Row2,
  Alert, BtnSave, BtnReset,
} from "../components/FormFields";
import { TH, TD, DELETE_BTN } from "../utils/Tablestyles";
import Pagination from "../components/Pagination";
import { saveTeacherDetails } from "../api/liferay";

// ⚠️ Replace value IDs with actual Liferay picklist IDs
// highestQualification is a Text field in Liferay — send string label directly
const QUALIFICATIONS = ["SSC", "HSC", "D.Ed", "B.Ed", "M.Ed", "B.A", "B.Sc", "M.A", "M.Sc", "PhD"];

const MEDIUMS = [
  { value: 1, label: "English" },
  { value: 2, label: "Marathi" },
  { value: 3, label: "Hindi" },
  { value: 4, label: "Urdu" },
  { value: 5, label: "Other" },
];

const SUBJECTS = [
  { value: 1, label: "Mathematics" },
  { value: 2, label: "Science" },
  { value: 3, label: "English" },
  { value: 4, label: "Marathi" },
  { value: 5, label: "Hindi" },
  { value: 6, label: "Social Science" },
  { value: 7, label: "Sanskrit" },
  { value: 8, label: "P.E." },
];

const themeStyles = {
  container: { padding: "var(--spacing-md, 16px) var(--spacing-lg, 20px)" },
  card: {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #d6e0e0)",
    borderRadius: "var(--radius-sm, 3px)",
    padding: "18px 20px 22px",
  },
  radioGroup:    { display: "flex", gap: "15px", alignItems: "center", fontSize: "13px", marginTop: "8px" },
  checkboxLabel: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", marginTop: "30px" },
  addBtn:        { background: "#28a745", color: "#fff", border: "none", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "14px" },
};

const emptyRow = {
  name:                                    "",
  highestQualification:                    "",  // Text field in Liferay — send string not ID
  mediumOfEducationTillStd10thId:          "",
  mediumOfEducationForDegreeId:            "",
  mediumForEducationForBedDedBPedBedPhyId: "",
  yearOfExperience:                        "",
  subject1Id:                              "",
  subject2Id:                              "",
  isSportsBPed:                            false,
  genderId:                                "",
  teacherDetailStatus:                     "",
};

export default function TeachersDetails() {
  const [rows,     setRows]     = useState([]);
  const [newRow,   setNewRow]   = useState(emptyRow);
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [alert,    setAlert]    = useState(null);
  const [saving,   setSaving]   = useState(false);

  const setR = (k) => (v) => setNewRow((p) => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newRow.name || !newRow.highestQualification || !newRow.genderId) {
      setAlert({ type: "error", message: "Please fill Name, Qualification and Gender." });
      return;
    }
    setRows((p) => [...p, { ...newRow, id: Date.now() }]);
    setNewRow(emptyRow);
  };

  const handleSave = async () => {
    if (rows.length === 0) {
      setAlert({ type: "error", message: "Please add at least one teacher." });
      return;
    }
    setSaving(true);
    setAlert(null);
    try {
      // POST each teacher row individually — Liferay object API = one record per POST
      for (const row of rows) {
        const payload = {
          name:                                    row.name                                    || "",
          highestQualification:                    row.highestQualification                    || "",  // Text field
          mediumOfEducationTillStd10thId:          Number(row.mediumOfEducationTillStd10thId)  || 0,
          mediumOfEducationForDegreeId:            Number(row.mediumOfEducationForDegreeId)    || 0,
          mediumForEducationForBedDedBPedBedPhyId: Number(row.mediumForEducationForBedDedBPedBedPhyId) || 0,
          yearOfExperience:                        Number(row.yearOfExperience)                || 0,
          subject1Id:                              Number(row.subject1Id)                      || 0,
          subject2Id:                              Number(row.subject2Id)                      || 0,
          isSportsBPed:                            !!row.isSportsBPed,
          genderId:                                Number(row.genderId)                        || 0,
          teacherDetailStatus:                     !!row.teacherDetailStatus,
        };
        console.log("[TeacherDetails] payload →", JSON.stringify(payload, null, 2));
        await saveTeacherDetails(payload);
      }
      setAlert({ type: "success", message: "Teachers data saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
    }
  };

  // Helper to get label from value for table display
  const getLabel = (options, value) => options.find((o) => o.value === Number(value))?.label || value;

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={themeStyles.container}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div style={themeStyles.card}>
        <SectionHeading title="Teacher Details" />

        <Row3>
          <Field label="Name" required>
            <TextInput value={newRow.name} onChange={setR("name")} />
          </Field>
          <Field label="Highest Qualification" required>
            <SelectInput value={newRow.highestQualification} onChange={setR("highestQualification")} options={QUALIFICATIONS} />
          </Field>
          <Field label="Medium of Education till Std. 10th" required>
            <SelectInput value={newRow.mediumOfEducationTillStd10thId} onChange={setR("mediumOfEducationTillStd10thId")} options={MEDIUMS} />
          </Field>
        </Row3>

        <Row3>
          <Field label="Medium of Education for Degree" required>
            <SelectInput value={newRow.mediumOfEducationForDegreeId} onChange={setR("mediumOfEducationForDegreeId")} options={MEDIUMS} />
          </Field>
          <Field label="Medium for B.Ed/D.Ed/B.P.Ed" required>
            <SelectInput value={newRow.mediumForEducationForBedDedBPedBedPhyId} onChange={setR("mediumForEducationForBedDedBPedBedPhyId")} options={MEDIUMS} />
          </Field>
          <Field label="Years Of Experience" required>
            <TextInput value={newRow.yearOfExperience} onChange={setR("yearOfExperience")} type="number" />
          </Field>
        </Row3>

        <Row3>
          <Field label="Subject 1" required>
            <SelectInput value={newRow.subject1Id} onChange={setR("subject1Id")} options={SUBJECTS} />
          </Field>
          <Field label="Subject 2">
            <SelectInput value={newRow.subject2Id} onChange={setR("subject2Id")} options={SUBJECTS} />
          </Field>
          <label style={themeStyles.checkboxLabel}>
            <input
              type="checkbox"
              checked={newRow.isSportsBPed}
              onChange={(e) => setR("isSportsBPed")(e.target.checked)}
            />
            Is Sports B.P.ed
          </label>
        </Row3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: "10px" }}>
          <Field label="Gender" required>
            <div style={themeStyles.radioGroup}>
              {[{ value: 1, label: "Male" }, { value: 2, label: "Female" }, { value: 3, label: "Other" }].map((g) => (
                <label key={g.value}>
                  <input
                    type="radio"
                    checked={newRow.genderId === g.value}
                    onChange={() => setR("genderId")(g.value)}
                  /> {g.label}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Status" required>
            <div style={themeStyles.radioGroup}>
              {["Residential", "Non Residential"].map((s, i) => (
                <label key={s}>
                  <input
                    type="radio"
                    checked={newRow.teacherDetailStatus === (i === 0)}
                    onChange={() => setR("teacherDetailStatus")(i === 0)}
                  /> {s}
                </label>
              ))}
            </div>
          </Field>
        </div>

        <button onClick={handleAdd} style={{ ...themeStyles.addBtn, marginTop: "20px" }}>Add</button>

        {/* Table */}
        {rows.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <div style={{ fontSize: 16, fontWeight: 400, marginBottom: 12 }}>Filled Details</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ccc" }}>
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
                  {paged.map((r) => (
                    <tr key={r.id}>
                      <td style={TD}>{r.name}</td>
                      <td style={TD}>{r.highestQualification}</td>
                      <td style={TD}>{getLabel(SUBJECTS, r.subject1Id)}</td>
                      <td style={TD}>{getLabel(MEDIUMS, r.mediumOfEducationTillStd10thId)}</td>
                      <td style={TD}>{getLabel(MEDIUMS, r.mediumOfEducationForDegreeId)}</td>
                      <td style={TD}>{r.genderId === 1 ? "Male" : r.genderId === 2 ? "Female" : "Other"}</td>
                      <td style={TD}>{r.yearOfExperience}</td>
                      <td style={TD}>
                        <button style={DELETE_BTN} onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              total={rows.length}
              pageSize={pageSize}
              setPageSize={setPageSize}
              page={page}
              setPage={setPage}
            />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <BtnReset onClick={() => { setRows([]); setNewRow(emptyRow); setAlert(null); }} />
        <BtnSave onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </BtnSave>
      </div>
    </div>
  );
}