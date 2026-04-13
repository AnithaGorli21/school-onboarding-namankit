// ============================================================
//  src/sections/TeachersDetails.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";

const YES_NO      = ["Yes", "No"];
const DESIGNATION = ["Principal","Vice Principal","Teacher","Assistant Teacher","PET Teacher","Art Teacher","Music Teacher","Other"];
const SUBJECT     = ["Mathematics","Science","English","Marathi","Hindi","Social Science","Computer","Sanskrit","Other"];
const MEDIUM      = ["Marathi","Hindi","English","Semi-English","Urdu"];
const QUALIFICATION = ["B.Ed","M.Ed","B.A. B.Ed","B.Sc B.Ed","M.A. B.Ed","M.Sc B.Ed","D.Ed","Other"];

const emptyForm = {
  totalSanctionedPosts: "", totalFilledPosts: "", totalVacantPosts: "",
  principalAppointed: "", totalPermanentTeachers: "",
  totalContractTeachers: "", totalGuestTeachers: "",
  totalMaleTeachers: "", totalFemaleTeachers: "",
};

const emptyRow = {
  teacherName: "", designation: "", subject: "",
  medium: "", qualification: "", mobileNumber: "",
  isPermanent: "", joiningDate: "",
};

export default function TeachersDetails({ onTabChange }) {
  const [form, setForm]     = useState(emptyForm);
  const [rows, setRows]     = useState([]);
  const [newRow, setNewRow] = useState(emptyRow);
  const [rowErr, setRowErr] = useState("");
  const [page, setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const set  = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const setR = (k) => (v) => setNewRow(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newRow.teacherName || !newRow.designation || !newRow.subject || !newRow.qualification) {
      setRowErr("Please fill Name, Designation, Subject and Qualification."); return;
    }
    setRowErr("");
    setRows(p => [...p, { ...newRow, id: Date.now() }]);
    setNewRow(emptyRow); setPage(1);
  };

  const handleSave = async () => {
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/teacherdetails", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, teachersData: JSON.stringify(rows) }),
      });
      setAlert({ type: "success", message: "Teachers Details saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setForm(emptyForm); setRows([]); setNewRow(emptyRow);
    setAlert(null); setRowErr(""); setPage(1);
  };

  const paged = rows.slice((page-1)*pageSize, page*pageSize);

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Teacher Summary" />

      <Row3>
        <Field label="Total Sanctioned Posts" required>
          <TextInput value={form.totalSanctionedPosts} onChange={set("totalSanctionedPosts")} type="number" />
        </Field>
        <Field label="Total Filled Posts" required>
          <TextInput value={form.totalFilledPosts} onChange={set("totalFilledPosts")} type="number" />
        </Field>
        <Field label="Total Vacant Posts">
          <TextInput value={form.totalVacantPosts} onChange={set("totalVacantPosts")} type="number" readOnly />
        </Field>
      </Row3>

      <Row3>
        <Field label="Principal Appointed" required>
          <SelectInput value={form.principalAppointed} onChange={set("principalAppointed")} options={YES_NO} />
        </Field>
        <Field label="Total Permanent Teachers" required>
          <TextInput value={form.totalPermanentTeachers} onChange={set("totalPermanentTeachers")} type="number" />
        </Field>
        <Field label="Total Contract Teachers" required>
          <TextInput value={form.totalContractTeachers} onChange={set("totalContractTeachers")} type="number" />
        </Field>
      </Row3>

      <Row3>
        <Field label="Total Guest Teachers">
          <TextInput value={form.totalGuestTeachers} onChange={set("totalGuestTeachers")} type="number" />
        </Field>
        <Field label="Total Male Teachers" required>
          <TextInput value={form.totalMaleTeachers} onChange={set("totalMaleTeachers")} type="number" />
        </Field>
        <Field label="Total Female Teachers" required>
          <TextInput value={form.totalFemaleTeachers} onChange={set("totalFemaleTeachers")} type="number" />
        </Field>
      </Row3>

      {/* Individual Teacher Entry */}
      <div style={{ marginTop: 24 }}>
        <SectionHeading title="Teacher Details" />
        {rowErr && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 8 }}>{rowErr}</div>}

        <Row3>
          <Field label="Teacher Name" required>
            <TextInput value={newRow.teacherName} onChange={setR("teacherName")} />
          </Field>
          <Field label="Designation" required>
            <SelectInput value={newRow.designation} onChange={setR("designation")} options={DESIGNATION} />
          </Field>
          <Field label="Subject" required>
            <SelectInput value={newRow.subject} onChange={setR("subject")} options={SUBJECT} />
          </Field>
        </Row3>

        <Row3>
          <Field label="Medium">
            <SelectInput value={newRow.medium} onChange={setR("medium")} options={MEDIUM} />
          </Field>
          <Field label="Qualification" required>
            <SelectInput value={newRow.qualification} onChange={setR("qualification")} options={QUALIFICATION} />
          </Field>
          <Field label="Mobile Number">
            <TextInput value={newRow.mobileNumber} onChange={setR("mobileNumber")} type="tel" />
          </Field>
        </Row3>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <Field label="Permanent / Contract" required>
              <SelectInput value={newRow.isPermanent} onChange={setR("isPermanent")}
                options={["Permanent","Contract","Guest"]} />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Joining Date">
              <TextInput value={newRow.joiningDate} onChange={setR("joiningDate")} type="date" />
            </Field>
          </div>
          <button onClick={handleAdd} style={ADD_BTN}>Add</button>
        </div>

        {rows.length > 0 && (
          <>
            <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 10 }}>Filled Details</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>
                  {["Sr No","Teacher Name","Designation","Subject","Qualification","Type","Joining Date","Delete"]
                    .map(h => <th key={h} style={TH}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {paged.map((r, i) => (
                    <tr key={r.id}>
                      <td style={TD}>{(page-1)*pageSize+i+1}</td>
                      <td style={TD}>{r.teacherName}</td>
                      <td style={TD}>{r.designation}</td>
                      <td style={TD}>{r.subject}</td>
                      <td style={TD}>{r.qualification}</td>
                      <td style={TD}>{r.isPermanent}</td>
                      <td style={TD}>{r.joiningDate}</td>
                      <td style={TD}><button style={DELETE_BTN} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={rows.length} pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage} />
          </>
        )}
      </div>
    </SectionWrapper>
  );
}