// ============================================================
//  BillGeneration.jsx  — ATC Bill Generation Page
//  Matches screenshots 100%
// ============================================================
import { useState, useEffect } from "react";

// ── Styles ────────────────────────────────────────────────────
const s = {
  page: { padding: "20px 24px", fontFamily: "'Segoe UI', Roboto, sans-serif", fontSize: 13, color: "#333", background: "#fff" },
  heading: { fontSize: 18, fontWeight: 600, color: "#222", paddingBottom: 10, borderBottom: "1px solid #ddd", marginBottom: 20 },
  subHeading: { fontSize: 15, fontWeight: 600, color: "#17a2b8", borderBottom: "2px solid #e8c84a", paddingBottom: 4, marginBottom: 16, marginTop: 28 },
  label: { display: "block", fontSize: 12, color: "#333", marginBottom: 4 },
  req: { color: "#e53935", marginLeft: 2 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none" },
  inputGrey: { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#e9ecef", outline: "none" },
  select: { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none", cursor: "pointer" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px 18px", marginBottom: 14 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px", marginBottom: 14 },
  grid4: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px 10px", alignItems: "flex-end", marginBottom: 10 },
  btnGreen: { background: "#28a745", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  btnTeal: { background: "#17a2b8", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  btnOrange: { background: "#fd7e14", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  btnCapture: { background: "#17a2b8", color: "#fff", border: "none", borderRadius: 20, padding: "7px 24px", fontSize: 13, cursor: "pointer", fontWeight: 500 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 },
  th: { padding: "9px 12px", background: "#fff", border: "1px solid #dee2e6", fontWeight: 600, textAlign: "left", color: "#222" },
  td: { padding: "8px 12px", border: "1px solid #dee2e6", color: "#333", verticalAlign: "middle" },
  tdLink: { padding: "8px 12px", border: "1px solid #dee2e6", color: "#17a2b8", cursor: "pointer", verticalAlign: "middle" },
  summaryRow: { display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap", marginTop: 18, marginBottom: 14 },
  summaryField: { display: "flex", flexDirection: "column", gap: 4, minWidth: 160 },
  finalFees: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 },
  finalAmt: { fontSize: 22, fontWeight: 700, color: "#e53935" },
  uidBox: { background: "#fffbea", border: "1px solid #e8c84a", borderRadius: 3, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#555" },
  captureBox: { background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 3, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
};

// ── Mock dropdown options ─────────────────────────────────────
const TRANSACTIONS = [
  { id: 1, label: "5 percent for Rajashree public school, Amravati, Diff. A" },
  { id: 2, label: "10 percent for ABC school, Pune" },
];
const PO_OPTIONS = ["Mumbai", "Pune", "Nashik", "Nagpur"];
const SCHOOL_OPTS = ["SchoolNa", "SchoolB", "SchoolC"];

// ── Empty row helpers ─────────────────────────────────────────
const emptyArrearsRow = { amount: "", billNo: "", date: "", remarks: "" };
const emptyDeductionRow = { amount: "", billNo: "", date: "", remarks: "" };

export default function BillGeneration() {
  // ── Header filters ────────────────────────────────────────
  const [transaction, setTransaction] = useState("");
  const [po, setPo] = useState("");
  const [school, setSchool] = useState("");
  const [billDate, setBillDate] = useState("");
  const [searched, setSearched] = useState(false);

  // ── Summary table (from search) ───────────────────────────
  const [summaryRows, setSummaryRows] = useState([]);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [studentsList, setStudentsList] = useState([]);
  const [totalFees, setTotalFees] = useState(0);

  // ── Arrears ────────────────────────────────────────────────
  const [arrearsInput, setArrearsInput] = useState(emptyArrearsRow);
  const [arrearsRows, setArrearsRows] = useState([]);

  // ── Deductions ────────────────────────────────────────────
  const [deductInput, setDeductInput] = useState(emptyDeductionRow);
  const [deductRows, setDeductRows] = useState([]);

  // ── PO Deductions (read-only table) ─────────────────────
  const [poDeductions, setPoDeductions] = useState([]);

  // ── Bottom summary ────────────────────────────────────────
  const [billRemarks, setBillRemarks] = useState("");

  // ── Auto-calculated totals ────────────────────────────────
  const totalArrears = arrearsRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalDeductions = deductRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalPODed = poDeductions.reduce((s, r) => s + (Number(r.deductionsAmount) || 0), 0);
  const finalTotalFees = totalFees + totalArrears - totalDeductions - totalPODed;

  // ── Search handler (mock data matching screenshot) ────────
  const handleSearch = () => {
    if (!transaction || !po || !school) {
      alert("Please select Transaction, PO and School before searching."); return;
    }
    // Mock response data matching screenshot
    const mockSummary = [
      { admissionYear: "2025-2026", noOfStudents: 2, feesPerYear: 50000.00, totalFeesYear: 5000.00 },
    ];
    const mockStudents = [
      { id: 1, studentPO: po, uniqueNumber: "5872-72933", studentName: "pradeep lawoo manchekar", feesYear: "2025-2026", feesAmount: 2500.00 },
      { id: 2, studentPO: po, uniqueNumber: "5872-72935", studentName: "Rohan S Bhosle", feesYear: "2025-2026", feesAmount: 2500.00 },
    ];
    setSummaryRows(mockSummary);
    setStudentsList(mockStudents);
    setTotalStudentCount(mockStudents.length);
    setTotalFees(mockSummary.reduce((s, r) => s + r.totalFeesYear, 0));
    setSearched(true);
  };

  // ── Arrears handlers ──────────────────────────────────────
  const handleAddArrears = () => {
    if (!arrearsInput.amount) { alert("Amount is required."); return; }
    setArrearsRows(p => [...p, { ...arrearsInput, id: Date.now() }]);
    setArrearsInput(emptyArrearsRow);
  };
  const deleteArrears = (id) => setArrearsRows(p => p.filter(r => r.id !== id));

  // ── Deduction handlers ────────────────────────────────────
  const handleAddDeduction = () => {
    if (!deductInput.amount) { alert("Amount is required."); return; }
    setDeductRows(p => [...p, { ...deductInput, id: Date.now() }]);
    setDeductInput(emptyDeductionRow);
  };
  const deleteDeduction = (id) => setDeductRows(p => p.filter(r => r.id !== id));

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = () => {
    setTransaction(""); setPo(""); setSchool(""); setBillDate(""); setSearched(false);
    setSummaryRows([]); setStudentsList([]); setTotalStudentCount(0); setTotalFees(0);
    setArrearsInput(emptyArrearsRow); setArrearsRows([]);
    setDeductInput(emptyDeductionRow); setDeductRows([]);
    setBillRemarks("");
  };

  // ── Save handler ─────────────────────────────────────────
  const handleSave = async () => {
    if (!billDate) { alert("Bill Date is required."); return; }
    if (!billRemarks) { alert("Bill Remarks is required."); return; }
    const payload = {
      transactionId: transaction,
      po, school, billDate,
      totalStudentCount,
      summaryRows,
      studentsList,
      arrearsRows,
      deductRows,
      totalFees,
      totalArrears,
      totalDeductions,
      totalPODeductions: totalPODed,
      finalTotalFees,
      billRemarks,
    };
    console.log("Bill Generation payload:", payload);
    // TODO: POST to /o/c/billgeneration
    alert("Bill saved successfully!");
  };

  // ── Field setter helpers ──────────────────────────────────
  const setA = (k) => (e) => setArrearsInput(p => ({ ...p, [k]: e.target.value }));
  const setD = (k) => (e) => setDeductInput(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={s.page}>

      {/* ── Page Heading ──────────────────────────────────── */}
      <div style={s.heading}>Bill Generation</div>

      {/* ── Row 1: Transaction | PO | School | Search ───── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px 18px", alignItems: "flex-end", marginBottom: 14 }}>
        <div>
          <label style={s.label}>Transaction <span style={s.req}>*</span></label>
          <select style={s.select} value={transaction} onChange={e => setTransaction(e.target.value)}>
            <option value="">--Select--</option>
            {TRANSACTIONS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label style={s.label}>PO <span style={s.req}>*</span></label>
          <select style={s.select} value={po} onChange={e => setPo(e.target.value)}>
            <option value="">--Select--</option>
            {PO_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={s.label}>School <span style={s.req}>*</span></label>
          <select style={s.select} value={school} onChange={e => setSchool(e.target.value)}>
            <option value="">--Select--</option>
            {SCHOOL_OPTS.map(sc => <option key={sc} value={sc}>{sc}</option>)}
          </select>
        </div>
        <div>
          <button style={{ ...s.btnGreen, padding: "7px 22px" }} onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* ── Row 2: Bill Date | Total Student Count ────────── */}
      <div style={s.grid2}>
        <div>
          <label style={s.label}>Bill Date <span style={s.req}>*</span></label>
          <input style={s.input} type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
        </div>
        <div>
          <label style={s.label}>Total Student count <span style={s.req}>*</span></label>
          <input style={s.inputGrey} value={searched ? totalStudentCount : ""} readOnly />
        </div>
      </div>

      {/* ── Admission-year summary table ──────────────────── */}
      {summaryRows.length > 0 && (
        <table style={s.table}>
          <thead>
            <tr>
              {["Sr No.", "Admission Year", "No. of Students", "Fees per Year", "Total Fees Year"].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((r, i) => (
              <tr key={i}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{r.admissionYear}</td>
                <td style={s.td}>{r.noOfStudents}</td>
                <td style={s.td}>{r.feesPerYear.toFixed(2)}</td>
                <td style={s.td}>{r.totalFeesYear.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── Students List ─────────────────────────────────── */}
      {studentsList.length > 0 && (
        <>
          <div style={s.subHeading}>Students List</div>
          <table style={s.table}>
            <thead>
              <tr>
                {["Sr No.", "Student PO", "Unique Number", "Student Name", "Fees Year", "Fees Amount"].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsList.map((r, i) => (
                <tr key={r.id}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={s.td}>{r.studentPO}</td>
                  <td style={s.td}>{r.uniqueNumber}</td>
                  <td style={{ ...s.td, color: "#17a2b8" }}>{r.studentName}</td>
                  <td style={s.td}>{r.feesYear}</td>
                  <td style={s.td}>{r.feesAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── Arrears Details ───────────────────────────────── */}
      <div style={s.subHeading}>Arrears Details</div>

      {/* Input row */}
      <div style={s.grid4}>
        <div>
          <label style={s.label}>Amount</label>
          <input style={s.input} type="number" value={arrearsInput.amount} onChange={setA("amount")} />
        </div>
        <div>
          <label style={s.label}>BillNo</label>
          <input style={s.input} value={arrearsInput.billNo} onChange={setA("billNo")} />
        </div>
        <div>
          <label style={s.label}>Date</label>
          <input style={s.inputGrey} type="date" value={arrearsInput.date} onChange={setA("date")} />
        </div>
        <div>
          <label style={s.label}>Remarks</label>
          <input style={s.input} value={arrearsInput.remarks} onChange={setA("remarks")} />
        </div>
        <div>
          <button style={s.btnGreen} onClick={handleAddArrears}>Add</button>
        </div>
      </div>

      {/* Arrears table */}
      <table style={s.table}>
        <thead>
          <tr>
            {["Sr No.", "Amount", "Bill No", "Date", "Remarks", "Delete"].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arrearsRows.length === 0 ? (
            <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
          ) : (
            arrearsRows.map((r, i) => (
              <tr key={r.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{r.amount}</td>
                <td style={s.td}>{r.billNo}</td>
                <td style={s.td}>{r.date}</td>
                <td style={s.td}>{r.remarks}</td>
                <td style={s.td}>
                  <button
                    onClick={() => deleteArrears(r.id)}
                    style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 3, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}
                  >Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── Deduction Details ─────────────────────────────── */}
      <div style={s.subHeading}>Deduction Details</div>

      {/* Input row */}
      <div style={s.grid4}>
        <div>
          <label style={s.label}>Amount</label>
          <input style={s.input} type="number" value={deductInput.amount} onChange={setD("amount")} />
        </div>
        <div>
          <label style={s.label}>BillNo</label>
          <input style={s.input} value={deductInput.billNo} onChange={setD("billNo")} />
        </div>
        <div>
          <label style={s.label}>Date</label>
          <input style={s.inputGrey} type="date" value={deductInput.date} onChange={setD("date")} />
        </div>
        <div>
          <label style={s.label}>Remarks</label>
          <input style={s.input} value={deductInput.remarks} onChange={setD("remarks")} />
        </div>
        <div>
          <button style={s.btnGreen} onClick={handleAddDeduction}>Add</button>
        </div>
      </div>

      {/* Deductions table */}
      <table style={s.table}>
        <thead>
          <tr>
            {["Sr No.", "Amount", "Bill No", "Date", "Remarks", "Delete"].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {deductRows.length === 0 ? (
            <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
          ) : (
            deductRows.map((r, i) => (
              <tr key={r.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>{r.amount}</td>
                <td style={s.td}>{r.billNo}</td>
                <td style={s.td}>{r.date}</td>
                <td style={s.td}>{r.remarks}</td>
                <td style={s.td}>
                  <button
                    onClick={() => deleteDeduction(r.id)}
                    style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 3, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}
                  >Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── PO Deductions ─────────────────────────────────── */}
      <div style={s.subHeading}>PO Deductions</div>
      <table style={s.table}>
        <thead>
          <tr>
            {["Deductions Added By", "Deductions Amount", "Remarks", "Add/Remove Deductions"].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {poDeductions.length === 0 ? (
            <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
          ) : (
            poDeductions.map((r, i) => (
              <tr key={i}>
                <td style={s.td}>{r.addedBy}</td>
                <td style={s.td}>{r.deductionsAmount}</td>
                <td style={s.td}>{r.remarks}</td>
                <td style={s.td}>
                  <button style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 3, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}
                    onClick={() => setPoDeductions(p => p.filter((_, j) => j !== i))}>Remove</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ── Bottom Summary Row ────────────────────────────── */}
      <div style={s.summaryRow}>
        <div style={s.summaryField}>
          <label style={s.label}>Total Fees <span style={s.req}>*</span></label>
          <input style={{ ...s.inputGrey, width: 160 }} value={totalFees ? totalFees.toFixed(2) : ""} readOnly />
        </div>
        <div style={s.summaryField}>
          <label style={s.label}>Total Arrears</label>
          <input style={{ ...s.inputGrey, width: 130 }} value={totalArrears || 0} readOnly />
        </div>
        <div style={s.summaryField}>
          <label style={s.label}>Total Deductions</label>
          <input style={{ ...s.inputGrey, width: 140 }} value={totalDeductions || ""} readOnly />
        </div>
        <div style={s.summaryField}>
          <label style={s.label}>Total PO Deductions</label>
          <input style={{ ...s.inputGrey, width: 150 }} value={totalPODed || ""} readOnly />
        </div>
        <div style={s.finalFees}>
          <span style={{ fontSize: 13, color: "#333" }}>Final Total Fees</span>
          <span style={s.finalAmt}>{finalTotalFees ? finalTotalFees.toFixed(2) : "0.00"}</span>
        </div>
      </div>

      {/* ── Bill Remarks ──────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <label style={s.label}>Bill Remarks <span style={s.req}>*</span></label>
        <input
          style={{ ...s.input, border: "1px solid #17a2b8" }}
          value={billRemarks}
          onChange={e => setBillRemarks(e.target.value)}
          placeholder=""
        />
      </div>

      {/* ── Steps for UID Verification ────────────────────── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e53935", marginBottom: 8 }}>
          Steps for UID verification :-
        </div>
        <div style={s.uidBox}>
          <span style={{ marginRight: 8 }}>•</span>
          For Capturing finger print and verifying press 'Capture' button
        </div>
        <div style={s.captureBox}>
          <span style={{ fontSize: 13, color: "#555" }}>
            Click here to capture Right Hand FingerPrint &amp; to verify UID
          </span>
          <button style={s.btnCapture} onClick={() => alert("Capture fingerprint triggered")}>
            Capture
          </button>
        </div>
      </div>

      {/* ── Save / Reset Buttons ──────────────────────────── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingBottom: 32 }}>
        <button style={s.btnGreen} onClick={handleSave}>Save</button>
        <button style={s.btnOrange} onClick={handleReset}>Reset</button>
      </div>

    </div>
  );
}

// // ============================================================
// //  src/sections/BillGeneration.jsx
// //  Full API integration with Liferay objects
// // ============================================================
// import { useState, useEffect } from "react";
// import {
//   apiFetch,
//   apiPost,
//   apiPatch,
// } from "../api/liferay";

// // ── API helpers specific to Bill Generation ──────────────────
// const saveBillGeneration      = (p)       => apiPost("/o/c/billgenerations", p);
// const patchBillGeneration     = (id, p)   => apiPatch(`/o/c/billgenerations/${id}`, p);
// const saveBillArrear          = (p)       => apiPost("/o/c/billarrears", p);
// const saveBillDeduction       = (p)       => apiPost("/o/c/billdeductions", p);
// const getBillArrears          = (billId)  => apiFetch(`/o/c/billarrears?filter=billGenerationId eq ${billId}&pageSize=200`).then(d => d.items || []);
// const getBillDeductions       = (billId)  => apiFetch(`/o/c/billdeductions?filter=billGenerationId eq ${billId}&pageSize=200`).then(d => d.items || []);
// const getBillPODeductions     = (billId)  => apiFetch(`/o/c/billpodeductions?filter=billGenerationId eq ${billId}&pageSize=200`).then(d => d.items || []);
// const getBillStudents         = (billId)  => apiFetch(`/o/c/billstudents?filter=billGenerationId eq ${billId}&pageSize=200`).then(d => d.items || []);
// const getTransactions         = ()        => apiFetch("/o/c/transactions?pageSize=200&sort=dateCreated:desc").then(d => d.items || []);
// const getPOList               = ()        => apiFetch("/o/c/ponames?pageSize=200&sort=name:asc").then(d => d.items || []);
// const getSchoolsByPO          = (poId)    => apiFetch(`/o/c/namankitschoolprofiles?filter=poNameId eq ${poId}&pageSize=200`).then(d => d.items || []);
// const searchBillData          = (transactionId, poId, schoolId) =>
//   apiFetch(`/o/c/billstudents?filter=schoolId eq ${schoolId}&pageSize=200`).then(d => d.items || []);

// // ── Styles ────────────────────────────────────────────────────
// const s = {
//   page:       { padding: "20px 24px", fontFamily: "'Segoe UI', Roboto, sans-serif", fontSize: 13, color: "#333", background: "#fff" },
//   heading:    { fontSize: 18, fontWeight: 600, color: "#222", paddingBottom: 10, borderBottom: "1px solid #ddd", marginBottom: 20 },
//   subHeading: { fontSize: 15, fontWeight: 600, color: "#17a2b8", borderBottom: "2px solid #e8c84a", paddingBottom: 4, marginBottom: 16, marginTop: 28 },
//   label:      { display: "block", fontSize: 12, color: "#333", marginBottom: 4 },
//   req:        { color: "#e53935", marginLeft: 2 },
//   input:      { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none" },
//   inputGrey:  { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#e9ecef", outline: "none" },
//   select:     { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none", cursor: "pointer" },
//   grid2:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px", marginBottom: 14 },
//   grid4add:   { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px 10px", alignItems: "flex-end", marginBottom: 10 },
//   btnGreen:   { background: "#28a745", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
//   btnOrange:  { background: "#fd7e14", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
//   btnCapture: { background: "#17a2b8", color: "#fff", border: "none", borderRadius: 20, padding: "7px 24px", fontSize: 13, cursor: "pointer", fontWeight: 500 },
//   btnDelete:  { background: "#dc3545", color: "#fff", border: "none", borderRadius: 3, padding: "4px 12px", fontSize: 12, cursor: "pointer" },
//   table:      { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 12 },
//   th:         { padding: "9px 12px", background: "#fff", border: "1px solid #dee2e6", fontWeight: 600, textAlign: "left", color: "#222" },
//   td:         { padding: "8px 12px", border: "1px solid #dee2e6", color: "#333", verticalAlign: "middle" },
//   summaryRow: { display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap", marginTop: 18, marginBottom: 14 },
//   finalAmt:   { fontSize: 22, fontWeight: 700, color: "#e53935" },
//   uidBox:     { background: "#fffbea", border: "1px solid #e8c84a", borderRadius: 3, padding: "10px 14px", marginBottom: 10, fontSize: 13, color: "#555" },
//   captureBox: { background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 3, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
//   alert:      { padding: "10px 14px", borderRadius: 3, fontSize: 13, marginBottom: 14 },
//   err:        { background: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
//   suc:        { background: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
// };

// const emptyArrear    = { amount: "", billNo: "", date: "", remarks: "" };
// const emptyDeduction = { amount: "", billNo: "", date: "", remarks: "" };

// export default function BillGeneration() {

//   // ── Dropdown data ─────────────────────────────────────────
//   const [transactions, setTransactions] = useState([]);
//   const [poList,       setPoList]       = useState([]);
//   const [schoolList,   setSchoolList]   = useState([]);

//   // ── Header filters ────────────────────────────────────────
//   const [transaction, setTransaction] = useState("");
//   const [po,          setPo]          = useState("");
//   const [school,      setSchool]      = useState("");
//   const [billDate,    setBillDate]    = useState("");

//   // ── Search result data ────────────────────────────────────
//   const [searched,          setSearched]          = useState(false);
//   const [summaryRows,       setSummaryRows]       = useState([]);
//   const [studentsList,      setStudentsList]      = useState([]);
//   const [totalStudentCount, setTotalStudentCount] = useState(0);
//   const [totalFees,         setTotalFees]         = useState(0);

//   // ── Saved bill id (after first save) ─────────────────────
//   const [billId, setBillId] = useState(null);

//   // ── Arrears ────────────────────────────────────────────────
//   const [arrearInput, setArrearInput] = useState(emptyArrear);
//   const [arrearRows,  setArrearRows]  = useState([]);

//   // ── Deductions ────────────────────────────────────────────
//   const [deductInput, setDeductInput] = useState(emptyDeduction);
//   const [deductRows,  setDeductRows]  = useState([]);

//   // ── PO Deductions (read-only, from Liferay) ───────────────
//   const [poDeductions, setPoDeductions] = useState([]);

//   // ── Bottom ────────────────────────────────────────────────
//   const [billRemarks, setBillRemarks] = useState("");

//   // ── UI state ─────────────────────────────────────────────
//   const [saving,   setSaving]   = useState(false);
//   const [loading,  setLoading]  = useState(false);
//   const [alert,    setAlert]    = useState(null);

//   // ── Auto-calc ────────────────────────────────────────────
//   const totalArrears    = arrearRows.reduce((s, r)  => s + (Number(r.amount) || 0), 0);
//   const totalDeductions = deductRows.reduce((s, r)  => s + (Number(r.amount) || 0), 0);
//   const totalPODed      = poDeductions.reduce((s, r) => s + (Number(r.deductionsAmount) || 0), 0);
//   const finalTotalFees  = totalFees + totalArrears - totalDeductions - totalPODed;

//   // ── Load dropdowns on mount ───────────────────────────────
//   useEffect(() => {
//     getTransactions()
//       .then(setTransactions)
//       .catch(() => setTransactions([]));
//     getPOList()
//       .then(setPoList)
//       .catch(() => setPoList([]));
//   }, []);

//   // ── Load schools when PO changes ─────────────────────────
//   useEffect(() => {
//     if (!po) { setSchoolList([]); setSchool(""); return; }
//     getSchoolsByPO(po)
//       .then(setSchoolList)
//       .catch(() => setSchoolList([]));
//   }, [po]);

//   // ── Search ────────────────────────────────────────────────
//   const handleSearch = async () => {
//     if (!transaction || !po || !school) {
//       setAlert({ type: "err", message: "Please select Transaction, PO and School." }); return;
//     }
//     setLoading(true); setAlert(null);
//     try {
//       // Fetch students for this school from billstudents object
//       const students = await searchBillData(transaction, po, school);

//       // Group by admissionYear for summary table
//       const grouped = {};
//       students.forEach(st => {
//         const yr = st.feesYear || st.admissionYear || "—";
//         if (!grouped[yr]) grouped[yr] = { admissionYear: yr, noOfStudents: 0, feesPerYear: Number(st.feesPerYear || 0), totalFeesYear: 0 };
//         grouped[yr].noOfStudents++;
//         grouped[yr].totalFeesYear += Number(st.feesAmount || 0);
//       });

//       const summary = Object.values(grouped);
//       const totalFeesCal = summary.reduce((s, r) => s + r.totalFeesYear, 0);

//       setSummaryRows(summary);
//       setStudentsList(students);
//       setTotalStudentCount(students.length);
//       setTotalFees(totalFeesCal);
//       setSearched(true);

//       // If a bill already exists for this combination, load its child data
//       const existingBills = await apiFetch(
//         `/o/c/billgenerations?filter=schoolId eq ${school} and transactionId eq ${transaction}&pageSize=1&sort=dateCreated:desc`
//       ).then(d => d.items || []);

//       if (existingBills.length > 0) {
//         const existing = existingBills[0];
//         setBillId(existing.id);
//         setBillDate(existing.billDate ? existing.billDate.split("T")[0] : "");
//         setBillRemarks(existing.billRemarks || "");

//         // Load child tables
//         const [arrears, deductions, poDeds] = await Promise.all([
//           getBillArrears(existing.id),
//           getBillDeductions(existing.id),
//           getBillPODeductions(existing.id),
//         ]);
//         setArrearRows(arrears.map(r => ({ ...r, _saved: true })));
//         setDeductRows(deductions.map(r => ({ ...r, _saved: true })));
//         setPoDeductions(poDeds);
//       }

//     } catch (e) {
//       setAlert({ type: "err", message: "Search failed — " + e.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Add Arrear ────────────────────────────────────────────
//   const handleAddArrear = () => {
//     if (!arrearInput.amount) { setAlert({ type: "err", message: "Arrear amount is required." }); return; }
//     setArrearRows(p => [...p, { ...arrearInput, id: Date.now(), _saved: false }]);
//     setArrearInput(emptyArrear);
//   };

//   const deleteArrear = (id) => setArrearRows(p => p.filter(r => r.id !== id));

//   // ── Add Deduction ─────────────────────────────────────────
//   const handleAddDeduction = () => {
//     if (!deductInput.amount) { setAlert({ type: "err", message: "Deduction amount is required." }); return; }
//     setDeductRows(p => [...p, { ...deductInput, id: Date.now(), _saved: false }]);
//     setDeductInput(emptyDeduction);
//   };

//   const deleteDeduction = (id) => setDeductRows(p => p.filter(r => r.id !== id));

//   // ── Save ──────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!billDate)    { setAlert({ type: "err", message: "Bill Date is required." }); return; }
//     if (!billRemarks) { setAlert({ type: "err", message: "Bill Remarks is required." }); return; }

//     setSaving(true); setAlert(null);
//     try {
//       // 1. Save / update main bill
//       const billPayload = {
//         transactionId:    Number(transaction),
//         po,
//         schoolId:         Number(school),
//         billDate,
//         totalStudentCount,
//         totalFees,
//         totalArrears,
//         totalDeductions,
//         totalPODeductions: totalPODed,
//         finalTotalFees,
//         billRemarks,
//         status:           "Draft",
//       };

//       let currentBillId = billId;
//       if (billId) {
//         await patchBillGeneration(billId, billPayload);
//       } else {
//         const res = await saveBillGeneration(billPayload);
//         currentBillId = res.id;
//         setBillId(res.id);
//       }

//       // 2. Save new arrear rows (skip already saved ones)
//       const newArrears = arrearRows.filter(r => !r._saved);
//       for (const row of newArrears) {
//         await saveBillArrear({
//           billGenerationId: currentBillId,
//           amount:           Number(row.amount),
//           billNo:           row.billNo,
//           date:             row.date,
//           remarks:          row.remarks,
//         });
//       }
//       setArrearRows(p => p.map(r => ({ ...r, _saved: true })));

//       // 3. Save new deduction rows
//       const newDeductions = deductRows.filter(r => !r._saved);
//       for (const row of newDeductions) {
//         await saveBillDeduction({
//           billGenerationId: currentBillId,
//           amount:           Number(row.amount),
//           billNo:           row.billNo,
//           date:             row.date,
//           remarks:          row.remarks,
//         });
//       }
//       setDeductRows(p => p.map(r => ({ ...r, _saved: true })));

//       setAlert({ type: "suc", message: "Bill saved successfully!" });
//       window.scrollTo({ top: 0, behavior: "smooth" });

//     } catch (e) {
//       setAlert({ type: "err", message: "Save failed — " + e.message });
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Reset ─────────────────────────────────────────────────
//   const handleReset = () => {
//     setTransaction(""); setPo(""); setSchool(""); setBillDate("");
//     setSearched(false); setSummaryRows([]); setStudentsList([]);
//     setTotalStudentCount(0); setTotalFees(0); setBillId(null);
//     setArrearInput(emptyArrear); setArrearRows([]);
//     setDeductInput(emptyDeduction); setDeductRows([]);
//     setPoDeductions([]); setBillRemarks(""); setAlert(null);
//   };

//   const setA = (k) => (e) => setArrearInput(p => ({ ...p, [k]: e.target.value }));
//   const setD = (k) => (e) => setDeductInput(p => ({ ...p, [k]: e.target.value }));

//   // ── Render ────────────────────────────────────────────────
//   return (
//     <div style={s.page}>

//       <div style={s.heading}>Bill Generation</div>

//       {/* Alert */}
//       {alert && (
//         <div style={{ ...s.alert, ...s[alert.type] }}>
//           {alert.message}
//           <span onClick={() => setAlert(null)} style={{ float: "right", cursor: "pointer", fontWeight: 700 }}>×</span>
//         </div>
//       )}

//       {/* ── Row 1: Transaction | PO | School | Search ────── */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px 18px", alignItems: "flex-end", marginBottom: 14 }}>
//         <div>
//           <label style={s.label}>Transaction <span style={s.req}>*</span></label>
//           <select style={s.select} value={transaction} onChange={e => setTransaction(e.target.value)}>
//             <option value="">--Select--</option>
//             {transactions.map(t => (
//               <option key={t.id} value={t.id}>{t.transactionName || t.name || t.id}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label style={s.label}>PO <span style={s.req}>*</span></label>
//           <select style={s.select} value={po} onChange={e => setPo(e.target.value)}>
//             <option value="">--Select--</option>
//             {poList.map(p => (
//               <option key={p.id} value={p.id}>{p.name || p.poName || p.id}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label style={s.label}>School <span style={s.req}>*</span></label>
//           <select style={s.select} value={school} onChange={e => setSchool(e.target.value)} disabled={!po}>
//             <option value="">--Select--</option>
//             {schoolList.map(sc => (
//               <option key={sc.id} value={sc.id}>{sc.schoolName || sc.name || sc.id}</option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <button style={{ ...s.btnGreen, padding: "7px 22px" }} onClick={handleSearch} disabled={loading}>
//             {loading ? "Searching…" : "Search"}
//           </button>
//         </div>
//       </div>

//       {/* ── Row 2: Bill Date | Total Student Count ────────── */}
//       <div style={s.grid2}>
//         <div>
//           <label style={s.label}>Bill Date <span style={s.req}>*</span></label>
//           <input style={s.input} type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
//         </div>
//         <div>
//           <label style={s.label}>Total Student count <span style={s.req}>*</span></label>
//           <input style={s.inputGrey} value={searched ? totalStudentCount : ""} readOnly />
//         </div>
//       </div>

//       {/* ── Admission Summary Table ───────────────────────── */}
//       {summaryRows.length > 0 && (
//         <table style={s.table}>
//           <thead>
//             <tr>
//               {["Sr No.","Admission Year","No of Students","Fees per Year","Total Fees Year"].map(h => (
//                 <th key={h} style={s.th}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {summaryRows.map((r, i) => (
//               <tr key={i}>
//                 <td style={s.td}>{i + 1}</td>
//                 <td style={s.td}>{r.admissionYear}</td>
//                 <td style={s.td}>{r.noOfStudents}</td>
//                 <td style={s.td}>{Number(r.feesPerYear).toFixed(2)}</td>
//                 <td style={s.td}>{Number(r.totalFeesYear).toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* ── Students List ─────────────────────────────────── */}
//       {studentsList.length > 0 && (
//         <>
//           <div style={s.subHeading}>Students List</div>
//           <table style={s.table}>
//             <thead>
//               <tr>
//                 {["Sr No.","Student PO","Unique Number","Student Name","Fees Year","Fees Amount"].map(h => (
//                   <th key={h} style={s.th}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {studentsList.map((r, i) => (
//                 <tr key={r.id || i}>
//                   <td style={s.td}>{i + 1}</td>
//                   <td style={s.td}>{r.studentPO || r.po}</td>
//                   <td style={s.td}>{r.uniqueNumber}</td>
//                   <td style={{ ...s.td, color: "#17a2b8" }}>{r.studentName}</td>
//                   <td style={s.td}>{r.feesYear || r.admissionYear}</td>
//                   <td style={s.td}>{Number(r.feesAmount).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {/* ── Arrears Details ───────────────────────────────── */}
//       <div style={s.subHeading}>Arrears Details</div>
//       <div style={s.grid4add}>
//         <div>
//           <label style={s.label}>Amount</label>
//           <input style={s.input} type="number" value={arrearInput.amount} onChange={setA("amount")} />
//         </div>
//         <div>
//           <label style={s.label}>BillNo</label>
//           <input style={s.input} value={arrearInput.billNo} onChange={setA("billNo")} />
//         </div>
//         <div>
//           <label style={s.label}>Date</label>
//           <input style={s.inputGrey} type="date" value={arrearInput.date} onChange={setA("date")} />
//         </div>
//         <div>
//           <label style={s.label}>Remarks</label>
//           <input style={s.input} value={arrearInput.remarks} onChange={setA("remarks")} />
//         </div>
//         <div><button style={s.btnGreen} onClick={handleAddArrear}>Add</button></div>
//       </div>
//       <table style={s.table}>
//         <thead>
//           <tr>{["Sr No.","Amount","Bill No","Date","Remarks","Delete"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
//         </thead>
//         <tbody>
//           {arrearRows.length === 0
//             ? <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
//             : arrearRows.map((r, i) => (
//               <tr key={r.id}>
//                 <td style={s.td}>{i + 1}</td>
//                 <td style={s.td}>{r.amount}</td>
//                 <td style={s.td}>{r.billNo}</td>
//                 <td style={s.td}>{r.date}</td>
//                 <td style={s.td}>{r.remarks}</td>
//                 <td style={s.td}><button style={s.btnDelete} onClick={() => deleteArrear(r.id)}>Delete</button></td>
//               </tr>
//             ))
//           }
//         </tbody>
//       </table>

//       {/* ── Deduction Details ─────────────────────────────── */}
//       <div style={s.subHeading}>Deduction Details</div>
//       <div style={s.grid4add}>
//         <div>
//           <label style={s.label}>Amount</label>
//           <input style={s.input} type="number" value={deductInput.amount} onChange={setD("amount")} />
//         </div>
//         <div>
//           <label style={s.label}>BillNo</label>
//           <input style={s.input} value={deductInput.billNo} onChange={setD("billNo")} />
//         </div>
//         <div>
//           <label style={s.label}>Date</label>
//           <input style={s.inputGrey} type="date" value={deductInput.date} onChange={setD("date")} />
//         </div>
//         <div>
//           <label style={s.label}>Remarks</label>
//           <input style={s.input} value={deductInput.remarks} onChange={setD("remarks")} />
//         </div>
//         <div><button style={s.btnGreen} onClick={handleAddDeduction}>Add</button></div>
//       </div>
//       <table style={s.table}>
//         <thead>
//           <tr>{["Sr No","Amount","Bill No","Date","Remarks","Delete"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
//         </thead>
//         <tbody>
//           {deductRows.length === 0
//             ? <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
//             : deductRows.map((r, i) => (
//               <tr key={r.id}>
//                 <td style={s.td}>{i + 1}</td>
//                 <td style={s.td}>{r.amount}</td>
//                 <td style={s.td}>{r.billNo}</td>
//                 <td style={s.td}>{r.date}</td>
//                 <td style={s.td}>{r.remarks}</td>
//                 <td style={s.td}><button style={s.btnDelete} onClick={() => deleteDeduction(r.id)}>Delete</button></td>
//               </tr>
//             ))
//           }
//         </tbody>
//       </table>

//       {/* ── PO Deductions (read-only) ─────────────────────── */}
//       <div style={s.subHeading}>PO Deductions</div>
//       <table style={s.table}>
//         <thead>
//           <tr>{["Deductions Added By","Deductions Amount","Remarks","Add/Remove Deductions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
//         </thead>
//         <tbody>
//           {poDeductions.length === 0
//             ? <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: "#aaa" }}></td></tr>
//             : poDeductions.map((r, i) => (
//               <tr key={i}>
//                 <td style={s.td}>{r.deductionsAddedBy}</td>
//                 <td style={s.td}>{r.deductionsAmount}</td>
//                 <td style={s.td}>{r.remarks}</td>
//                 <td style={s.td}>
//                   <button style={s.btnDelete}
//                     onClick={() => setPoDeductions(p => p.filter((_, j) => j !== i))}>
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))
//           }
//         </tbody>
//       </table>

//       {/* ── Summary totals row ────────────────────────────── */}
//       <div style={s.summaryRow}>
//         <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//           <label style={s.label}>Total Fees <span style={s.req}>*</span></label>
//           <input style={{ ...s.inputGrey, width: 160 }} value={totalFees ? totalFees.toFixed(2) : ""} readOnly />
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//           <label style={s.label}>Total Arrears</label>
//           <input style={{ ...s.inputGrey, width: 130 }} value={totalArrears || 0} readOnly />
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//           <label style={s.label}>Total Deductions</label>
//           <input style={{ ...s.inputGrey, width: 140 }} value={totalDeductions || ""} readOnly />
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//           <label style={s.label}>Total PO Deductions</label>
//           <input style={{ ...s.inputGrey, width: 150 }} value={totalPODed || ""} readOnly />
//         </div>
//         <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ fontSize: 13 }}>Final Total Fees</span>
//           <span style={s.finalAmt}>{finalTotalFees ? finalTotalFees.toFixed(2) : "0.00"}</span>
//         </div>
//       </div>

//       {/* ── Bill Remarks ──────────────────────────────────── */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={s.label}>Bill Remarks <span style={s.req}>*</span></label>
//         <input
//           style={{ ...s.input, border: "1px solid #17a2b8" }}
//           value={billRemarks}
//           onChange={e => setBillRemarks(e.target.value)}
//         />
//       </div>

//       {/* ── UID Verification ──────────────────────────────── */}
//       <div style={{ marginBottom: 14 }}>
//         <div style={{ fontSize: 13, fontWeight: 600, color: "#e53935", marginBottom: 8 }}>
//           Steps for UID verification :-
//         </div>
//         <div style={s.uidBox}>
//           <span style={{ marginRight: 8 }}>•</span>
//           For Capturing finger print and verifying press 'Capture' button
//         </div>
//         <div style={s.captureBox}>
//           <span style={{ fontSize: 13, color: "#555" }}>
//             Click here to capture Right Hand FingerPrint &amp; to verify UID
//           </span>
//           <button style={s.btnCapture} onClick={() => alert("Capture fingerprint triggered")}>
//             Capture
//           </button>
//         </div>
//       </div>

//       {/* ── Save / Reset ──────────────────────────────────── */}
//       <div style={{ display: "flex", gap: 10, justifyContent: "center", paddingBottom: 32 }}>
//         <button style={s.btnGreen}  onClick={handleSave}  disabled={saving}>
//           {saving ? "Saving…" : "Save"}
//         </button>
//         <button style={s.btnOrange} onClick={handleReset}>Reset</button>
//       </div>

//     </div>
//   );
// }