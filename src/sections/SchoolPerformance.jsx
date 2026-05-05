// ============================================================
//  src/sections/SchoolPerformance.jsx
//  Validations added:
//  - Minimum 3 performance years required (Excel row 41)
//  - Students Passed cannot exceed Students Appeared
//  - "Any Other" standard requires text in Others field
// ============================================================
import React, { useState, useEffect } from "react";
import {
  Field, SelectInput, TextInput,
  SectionHeading, Row3, BtnAdd, Alert,
} from "../components/FormFields";
import { validatePerformanceRow } from "../utils/validate";
import { loadSchoolPerformanceIntake, submitSchoolPerformanceIntake, mapRecordsToRows } from "../api/schoolPerformanceIntake";
import Loader from "../components/Loader";

const YEAR_OPTIONS = [
  "2020-2021","2021-2022","2022-2023","2023-2024","2024-2025",
];

// Excel row 37: DDL Value - HSC, SSC, Scholarship, MTS, NTS, Any Other
const STANDARD_OPTIONS = ["SSC","HSC","Scholarship","MTS","NTS","Any Other"];

// Map standard names to IDs (these should match the Liferay object field values)
const STANDARD_ID_MAP = {
  "SSC": 1,
  "HSC": 2, 
  "Scholarship": 3,
  "MTS": 4,
  "NTS": 5,
  "Any Other": 6
};

const th = {
  padding: "9px 12px",
  background: "#f8f9fa",
  borderBottom: "1px solid #dee2e6",
  fontSize: 13,
  fontWeight: 600,
  color: "#333",
  textAlign: "left",
};
const td = {
  padding: "8px 12px",
  borderBottom: "1px solid #eee",
  fontSize: 13,
  color: "#333",
};
const errStyle = {
  color: "#c0392b", fontSize: 12, marginTop: 4, display: "block",
};

