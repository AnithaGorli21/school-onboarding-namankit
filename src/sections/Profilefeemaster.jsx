// ============================================================
//  src/sections/ProfileFeeMaster.jsx
// ============================================================
import { useState } from "react";
import { Field, TextInput, SelectInput, SectionHeading, Row3, Row2 } from "../components/FormFields";
import SectionWrapper from "../components/SectionWrapper";
import Pagination from "../components/Pagination";
import { TH, TD, DELETE_BTN, ADD_BTN } from "../utils/Tablestyles";

const STANDARD_OPTS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const FEE_TYPE      = ["Tuition Fee","Examination Fee","Admission Fee","Library Fee","Laboratory Fee","Sports Fee","Other"];

const emptyRow = { standard: "", feeType: "", amount: "", academicYear: "" };

export default function ProfileFeeMaster({ onTabChange }) {
  const [rows, setRows]     = useState([]);
  const [newRow, setNewRow] = useState(emptyRow);
  const [rowErr, setRowErr] = useState("");
  const [page, setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert]   = useState(null);

  const setR = (k) => (v) => setNewRow(p => ({ ...p, [k]: v }));

  const handleAdd = () => {
    if (!newRow.standard || !newRow.feeType || !newRow.amount || !newRow.academicYear) {
      setRowErr("Please fill all fee fields before adding."); return;
    }
    setRowErr("");
    setRows(p => [...p, { ...newRow, id: Date.now() }]);
    setNewRow(emptyRow); setPage(1);
  };

  const handleSave = async () => {
    if (rows.length === 0) {
      setAlert({ type: "error", message: "Please add at least one fee entry." }); return;
    }
    setSaving(true); setAlert(null);
    try {
      await fetch("/o/c/profilefeemaster", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feesData: JSON.stringify(rows) }),
      });
      setAlert({ type: "success", message: "Profile Fee Master saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  const handleReset = () => {
    setRows([]); setNewRow(emptyRow); setAlert(null); setRowErr(""); setPage(1);
  };

  const paged = rows.slice((page-1)*pageSize, page*pageSize);

  return (
    <SectionWrapper alert={alert} onCloseAlert={() => setAlert(null)}
      onSave={handleSave} onReset={handleReset} saving={saving}>

      <SectionHeading title="Profile Fee Master" />
      {rowErr && <div style={{ color: "#cc0000", fontSize: 12, marginBottom: 8 }}>{rowErr}</div>}

      <Row3>
        <Field label="Standard" required>
          <SelectInput value={newRow.standard} onChange={setR("standard")} options={STANDARD_OPTS} />
        </Field>
        <Field label="Fee Type" required>
          <SelectInput value={newRow.feeType} onChange={setR("feeType")} options={FEE_TYPE} />
        </Field>
        <Field label="Amount (Rs.)" required>
          <TextInput value={newRow.amount} onChange={setR("amount")} type="number" />
        </Field>
      </Row3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 20 }}>
        <div style={{ width: "calc(33% - 8px)" }}>
          <Field label="Academic Year" required>
            <SelectInput value={newRow.academicYear} onChange={setR("academicYear")}
              options={["2022-23","2023-24","2024-25","2025-26"]} />
          </Field>
        </div>
        <button onClick={handleAdd} style={ADD_BTN}>Add</button>
      </div>

      {rows.length > 0 && (
        <>
          <div style={{ fontSize: 16, fontWeight: 400, color: "#333", marginBottom: 10 }}>Filled Details</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              {["Sr No","Standard","Fee Type","Amount (Rs.)","Academic Year","Delete"]
                .map(h => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={r.id}>
                  <td style={TD}>{(page-1)*pageSize+i+1}</td>
                  <td style={TD}>{r.standard}</td>
                  <td style={TD}>{r.feeType}</td>
                  <td style={TD}>₹ {r.amount}</td>
                  <td style={TD}>{r.academicYear}</td>
                  <td style={TD}><button style={DELETE_BTN} onClick={() => setRows(p => p.filter(x => x.id !== r.id))}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination total={rows.length} pageSize={pageSize} setPageSize={setPageSize} page={page} setPage={setPage} />
        </>
      )}
    </SectionWrapper>
  );
}