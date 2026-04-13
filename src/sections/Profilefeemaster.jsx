// ============================================================
//  src/sections/ProfileFeeMaster.jsx  — 100% UI Match
// ============================================================
import { useState, useEffect } from "react";
import SectionWrapper from "../components/SectionWrapper";


// ─── Fee type options ─────────────────────────────────────────────────────────
const FEE_TYPE_OPTS = [
  "Admission Fee", "Tuition Fee", "Examination Fee",
  "Library Fee", "Laboratory Fee", "Sports Fee", "Other"
];

// ─── Empty input row ──────────────────────────────────────────────────────────
const emptyInput = {
  feesItem: "",
  itemFeesTDD: "",
  itemFeesGeneral: ""
};

// ─── Inject responsive CSS ────────────────────────────────────────────────────
const STYLE_ID = "pfm-styles";
const CSS = `
  /* ── Heading ── */
  .pfm-heading {
    font-size: 20px;
    font-weight: 600;
    color: #222;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  /* ── Label ── */
  .pfm-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  .pfm-label .req {
    color: #e53935;
    margin-left: 2px;
  }

  /* ── Text input ── */
  .pfm-input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 7px 10px;
    font-size: 13px;
    color: #333;
    background: #fff;
    outline: none;
    transition: border-color 0.15s;
  }
  .pfm-input:focus { border-color: #80bdff; }
  .pfm-input.grey  { background: #e9ecef; }

  /* ── Select ── */
  .pfm-select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 7px 10px;
    font-size: 13px;
    color: #333;
    background: #fff;
    outline: none;
    appearance: auto;
    cursor: pointer;
    transition: border-color 0.15s;
  }
  .pfm-select:focus { border-color: #80bdff; }

  /* ── Grid rows ── */
  .pfm-row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .pfm-row3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  /* ── Add button (teal) ── */
  .pfm-add-btn {
    background: #17a2b8;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background 0.15s;
  }
  .pfm-add-btn:hover { background: #138496; }

  /* ── Upload row ── */
  .pfm-upload-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .pfm-upload-group { display: flex; flex-direction: column; gap: 5px; }
  .pfm-file-box {
    display: flex;
    align-items: center;
    border: 1px solid #ced4da;
    border-radius: 4px;
    overflow: hidden;
    min-width: 0;
  }
  .pfm-choose-label {
    background: #f8f9fa;
    border-right: 1px solid #ced4da;
    padding: 7px 12px;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    flex-shrink: 0;
  }
  .pfm-filename {
    padding: 7px 10px;
    font-size: 13px;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 100px;
    flex: 1;
  }
  .pfm-view-btn {
    background: #17a2b8;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.15s;
    align-self: flex-end;
  }
  .pfm-view-btn:hover:not(:disabled) { background: #138496; }
  .pfm-view-btn:disabled { opacity: 0.65; cursor: default; }

  /* ── Table ── */
  .pfm-table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 20px;
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }
  .pfm-table {
    width: 100%;
    min-width: 500px;
    border-collapse: collapse;
    font-size: 13px;
  }
  .pfm-table th {
    background: #fff;
    border: 1px solid #dee2e6;
    padding: 10px 14px;
    text-align: left;
    font-weight: 700;
    color: #222;
    font-size: 13px;
  }
  .pfm-table td {
    border: 1px solid #dee2e6;
    padding: 10px 14px;
    color: #333;
    font-size: 13px;
    vertical-align: middle;
  }
  .pfm-delete-btn {
    background: #e5a020;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 5px 16px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .pfm-delete-btn:hover { background: #c8891a; }

  /* ── Bottom action buttons ── */
  .pfm-actions {
    display: flex;
    gap: 10px;
    margin-top: 4px;
    flex-wrap: wrap;
  }
  .pfm-save-btn {
    background: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 9px 26px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .pfm-save-btn:hover:not(:disabled) { background: #218838; }
  .pfm-save-btn:disabled { background: #6cbe89; cursor: default; }
  .pfm-reset-btn {
    background: #e5a020;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 9px 26px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .pfm-reset-btn:hover { background: #c8891a; }

  /* ── Error ── */
  .pfm-err { color: #cc0000; font-size: 12px; margin-bottom: 8px; }

  /* ── Alert ── */
  .pfm-alert {
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 13px;
    margin-bottom: 14px;
  }
  .pfm-alert.success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  .pfm-alert.error   { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

  /* ── Tablet (≤1024px) ── */
  @media (max-width: 1024px) {
    .pfm-row3 { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── Small tablet (≤768px) ── */
  @media (max-width: 768px) {
    .pfm-row2, .pfm-row3 { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .pfm-upload-row { flex-direction: column; align-items: flex-start; }
    .pfm-file-box { width: 100%; }
    .pfm-view-btn { width: 100%; text-align: center; }
  }

  /* ── Mobile portrait (≤520px) ── */
  @media (max-width: 520px) {
    .pfm-row2, .pfm-row3 { grid-template-columns: 1fr; gap: 10px; }
    .pfm-add-btn  { width: 100%; }
    .pfm-save-btn, .pfm-reset-btn { flex: 1; padding: 11px 0; }
    .pfm-actions  { gap: 8px; }
  }

  /* ── Very small (≤360px) ── */
  @media (max-width: 360px) {
    .pfm-heading  { font-size: 17px; }
    .pfm-table    { font-size: 11px; }
    .pfm-table th, .pfm-table td { padding: 8px 10px; }
  }
`;

function useInjectStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const tag = document.createElement("style");
    tag.id = STYLE_ID;
    tag.textContent = CSS;
    document.head.appendChild(tag);
    return () => { document.getElementById(STYLE_ID)?.remove(); };
  }, []);
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProfileFeeMaster({ onTabChange }) {
  useInjectStyles();

  // Top 2 fields (per-student totals — greyed, auto-computed or user-entered)
  const [feesPerStudentST,      setFeesPerStudentST]      = useState("");
  const [feesPerStudentGeneral, setFeesPerStudentGeneral] = useState("");

  // Input row
  const [input,    setInput]    = useState(emptyInput);
  const [inputErr, setInputErr] = useState("");

  // Table rows
  const [rows, setRows] = useState([]);

  // Upload receipt
  const [receiptFile,    setReceiptFile]    = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [alert,  setAlert]  = useState(null);

  const setI = (k) => (v) => setInput(p => ({ ...p, [k]: v }));

  // ── Re-compute totals whenever rows change ──────────────────────────────────
  useEffect(() => {
    const totalST      = rows.reduce((s, r) => s + (parseFloat(r.itemFeesTDD)     || 0), 0);
    const totalGeneral = rows.reduce((s, r) => s + (parseFloat(r.itemFeesGeneral) || 0), 0);
    setFeesPerStudentST(totalST      ? String(totalST)      : "");
    setFeesPerStudentGeneral(totalGeneral ? String(totalGeneral) : "");
  }, [rows]);

  // ── Add row ─────────────────────────────────────────────────────────────────
  const handleAdd = () => {
    if (!input.feesItem || !input.itemFeesTDD || !input.itemFeesGeneral) {
      setInputErr("Please fill all fields before adding.");
      return;
    }
    setInputErr("");
    setRows(p => [...p, { ...input, id: Date.now() }]);
    setInput(emptyInput);
  };

  // ── Delete row ──────────────────────────────────────────────────────────────
  const handleDelete = (id) => setRows(p => p.filter(r => r.id !== id));

  // ── File change ─────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { window.alert("File must be under 2MB"); return; }
    setReceiptFile(file);
    if (file.type.startsWith("image/")) setReceiptPreview(URL.createObjectURL(file));
    else setReceiptPreview(null);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (rows.length === 0) {
      setAlert({ type: "error", message: "Please add at least one fee entry." });
      return;
    }
    setSaving(true); setAlert(null);
    try {
      const toBase64 = (f) => new Promise((res, rej) => {
        const r = new FileReader();
        r.readAsDataURL(f);
        r.onload = () => res(r.result);
        r.onerror = rej;
      });
      const fileBase64 = receiptFile ? await toBase64(receiptFile) : "";
      await fetch("/o/c/profilefeemaster", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feesPerStudentST,
          feesPerStudentGeneral,
          feesData: JSON.stringify(rows),
          uploadReceipt: fileBase64
        }),
      });
      setAlert({ type: "success", message: "Profile Fee Master saved successfully!" });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally { setSaving(false); }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setFeesPerStudentST(""); setFeesPerStudentGeneral("");
    setInput(emptyInput); setInputErr("");
    setRows([]); setReceiptFile(null); setReceiptPreview(null);
    setAlert(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "16px 20px", background: "#fff", borderRadius: 4 }}>

      {/* Heading */}
      <div className="pfm-heading">Profile FeeMaster</div>

      {/* Alert */}
      {alert && (
        <div className={`pfm-alert ${alert.type}`}>
          {alert.message}
          <span
            onClick={() => setAlert(null)}
            style={{ float: "right", cursor: "pointer", fontWeight: 700 }}
          >×</span>
        </div>
      )}

      {/* ── Row 1: Fees Per Student ST | Fees Per Student General ── */}
      <div className="pfm-row2">
        <div>
          <label className="pfm-label">Fees Per Student ST <span className="req">*</span></label>
          <input
            className="pfm-input grey"
            value={feesPerStudentST}
            readOnly
            placeholder=""
          />
        </div>
        <div>
          <label className="pfm-label">Fees Per Student General <span className="req">*</span></label>
          <input
            className="pfm-input grey"
            value={feesPerStudentGeneral}
            readOnly
            placeholder=""
          />
        </div>
      </div>

      {/* ── Row 2: Fees Item | Item Fees TDD | Item Fees General ── */}
      {inputErr && <div className="pfm-err">{inputErr}</div>}
      <div className="pfm-row3">
        <div>
          <label className="pfm-label">Fees Item <span className="req">*</span></label>
          <select
            className="pfm-select"
            value={input.feesItem}
            onChange={(e) => setI("feesItem")(e.target.value)}
          >
            <option value="">Select</option>
            {FEE_TYPE_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="pfm-label">Item Fees TDD: <span className="req">*</span></label>
          <input
            className="pfm-input"
            value={input.itemFeesTDD}
            onChange={(e) => setI("itemFeesTDD")(e.target.value)}
            type="number"
            min="0"
          />
        </div>
        <div>
          <label className="pfm-label">Item Fees General: <span className="req">*</span></label>
          <input
            className="pfm-input"
            value={input.itemFeesGeneral}
            onChange={(e) => setI("itemFeesGeneral")(e.target.value)}
            type="number"
            min="0"
          />
        </div>
      </div>

      {/* ── Add button ── */}
      <button type="button" className="pfm-add-btn" onClick={handleAdd}>
        Add
      </button>

      {/* ── Upload Receipt ── */}
      <div className="pfm-upload-row">
        <div className="pfm-upload-group">
          <label className="pfm-label">Upload Receipt <span className="req">*</span></label>
          <div className="pfm-file-box">
            <label className="pfm-choose-label">
              Choose File
              <input
                type="file"
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
              />
            </label>
            <span className="pfm-filename">
              {receiptFile ? receiptFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="pfm-view-btn"
          onClick={() => receiptPreview && window.open(receiptPreview, "_blank")}
          disabled={!receiptFile}
        >
          View Uploaded Receipt
        </button>
      </div>

      {/* ── Table ── */}
      {rows.length > 0 && (
        <div className="pfm-table-wrap">
          <table className="pfm-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item Fees ST</th>
                <th>Item Fees General</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td>{r.feesItem}</td>
                  <td>{r.itemFeesTDD}</td>
                  <td>{r.itemFeesGeneral}</td>
                  <td>
                    <button className="pfm-delete-btn" onClick={() => handleDelete(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Save + Reset ── */}
      <div className="pfm-actions">
        <button type="button" className="pfm-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" className="pfm-reset-btn" onClick={handleReset}>
          Reset
        </button>
      </div>

    </div>
  );
}