export default function SchoolPerformance({ 
  onTabChange, 
  onSave, 
  schoolProfileId, 
  onLoadingChange,
  // Legacy props for backward compatibility
  rows: externalRows, 
  setRows: externalSetRows, 
  perfError: externalPerfError,
  isDisabled 
}) {
  const [newRow, setNewRow] = useState({
    year: "", standard: "", others: "", studentsAppeared: "", studentsPassed: "",
  });
  const [rowErrors, setRowErrors] = useState({});
  
  // Use external rows/setRows if provided (legacy mode), otherwise use internal state
  const [internalRows, setInternalRows] = useState([]);
  const rows = externalRows !== undefined ? externalRows : internalRows;
  const setRows = externalSetRows !== undefined ? externalSetRows : setInternalRows;
  
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [perfError, setPerfError] = useState(externalPerfError || "");

  const setR = (key) => (val) => {
    setNewRow((prev) => ({ ...prev, [key]: val }));
    // Clear field error on change
    setRowErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // ── Load existing rows on mount ───────────────────────────
  useEffect(() => {
    if (!schoolProfileId) return;
    console.log("[SchoolPerformance] loading for schoolProfileId →", schoolProfileId);
    setLoadingData(true);
    loadSchoolPerformanceIntake(schoolProfileId)
      .then(({ records }) => {
        const mapped = mapRecordsToRows(records);
        if (mapped.length > 0) setRows(mapped);
      })
      .catch((err) => console.error("[SchoolPerformance] load error:", err))
      .finally(() => setLoadingData(false));
  }, [schoolProfileId, setRows]);

  useEffect(() => {
    onLoadingChange?.(loadingData || saving);
  }, [loadingData, saving, onLoadingChange]);

  const handleAdd = () => {
    const errs = validatePerformanceRow(newRow);
    if (Object.keys(errs).length > 0) {
      setRowErrors(errs);
      return;
    }
    setRowErrors({});
    setRows((prev) => [...prev, { ...newRow, id: Date.now(), liferayId: null }]);
    setNewRow({ year: "", standard: "", others: "", studentsAppeared: "", studentsPassed: "" });
  };

  const handleDelete = (id) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  // ── Save ───────────────────────────────────
  const handleSave = async () => {
    // Check minimum 3 performance years requirement
    if (rows.length < 3) {
      setPerfError("Minimum 3 performance years are required.");
      return;
    }

    if (rows.length === 0) {
      setAlert({ type: "error", message: "Please add at least one performance entry." });
      return;
    }

    setSaving(true);
    setAlert(null);
    setPerfError("");
    setLoadingData(true);
    try {
      await submitSchoolPerformanceIntake(rows, schoolProfileId);
      setAlert({ type: "success", message: "School Performance saved successfully!" });
      onSave?.({ rows });
    } catch (e) {
      setAlert({ type: "error", message: "Save failed — " + e.message });
    } finally {
      setSaving(false);
      setLoadingData(false);
    }
  };

  const handleReset = () => {
    setNewRow({ year: "", standard: "", others: "", studentsAppeared: "", studentsPassed: "" });
    setRowErrors({});
    setRows([]);
    setAlert(null);
    setPerfError("");
  };

  return (
    <div style={{ padding: "16px 20px", background: "#fff", borderRadius: 4, position: "relative" }}>

      {(loadingData || saving) && (
        <div style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute", zIndex: 1000, background: "rgba(255, 255, 255, 0.72)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader />
        </div>
      )}

      {alert && (
        <div style={{
          padding: "10px 14px", borderRadius: 4, fontSize: 13, marginBottom: 14,
          background: alert.type === "success" ? "#d4edda" : "#f8d7da",
          color: alert.type === "success" ? "#155724" : "#721c24",
          border: `1px solid ${alert.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
        }}>
          {alert.message}
          <span onClick={() => setAlert(null)} style={{ float: "right", cursor: "pointer", fontWeight: 700 }}>×</span>
        </div>
      )}

      {/* Min-3 performance years error — shown on Save attempt */}
      {perfError && (
        <div style={{
          background: "#fff5f5", border: "1px solid #f5c6cb",
          borderRadius: 3, padding: "10px 14px", marginBottom: 14,
          color: "#c0392b", fontSize: 13,
        }}>
          ⚠️ {perfError}
        </div>
      )}

      {/* ── Input row ── */}
      <Row3>
        <Field label="School Performance Year" required error={rowErrors.year}>
          <SelectInput
            value={newRow.year}
            onChange={setR("year")}
            options={YEAR_OPTIONS}
            hasError={!!rowErrors.year}
          />
        </Field>
        <Field label="Standard" required error={rowErrors.standard}>
          <SelectInput
            value={newRow.standard}
            onChange={setR("standard")}
            options={STANDARD_OPTIONS}
            hasError={!!rowErrors.standard}
          />
        </Field>
        <Field label="No of Students Appeared" required error={rowErrors.studentsAppeared}>
          <TextInput
            value={newRow.studentsAppeared}
            onChange={setR("studentsAppeared")}
            type="number"
            hasError={!!rowErrors.studentsAppeared}
          />
        </Field>
      </Row3>

      {/* Row 38 — Others: shown only when "Any Other" selected */}
      {newRow.standard === "Any Other" && (
        <Row3>
          <Field label="Others" required error={rowErrors.others}>
            <TextInput
              value={newRow.others}
              onChange={setR("others")}
              placeholder="Please specify..."
              hasError={!!rowErrors.others}
            />
          </Field>
        </Row3>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 24 }}>
        <div style={{ width: "calc(33.33% - 10px)" }}>
          <Field label="No of Students Passed" required error={rowErrors.studentsPassed}>
            <TextInput
              value={newRow.studentsPassed}
              onChange={setR("studentsPassed")}
              type="number"
              hasError={!!rowErrors.studentsPassed}
            />
          </Field>
        </div>
        <BtnAdd onClick={handleAdd}>Add</BtnAdd>
      </div>

      {/* ── Minimum 3 indicator ── */}
      <div style={{
        fontSize: 12, color: rows.length >= 3 ? "#1a6b3a" : "#856404",
        marginBottom: 12, fontWeight: 500,
      }}>
        {rows.length >= 3
          ? `✅ ${rows.length} performance years added (minimum 3 required)`
          : `⚠️ ${rows.length}/3 performance years added — minimum 3 required`
        }
      </div>

      {/* ── Filled details table ── */}
      {rows.length > 0 && (
        <>
          <SectionHeading title="Filled Details" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Sr No","Year","Standard","Others","No of Students Appeared","No of Students Passed","Delete"]
                  .map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={td}>{idx + 1}</td>
                  <td style={td}>{row.year}</td>
                  <td style={td}>{row.standard}</td>
                  <td style={td}>{row.others || "—"}</td>
                  <td style={td}>{row.studentsAppeared}</td>
                  <td style={td}>{row.studentsPassed}</td>
                  <td style={td}>
                    <button
                      onClick={() => handleDelete(row.id)}
                      style={{
                        background: "none", border: "none",
                        color: "#c0392b", cursor: "pointer",
                        fontWeight: 500, fontSize: 13, padding: 0,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "#28a745", color: "#fff", border: "none", borderRadius: 4,
            padding: "9px 26px", fontSize: 14, fontWeight: 600, cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.65 : 1,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            background: "#e5a020", color: "#fff", border: "none", borderRadius: 4,
            padding: "9px 26px", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}