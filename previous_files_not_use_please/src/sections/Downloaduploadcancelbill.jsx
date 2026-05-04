// ============================================================
//  src/sections/DownloadUploadCancelBill.jsx
//  ATC — Download / Upload / Cancel Bill
// ============================================================
import React, { useState, useEffect } from "react";
import { apiFetch, apiPatch } from "../api/liferay";

// ── API ───────────────────────────────────────────────────────
const getTransactions = () =>
  apiFetch("/o/c/transactions?pageSize=200&sort=dateCreated:desc")
    .then((d) => d.items || []);

const getPOList = () =>
  apiFetch("/o/c/ponames?pageSize=200&sort=name:asc")
    .then((d) => d.items || []);

const searchBills = (transactionId, poId, billNo) => {
  let filter = `transactionId eq ${transactionId} and po eq '${poId}'`;
  if (billNo) filter += ` and billNo eq '${billNo}'`;
  return apiFetch(
    `/o/c/billgenerations?filter=${encodeURIComponent(filter)}&pageSize=200&sort=dateCreated:desc`
  ).then((d) => d.items || []);
};

const cancelBill = (id) => apiPatch(`/o/c/billgenerations/${id}`, { bill_status: "Cancelled" });
const uploadBill = (id, fileUrl) => apiPatch(`/o/c/billgenerations/${id}`, { bill_status: "Uploaded", uploadedFile: fileUrl });

// ── Styles (matching BillGeneration exactly) ──────────────────
const s = {
  page: { padding: "20px 24px", fontFamily: "'Segoe UI', Roboto, sans-serif", fontSize: 13, color: "#333", background: "#fff" },
  heading: { fontSize: 18, fontWeight: 600, color: "#222", paddingBottom: 10, borderBottom: "1px solid #ddd", marginBottom: 20 },
  label: { display: "block", fontSize: 12, color: "#333", marginBottom: 4 },
  req: { color: "#e53935", marginLeft: 2 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none" },
  select: { width: "100%", boxSizing: "border-box", border: "1px solid #ced4da", borderRadius: 3, padding: "6px 10px", fontSize: 13, color: "#333", background: "#fff", outline: "none", cursor: "pointer" },
  btnGreen: { background: "#28a745", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  btnBlue: { background: "#007bff", color: "#fff", border: "none", borderRadius: 3, padding: "5px 12px", fontSize: 12, cursor: "pointer" },
  btnTeal: { background: "#17a2b8", color: "#fff", border: "none", borderRadius: 3, padding: "5px 12px", fontSize: 12, cursor: "pointer" },
  btnOrange: { background: "#fd7e14", color: "#fff", border: "none", borderRadius: 3, padding: "5px 12px", fontSize: 12, cursor: "pointer" },
  btnRed: { background: "#dc3545", color: "#fff", border: "none", borderRadius: 3, padding: "5px 12px", fontSize: 12, cursor: "pointer" },
  btnYellow: { background: "#ffc107", color: "#fff", border: "none", borderRadius: 3, padding: "7px 18px", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 20 },
  th: { padding: "9px 12px", background: "#fff", border: "1px solid #dee2e6", fontWeight: 600, textAlign: "left", color: "#222" },
  td: { padding: "8px 12px", border: "1px solid #dee2e6", color: "#333", verticalAlign: "middle" },
  alert: { padding: "10px 14px", borderRadius: 3, fontSize: 13, marginBottom: 14 },
  err: { background: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" },
  suc: { background: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" },
  badge: (status) => ({
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: status === "Uploaded" ? "#d4edda" : status === "Cancelled" ? "#f8d7da" : "#fff3cd",
    color: status === "Uploaded" ? "#155724" : status === "Cancelled" ? "#721c24" : "#856404",
  }),
};

// ── Modal for Upload ──────────────────────────────────────────
function UploadModal({ bill, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleUpload = async () => {
    if (!file) { setErr("Please select a file."); return; }
    setLoading(true);
    try {
      // Upload file to Liferay Documents & Media
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/o/headless-delivery/v1.0/sites/guest/documents", {
        method: "POST",
        headers: { Authorization: "Basic " + btoa("prabhudasu:root") },
        body: form,
      });
      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.contentUrl || uploadData.id || file.name;
      await uploadBill(bill.id, fileUrl);
      onUploaded();
    } catch (e) {
      setErr("Upload failed — " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#fff", borderRadius: 6, width: 420, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "#17a2b8", padding: "12px 18px", color: "#fff", fontWeight: 600, fontSize: 15 }}>
          Upload Bill — {bill.id}
        </div>
        <div style={{ padding: "20px 18px" }}>
          {err && <div style={{ ...s.alert, ...s.err, marginBottom: 12 }}>{err}</div>}
          <label style={s.label}>Select Bill File <span style={s.req}>*</span></label>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ ...s.input, padding: "4px" }}
          />
          <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Accepted: PDF, Excel</div>
        </div>
        <div style={{ padding: "10px 18px 18px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button style={{ ...s.btnRed }} onClick={onClose}>Cancel</button>
          <button style={{ ...s.btnGreen }} onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function DownloadUploadCancelBill() {
  const [transactions, setTransactions] = useState([]);
  const [poList, setPoList] = useState([]);
  const [transaction, setTransaction] = useState("");
  const [po, setPo] = useState("");
  const [billNo, setBillNo] = useState("");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [alert, setAlert] = useState(null);
  const [uploadModal, setUploadModal] = useState(null); // bill object

  // Load dropdowns
  useEffect(() => {
    getTransactions().then(setTransactions).catch(() => { });
    getPOList().then(setPoList).catch(() => { });
  }, []);

  const handleSearch = async () => {
    if (!transaction || !po) {
      setAlert({ type: "err", message: "Please select Transaction and PO." }); return;
    }
    setLoading(true); setAlert(null);
    try {
      const data = await searchBills(transaction, po, billNo);
      setBills(data);
      setSearched(true);
      if (data.length === 0) setAlert({ type: "err", message: "No bills found for selected criteria." });
    } catch (e) {
      setAlert({ type: "err", message: "Search failed — " + e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bill) => {
    if (!window.confirm(`Cancel Bill ID ${bill.id}? This cannot be undone.`)) return;
    try {
      await cancelBill(bill.id);
      setBills((prev) => prev.map((b) => b.id === bill.id ? { ...b, bill_status: "Cancelled" } : b));
      setAlert({ type: "suc", message: "Bill cancelled successfully." });
    } catch (e) {
      setAlert({ type: "err", message: "Cancel failed — " + e.message });
    }
  };

  const handleDownload = (bill) => {
    if (bill.uploadedFile) {
      window.open(bill.uploadedFile, "_blank");
    } else {
      alert("No file uploaded for this bill yet.");
    }
  };

  const handleExportExcel = () => {
    // Simple CSV export
    const rows = [
      ["Sr No", "Project Office", "Transaction", "Bill No", "School", "Student Count", "Final Amount", "Status"],
      ...bills.map((b, i) => [i + 1, b.po, b.transactionId, b.id, b.schoolId, b.totalStudentCount, b.finalTotalFees, b.bill_status || "Generated"]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bills.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {uploadModal && (
        <UploadModal
          bill={uploadModal}
          onClose={() => setUploadModal(null)}
          onUploaded={() => {
            setBills((prev) => prev.map((b) => b.id === uploadModal.id ? { ...b, bill_status: "Uploaded" } : b));
            setUploadModal(null);
            setAlert({ type: "suc", message: "Bill uploaded successfully." });
          }}
        />
      )}

      <div style={s.page}>
        <div style={s.heading}>Download / Upload / Cancel Bill</div>

        {alert && (
          <div style={{ ...s.alert, ...s[alert.type] }}>
            {alert.message}
            <span onClick={() => setAlert(null)} style={{ float: "right", cursor: "pointer", fontWeight: 700 }}>×</span>
          </div>
        )}

        {/* Filter row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: "12px 18px", alignItems: "flex-end", marginBottom: 14 }}>
          <div>
            <label style={s.label}>Transaction <span style={s.req}>*</span></label>
            <select style={s.select} value={transaction} onChange={(e) => setTransaction(e.target.value)}>
              <option value="">--Please Select--</option>
              {transactions.map((t) => (
                <option key={t.id} value={t.id}>{t.transactionName || t.name || t.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={s.label}>PO <span style={s.req}>*</span></label>
            <select style={s.select} value={po} onChange={(e) => setPo(e.target.value)}>
              <option value="">--Please Select--</option>
              {poList.map((p) => (
                <option key={p.id} value={p.id}>{p.name || p.poName || p.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={s.label}>Bill No</label>
            <input style={s.input} value={billNo} onChange={(e) => setBillNo(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <button style={{ ...s.btnGreen, padding: "7px 22px" }} onClick={handleSearch} disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          <div>
            <button style={{ ...s.btnYellow, padding: "7px 18px" }} onClick={handleExportExcel} disabled={!bills.length}>
              Export to Excel
            </button>
          </div>
        </div>

        {/* Results table */}
        {searched && bills.length > 0 && (
          <table style={s.table}>
            <thead>
              <tr>
                {["Project Office", "Transaction", "Bill No", "School", "Student Count", "Final Amount", "Status", "Download", "Upload", "View", "Cancel"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={bill.id}>
                  <td style={s.td}>{bill.po}</td>
                  <td style={s.td}>{bill.transactionId}</td>
                  <td style={s.td}>{bill.id}</td>
                  <td style={s.td}>{bill.schoolId}</td>
                  <td style={s.td}>{bill.totalStudentCount}</td>
                  <td style={s.td}>{bill.finalTotalFees ? Number(bill.finalTotalFees).toFixed(2) : "—"}</td>
                  <td style={s.td}>
                    <span style={s.badge(bill.bill_status || "Generated")}>
                      {bill.bill_status || "Generated"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnBlue} onClick={() => handleDownload(bill)}>Download</button>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnTeal} onClick={() => setUploadModal(bill)}
                      disabled={bill.bill_status === "Cancelled"}>
                      Upload
                    </button>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnOrange}
                      onClick={() => bill.uploadedFile && window.open(bill.uploadedFile, "_blank")}>
                      View
                    </button>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnRed} onClick={() => handleCancel(bill)}
                      disabled={bill.bill_status === "Cancelled"}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {searched && bills.length === 0 && !alert && (
          <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>No bills found.</div>
        )}
      </div>
    </>
  );
}